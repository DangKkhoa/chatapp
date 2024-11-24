package com.dkkhoa.chatapp.controller;


import com.dkkhoa.chatapp.dto.*;
import com.dkkhoa.chatapp.mapper.MessageMapper;
import com.dkkhoa.chatapp.mapper.UserMapper;
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

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Controller

public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;



    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MessageMapper messageMapper;

    int MESSAGE_MAX_LENGTH = 250;

    private Set<OnlineUser> onlineUsers = new HashSet<>();

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message recievePublicMessage(@Payload MessageDTO messageDTO) {
        try {
            String email = jwtUtil.extractUsername(messageDTO.getToken());
            if(email == null || jwtUtil.isTokenExpired(messageDTO.getToken())) {
                return null;
            }

//            User senderInfo = userService.getUserById(messageDTO.getSenderId());
            Message message = messageMapper.toEntity(messageDTO);

            chatService.storePublicMessage(message);
            System.out.println(message);
            return message;
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }



    @GetMapping("/chat/public/history")
    @ResponseBody
    public List<Message> getPublicHistoryMessages(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7); // Assuming Bearer token format

            String email = jwtUtil.extractUsername(token);
            if(email == null || jwtUtil.isTokenExpired(token)) {
                System.out.println("Token is invalid or expired");
                return null;
            }
            return chatService.findAllByChatroom("chatroom-1");
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @MessageMapping("/join/public")
    @SendTo("/topic/online-users")
    public Set<OnlineUser> userJoin(@Payload MessageDTO messageDTO) {
        System.out.println(messageDTO);
        boolean onlineUserExist = onlineUsers.stream().anyMatch(user -> user.getId() == messageDTO.getSenderId());
        User user = userService.getUserById(messageDTO.getSenderId());

        if(!onlineUserExist && user != null) {
            user.setStatus("Online");
            userService.updateUser(user);
            onlineUsers.add(new OnlineUser(messageDTO.getSenderId(), messageDTO.getSenderName(), messageDTO.getSenderAvatar()));
        }
        System.out.println(onlineUsers);
        return onlineUsers;
    }

    @MessageMapping("/disconnect/public")
    @SendTo("/topic/online-users")
    public Set<OnlineUser> userDisconnect(@Payload MessageDTO messageDTO) {
        onlineUsers.removeIf(user -> user.getId() == messageDTO.getSenderId());
        User userToUpdate = userService.getUserById(messageDTO.getSenderId());
        if(userToUpdate != null) {
            LocalDateTime logoutTime = LocalDateTime.now();
            userToUpdate.setLastLogin(logoutTime);
            userToUpdate.setStatus("Offline");
            userService.updateUser(userToUpdate);
        }
        return onlineUsers;
    }

    @MessageMapping("/join/private")
    public void userJoinPrivate(@Payload MessageDTO messageDTO) {
        System.out.println("Chat controller 110");
        System.out.println(messageDTO);

        Message message = messageMapper.toEntity(messageDTO);
         ChatStatusResponse chatroomAvailability = chatService.isAcceptedByReceiver(message);
//         System.out.println("Chatroom available: " + chatroomAvailable);
        simpMessagingTemplate.convertAndSendToUser(Integer.toString(messageDTO.getSenderId()), "/chat-availability", chatroomAvailability.isAvailable());
        //chatService.isAcceptedByReceiver(message.getSenderId(), message.getReceiverId());

    }


    @MessageMapping("/private-message")
    public void receivePrivateMessage(@Payload MessageDTO messageDTO) {

        System.out.println(messageDTO);
        System.out.println("144");
        Message message = messageMapper.toEntity(messageDTO);


//        System.out.println(message.getSenderId());

        if(chatService.storePrivateMessage(message) != null) {
            System.out.println("119");
            // boolean chatAvailable = chatService.isAcceptedByReceiver(message.getSenderId(), message.getReceiverId());
            simpMessagingTemplate.convertAndSendToUser(messageDTO.getReceiverId(), "/private", message);
            //simpMessagingTemplate.convertAndSendToUser(messageDTO.getReceiverId(), "/chat-availability", chatAvailable);
            ChatStatusResponse chatroomAvailability = chatService.isAcceptedByReceiver(message);
            System.out.println("Code: " + chatroomAvailability.getCode());
            if(chatroomAvailability.getCode() == 1 || chatroomAvailability.getCode() == 3) {
                    simpMessagingTemplate.convertAndSendToUser(Integer.toString(message.getSender().getId()), "/chat-availability", chatroomAvailability.isAvailable());
            }
            else {
                simpMessagingTemplate.convertAndSendToUser(Integer.toString(message.getReceiver().getId()), "/chat-availability", chatroomAvailability.isAvailable());

            }


            return ;
        }

//        Message systemMessage = new Message();
//        // If invitation is not accepted, SYSTEM send message back to user
//        systemMessage.setSenderName("System");
//        systemMessage.setSenderId(0);
//        systemMessage.setMessageId(0);
//        systemMessage.setMessage("Wait for user to accept your message.");
//        systemMessage.setReceiverId(message.getSenderId());
//        systemMessage.setReceiverName(message.getSenderName());
//        simpMessagingTemplate.convertAndSendToUser(Integer.toString(systemMessage.getReceiverId()), "/private", systemMessage);

        //return systemMessage;
    }

    @GetMapping("/chat/private/history")
    @ResponseBody
    public List<Message> getPrivateHistoryMessages(HttpServletRequest request,
                                                   @RequestParam("senderId") int senderId,
                                                   @RequestParam("receiverId") int receiverId) {
        try {
            String token = request.getHeader("Authorization").substring(7); // Assuming Bearer token format

            String email = jwtUtil.extractUsername(token);
            if(email == null || jwtUtil.isTokenExpired(token)) {
                System.out.println("Token is invalid or expired");
                return null;
            }
            System.out.println(120);
            System.out.println(senderId);
            System.out.println(receiverId);
            System.out.println(chatService.findPrivateMessages(senderId, receiverId));
            return chatService.findPrivateMessages(senderId, receiverId);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @PostMapping("/chat/private/incoming-message")
    @ResponseBody
    public Map<String, Map<String, Message>> sendPrivateMessages(@RequestBody int userId) {
        System.out.println(userId);
        return chatService.getMessagesGroupedBySender(userId);
    }




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

    @PostMapping("/user/update")
    @ResponseBody
    public CustomResponse updateUser(HttpServletRequest request, @RequestBody UserSessionDTO userRequestUpdate) {
        System.out.println(userRequestUpdate);

        try {
            String authHeader = request.getHeader("Authorization");
            System.out.println(authHeader);
            if(authHeader == null || !authHeader.startsWith("Bearer")) {
                return new CustomResponse(0, "Unauthorized");
            }

            String token = authHeader.substring(7);
            JwtUtil jwtUtil = new JwtUtil();
            String email = jwtUtil.extractEmail(token);
            if(email == null || jwtUtil.isTokenExpired(token)) {
                return new CustomResponse(0, "Token is invalid or expired");
            }
            User existingUser = userService.getUserByEmail(email);
            if(existingUser.getId() != userRequestUpdate.getId()) {
                return new CustomResponse(0, "User does not exist");
            }
            userRequestUpdate.setEmail(email);
            User userToUpdate = UserMapper.toEntity(userRequestUpdate);

            if(userService.updateUser(userToUpdate) != null) {
                Optional<OnlineUser> onlineUserOptional = onlineUsers.stream()
                        .filter(user -> user.getId() == userRequestUpdate.getId())
                        .findFirst();

                if(onlineUserOptional.isPresent()) {
                    OnlineUser onlineUser = onlineUserOptional.get();
                    onlineUser.setAvatar(userToUpdate.getAvatar());
                    onlineUser.setUsername(userToUpdate.getUsername());
                }

                userRequestUpdate.setEmail("");
                simpMessagingTemplate.convertAndSend("/topic/update", userRequestUpdate);
                return new CustomResponse(1, "User updated successfully", userRequestUpdate);
            }

            return new CustomResponse(0, "User not found");

        }
        catch (Exception e) {
            e.printStackTrace();
            return new CustomResponse(0, "Something went wrong. Please try again later");
        }
    }
}
