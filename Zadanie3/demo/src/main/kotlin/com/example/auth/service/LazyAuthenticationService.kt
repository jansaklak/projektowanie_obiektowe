package com.example.auth.service

import org.springframework.stereotype.Service

class LazyAuthenticationService private constructor() : IAuthenticationService {

    private val userCredentials = mapOf(
        "admin" to "admin123",
        "user1" to "password1",
        "user2" to "password2"
    )
    
    override fun authenticate(username: String, password: String): Boolean {
        return userCredentials[username] == password
    }
    
    companion object {
        @Volatile
        private var instance: LazyAuthenticationService? = null
        
        fun getInstance(): LazyAuthenticationService {
            // Double-checked locking pattern
            return instance ?: synchronized(this) {
                instance ?: LazyAuthenticationService().also { instance = it }
            }
        }
    }
}
