import 'package:flutter/material.dart';

class FireButton extends StatelessWidget {
  final VoidCallback? onPressed;
  const FireButton({this.onPressed, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [Colors.redAccent, Colors.orangeAccent]),
          borderRadius: BorderRadius.circular(40),
          boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 8)],
        ),
        child: Center(
          child: Icon(Icons.whatshot, color: Colors.white, size: 40), // Use flame icon asset for custom
        ),
      ),
    );
  }
}
