import 'package:flutter_test/flutter_test.dart';
import 'package:wasteagram/imports.dart';
import 'package:wasteagram/widgets/form_widget.dart';

void main() {
  group('isNumAndPos testing', () {
    test('Testing isNumAndPos method in Form Widget', () {
      expect(
          new FormWidget(imagePath: "testPath.com")
              .createState()
              .isNumAndPos("1"),
          true);
    });
    test(
        'Testing isNumAndPos method in Form Widget (with false answer expected)',
        () {
      expect(
          new FormWidget(imagePath: "testPath.com")
              .createState()
              .isNumAndPos("g"),
          false);
    });
  });
}
