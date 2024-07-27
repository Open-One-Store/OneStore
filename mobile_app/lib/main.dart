import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_app/provider/users_provider.dart';
import 'package:mobile_app/screens/Login_Screen.dart';
import 'package:mobile_app/screens/main_screen.dart';

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return MaterialApp(
      home: authState.isAuthenticated ? MainApp() : LoginPage(),
    );
  }
}
