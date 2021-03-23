import 'package:wasteagram/imports.dart';

//translations available (English, Spanish, Klingon)
class Translations {
  Locale locale;
  Translations(Locale localeOf, {this.locale});

  String getQuantityFieldHint(Locale locale) {
    print("LOCALE: $locale");
    switch (locale.languageCode) {
      case 'en':
        return 'Items Wasted';
      case 'tlh':
        return 'ChiSqu\'';
      case 'es':
        return 'Artículos Desperdiciados';
      default:
        return 'Items Wasted';
    }
  }
}
