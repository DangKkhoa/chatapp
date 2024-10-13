package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.model.Message;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashSet;
import java.util.Set;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private Set<String> onlineUsers = new HashSet<>();



    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message recievePublicMessage(@Payload Message message) {
        System.out.println(message);
        return message;
    }

//    @MessageMapping("/join")
//    @SendTo("/topic/online-users")
//    public Message userJoin(@Payload  Message message) {
//        onlineUsers.add(message.getSenderName());
//        simpMessagingTemplate.convertAndSend("/topic/online-users", onlineUsers);
//
//        Message joinMessage = new Message();
//        joinMessage.setSenderName("System");
//        joinMessage.setMessage(message.getSenderName() + " has joined the conversation.");
//        joinMessage.setStatus(Status.JOIN);
//        simpMessagingTemplate.convertAndSend("/chatroom/public", joinMessage);
//        System.out.println(onlineUsers);
//        return message;
//    }

    @MessageMapping("/private-message")
    public Message recievePrivateMessage(@Payload Message message) {

        // /user/Username/private
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        return message;
    }
}
