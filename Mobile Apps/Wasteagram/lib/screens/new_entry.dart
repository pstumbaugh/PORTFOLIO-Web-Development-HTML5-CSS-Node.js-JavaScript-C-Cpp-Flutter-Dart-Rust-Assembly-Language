import '../imports.dart';

// This screen allows a user to upload a new post
class NewPostScreen extends StatefulWidget {
  final String imagePath;
  NewPostScreen({this.imagePath});

  @override
  _NewPostScreenState createState() =>
      _NewPostScreenState(imagePath: imagePath);
}

class _NewPostScreenState extends State<NewPostScreen> {
  LocationData locationData;
  final String imagePath;
  _NewPostScreenState({this.imagePath});

  //build the new entry screen using Image and Form widgets
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          centerTitle: true,
          title: Text(
            'Wastegram',
            style: Styles.headline1,
          )),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 50),
          child: Column(children: [
            ImageWidget(imagePath: imagePath),
            FormWidget(imagePath: imagePath),
          ]),
        ),
      ),
    );
  }
}
