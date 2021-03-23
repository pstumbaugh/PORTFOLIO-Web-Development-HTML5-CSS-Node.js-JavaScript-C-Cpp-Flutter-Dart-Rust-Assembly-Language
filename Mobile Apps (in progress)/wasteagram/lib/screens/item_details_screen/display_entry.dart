import 'package:wasteagram/imports.dart';
import 'package:intl/intl.dart';

//displays information from entry passed, stacks it as listview to be scrollable if screen size is too small
class DisplayEntry extends StatelessWidget {
  final Entry entry;
  DisplayEntry({this.entry});

  //building out items details page with date, picture, items and location
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: <Widget>[
        displayDate(),
        displayPictureAndItems(),
      ],
    );
  }

  //gets the date from entry, prints to screen
  Padding displayDate() {
    return Padding(
      padding: const EdgeInsets.only(top: 20),
      child: Column(
        children: [
          Text(DateFormat.yMMMd().format(entry.date.toDate()),
              style: Styles.headline2),
        ],
      ),
    );
  }

  //gets the picture and items, prints to screen
  Padding displayPictureAndItems() {
    return Padding(
      padding: const EdgeInsets.only(top: 80),
      child: Column(
        children: [
          ImageWidget(imagePath: entry.url),
          //Image.network(entry.url),
          displayItemCount(),
          displayLocation(),
        ],
      ),
    );
  }

  //gets the number of wasted items from entry, prints to screen
  Padding displayItemCount() {
    return Padding(
      padding: const EdgeInsets.only(top: 30),
      child:
          Text('Items: ' + entry.itemCount.toString(), style: Styles.headline4),
    );
  }

  //gets the location from entry and prints to screen
  Padding displayLocation() {
    return Padding(
      padding: const EdgeInsets.only(top: 20),
      child: Container(
          child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          Text('Location: (' + entry.latitude + ', ' + entry.longitude + ')'),
        ],
      )),
    );
  }
}
