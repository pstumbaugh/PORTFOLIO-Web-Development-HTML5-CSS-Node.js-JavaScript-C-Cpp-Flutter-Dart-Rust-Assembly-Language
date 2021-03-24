import 'imports.dart';

class mainScreen extends StatelessWidget {
  var answers;
  //save answers json(which was pased to this class) as a dynamic to be sent later to tabs
  mainScreen(this.answers);

  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        primaryColor: Colors.deepPurple, //main title background color
      ),
      home: DefaultTabController(
        length: 3, //number of tabs
        child: Scaffold(
          appBar: AppBar(
            title: title('Call Me Maybe'),
            bottom: PreferredSize(
                preferredSize: Size.fromHeight(100.0), child: tabBar()),
          ),
          body: tabs(answers),
        ),
      ),
    );
  }

  Widget tabs(dynamic answers) {
    return TabBarView(
      //what's in the tabs
      children: [
        Profile(),
        Resume(),
        Question(answers), //send dynamic answers (json file) to Question class
      ],
    );
  }

  Widget tabBar() {
    return TabBar(
      indicatorColor: Colors.yellowAccent, //tab bar indicator color
      tabs: [
        //TABS (icons)
        Tab(icon: Icon(Icons.face)),
        Tab(icon: Icon(Icons.ballot)),
        Tab(icon: Icon(Icons.question_answer)),
      ],
    );
  }

  Widget title(String text) {
    return Text(
      text,
      style: TextStyle(color: Colors.yellow),
    );
  }
}
