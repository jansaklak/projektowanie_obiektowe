package com.example.auth.service

import org.springframework.stereotype.Service

class EagerAuthenticationService private constructor() : IAuthenticationService {
    
    private val userCredentials = mapOf(
        "admin" to "admin123",
        "user1" to "password1",
        "user2" to "password2"
    )
    
    override fun authenticate(username: String, password: String): Boolean {
        return userCredentials[username] == password
    }
    
    companion object {
        // Eager initialization of singleton
        private val instance: EagerAuthenticationService = EagerAuthenticationService()
        
        fun getInstance(): EagerAuthenticationService {
            return instance
        }
    }
}
