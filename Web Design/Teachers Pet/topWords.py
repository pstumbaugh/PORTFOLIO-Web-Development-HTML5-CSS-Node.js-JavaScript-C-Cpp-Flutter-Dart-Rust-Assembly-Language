import wikipediaapi
import pika
import string
import uuid
import sys

wikipedia = wikipediaapi.Wikipedia("en")

# Source for stop words: http://ir.dcs.gla.ac.uk/resources/linguistic_utils/stop_words
stopwords = ['a', 'about', 'above', 'across', 'after', 'afterwards']
stopwords += ['again', 'against', 'all', 'almost', 'alone', 'along']
stopwords += ['already', 'also', 'although', 'always', 'am', 'among']
stopwords += ['amongst', 'amoungst', 'amount', 'an', 'and', 'another']
stopwords += ['any', 'anyhow', 'anyone', 'anything', 'anyway', 'anywhere']
stopwords += ['are', 'around', 'as', 'at', 'back', 'be', 'became']
stopwords += ['because', 'become', 'becomes', 'becoming', 'been']
stopwords += ['before', 'beforehand', 'behind', 'being', 'below']
stopwords += ['beside', 'besides', 'between', 'beyond', 'bill', 'both']
stopwords += ['bottom', 'but', 'by', 'call', 'can', 'cannot', 'cant']
stopwords += ['co', 'computer', 'con', 'could', 'couldnt', 'cry', 'de']
stopwords += ['describe', 'detail', 'did', 'do', 'done', 'down', 'due']
stopwords += ['during', 'each', 'eg', 'eight', 'either', 'eleven', 'else']
stopwords += ['elsewhere', 'empty', 'enough', 'etc', 'even', 'ever']
stopwords += ['every', 'everyone', 'everything', 'everywhere', 'except']
stopwords += ['few', 'fifteen', 'fifty', 'fill', 'find', 'fire', 'first']
stopwords += ['five', 'for', 'former', 'formerly', 'forty', 'found']
stopwords += ['four', 'from', 'front', 'full', 'further', 'get', 'give']
stopwords += ['go', 'had', 'has', 'hasnt', 'have', 'he', 'hence', 'her']
stopwords += ['here', 'hereafter', 'hereby', 'herein', 'hereupon', 'hers']
stopwords += ['herself', 'him', 'himself', 'his', 'how', 'however']
stopwords += ['hundred', 'i', 'ie', 'if', 'in', 'inc', 'indeed']
stopwords += ['interest', 'into', 'is', 'it', 'its', 'itself', 'keep']
stopwords += ['last', 'latter', 'latterly', 'least', 'less', 'ltd', 'made']
stopwords += ['many', 'may', 'me', 'meanwhile', 'might', 'mill', 'mine']
stopwords += ['more', 'moreover', 'most', 'mostly', 'move', 'much']
stopwords += ['must', 'my', 'myself', 'name', 'namely', 'neither', 'never']
stopwords += ['nevertheless', 'next', 'nine', 'no', 'nobody', 'none']
stopwords += ['noone', 'nor', 'not', 'nothing', 'now', 'nowhere', 'of']
stopwords += ['off', 'often', 'on', 'once', 'one', 'only', 'onto', 'or']
stopwords += ['other', 'others', 'otherwise', 'our', 'ours', 'ourselves']
stopwords += ['out', 'over', 'own', 'part', 'per', 'perhaps', 'please']
stopwords += ['put', 'rather', 're', 's', 'same', 'see', 'seem', 'seemed']
stopwords += ['seeming', 'seems', 'serious', 'several', 'she', 'should']
stopwords += ['show', 'side', 'since', 'sincere', 'six', 'sixty', 'so']
stopwords += ['some', 'somehow', 'someone', 'something', 'sometime']
stopwords += ['sometimes', 'somewhere', 'still', 'such', 'system', 'take']
stopwords += ['ten', 'than', 'that', 'the', 'their', 'them', 'themselves']
stopwords += ['then', 'thence', 'there', 'thereafter', 'thereby']
stopwords += ['therefore', 'therein', 'thereupon', 'these', 'they']
stopwords += ['thick', 'thin', 'third', 'this', 'those', 'though', 'three']
stopwords += ['three', 'through', 'throughout', 'thru', 'thus', 'to']
stopwords += ['together', 'too', 'top', 'toward', 'towards', 'twelve']
stopwords += ['twenty', 'two', 'un', 'under', 'until', 'up', 'upon']
stopwords += ['us', 'very', 'via', 'was', 'we', 'well', 'were', 'what']
stopwords += ['whatever', 'when', 'whence', 'whenever', 'where']
stopwords += ['whereafter', 'whereas', 'whereby', 'wherein', 'whereupon']
stopwords += ['wherever', 'whether', 'which', 'while', 'whither', 'who']
stopwords += ['whoever', 'whole', 'whom', 'whose', 'why', 'will', 'with']
stopwords += ['within', 'without', 'would', 'yet', 'you', 'your']
stopwords += ['yours', 'yourself', 'yourselves', '===', '==', '=', '.', ',']


def get_top_words(page_name, num_words, incl_links):
    pg = wikipedia.page(page_name)
    content = pg.text.lower().translate(str.maketrans('', '', string.punctuation))
    all_words = content.lower().split()
    if incl_links == True:
        print(get_wf_top_words(page_name))
        return()
    word_freqs = {}
    for w in all_words:
        if w not in stopwords:
            if w in word_freqs:
                word_freqs[w] += 1
            else:
                word_freqs[w] = 1
    ordered_words = [freqs[0] for freqs in sorted(
        word_freqs.items(), key=lambda item: item[1], reverse=True)]
    return ordered_words[0:num_words]


def get_top_words_str(page_name, num_words, incl_links):
    words_list = get_top_words(page_name, num_words, incl_links)
    str = ""
    for word in words_list:
        str = str + word+'\n'
    return str


def get_wf_top_words(page_name):
    full_url = "https://en.wikipedia.org/wiki/"+page_name
    wf_client = WikipediaFerretClient()
    print(" [x] Requesting wf(%s)" % full_url)
    response = wf_client.call_wf(full_url)
    return(response)

# Top Words Message Response in RabbitMQ server


def respond_to_RabbitMQ():
    connection = pika.BlockingConnection(pika.URLParameters(
        "amqp://leoparduser:E6dXz8t!fPthwfr@40.71.6.249"))

    channel = connection.channel()

    channel.queue_declare(queue='topwords_queue')

    def on_request(ch, method, props, body):
        page_name = str(body)

        print(" [.] top words(%s)" % page_name)
        response = get_top_words_str(page_name, 10, False)

        ch.basic_publish(exchange='',
                         routing_key=props.reply_to,
                         properties=pika.BasicProperties(
                             correlation_id=props.correlation_id),
                         body=str(response))
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='topwords_queue',
                          on_message_callback=on_request)

    print(" [x] Awaiting Top Words requests")
    channel.start_consuming()

# Accessing WikipediaFerretPlus from RabbitMQ server


class WikipediaFerretClient():
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.URLParameters(
            "amqp://leoparduser:E6dXz8t!fPthwfr@40.71.6.249"))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True)

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call_wf(self, message):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange='',
            routing_key="wikipediaFerretPlus",
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=message)
        while self.response is None:
            self.connection.process_data_events()
        return self.response


### MAIN ###
# respond_to_RabbitMQ()

### Uncomment to Debug Top Words function ###
usage = "usage: " + \
    sys.argv[0] + \
        " <Name of Wikipedia File> <Number of Top Words> <Include Neighboring Entries - True/False (Via WikipediaFerret+)>"
if len(sys.argv) != 4:
    print(usage)
    sys.exit()

wikipedia_page_name = sys.argv[1]
num_top_words = int(sys.argv[2])
if sys.argv[3] == 'True':
    neighboring_entries = True
elif sys.argv[3] == 'False':
    neighboring_entries = False
else:
    print(usage)
    sys.exit()

print(get_top_words_str(wikipedia_page_name, num_top_words, neighboring_entries))
