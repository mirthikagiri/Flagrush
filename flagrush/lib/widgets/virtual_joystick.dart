import 'package:flutter/material.dart';

class VirtualJoystick extends StatelessWidget {
  final Function(Offset) onMove;
  const VirtualJoystick({required this.onMove, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Colors.blue, Colors.purple]),
        borderRadius: BorderRadius.circular(60),
        boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 8)],
      ),
      child: GestureDetector(
        onPanUpdate: (details) {
          Offset offset = Offset(
            (details.localPosition.dx - 60) / 60,
            (details.localPosition.dy - 60) / 60,
          );
          onMove(offset);
        },
        child: Center(
          child: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.5),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
            ),
          ),
        ),
      ),
    );
  }
}
