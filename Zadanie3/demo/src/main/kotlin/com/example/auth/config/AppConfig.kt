package com.example.auth.config

import com.example.auth.service.EagerAuthenticationService
import com.example.auth.service.LazyAuthenticationService
import com.example.auth.service.IAuthenticationService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary

@Configuration
class AppConfig {
    
    @Bean(name = ["eagerAuthService"])
    fun eagerAuthenticationService(): IAuthenticationService {
        return EagerAuthenticationService.getInstance()
    }
    
    @Bean(name = ["lazyAuthService"])
    fun lazyAuthenticationService(): IAuthenticationService {
        return LazyAuthenticationService.getInstance()
    }
}