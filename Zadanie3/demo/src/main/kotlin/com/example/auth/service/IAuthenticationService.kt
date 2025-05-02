package com.example.auth.service

interface IAuthenticationService {
    fun authenticate(username: String, password: String): Boolean
}
