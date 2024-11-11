package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.dto.CustomResponse;
import com.dkkhoa.chatapp.dto.UserSessionDTO;
import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.service.UserService;
import com.dkkhoa.chatapp.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

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

    @PostMapping("/user/update")
    @ResponseBody
    public void updateUser(HttpServletRequest request, @RequestBody UserSessionDTO userRequestUpdate) {
        System.out.println("64 in UserController");
        System.out.println(userRequestUpdate);
        try {
            String authHeader = request.getHeader("Authorization");
            System.out.println(authHeader);
            if(authHeader == null || !authHeader.startsWith("Bearer")) {
                return ;
            }

//            String token = authHeader.substring(7);
//            JwtUtil jwtUtil = new JwtUtil();
//            String email = jwtUtil.extractEmail(token);
//            if(email == null || jwtUtil.isTokenExpired(token)) {
//
//            }
//            User user = userService.getUserByEmail(email);
//
//            UserSessionDTO userSessionDTO = new UserSessionDTO();
//            userSessionDTO.setId(user.getId());
//            userSessionDTO.setEmail(user.getEmail());
//            userSessionDTO.setUsername(user.getUsername());
//            userSessionDTO.setAvatar(user.getAvatar());

        }
        catch (Exception e) {
            e.printStackTrace();

        }
    }
}
