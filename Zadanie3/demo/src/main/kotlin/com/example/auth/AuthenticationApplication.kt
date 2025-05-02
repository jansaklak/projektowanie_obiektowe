package com.example.auth

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import com.example.auth.service.IAuthenticationService
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean

@SpringBootApplication
class AuthenticationApplication {
    
    @Autowired
    @Qualifier("eagerAuthService") // Can be changed to "lazyAuthService" to use lazy initialization
    private lateinit var authService: IAuthenticationService
    
    @Bean
    fun init() = CommandLineRunner {
        // Simply log that we're using the singleton instance
        println("Using authentication service: ${authService.javaClass.simpleName}")
        
        // Test authentication with the singleton
        val testAuth = authService.authenticate("admin", "admin123")
        println("Authentication test result: $testAuth")
    }
}

fun main(args: Array<String>) {
    runApplication<AuthenticationApplication>(*args)
}
