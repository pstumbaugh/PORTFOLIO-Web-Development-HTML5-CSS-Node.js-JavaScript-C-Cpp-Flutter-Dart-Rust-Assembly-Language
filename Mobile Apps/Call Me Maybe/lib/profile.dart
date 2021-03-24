/* For email and SMS, I borrowed from the geeksforgeeks website, 
using url_launcher
(email launcher tries, but can't open email app, as the emulator does
not have one installed)
*/

import 'package:flutter/rendering.dart';

import 'imports.dart';

class Profile extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return profile(context);
  }

  Widget profile(BuildContext context) {
    return FractionallySizedBox(
      widthFactor: 1,
      heightFactor: 1,
      child: Padding(
        padding: EdgeInsets.all(padding(context)),
        child: Column(
          children: <Widget>[
            Flexible(
                flex: 1,
                child: Text('Patrick Stumbaugh', style: Styles.headline1)),
            Flexible(flex: 3, child: profilePic()),
            Flexible(flex: 2, child: profileText("Mobile Software Developer")),
            Flexible(
              flex: 1,
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    hyperlink("http://www.github.com/pstumbaugh", "GitHub"),
                    hyperlink("http://www.patrickstumbaugh.com", "Portfolio"),
                  ]),
            ),
            Flexible(
                flex: 1,
                child: profileButton('Email Me Maybe?', _sendingMails)),
            Flexible(
                flex: 1, child: profileButton('Text Me Maybe?', _sendingSMS)),
          ],
        ),
      ),
    );
  }

  double padding(BuildContext context) {
    if (MediaQuery.of(context).orientation == Orientation.landscape) {
      return MediaQuery.of(context).size.width * .01;
    } else {
      return MediaQuery.of(context).size.width * 0.01;
    }
  }

  //gets picture, adds padding
  Widget profilePic() {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Container(
          decoration: BoxDecoration(
            color: Colors.grey[700],
            border: Border.all(
              //border size and color
              color: Colors.deepPurple,
              width: 4,
            ),
            borderRadius: BorderRadius.circular(12), //rounded edges
          ),
          child: Padding(
            padding: EdgeInsets.all(8),
            child: SizedBox(
                child: Image.asset('assets/profilePic.jpg'),
                width: 150,
                height: 150),
          )),
    );
  }

  Widget hyperlink(String url, String title) {
    return Padding(
        padding: const EdgeInsets.all(8.0),
        child: RichText(
            text: TextSpan(
                text: title,
                style: new TextStyle(
                    fontWeight: FontWeight.bold, color: Colors.purple),
                recognizer: new TapGestureRecognizer()
                  ..onTap = () {
                    launch(url);
                  })));
  }

  Widget profileText(String text) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Text(text, style: Styles.headline2),
    );
  }

  Widget profileButton(String text, type) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: RaisedButton(
          splashColor: Colors.purpleAccent, onPressed: type, child: Text(text)),
    );
  }

  void _sendingMails() async {
    const url = 'mailto:stumbaup@oregonstate.edu';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  void _sendingSMS() async {
    const url = 'sms:6508683189';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
