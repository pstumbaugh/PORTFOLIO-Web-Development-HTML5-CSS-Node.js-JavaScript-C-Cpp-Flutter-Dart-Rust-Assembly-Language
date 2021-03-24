import 'package:flutter_test/flutter_test.dart';
import 'package:wasteagram/imports.dart';

void main() {
  test('Values added to new post test', () {
    DateTime currentDate = DateTime.now(); //DateTime
    Timestamp day = Timestamp.fromDate(currentDate); //conver to timestamp
    String url = "fakeImage.com";
    String lat = '140.3';
    String long = '-42';
    int itemCount;

    final post = Entry.fromMap();
    post.date = day;
    post.itemCount = itemCount;
    post.url = url;
    post.latitude = lat;
    post.longitude = long;

    expect(post.date, day);
    expect(post.itemCount, itemCount);
    expect(post.url, url);
    expect(post.latitude, lat);
    expect(post.longitude, long);
  });
}
