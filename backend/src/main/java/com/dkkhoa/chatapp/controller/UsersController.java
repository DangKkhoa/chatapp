package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.dto.CustomResponse;
import com.dkkhoa.chatapp.dto.UserSessionDTO;
import com.dkkhoa.chatapp.mapper.UserMapper;
import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.service.UserService;
import com.dkkhoa.chatapp.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class UsersController {
    @Autowired
    public UserService userService;
//
//
//    @PostMapping("/users")
//    public String checkJwt(HttpServletRequest request) {
//        System.out.println("Line 14");
//
//        String authHeader = request.getHeader("Authorization");
//        System.out.println(authHeader);
//        if(authHeader == null || !authHeader.startsWith("Bearer")) {
//            return "redirect:/auth/login";
//        }
//        System.out.println("Line 19");
//
//        String token = authHeader.substring(7);
//        try {
//            JwtUtil jwtUtil = new JwtUtil();
//            String email = jwtUtil.extractEmail(token);
//            if(email == null || jwtUtil.isTokenExpired(token)) {
//                return "redirect:/auth/login";
//            }
//            System.out.println("Line 27");
//            return "index";
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//            return "redirect:/auth/login";
//        }
//    }
//
//    @GetMapping("/users")
//    public String usersPage() {
//        return "users";
//    }
//
//
//
    @GetMapping("/user/{id}")
    @ResponseBody
    public User getReceiverInfo(@PathVariable int id) {
        System.out.println(id);
        User userToSend = userService.getUserById(id);
//        userToSend.setEmail("");
//        userToSend.setPassword("");
        return userToSend;
    }
}
