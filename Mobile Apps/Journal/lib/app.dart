import 'imports.dart';
import './screens/journal_entries.dart';
import 'package:journal/widgets/journal_entry_form.dart';

class App extends StatefulWidget {
  final SharedPreferences preferences;
  App({Key key, @required this.preferences}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<App> {
  static const THEME_STATUS_KEY = 'Light Mode';
  //retrieve last saved themeStatus from preferences. If new (??) use 'Dark Mode'
  String get themeStatus =>
      widget.preferences.getString(THEME_STATUS_KEY) ?? 'Light Mode';

  @override
  void initState() {
    super.initState();
    initThemeStatus();
  }

  void initThemeStatus() {
    widget.preferences.getString(themeStatus);
    setState(() {
      currentTheme.currentTheme();
      if (themeStatus == null) {
        widget.preferences.setString(THEME_STATUS_KEY, "Dark Mode");
        currentTheme.setLightMode();
      } else {
        if (themeStatus == 'Dark Mode')
          currentTheme.setLightMode();
        else {
          currentTheme.setDarkMode();
        }
      }
    });
    currentTheme.addListener(() {
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData.light(),
        darkTheme: ThemeData.dark(),
        themeMode: currentTheme.currentTheme(),
        title: 'Flutter Demo',
        home: Scaffold(
            appBar: AppBar(
              title: Text('Journal'),
              actions: <Widget>[
                themeStatus == null
                    ? CircularProgressIndicator()
                    : PopupMenuButton<String>(
                        onSelected: handleClick,
                        itemBuilder: (BuildContext context) {
                          return {'$themeStatus    '}.map((String choice) {
                            return PopupMenuItem<String>(
                              value: choice,
                              child: Text(choice),
                            );
                          }).toList();
                        },
                      ),
              ],
            ),
            body: JournalEntriesScreen()));
  }

  void handleClick(String value) async {
    setState(() {
      //change the name on the settings button to change theme
      if (themeStatus == 'Dark Mode')
        widget.preferences.setString(THEME_STATUS_KEY, 'Light Mode');
      else if (themeStatus == 'Light Mode')
        widget.preferences.setString(THEME_STATUS_KEY, 'Dark Mode');
    });

    currentTheme.switchTheme(); //switch the theme
  }
}
