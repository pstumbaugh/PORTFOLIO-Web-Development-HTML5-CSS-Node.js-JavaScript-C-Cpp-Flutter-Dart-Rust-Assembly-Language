library config.globals;

import 'imports.dart';

MyTheme currentTheme = MyTheme();

class MyTheme with ChangeNotifier {
  static bool _isDark = true;

  ThemeMode currentTheme() {
    return _isDark ? ThemeMode.dark : ThemeMode.light;
  }

  void switchTheme() {
    _isDark = !_isDark;
    notifyListeners();
  }

  void setLightMode() {
    _isDark = false;
  }

  void setDarkMode() {
    _isDark = true;
  }
}
