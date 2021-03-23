import 'package:intl/intl.dart';
import 'package:wasteagram/imports.dart';

//POST LIST SCREEN body:
class ListsOfPosts extends StatefulWidget {
  @override
  _ListsOfPostsState createState() => _ListsOfPostsState();
}

class _ListsOfPostsState extends State<ListsOfPosts> {
  @override
  Widget build(BuildContext context) {
    Widget _buildListItem(BuildContext context, Entry entry) {
      return Semantics(
        label: "Date: ${entry.date}",
        // generate a ListTile for each entry passed
        child: ListTile(
            title: dateAndItemsDetails(entry),
            onTap: () {
              // Navigate to post details when tapped
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => DetailScreen(entry: entry)));
            }),
      );
    }

    //buids our list of data items
    ListView buildList(snapshot) {
      return ListView.builder(
          itemExtent:
              100, //max number of items it will show (helps with scrolling if nearing max)
          itemCount: snapshot.data.documents.length,
          //generate each tile:
          itemBuilder: (context, index) {
            Entry entry = Entry(snapshot.data.documents[
                index]); //gets the data, saves into Entry model object
            return _buildListItem(context, entry); //builds the object
          });
    }

    //Stream data from firestore:
    return StreamBuilder(
        //Sort based on date added, most recent first
        stream: Firestore.instance
            .collection('posts')
            .orderBy('date', descending: true)
            .snapshots(),
        //builder will be invoked whenever there is new data added
        builder: (context, snapshot) {
          if (snapshot.hasData && !snapshot.data.documents.isEmpty) {
            //data is available, build the list:
            return buildList(snapshot);
          } else {
            //data not available, display CircularProgressIndicator:
            return Center(child: CircularProgressIndicator());
          }
        });
  }

  dateAndItemsDetails(Entry entry) {
    return Padding(
      padding: const EdgeInsets.only(left: 10, right: 10),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(DateFormat.yMMMd().format(entry.date.toDate()),
            style: Styles.headline3),
        Text(
          'Items: ' + entry.itemCount.toString(),
          style: Styles.headline3,
        ),
      ]),
    );
  }
}
