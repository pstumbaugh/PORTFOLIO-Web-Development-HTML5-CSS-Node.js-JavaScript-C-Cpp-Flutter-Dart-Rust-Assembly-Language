import 'imports.dart';

class Resume extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return resume(context);
  }

  Widget resume(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.only(top: 19.0),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'Patrick Stumbaugh',
                style: Styles.headline2,
              ),
              InkWell(
                child: Text("stumbuap@oregonstate.edu"),
                onTap: _sendingMails,
              ),
              InkWell(
                child: Text("(650) 868-3189"),
                onTap: _sendingSMS,
              ),
              spacing(),
              newJob(
                  "Ignite (Production) Director",
                  "KATU",
                  "2015-current",
                  "Portland, OR",
                  "Lead Director for Afternoon Live talk show and 5pm news.\nCode show elements with GV Ignite software.\nManage creative direction and production crews on special projects.\nDevelop and integrate graphic design elements.\nEnd-to-end video broadcast control room management."),
              newJob(
                  "Senior Ross OverDrive Director",
                  "WVLT",
                  "2012-2015",
                  "Knoxville, TN",
                  "Manage station's video production operations via Ross OverDrive.\nAssimilate VizRT graphics software with automation control.\nDevelop and advance new automation elements.\nPrincipal nightside graphic designer."),
              newJob(
                  "Digital Media Producer",
                  "WATE",
                  "2012-2013",
                  "Knoxville, TN",
                  "Produce and coordinate team for daily newscast. \nMaintain website and social media platforms"),
              newJob(
                  "Master Control Operator",
                  "KHQ",
                  "2011-2012",
                  "Spokane, WA",
                  "Operation of broadcast/engineering transmission services.\nTraffic log processing and commercial management."),
              newJob("Producer", "KESQ", "2010-2011", "Palm Springs, CA",
                  "Develop and manage local newscasts.\nAdvance breaking stories and pitch new angles."),
              newJob("Production Intern", "KHQ", "2009", "Spokane, WA",
                  "Intern for the KHQ This Morning show.\nWork with directors and producers for production of daily show.\nHelp reporters and photographers with live shots in the field."),
              spacing(),
              spacing(),
            ],
          ),
        ),
      ),
    );
  }

//creates a new job to display
  Widget newJob(String jobTitle, String company, String date, String location,
      String description) {
    return Container(
        child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Divider(color: Colors.purple),
        Text(
          jobTitle,
          textAlign: TextAlign.left,
          style: Styles.headline3,
        ), //title of job

        Container(
          child: Row(
            //row of company, date and location
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Align(
                  alignment: Alignment.topLeft,
                  child: Text(
                    company,
                    style: Styles.headline4,
                  )),
              Text(
                date,
                textAlign: TextAlign.center,
                style: Styles.headline4,
              ),
              Text(
                location,
                textAlign: TextAlign.right,
                style: Styles.headline4,
              ),
            ],
          ),
        ),
        Text(description, textAlign: TextAlign.left),
      ],
    ));
  }

//Adds some spacing
  Widget spacing() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
    );
  }

  void _sendingMails() async {
    const url = 'mailto:stumbaugh.patrick@gmail.com';
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
