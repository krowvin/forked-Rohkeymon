package com.rohkeymon.SpringBootAPI.controller;

import com.rohkeymon.SpringBootAPI.model.Users;
import com.rohkeymon.SpringBootAPI.repo.UsersRepo;
import com.rohkeymon.SpringBootAPI.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/api/register")
    public String register(@RequestBody Users users){
        service.register(users);
        return "User registered successfully";
    }

}
