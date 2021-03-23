import 'package:cloud_firestore/cloud_firestore.dart';

//Items that we will be recording in the firestore
class Entry {
  Timestamp date;
  String url;
  String latitude;
  String longitude;
  int itemCount;

  Entry(DocumentSnapshot doc) {
    this.date = doc['date'];
    this.itemCount = doc['itemCount'];
    this.url = doc['url'];
    this.latitude = doc['latitude'];
    this.longitude = doc['longitude'];
  }

  Entry.fromMap({
    this.date,
    this.itemCount,
    this.url,
    this.latitude,
    this.longitude,
  });
}
