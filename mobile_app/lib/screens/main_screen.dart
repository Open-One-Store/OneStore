import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:receive_sharing_intent/receive_sharing_intent.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();

class MainApp extends StatefulWidget {
  @override
  _MainApp createState() => _MainApp();
}

class _MainApp extends State<MainApp> {
  late StreamSubscription _intentSub;
  final _sharedFiles = <SharedMediaFile>[];
  final Map<String, String> _fileCategories = {};

  @override
  void initState() {
    super.initState();

    _intentSub = ReceiveSharingIntent.instance.getMediaStream().listen((value) {
      print("Received new shared media: $value");
      setState(() {
        _sharedFiles.clear();
        _sharedFiles.addAll(value);
      });
    }, onError: (err) {
      print("getIntentDataStream error: $err");
    });

    ReceiveSharingIntent.instance.getInitialMedia().then((value) {
      print("Initial shared media: $value");
      setState(() {
        _sharedFiles.clear();
        _sharedFiles.addAll(value);
        ReceiveSharingIntent.instance.reset();
      });
    });
  }

  @override
  void dispose() {
    _intentSub.cancel();
    super.dispose();
  }

  Future<Image?> _loadImage(String path) async {
    try {
      print("Loading image from path: $path");
      final file = File(path);
      final bytes = await file.readAsBytes();
      final result = await FlutterImageCompress.compressWithList(
        bytes,
        minWidth: 200,
        minHeight: 200,
        quality: 80,
      );
      print("Image loaded and compressed successfully");
      return Image.memory(result);
    } catch (error) {
      print("Error loading image: $error");
      return null;
    }
  }

  Future<void> _uploadContent(SharedMediaFile file) async {
    final Uri uri = Uri.parse('https://onestoreapi.vachanmn.tech/items');

    // Show uploading feedback
    // ScaffoldMessenger.of(context).showSnackBar(
    //   SnackBar(content: Text('Uploading ${file.path}...')),
    // );

    // Retrieve the JWT token from secure storage
    final token = await storage.read(key: 'jwt_token');
    print(token);

    // Create the multipart request
    final request = http.MultipartRequest('POST', uri)
      ..headers['Authorization'] = 'Bearer $token'
      ..fields['name'] = DateTime.now().toString()
      ..fields['description'] = DateTime.now().toString()
      ..fields['itemType'] = "link"
      ..fields['link'] = "https://instagram.com/1amSumit";

    // Uncomment and adjust the file handling code if needed
    /*
  final fileBytes = await File(file.path).readAsBytes();
  request.files.add(http.MultipartFile.fromBytes(
    'file',
    fileBytes,
    filename: file.path.split('/').last,
  ));
  */

    // Send the request
    final response = await request.send();

    // Check the response
    if (response.statusCode == 200) {
      // Show success feedback
      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(content: Text('Upload successful for ${file.path}')),
      // );
      print('Upload successful!');
    } else {
      // Show failure feedback
      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(content: Text('Upload failed for ${file.path}')),
      // );
      print('Upload failed with status code: ${response.statusCode}');
    }
  }

  Widget _buildFileContent(SharedMediaFile file) {
    final mimeType = file.mimeType;
    final filePath = file.path;
    final fileCategory = _fileCategories[filePath] ?? 'Select Category';

    print("Building content for file: $filePath, MIME type: $mimeType");

    if (mimeType?.startsWith('image/') == true) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Upload this image"),
          SizedBox(height: 10),
          DropdownButton<String>(
            value: fileCategory,
            onChanged: (String? newValue) {
              setState(() {
                _fileCategories[filePath] = newValue!;
              });
            },
            items: <String>['Select Category', 'Image', 'Video', 'Other']
                .map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
          ),
        ],
      );
    } else if (mimeType?.startsWith('video/') == true) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Upload this video"),
          SizedBox(height: 10),
          DropdownButton<String>(
            value: fileCategory,
            onChanged: (String? newValue) {
              setState(() {
                _fileCategories[filePath] = newValue!;
              });
            },
            items: <String>['Select Category', 'Image', 'Video', 'Other']
                .map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
          ),
        ],
      );
    } else if (mimeType?.startsWith('text/') == true ||
        mimeType?.startsWith('application/') == true ||
        mimeType?.startsWith('https/') == true) {
      final text = filePath;
      final isLink = Uri.tryParse(text)?.hasAbsolutePath ?? false;
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(isLink ? "Upload this link" : "Upload this text"),
          SizedBox(height: 10),
          Flexible(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: isLink
                    ? InkWell(
                        child: Text(
                          text,
                          style: TextStyle(
                              fontSize: 16,
                              color: Colors.blue,
                              decoration: TextDecoration.underline),
                        ),
                        onTap: () async {
                          Uri uri = Uri.parse(text);
                          if (await canLaunchUrl(uri)) {
                            await launchUrl(uri);
                          } else {
                            print("Could not launch $text");
                          }
                        },
                      )
                    : Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12.0),
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(8.0),
                          border: Border.all(color: Colors.grey),
                        ),
                        child: Text(
                          text,
                          style: TextStyle(fontSize: 16, color: Colors.black),
                        ),
                      ),
              ),
            ),
          ),
          SizedBox(height: 10),
          DropdownButton<String>(
            value: fileCategory,
            onChanged: (String? newValue) {
              setState(() {
                _fileCategories[filePath] = newValue!;
              });
            },
            items: <String>['Select Category', 'Text', 'Link', 'Other']
                .map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
          ),
        ],
      );
    } else {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            "File type not supported or unsupported content.",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.red),
          ),
        ),
      );
    }
  }

  void _selectCategory(String filePath) async {
    final selectedCategory = await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Select Category'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              ListTile(
                title: Text('Image'),
                onTap: () => Navigator.pop(context, 'Image'),
              ),
              ListTile(
                title: Text('Video'),
                onTap: () => Navigator.pop(context, 'Video'),
              ),
              ListTile(
                title: Text('Text'),
                onTap: () => Navigator.pop(context, 'Text'),
              ),
              ListTile(
                title: Text('Link'),
                onTap: () => Navigator.pop(context, 'Link'),
              ),
              ListTile(
                title: Text('Other'),
                onTap: () => Navigator.pop(context, 'Other'),
              ),
            ],
          ),
        );
      },
    );

    if (selectedCategory != null) {
      setState(() {
        _fileCategories[filePath] = selectedCategory;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        hintColor: Colors.orange,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: Text('Shared Content Viewer'),
          centerTitle: true,
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: _sharedFiles.isEmpty
              ? Center(
                  child: Text(
                    "No shared files yet.",
                    style: TextStyle(fontSize: 18),
                  ),
                )
              : GridView.builder(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 1, // Make items take full width
                    crossAxisSpacing: 10.0,
                    mainAxisSpacing: 10.0,
                    childAspectRatio:
                        2.0, // Adjust this ratio as needed for height
                  ),
                  itemCount: _sharedFiles.length,
                  itemBuilder: (context, index) {
                    final file = _sharedFiles[index];
                    return Container(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: _buildFileContent(file),
                      ),
                    );
                  },
                ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            if (_sharedFiles.isNotEmpty) {
              _sharedFiles.forEach((file) {
                _uploadContent(file);
                print("Scheduled upload for: ${file.path}");
              });
            } else {
              print('No content to upload');
            }
          },
          child: Icon(Icons.upload),
          backgroundColor: Colors.blue,
        ),
      ),
    );
  }
}
