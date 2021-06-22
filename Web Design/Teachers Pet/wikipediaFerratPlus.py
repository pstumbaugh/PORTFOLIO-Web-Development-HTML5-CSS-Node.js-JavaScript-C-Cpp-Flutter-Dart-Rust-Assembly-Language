import sys
import urllib2
import re  # Regex for parsing HTML
import ssl

input = sys.argv[1]

# test input:
#input = "https://en.wikipedia.org/wiki/Peanut_butter"

print(input)


# depth = linkDepth.get()

urllibOutput = urllib2.urlopen(
    input).read().decode("utf-8")


# Initial search pulls links up to "References" section
urllibOutputUpToReferences = urllibOutput.split('id="References"')

# Search strategy is to find all <a tags that redirect to another wikipedia page
# Uses non-greedy delimiter (.*?) for consistency in matches
rawOutput = re.findall('<a href="/wiki(.*?)</a>',
                       urllibOutputUpToReferences[0])
parsedOutput = {}

# parsedOutput["link"] = wikipediaLink.get()    # TODO Check if this older syntax can be removed
parsedOutput["link"] = input
# parsedOutput["title"] = re.search("https://en.wikipedia.org/wiki/(.*)",wikipediaLink.get()).group(1)  # TODO Check if this older syntax can be removed
parsedOutput["title"] = re.search(
    "https://en.wikipedia.org/wiki/(.*)", input).group(1)
parsedOutput["listOfSublinks"] = []

for r in rawOutput:
    try:
        rLink = "https://en.wikipedia.org/wiki" + \
            re.search('(.*?)"', r).group(1)
    except AttributeError:
        rLink = None

    try:
        rTitle = re.search('title="(.*?)">', r).group(1)
    except AttributeError:
        rTitle = None

    parsedOutput["listOfSublinks"].append(
        {"sublink": rLink, "title": rTitle}
        # {"sublink":rLink,"title":rTitle,"image":None} # Alternate versin with "image" attribute in output
    )

print(parsedOutput)
