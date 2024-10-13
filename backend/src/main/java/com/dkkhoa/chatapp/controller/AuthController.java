package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.dto.CustomResponse;
import com.dkkhoa.chatapp.dto.UserSessionDTO;
import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.dto.UserRegistrationDTO;
import com.dkkhoa.chatapp.service.UserService;
import com.dkkhoa.chatapp.utils.EmailChecker;
import com.dkkhoa.chatapp.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequestMapping("/auth")
//@CrossOrigin(origins = "http://localhost:5173")

public class AuthController {

    @Autowired
    private UserService userService;



    @PostMapping("/register")
    @ResponseBody
    public CustomResponse register(HttpSession httpSession, @RequestBody UserRegistrationDTO user) {
        try {
            if(user.getEmail().equals("") || user.getUsername().equals("") || user.getPassword().equals("")) {
                return new CustomResponse(0, "Please provide all information");
            }

            if(!EmailChecker.patternMatches(user.getEmail())) {
                return new CustomResponse(2, "Invalid email address");

            }
            if(user.getPassword().length() < 8) {
                return new CustomResponse(2, "Password must be at least 8 characters");
            }
            if(!user.getPassword().equals(user.getConfirmedPassword())) {
                return new CustomResponse(3, "Passwords do not match");
            }

            boolean isUserExisted = userService.userExists(user.getEmail());
            if(isUserExisted) {
                return new CustomResponse(4, "Email address has already been used");
            }

            User newUser = new User();
            newUser.setEmail(user.getEmail());
            newUser.setUsername(user.getUsername());
            newUser.setPassword(user.getPassword());
            User userToBeSaved = userService.registerUser(newUser);
            if(userToBeSaved == null) {
                return new CustomResponse(5, "Something went wrong");
            }
            return new CustomResponse(1, "User registration successful");
        }
        catch(RuntimeException error) {
            System.out.println(error.getMessage());
            return new CustomResponse(5, error.getMessage());
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public CustomResponse login(HttpSession session, @RequestBody User user) {
        System.out.println(user);

        User userFound = userService.getUser(user);

        if(userFound != null) {
//            session.setAttribute("user",
//                    new UserSessionDTO(userFound.getId(),
//                            userFound.getEmail(),
//                            userFound.getUsername(),
//                            userFound.getAvatarUrl()
//                    )
//            );
            return new CustomResponse(1, "{id: " + userFound.getId() + ", username: " + userFound.getUsername() + "}");
        }
        return new CustomResponse(4, "Wrong username or password");
    }

    @GetMapping("/login")
//    @ResponseBody
    public String loginPage(HttpSession session) {
        if(session.getAttribute("user") != null) {
            return "redirect:/";
        }
        return "login";
    }

    @GetMapping("/register")
//    @ResponseBody
    public String registerPage(HttpSession session, HttpServletRequest request) {
        return "register";
    }


}
