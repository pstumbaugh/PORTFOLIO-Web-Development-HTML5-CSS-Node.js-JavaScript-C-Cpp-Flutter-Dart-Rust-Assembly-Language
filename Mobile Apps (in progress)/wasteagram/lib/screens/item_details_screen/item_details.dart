import 'package:wasteagram/imports.dart';

class DetailScreen extends StatefulWidget {
  final Entry entry;

  DetailScreen({this.entry});
  @override
  _DetailScreenState createState() => _DetailScreenState(entry: entry);
}

class _DetailScreenState extends State<DetailScreen> {
  Entry entry;
  _DetailScreenState({this.entry});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Column(children: [
            Text(
              'Wasteagram',
              style: Styles.headline1,
            ),
          ]),
        ),
        body: DisplayEntry(entry: entry)); //display the selected entry
  }
}
