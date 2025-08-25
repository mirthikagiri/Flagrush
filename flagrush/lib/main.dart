
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart'; 
import 'dart:io';
import 'dart:async';


void main() => runApp(FlagRushApp());

class FlagRushApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FlagRush',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: DashboardPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class DashboardPage extends StatefulWidget {
  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  File? _selectedImage;
  bool _loading = false;
  String? _error;
  List<Map<String, dynamic>> _results = [];

  Future<void> _pickImage() async {
    setState(() {
      _error = null;
      _results = [];
    });
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;
    setState(() {
      _selectedImage = File(pickedFile.path);
      _loading = true;
    });
    await _sendImageForDetection(_selectedImage!);
  }

  Future<void> _sendImageForDetection(File image) async {
    // Simulate API call with delay and mock results
    await Future.delayed(Duration(seconds: 2));
    // Simulate random error
    if (DateTime.now().second % 7 == 0) {
      setState(() {
        _loading = false;
        _error = "Failed to detect billboards. Please try again.";
      });
      return;
    }
    setState(() {
      _loading = false;
      _results = [
        {"label": "Unlicensed Billboard", "confidence": 92},
        {"label": "Obstructive Placement", "confidence": 85},
      ];
    });
  }

  void _reset() {
    setState(() {
      _selectedImage = null;
      _results = [];
      _error = null;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue.shade50,
      appBar: AppBar(
        title: Text(
          "FlagRush Dashboard",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
        ),
        backgroundColor: Colors.blue.shade700,
        foregroundColor: Colors.white,
        elevation: 2,
        centerTitle: true,
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (_selectedImage == null)
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade600,
                    foregroundColor: Colors.white,
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                  ),
                  icon: Icon(Icons.upload_file),
                  label: Text("Upload Billboard Image", style: TextStyle(fontSize: 18)),
                  onPressed: _pickImage,
                ),
              if (_selectedImage != null)
                Column(
                  children: [
                    Container(
                      margin: EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Image.file(
                        _selectedImage!,
                        width: MediaQuery.of(context).size.width * 0.8,
                        fit: BoxFit.cover,
                      ),
                    ),
                    if (_loading)
                      Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: CircularProgressIndicator(
                          color: Colors.blue.shade700,
                        ),
                      ),
                    if (_error != null)
                      Padding(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        child: Text(
                          _error!,
                          style: TextStyle(color: Colors.red, fontSize: 16),
                        ),
                      ),
                    if (!_loading && _results.isNotEmpty)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Detection Results",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: Colors.blue.shade700,
                            ),
                          ),
                          SizedBox(height: 8),
                          ..._results.map((result) => Card(
                                elevation: 2,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                margin: EdgeInsets.symmetric(vertical: 6),
                                child: ListTile(
                                  leading: Icon(Icons.flag, color: Colors.orange.shade700),
                                  title: Text(result["label"], style: TextStyle(fontWeight: FontWeight.w600)),
                                  trailing: Text(
                                    "${result["confidence"]}%",
                                    style: TextStyle(
                                      color: Colors.blue.shade700,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                ),
                              )),
                        ],
                      ),
                    SizedBox(height: 24),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple.shade600,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(24),
                        ),
                      ),
                      icon: Icon(Icons.refresh),
                      label: Text("Upload Another", style: TextStyle(fontSize: 16)),
                      onPressed: _reset,
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}