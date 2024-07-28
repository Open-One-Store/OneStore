import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mobile_app/provider/users_provider.dart';
import 'package:receive_sharing_intent/receive_sharing_intent.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();

class MainApp extends ConsumerStatefulWidget {
  @override
  _MainAppState createState() => _MainAppState();
}

class _MainAppState extends ConsumerState<MainApp> {
  late StreamSubscription _intentSub;
  final _sharedFiles = <SharedMediaFile>[];
  final Map<String, String> _fileCategories = {};
  final Map<String, TextEditingController> _fileNameControllers = {};
  final Map<String, TextEditingController> _fileDescriptionControllers = {};
  bool _isUploading = false; // Add state for uploading

  @override
  void initState() {
    super.initState();
    _fetchCategory();

    _intentSub = ReceiveSharingIntent.instance.getMediaStream().listen((value) {
      print("Received new shared media: $value");
      setState(() {
        _sharedFiles.clear();
        _sharedFiles.addAll(value);
        _initializeControllers();
      });
    }, onError: (err) {
      print("getIntentDataStream error: $err");
    });

    ReceiveSharingIntent.instance.getInitialMedia().then((value) {
      print("Initial shared media: $value");
      setState(() {
        _sharedFiles.clear();
        _sharedFiles.addAll(value);
        _initializeControllers();
        ReceiveSharingIntent.instance.reset();
      });
    });
  }

  void _initializeControllers() {
    _fileNameControllers.clear();
    _fileDescriptionControllers.clear();
    for (var file in _sharedFiles) {
      final mimeType = file.mimeType ?? 'unknown';
      _fileNameControllers[file.path] =
          TextEditingController(text: mimeType.split('/')[0]);
      _fileDescriptionControllers[file.path] =
          TextEditingController(text: mimeType.split('/')[0]);
    }
  }

  @override
  void dispose() {
    _intentSub.cancel();
    _fileNameControllers.values.forEach((controller) => controller.dispose());
    _fileDescriptionControllers.values
        .forEach((controller) => controller.dispose());
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

  Future<void> _fetchCategory() async {
    try {
      final Uri uri = Uri.parse('https://onestoreapi.vachanmn.tech/categories');
      final token = await storage.read(key: 'jwt_token');
      print("Bearer $token");

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print(response);
      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        setState(() {
          _fileCategories.clear();
          for (var category in jsonResponse) {
            _fileCategories[category['id']] = category['name'];
          }
        });
      } else {
        print("Failed to fetch categories: ${response.statusCode}");
      }
    } catch (error) {
      print("Error fetching categories: $error");
    }
  }

  Future<void> _uploadContent(SharedMediaFile file) async {
    final mimeType = file.mimeType;
    final filePath = file.path;
    final fileName = _fileNameControllers[filePath]?.text ??
        "${mimeType?.split("/")[0]} ${DateTime.now().toString()}";
    final fileDescription = _fileDescriptionControllers[filePath]?.text ??
        DateTime.now().toString();

    print("Uploading file: $filePath");

    final Uri uri = Uri.parse('https://onestoreapi.vachanmn.tech/items');
    final token = await storage.read(key: 'jwt_token');
    print(token);

    final request = http.MultipartRequest('POST', uri)
      ..headers['Authorization'] = 'Bearer $token'
      ..fields['name'] = fileName
      ..fields['description'] = fileDescription;

    // Check if the category is selected
    final fileCategory = _fileCategories[filePath];
    if (fileCategory != 'Select Category' && fileCategory != null) {
      final categoryId = _fileCategories.entries
          .firstWhere((entry) => entry.value == fileCategory,
              orElse: () => MapEntry('', ''))
          .key;
      if (categoryId.isNotEmpty) {
        request.fields['categoryId'] = categoryId;
      }
    }

    if (mimeType?.startsWith("image/") == true) {
      request.fields['itemType'] = "image";
      final fileExtension = filePath.split('.').last;
      final image = await _loadImage(filePath);
      if (image != null) {
        request.files.add(http.MultipartFile(
          'file',
          File(filePath).openRead(),
          await File(filePath).length(),
          filename: filePath.split('/').last,
          contentType: MediaType(mimeType!.split("/")[0], fileExtension),
        ));
      } else {
        print("Failed to load image: $filePath");
        return;
      }
    } else if (mimeType?.startsWith("video/") == true) {
      request.fields['itemType'] = "video";
      final fileExtension = filePath.split('.').last;
      request.files.add(http.MultipartFile.fromBytes(
        'file',
        File(filePath).readAsBytesSync(),
        filename: filePath.split('/').last,
        contentType: MediaType(mimeType!.split("/")[0], fileExtension),
      ));
    } else if (filePath.toLowerCase().startsWith("http")) {
      request.fields['itemType'] = "link";
      request.fields['link'] = filePath;
    } else if (mimeType?.startsWith("text/") == true) {
      request.fields['itemType'] = "text";
      request.fields['link'] = filePath;
    } else {
      request.fields['itemType'] = "file";
      final fileExtension = filePath.split('.').last;
      request.files.add(http.MultipartFile.fromBytes(
        'file',
        File(filePath).readAsBytesSync(),
        filename: filePath.split('/').last,
        contentType: MediaType(mimeType!.split("/")[0], fileExtension),
      ));
    }

    final response = await request.send();

    if (response.statusCode == 200) {
      print('Upload successful!');
    } else {
      print('Upload failed with status code: ${response.statusCode}');
    }
  }

  Future<void> _uploadAllContents() async {
    setState(() {
      _isUploading = true; // Set the uploading state to true
    });

    for (var file in _sharedFiles) {
      await _uploadContent(file);
    }

    setState(() {
      _isUploading = false; // Set the uploading state to false
    });

    // Close the app
    SystemNavigator.pop();
  }

  Future<void> _logout() async {
    try {
      final authNotifier =
          ref.read(authProvider.notifier); // Access AuthNotifier using Riverpod
      await authNotifier.logout();
      await storage.delete(key: 'jwt_token'); // Remove the token from storage
      Navigator.of(context)
          .pushReplacementNamed('/login'); // Navigate to login screen
    } catch (e) {
      print("Logout error: $e");
    }
  }

  Widget _buildFileContent(SharedMediaFile file) {
    final mimeType = file.mimeType;
    final filePath = file.path;

    final fileCategory = _fileCategories.containsKey(filePath)
        ? _fileCategories[filePath]
        : 'Select Category';

    print("Building content for file: $filePath, MIME type: $mimeType");

    if (mimeType?.startsWith('image/') == true) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Upload this image"),
          SizedBox(height: 10),
          TextFormField(
            controller: _fileNameControllers[filePath],
            decoration: InputDecoration(
              labelText: 'Name (default: ${mimeType?.split('/')[0]})',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextFormField(
            controller: _fileDescriptionControllers[filePath],
            decoration: InputDecoration(
              labelText: 'Description (default: ${mimeType?.split('/')[0]})',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          DropdownButtonFormField<String>(
            value: fileCategory,
            onChanged: (String? newValue) {
              setState(() {
                _fileCategories[filePath] = newValue!;
              });
            },
            items: ['Select Category', ..._fileCategories.values.toSet()]
                .map((category) {
              return DropdownMenuItem<String>(
                value: category,
                child: Text(category),
              );
            }).toList(),
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
          ),
        ],
      );
    } else if (mimeType?.startsWith('video/') == true) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Upload this video"),
          SizedBox(height: 10),
          TextFormField(
            controller: _fileNameControllers[filePath],
            decoration: InputDecoration(
              labelText: 'Name (default: ${mimeType?.split('/')[0]})',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextFormField(
            controller: _fileDescriptionControllers[filePath],
            decoration: InputDecoration(
              labelText: 'Description (default: ${mimeType?.split('/')[0]})',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          DropdownButtonFormField<String>(
            value: fileCategory,
            onChanged: (String? newValue) {
              setState(() {
                _fileCategories[filePath] = newValue!;
              });
            },
            items: ['Select Category', ..._fileCategories.values.toSet()]
                .map((category) {
              return DropdownMenuItem<String>(
                value: category,
                child: Text(category),
              );
            }).toList(),
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
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
          TextFormField(
            controller: _fileNameControllers[filePath],
            decoration: InputDecoration(
              labelText: 'Name (default: ${mimeType?.split('/')[0]})',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextFormField(
            controller: _fileDescriptionControllers[filePath],
            decoration: InputDecoration(
              labelText: 'Description (default: ${mimeType?.split('/')[0]})',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          DropdownButtonFormField<String>(
            value: fileCategory,
            onChanged: (String? newValue) {
              setState(() {
                _fileCategories[filePath] = newValue!;
              });
            },
            items: ['Select Category', ..._fileCategories.values.toSet()]
                .map((category) {
              return DropdownMenuItem<String>(
                value: category,
                child: Text(category),
              );
            }).toList(),
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
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
          actions: [
            IconButton(
              icon: Icon(Icons.logout),
              onPressed: _logout, // Call logout function
            ),
          ],
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: _isUploading
              ? Center(
                  child: CircularProgressIndicator(), // Show progress indicator
                )
              : _sharedFiles.isEmpty
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
                            1.0, // Adjust this ratio as needed for height
                      ),
                      itemCount: _sharedFiles.length,
                      itemBuilder: (context, index) {
                        final file = _sharedFiles[index];
                        return Container(
                          margin: EdgeInsets.symmetric(horizontal: 8.0),
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: _buildFileContent(file),
                          ),
                        );
                      },
                    ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: _isUploading
              ? null // Disable button if uploading
              : () {
                  if (_sharedFiles.isNotEmpty) {
                    _uploadAllContents(); // Call method to upload all contents
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
