package com.example.auth.service

import com.example.auth.model.User
import org.springframework.stereotype.Service

@Service
class UserService {
    private val users = listOf(
        User(1, "admin", "admin@example.com"),
        User(2, "user1", "user1@example.com"),
        User(3, "user2", "user2@example.com")
    )
    
    fun getAllUsers(): List<User> {
        return users
    }
    
    fun getUserByUsername(username: String): User? {
        return users.find { it.username == username }
    }
}
