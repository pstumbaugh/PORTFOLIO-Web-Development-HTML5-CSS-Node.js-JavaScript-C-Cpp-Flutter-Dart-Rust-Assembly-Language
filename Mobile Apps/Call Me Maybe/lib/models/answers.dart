import '../imports.dart';

class Answers {
  String answer;
  Answers(this.answer);

  //gets a answer from json from 'answer' key, returns as string
  factory Answers.fromJson(dynamic json) {
    return Answers(json['answer'] as String);
  }

  @override
  String toString() {
    return '{ ${this.answer}}';
  }
}

//Gets a random answer from our answers list
String randomAnswer(List<Answers> answerOptions) {
  Random random = new Random();
  int size = answerOptions.length;
  int randomNumber = random.nextInt(size);
  return answerOptions[randomNumber].answer;
}

List<Answers> populateAnswers(dynamic answers) {
  var tagObjsJson = jsonDecode(answers)['tags'] as List;
  List<Answers> tagObjs =
      tagObjsJson.map((tagJson) => Answers.fromJson(tagJson)).toList();

  return tagObjs;
}

//BELOW IS ANOTHER WAY TO IMPORT ANSWERS JSON FILE FROM ABSOLUTE PATH, WITHOUT USING FUTURES
/*
List<Answers> myFunction2() {
  String arrayObjsText = readFileSync();
  //print(arrayObjsText);

  var tagObjsJson = jsonDecode(arrayObjsText)['tags'] as List;
  var tagObjs =
      tagObjsJson.map((tagJson) => Answers.fromJson(tagJson)).toList();

  return tagObjs;
}

String readFileSync() {
  String contents = new File(
          '/Users/pstumbaugh/Documents/Computer Science/CS492 Mobile Dev/Dart-Flutter-CallMeMaybe/project3/assets/answers.json')
      .readAsStringSync();

  return contents;
}
*/
