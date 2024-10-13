    package com.dkkhoa.chatapp.controller;

    import com.dkkhoa.chatapp.dto.CustomResponse;
    import com.dkkhoa.chatapp.utils.JwtUtil;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpSession;
    import org.springframework.http.HttpRequest;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.*;

    @Controller
    public class HomeController {

        @GetMapping("/")
//        @ResponseBody
        public String homePage(HttpSession session) {
            if (session.getAttribute("user") != null) {
                return "index";
            }
            return "redirect:/auth/ login";
        }
    }




