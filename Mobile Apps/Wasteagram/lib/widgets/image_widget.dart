import '../imports.dart';

class ImageWidget extends StatelessWidget {
  final String imagePath;
  ImageWidget({this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Container(
        width: MediaQuery.of(context).size.width * 0.80,
        height: MediaQuery.of(context).size.width * 0.65,
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30.0),
            image: DecorationImage(
                image: NetworkImage('$imagePath'), fit: BoxFit.scaleDown)));
  }
}
