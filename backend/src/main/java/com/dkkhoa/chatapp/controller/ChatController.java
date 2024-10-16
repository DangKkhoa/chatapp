package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.dto.OnlineUser;
import com.dkkhoa.chatapp.model.Message;
import com.dkkhoa.chatapp.model.Status;
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

    private Set<OnlineUser> onlineUsers = new HashSet<>();



    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message recievePublicMessage(@Payload Message message) {

        System.out.println(message);
        return message;
    }

    @MessageMapping("/join")
    @SendTo("/topic/online-users")
    public Set<OnlineUser> userJoin(@Payload  Message message) {
        System.out.println(message);
        boolean onlineUserExist = onlineUsers.stream().anyMatch(user -> user.getId() == message.getSenderId());
        if(!onlineUserExist) {
            onlineUsers.add(new OnlineUser(message.getSenderId(), message.getSenderName(), message.getSenderAvatarColor()));
            simpMessagingTemplate.convertAndSend("/topic/online-users", onlineUsers);

            Message joinMessage = new Message();
            joinMessage.setSenderName("System");
            joinMessage.setMessage(message.getSenderName() + " has joined the conversation.");
            joinMessage.setStatus(Status.JOIN);
            simpMessagingTemplate.convertAndSend("/chatroom/public", joinMessage);
        }
        System.out.println(onlineUsers);
        return onlineUsers;
    }

    @MessageMapping("/private-message")
    public Message recievePrivateMessage(@Payload Message message) {

        // /user/Username/private
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        return message;
    }
}
