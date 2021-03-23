import 'imports.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(App(preferences: await SharedPreferences.getInstance()));
}
