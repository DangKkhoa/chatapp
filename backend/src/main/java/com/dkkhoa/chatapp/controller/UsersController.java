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


    @PostMapping("/users")
    public String checkJwt(HttpServletRequest request) {
        System.out.println("Line 14");

        String authHeader = request.getHeader("Authorization");
        System.out.println(authHeader);
        if(authHeader == null || !authHeader.startsWith("Bearer")) {
            return "redirect:/auth/login";
        }
        System.out.println("Line 19");

        String token = authHeader.substring(7);
        try {
            JwtUtil jwtUtil = new JwtUtil();
            String email = jwtUtil.extractEmail(token);
            if(email == null || jwtUtil.isTokenExpired(token)) {
                return "redirect:/auth/login";
            }
            System.out.println("Line 27");
            return "index";
        }
        catch (Exception e) {
            e.printStackTrace();
            return "redirect:/auth/login";
        }
    }

    @GetMapping("/users")
    public String usersPage() {
        return "users";
    }

//    @PostMapping("/user/update")
//    @ResponseBody
//    public CustomResponse updateUser(HttpServletRequest request, @RequestBody UserSessionDTO userRequestUpdate) {
//        System.out.println("64 in UserController");
//        System.out.println(userRequestUpdate);
//        try {
//            String authHeader = request.getHeader("Authorization");
//            System.out.println(authHeader);
//            if(authHeader == null || !authHeader.startsWith("Bearer")) {
//                return new CustomResponse(0, "Unauthorized");
//            }
//
//            String token = authHeader.substring(7);
//            JwtUtil jwtUtil = new JwtUtil();
//            String email = jwtUtil.extractEmail(token);
//            if(email == null || jwtUtil.isTokenExpired(token)) {
//                return new CustomResponse(0, "Token is invalid or expired");
//            }
//            User user = userService.getUserByEmail(email);
//            if(user.getId() != userRequestUpdate.getId()) {
//                return new CustomResponse(0, "User does not exist");
//            }
//            userRequestUpdate.setEmail(email);
//            User userToUpdate = UserMapper.toEntity(userRequestUpdate);
//
//            if(userService.updateUser(userToUpdate) != null) {
//                return new CustomResponse(1, "User updated successfully", userRequestUpdate);
//            }
//
//            return new CustomResponse(0, "User not found");
//
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//            return new CustomResponse(0, "Something went wrong. Please try again later");
//        }
//    }

    @GetMapping("/chat/private/{id}")
    @ResponseBody
    public User getReceiverInfo(@PathVariable int id) {
        System.out.println(id);
        User userToSend = userService.getUserById(id);
        userToSend.setEmail("");
        userToSend.setPassword("");
        return userToSend;
    }
}
