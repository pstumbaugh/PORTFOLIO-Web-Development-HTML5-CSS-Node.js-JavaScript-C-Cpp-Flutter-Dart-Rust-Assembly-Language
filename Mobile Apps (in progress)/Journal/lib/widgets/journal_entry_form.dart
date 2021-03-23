import 'package:flutter/material.dart';

class JournalEntryFields {
  String title;
  String body;
  DateTime dateTime;
  int rating;
  @override
  String toString() {
    return 'Title: $title, Body: $body, Time: $dateTime, Rating: $rating';
  }
}

class JournalEntryForm extends StatefulWidget {
  @override
  _JournalEntryFormState createState() => _JournalEntryFormState();
}

class _JournalEntryFormState extends State<JournalEntryForm> {
  final formKey = GlobalKey<FormState>();
  final journalEntryFields = JournalEntryFields();

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(10),
        child: Form(
          key: formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                autofocus: true,
                decoration: InputDecoration(
                    labelText: 'Title', border: OutlineInputBorder()),
                onSaved: (value) {
                  journalEntryFields.title = value;
                },
                validator: (value) {
                  if (value.isEmpty) {
                    return 'Please enter a title';
                  } else {
                    return null;
                  }
                },
              ),
              SizedBox(height: 10),
              RaisedButton(
                  onPressed: () {
                    if (formKey.currentState.validate()) {
                      formKey.currentState.save();
                      //Database.of(context).saveJournalEntry(journalEntryFields);
                      Navigator.of(context).pop();
                    }
                  },
                  child: Text('Save Entry'))
            ],
          ),
        ));
  }
}
