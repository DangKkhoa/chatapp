package com.dkkhoa.chatapp.controller;

import com.dkkhoa.chatapp.dto.CustomResponse;
import com.dkkhoa.chatapp.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/jwt-verify")
public class JwtVerifyController {

    @GetMapping("/")
    @ResponseBody
    public CustomResponse checkJwtHome(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        System.out.println(authHeader);
        if(authHeader == null || !authHeader.startsWith("Bearer")) {
            return new CustomResponse(11, "No authorization header");
        }


        String token = authHeader.substring(7);
        try {
            JwtUtil jwtUtil = new JwtUtil();
            String email = jwtUtil.extractEmail(token);
            if(email == null || jwtUtil.isTokenExpired(token)) {
                return new CustomResponse(11, "Invalid token");
            }
            System.out.println("Line 27");
            return new CustomResponse(10, "Success");
        }
        catch (Exception e) {
            e.printStackTrace();
            return new CustomResponse(11, "Something went wrong");
        }

    }
}
