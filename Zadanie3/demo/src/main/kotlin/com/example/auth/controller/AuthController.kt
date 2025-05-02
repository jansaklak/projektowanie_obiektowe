package com.example.auth.controller

import com.example.auth.model.User
import com.example.auth.service.IAuthenticationService
import com.example.auth.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class AuthController {
    
    @Autowired
    private lateinit var userService: UserService
    
    @Autowired
    @Qualifier("eagerAuthService") // Can be changed to "lazyAuthService" to use lazy initialization
    private lateinit var authService: IAuthenticationService
    
    @GetMapping("/users")
    fun getAllUsers(): ResponseEntity<List<User>> {
        return ResponseEntity.ok(userService.getAllUsers())
    }
    
    @PostMapping("/login")
    fun login(@RequestParam username: String, @RequestParam password: String): ResponseEntity<Any> {
        val authenticated = authService.authenticate(username, password)
        
        if (authenticated) {
            val user = userService.getUserByUsername(username)
            return ResponseEntity.ok(mapOf(
                "message" to "Authentication successful",
                "user" to user,
                "authType" to authService.javaClass.simpleName
            ))
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(mapOf("message" to "Authentication failed"))
    }
}
