//This screen shows the list of items currently in the database
import 'package:wasteagram/imports.dart';
import 'package:path/path.dart' as Path;

class ListScreen extends StatefulWidget {
  @override
  _ListScreenState createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  final picker = ImagePicker();
  String imagePath;
  File image;
  LocationData locationData;
  var totalWaste = 0;

  void initState() {
    super.initState();
  }

//Building the list screen:
  @override
  Widget build(BuildContext context) {
    ProgressDialog progressDialog =
        ProgressDialog(context: context, barrierDismissible: false);
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: titleAndTotalWaste(),
      ),
      body: ListsOfPosts(), //list of posts from database
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: Semantics(
          button: true,
          enabled: true,
          onTapHint: 'Add a new image and post',
          child: addNewButton(progressDialog)), //button for new entry
    );
  }

  //displays the app's title and the total waste in the database
  StreamBuilder titleAndTotalWaste() {
    return StreamBuilder(
        stream: Firestore.instance.collection('posts').snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData)
            return Text(
              'Wastegram',
              style: Styles.headline1,
            );
          else {
            //iterate through each item, adding up "itemCount" to total waste
            for (int index = 0;
                index < snapshot.data.documents.length;
                index++) {
              totalWaste = getTotalWaste(
                  snapshot.data.documents[index]['itemCount'], totalWaste);
            }
            //make new var to hold totalWaste (in case this gets rebuilt, it won't add to previous total)
            int wasteTotal = totalWaste; //move to "wasteTotal" variable
            totalWaste = 0; //reset totalWaste
            return Text('Wasteagram - $wasteTotal', style: Styles.headline1);
          }
        });
  }

  //adds a new Floating Action Button (the add button)
  //on pressed will direct to get a new picture from gallery, then route to new entry page
  FloatingActionButton addNewButton(dynamic progressDialog) {
    //add a button for the user to add a new post:
    return FloatingActionButton(
      backgroundColor: Colors.blue[400],
      hoverColor: Colors.blue[800],
      splashColor: Colors.blue[900],
      key: Key('postButton'),
      child: Icon(Icons.add_photo_alternate),
      onPressed: () async {
        getPictureAndRoute(progressDialog);
      },
    );
  }

  //adds up total waste and saves to global variable "totalWaste"
  int getTotalWaste(int quantity, int totalWaste) {
    return totalWaste = totalWaste + quantity;
  }

  //prompts to get a picture from the user from the phone's gallery
  //It will save it to the firebase storage, then return a download URL
  //It then saves that download URL as a string to the global variable "imagePath"
  Future getImage() async {
    ProgressDialog progressDialog =
        ProgressDialog(context: context, barrierDismissible: false);
    image = await ImagePicker.pickImage(source: ImageSource.gallery);
    StorageReference storageReference = FirebaseStorage.instance
        .ref()
        .child(DateTime.now().toString()); //using dateTime as unique id
    StorageUploadTask uploadTask = storageReference.putFile(image);
    progressDialog.dismiss(); //remove progress indicator
    showProgressIndicator(progressDialog, "Uploading Picture");
    await uploadTask.onComplete;
    imagePath = await storageReference.getDownloadURL();
  }

/* OLD METHOD OF GETTING PICTURE:
  void getImage() async {
    final pickedFile = await picker.getImage(source: ImageSource.gallery);
    imagePath = pickedFile.path;
    setState(() {});
  }
*/

//pops up a box with the progress indicator (using while waiting for async functions to complete)
//NOTE - progressDialog.dismiss(); must be called after to remove the progress indicator from screen
  void showProgressIndicator(
      ProgressDialog progressDialog, String messageString) {
    return progressDialog.showMaterial(
      backgroundColor: Colors.grey[300],
      message: messageString,
      messageStyle: TextStyle(
          color: Colors.blue[800], fontSize: 17, fontWeight: FontWeight.bold),
      title: "Wasteagram",
      titleStyle: TextStyle(
        color: Colors.blue[800],
        fontSize: 22,
      ),
      centerTitle: true,
      layout: MaterialProgressDialogLayout
          .columnReveredWithCircularProgressIndicator,
    );
  }

  //gets a new pic from user, then routes to the new post screen
  Future<void> getPictureAndRoute(ProgressDialog progressDialog) async {
    showProgressIndicator(progressDialog,
        "Loading Gallery"); //show progress indicator (on list page)
    await getImage(); // wait for image to be selected before navigating
    progressDialog.dismiss(); //remove progress indicator
    Navigator.push(
        //go to the new post screen with the image's url
        context,
        MaterialPageRoute(
            builder: (context) => NewPostScreen(imagePath: imagePath)));
  }
}
