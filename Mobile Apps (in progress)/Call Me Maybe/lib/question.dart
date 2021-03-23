import 'imports.dart';

class Question extends StatefulWidget {
  var answers;
  Question(this.answers);

  @override
  _QuestionState createState() => _QuestionState(answers);
}

class _QuestionState extends State<Question> {
  var answers;
  _QuestionState(this.answers);
  //save dynamic answers to be used by populateAnswers() function

  bool answerCounter = false; //if first answer = false
  //var test = testFunction();

  Widget build(BuildContext context) {
    List<Answers> myAnswersList =
        populateAnswers(answers); //populate answers from json file as list
    return Padding(
      padding: const EdgeInsets.only(bottom: 100.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Padding(
            padding: EdgeInsets.only(bottom: 20.0),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 20.0),
                  child: Text("Call Me... Maybe", style: Styles.headline1),
                ),
                qAndaButton2(myAnswersList), //populates button and answer
              ],
            ),
          ),
          //calls for a new random answer from our list
          Text(getNewAnswer(myAnswersList), style: Styles.headline2)
        ],
      ),
    );
  }

//gets a new answer from our answers list.
  String getNewAnswer(List<Answers> myAnswersList) {
    if (answerCounter == false) {
      answerCounter = true; //switch counter to true
      return "Go ahead, hit that button!"; //default answer before first button push
    } else {
      String newAnswer = randomAnswer(myAnswersList);
      return newAnswer;
    }
  }

  Widget qAndaButton2(List<Answers> myAnswersList) {
    return Container(
        child: RichText(
      text: TextSpan(
        text: 'Ask me a question, click me for an answer',
        style: Styles.headline3,
        recognizer: TapGestureRecognizer()
          ..onTap = () {
            setState(() {
              getNewAnswer(myAnswersList); //get a new answer, update state
            });
          },
      ),
    ));
  }

  /* Original Q/A, but in butotn form
  Widget qAndaButton(List<Answers> myAnswersList) {
    return RaisedButton(
        color: Colors.deepPurple,
        textColor: Colors.yellow,
        splashColor: Colors.purpleAccent,
        onPressed: () {
          setState(() {
            getNewAnswer(myAnswersList); //get a new answer, update state
          });
        },
        child: Text("Ask a question, tap me for answer"));
  }
*/

}
