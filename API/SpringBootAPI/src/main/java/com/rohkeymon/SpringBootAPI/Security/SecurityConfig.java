package com.rohkeymon.SpringBootAPI.Security;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean // Custom filter chain bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(cors -> {
        });
        http.csrf(customizer -> customizer.disable());
        // Configure which request need to be authenticated. Specify /register and
        // /login and require auth for all other resources. Define request matchers for
        // public endpoints.
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authorizeHttpRequests(request -> request
                .requestMatchers(
                        "/api/register",
                        "/api/login"// ,
                // "/api/test",
                // "/api/alldata",
                // "/api/decklist",
                // "/api/decklist/**",
                // "/api/add-to-deck",
                // "/api/decrement-copies",
                // "/api/delete-entry"
                ).permitAll()
                .anyRequest().authenticated());
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
