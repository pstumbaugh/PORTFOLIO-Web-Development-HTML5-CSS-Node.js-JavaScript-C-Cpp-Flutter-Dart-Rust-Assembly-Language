import 'package:flutter/material.dart';
import '../widgets/journal_scaffold.dart';

class JournalEntriesScreen extends StatefulWidget {
  static const routeKey = 'journal_entries';

  @override
  _JournalEntriesScreenState createState() => _JournalEntriesScreenState();
}

class _JournalEntriesScreenState extends State<JournalEntriesScreen> {
  final items = List<Map>.generate(1000, (i) {
    return {
      'title': 'Journal Entry $i',
      'subtitle': 'Subtitle text for $i',
    };
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: ListView.builder(
      //itemCount: /*number of items in the list, if known*/,
      itemBuilder: (context, index) {
        return ListTile(
          leading: FlutterLogo(),
          trailing: Icon(Icons.more_horiz),
          title: Text('Journal Entry ${items[index]['title']}'),
          subtitle: Text('Example subtitle ${items[index]['subtitle']}'),
          //onTap: () {Navigator.of(context).pushNamed(/*route name here*/)},
        );
      },
    ));
  }
}



/*
  @override
  Widget build(BuildContext context) {
    return JournalScaffold(
        title: 'Journal Entries',
        child: ListView.builder(
          //itemCount: /*number of items in the list, if known*/,
          itemBuilder: (context, index) {
            return ListTile(
              leading: FlutterLogo(),
              trailing: Icon(Icons.more_horiz),
              title: Text('Journal Entry ${items[index]['title']}'),
              subtitle: Text('Example subtitle ${items[index]['subtitle']}'),
              onTap: () {Navigator.of(context).pushNamed(/*route name here*/)},
            );
          },
        ));
  }
}
*/

