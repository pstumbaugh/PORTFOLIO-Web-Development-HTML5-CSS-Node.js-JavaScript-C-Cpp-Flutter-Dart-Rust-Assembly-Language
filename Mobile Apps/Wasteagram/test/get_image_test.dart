import 'package:flutter_test/flutter_test.dart';
import 'package:wasteagram/imports.dart';

void main() {
  test('Testing getTotalWaste method in all_posts', () {
    var addingWaste = 5;
    var totalWaste = 1;
    expect(
        new ListScreen().createState().getTotalWaste(addingWaste, totalWaste),
        6);
  });
}
