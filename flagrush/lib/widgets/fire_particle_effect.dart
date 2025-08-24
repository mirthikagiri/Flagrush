import 'package:flutter/material.dart';

class FireParticleEffect extends StatelessWidget {
  const FireParticleEffect({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Placeholder for animated fire effect, use Lottie or custom painter for real effect
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Colors.orange, Colors.red, Colors.yellow]),
        borderRadius: BorderRadius.circular(40),
        boxShadow: [BoxShadow(color: Colors.redAccent, blurRadius: 16)],
      ),
      child: Icon(Icons.local_fire_department, color: Colors.white, size: 48),
    );
  }
}
