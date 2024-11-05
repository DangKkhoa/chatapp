package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.dto.*;
import com.dkkhoa.chatapp.mapper.MessageMapper;
import com.dkkhoa.chatapp.model.Chatroom;
import com.dkkhoa.chatapp.model.Message;
import com.dkkhoa.chatapp.model.Status;
import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.service.ChatService;
import com.dkkhoa.chatapp.service.UserService;
import com.dkkhoa.chatapp.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Controller

public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    private Set<OnlineUser> onlineUsers = new HashSet<>();

    @Autowired
    private JwtUtil jwtUtil;

    int MESSAGE_MAX_LENGTH = 250;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message recievePublicMessage(@Payload MessageDTO messageDTO) {
        try {
            String email = jwtUtil.extractUsername(messageDTO.getToken());
            if(email == null || jwtUtil.isTokenExpired(messageDTO.getToken())) {
                return null;
            }

            Message message = MessageMapper.toEntity(messageDTO);
            chatService.storePublicMessage(message);
            System.out.println(message);
            return message;
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }



    @PostMapping("/chat/history")
    @ResponseBody
    public List<Message> getHistoryMessages() {
        try {
//            String token = request.getHeader("Authorization").substring(7); // Assuming Bearer token format
//
//            String email = jwtUtil.extractUsername(token);
//            if(email == null || jwtUtil.isTokenExpired(token)) {
//                return null;
//            }
            return chatService.findAllByChatroom("chatroom-1");
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @MessageMapping("/join/public")
    @SendTo("/topic/online-users")
    public Set<OnlineUser> userJoin(@Payload Message message) {
        System.out.println(message);
        boolean onlineUserExist = onlineUsers.stream().anyMatch(user -> user.getId() == message.getSenderId());
        if(!onlineUserExist) {
            onlineUsers.add(new OnlineUser(message.getSenderId(), message.getSenderName(), message.getSenderAvatarColor()));
//            simpMessagingTemplate.convertAndSend("/topic/online-users", onlineUsers);

            Message joinMessage = new Message();
            joinMessage.setSenderName("System");
            joinMessage.setMessage(message.getSenderName() + " has joined the conversation.");
            joinMessage.setStatus(Status.JOIN);
            simpMessagingTemplate.convertAndSend("/chatroom/public", joinMessage);
        }
        System.out.println(onlineUsers);
        return onlineUsers;
    }

    @MessageMapping("/disconnect/public")
    @SendTo("/topic/online-users")
    public Set<OnlineUser> userDisconnect(@Payload Message message) {
        onlineUsers.removeIf(user -> user.getId() == message.getSenderId());
        return onlineUsers;
    }

    @MessageMapping("/join/private")
//    @SendTo("/topic/chat-availability")
    public void userJoinPrivate(@Payload Message message) {
        System.out.println("Chat controller 110");
        System.out.println(message);
         ChatStatusResponse chatroomAvailability = chatService.isAcceptedByReceiver(message);
//         System.out.println("Chatroom available: " + chatroomAvailable);
        simpMessagingTemplate.convertAndSendToUser(Integer.toString(message.getSenderId()), "/chat-availability", chatroomAvailability.isAvailable());
        //chatService.isAcceptedByReceiver(message.getSenderId(), message.getReceiverId());

    }


    @MessageMapping("/private-message")
    public void receivePrivateMessage(@Payload MessageDTO messageDTO) {

        // /user/Username/private
        System.out.println("144");
        Message message = MessageMapper.toEntity(messageDTO);

        System.out.println(messageDTO);
        System.out.println(message.getSenderId());

        if(chatService.storePrivateMessage(message) != null) {
            System.out.println("119");
            // boolean chatAvailable = chatService.isAcceptedByReceiver(message.getSenderId(), message.getReceiverId());
            simpMessagingTemplate.convertAndSendToUser(messageDTO.getReceiverId(), "/private", message);
            //simpMessagingTemplate.convertAndSendToUser(messageDTO.getReceiverId(), "/chat-availability", chatAvailable);
            ChatStatusResponse chatroomAvailability = chatService.isAcceptedByReceiver(message);
            System.out.println("Code: " + chatroomAvailability.getCode());
            if(chatroomAvailability.getCode() == 1 || chatroomAvailability.getCode() == 3) {
                    simpMessagingTemplate.convertAndSendToUser(Integer.toString(message.getSenderId()), "/chat-availability", chatroomAvailability.isAvailable());
            }
            else {
                simpMessagingTemplate.convertAndSendToUser(Integer.toString(message.getReceiverId()), "/chat-availability", chatroomAvailability.isAvailable());

            }


            return ;
        }

        Message systemMessage = new Message();
        // If invitation is not accepted, SYSTEM send message back to user
        systemMessage.setSenderName("System");
        systemMessage.setSenderId(0);
        systemMessage.setMessageId(0);
        systemMessage.setMessage("Wait for user to accept your message.");
        systemMessage.setReceiverId(message.getSenderId());
        systemMessage.setReceiverName(message.getSenderName());
        simpMessagingTemplate.convertAndSendToUser(Integer.toString(systemMessage.getReceiverId()), "/private", systemMessage);

        //return systemMessage;
    }

    @PostMapping("/chat/private/history")
    @ResponseBody
    public List<Message> sendPrivateHistoryMessages(@RequestBody PrivateChatHistoryRequestDTO requestDTO) {
        System.out.println(120);
        System.out.println(requestDTO.getSenderId());
        System.out.println(requestDTO.getReceiverId());
        System.out.println(chatService.findPrivateMessages(requestDTO.getSenderId(), requestDTO.getReceiverId()));
        return chatService.findPrivateMessages(requestDTO.getSenderId(), requestDTO.getReceiverId());
    }

    @PostMapping("/chat/private/incoming-message")
    @ResponseBody
    public Map<String, String> sendPrivateMessages(@RequestBody int userId) {
        System.out.println(userId);
        return chatService.getMessagesGroupedBySender(userId);
    }

    @GetMapping("/chat/private/{id}")
    @ResponseBody
//    @CrossOrigin(origins = "http://localhost:5173")
    public User getReceiverInfo(@PathVariable int id) {
        System.out.println(id);
        User userToSend = userService.getUserById(id);
        userToSend.setEmail("");
        userToSend.setPassword("");
        return userToSend;
    }

//    @PostMapping("/chat/private/chat-availability")
//    @ResponseBody
//    public boolean sendChatroomAvailability(@RequestBody PrivateChatHistoryRequestDTO requestDTO) {
//        System.out.println(167);
//        System.out.println(requestDTO.getSenderId());
//        // return chatService.isAcceptedByReceiver(requestDTO.getSenderId(), requestDTO.getReceiverId());
//    }

    @DeleteMapping("/private-chat/delete")
    @ResponseBody
    public CustomResponse deleteMessage(@RequestBody Chatroom chatroom) {
        System.out.println(199);
        System.out.println(chatroom.getUser1()  + " - " + chatroom.getUser2());
        boolean isDeleted = chatService.deleteChatroom(chatroom.getUser1(), chatroom.getUser2());
        if(isDeleted) {
            //simpMessagingTemplate.convertAndSend("/topic/delete/" + chatroom.getUser1(), chatroom.getUser2());
            // simpMessagingTemplate.convertAndSend("/topic/delete/" + chatroom.getUser2(), chatroom.getUser1());
            return new CustomResponse(1, "Chat deleted successfully.");
        }

        return new CustomResponse(2, "Unable to delete chat");
    }

    @MessageMapping("/private-chat/delete")
    public void sendDeleteSignalToUser(@Payload Chatroom chatroom) {
        CustomResponse response = deleteMessage(chatroom);
        // simpMessagingTemplate.convertAndSend("/topic/delete/" + chatroom.getUser1(), chatroom.getUser2());
         simpMessagingTemplate.convertAndSend("/topic/delete/" + chatroom.getUser2(), chatroom.getUser1());


    }
}
