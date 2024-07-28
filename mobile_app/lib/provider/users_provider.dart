import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

class AuthState {
  final bool isAuthenticated;
  final String? token;

  AuthState({
    required this.isAuthenticated,
    this.token,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    String? token,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      token: token ?? this.token,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ref;
  final FlutterSecureStorage _storage = FlutterSecureStorage();

  AuthNotifier(this.ref)
      : super(AuthState(isAuthenticated: false, token: null)) {
    // Check token on initialization
    checkToken();
  }

  Future<void> checkToken() async {
    try {
      final token = await _storage.read(key: 'jwt_token');
      if (token != null) {
        state = state.copyWith(
          isAuthenticated: true,
          token: token,
        );
      } else {
        state = state.copyWith(
          isAuthenticated: false,
          token: null,
        );
      }
    } catch (e) {
      print("Error reading token: $e");
      state = state.copyWith(
        isAuthenticated: false,
        token: null,
      );
    }
  }

  Future<void> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('https://onestoreapi.vachanmn.tech/auth/login'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['data']["token"];

        await _storage.write(key: 'jwt_token', value: token);
        state = state.copyWith(
          isAuthenticated: true,
          token: token,
        );
      } else {
        throw Exception('Failed to login');
      }
    } catch (e) {
      print("Error during login: $e");
      throw Exception('Failed to login');
    }
  }

  Future<void> logout() async {
    try {
      await _storage.delete(key: 'jwt_token');
      state = state.copyWith(
        isAuthenticated: false,
        token: null,
      );
    } catch (e) {
      print("Error during logout: $e");
      throw Exception('Failed to logout');
    }
  }
}
