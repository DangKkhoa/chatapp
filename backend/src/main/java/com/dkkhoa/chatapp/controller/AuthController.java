package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.dto.*;
import com.dkkhoa.chatapp.mapper.UserMapper;
import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.service.SendEmailService;
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
import org.springframework.mail.MailAuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

@Controller
@RequestMapping("/auth")
//@CrossOrigin(origins = "http://localhost:5173")

public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private SendEmailService sendEmailService;

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

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
            newUser.setPassword(hashPassword(user.getPassword()));

            sendEmailService.senndEmail(
                    newUser.getEmail(),
                    "Welcome to Anonify!",
                    "Hello " + newUser.getUsername() + ",\n\nThank you for registering with Anonify. We're glad to have you!"
            );

            User userToBeSaved = userService.registerUser(newUser);
            if(userToBeSaved == null) {
                return new CustomResponse(5, "Something went wrong");
            }

            return new CustomResponse(1, "User registration successful");
        } catch(MailAuthenticationException mailAuthenticationException) {
            return new CustomResponse(5, "Something went wrong with the email address");
        } catch(RuntimeException error) {
            System.out.println(error.getMessage());
            return new CustomResponse(5, error.getMessage());
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public CustomResponse login(@RequestBody UserLoginDTO userLoginDTO) {
        System.out.println(userLoginDTO);
        String hashPassword = hashPassword(userLoginDTO.getPassword());
        userLoginDTO.setPassword(hashPassword);
        User userFound = userService.getUser(userLoginDTO);

        if(userFound != null) {

            JwtUtil jwtUtil = new JwtUtil();
            String token = jwtUtil.generateToken(userFound);

            UserSessionDTO userSessionDTO = new UserSessionDTO();
            userSessionDTO.setId(userFound.getId());
            userSessionDTO.setEmail(userFound.getEmail());
            userSessionDTO.setUsername(userFound.getUsername());
            userSessionDTO.setAvatar(userFound.getAvatar());
            return new CustomResponse(1, token, userSessionDTO);
        }
        return new CustomResponse(4, "Wrong username or password");
    }

    @GetMapping("/jwt-verify")
    @ResponseBody
    public CustomResponse verifyToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            System.out.println(authHeader);
            if(authHeader == null || !authHeader.startsWith("Bearer")) {
                return new CustomResponse(11, "No authorization header");
            }

            String token = authHeader.substring(7);
            JwtUtil jwtUtil = new JwtUtil();
            String email = jwtUtil.extractEmail(token);
            if(email == null || jwtUtil.isTokenExpired(token)) {
                return new CustomResponse(11, "Invalid token");
            }
            System.out.println("Line 27");
            User user = userService.getUserByEmail(email);

            UserSessionDTO userSessionDTO = UserMapper.toUserSessionDTO(user);
            return new CustomResponse(10, token, userSessionDTO);
        }
        catch (Exception e) {
            e.printStackTrace();
            return new CustomResponse(11, "Something went wrong");
        }
    }

    @PostMapping("/forget-password/send-code")
    @ResponseBody
    public CustomResponse sendCode(@RequestBody SendCodeDTO sendCodeDTO) {
        User userToUpdate = userService.getUserByEmail(sendCodeDTO.getEmail());
        Random rand = new Random();
        int code = rand.nextInt(100000, 999999);
        userToUpdate.setCode(code);
        userService.updateUser(userToUpdate);
        sendEmailService.senndEmail(
                sendCodeDTO.getEmail(),
                "Change password request",
                "You have requested to change password.\n\nThis is your code: " + code);
        return new CustomResponse(1, "Password changed successfully");
    }


    @PostMapping("/forget-password")
    @ResponseBody
    public CustomResponse forgetPassword(@RequestBody ForgetPasswordDTO forgetPasswordDTO) {
        try {
            User userToUpdate = userService.getUserByEmail(forgetPasswordDTO.getEmail());
            if(userToUpdate.getCode() == 0) {
                return new CustomResponse(10, "Please provide code sent to your email address");
            }
            if(forgetPasswordDTO.getCode() != userToUpdate.getCode()) {
                return new CustomResponse(10, "Invalid code.");
            }
            if(userToUpdate == null) {
                return new CustomResponse(5, "User not found!");
            }

            if(!forgetPasswordDTO.getPassword().equals(forgetPasswordDTO.getConfirmPassword())) {
                return new CustomResponse(6, "Passwords do not match!");
            }

            if(forgetPasswordDTO.getPassword().length() < 8) {
                return new CustomResponse(7, "Password must be at least 8 characters!");
            }

            String hashPassword = hashPassword(forgetPasswordDTO.getPassword());
            userToUpdate.setPassword(hashPassword);

            userService.updateUser(userToUpdate);
            sendEmailService.senndEmail(
                    forgetPasswordDTO.getEmail(),
                    "Password changed!",
                    "Your password has been changed.");
            return new CustomResponse(1, "Password changed successfully");
        }
        catch(MailAuthenticationException e) {
            System.out.println(e);
            return new CustomResponse(3, "Something went wrong with the email address.");
        }
        catch (RuntimeException e) {
            System.out.println(e);
            return new CustomResponse(3, "Cannot change password at the moment. Try again later.");
        }
    }

    @PostMapping("/verify-code")
    @ResponseBody
    public CustomResponse verifyCode(@RequestBody SendCodeDTO sendCodeDTO) {
        User user = userService.getUserByEmail(sendCodeDTO.getEmail());
        if(user == null) {
            return new CustomResponse(5, "User not found!");
        }
        int userCode = user.getCode();
        System.out.println("user code: " + userCode + ", send code: " + sendCodeDTO.getCode());
        if(userCode != sendCodeDTO.getCode()) {
            return new CustomResponse(6, "Incorrect code! Please try again.");
        }

//        user.setCode(0);
//        userService.updateUser(user);
        return new CustomResponse(1, "Code verified.");
    }





}
