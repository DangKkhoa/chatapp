package com.dkkhoa.chatapp.service;


import com.dkkhoa.chatapp.dto.ChatStatusResponse;
import com.dkkhoa.chatapp.model.Chatroom;
import com.dkkhoa.chatapp.model.Message;
import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.repo.ChatRepository;
import com.dkkhoa.chatapp.repo.MessageRepository;
import com.dkkhoa.chatapp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private UserRepository userRepository;


    public String generatePrivateChatroom(int senderId, int receiverId) {
        return "chatroom-" + Math.max(senderId, receiverId) + "-" + Math.min(senderId, receiverId);
    }

    public Message storePublicMessage(Message message) {
        try {
            Chatroom publicChatroom = chatRepository.findByChatroomId("chatroom-1");
            message.setChatroom(publicChatroom);

            return messageRepository.save(message);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    public List<Message> findAllByChatroom(String id) {
        Chatroom chatroom = chatRepository.findByChatroomId(id);
        return messageRepository.findAllByChatroom(chatroom);
    }

    public Message storePrivateMessage(Message message) {

        String chatroomId = generatePrivateChatroom(message.getSenderId(), message.getReceiverId());
        System.out.println("chatroomId: " + chatroomId);
        Chatroom privateChatroom = chatRepository.findByChatroomId(chatroomId);


        if(privateChatroom == null) {
            Chatroom newPrivateChatroom = new Chatroom(chatroomId, false, message.getSenderId(), message.getReceiverId());
            chatRepository.save(newPrivateChatroom);
            message.setChatroom(newPrivateChatroom);
        }
        else {
            List<Message> messages = messageRepository.findAllByChatroom(privateChatroom);
            System.out.println(58);
            System.out.println(messages.get(0));
            if(messages.get(0).getReceiverId() == message.getSenderId()) {
                privateChatroom.setAccepted(true);
                chatRepository.save(privateChatroom);

            }

            if(!privateChatroom.isAccepted()) return null;
            message.setChatroom(privateChatroom);
        }

        return messageRepository.save(message);
    }

    public List<Message> findPrivateMessages(int senderId, int receiverId) {
        Chatroom privateChatroom = chatRepository.findByChatroomId(generatePrivateChatroom(senderId, receiverId));
        return messageRepository.findAllByChatroom(privateChatroom);
    }

    public Map<String, String> getMessagesGroupedBySender(int userId) {
        List<Chatroom> chatrooms = chatRepository.findAllByUserId(userId);

//        List<Message> messages = messageRepository.findAllMessagesSentToUser(userId);
        Map<String, String> usersInChatroom = new HashMap<>();
        for(Chatroom chatroom : chatrooms) {
            int otherUserId = chatroom.getUser1() == userId ? chatroom.getUser2() : chatroom.getUser1();
            User otherUserData = userRepository.findById(otherUserId);
            // List<Message> messages = messageRepository.findAllBySenderIdAndReceiverId(otherUserId, userId);
            if(otherUserData != null) {
                usersInChatroom.put(Integer.toString(otherUserData.getId()), otherUserData.getUsername());

            };
        }




        return usersInChatroom;
    }


    public ChatStatusResponse isAcceptedByReceiver(Message message) {
        String chatroomId = generatePrivateChatroom(message.getSenderId(), message.getReceiverId());
        Chatroom chatroom = chatRepository.findByChatroomId(chatroomId);
        if (chatroom == null) {
            // simpMessagingTemplate.convertAndSendToUser(Integer.toString(receiverId), "/chat-availability", true);
            return new ChatStatusResponse(1, true);
        }
//
        List<Message> messages = messageRepository.findAllByChatroom(chatroom);
        if (messages.size() <= 2 && messages.get(0).getReceiverId() == message.getSenderId()) {
                //simpMessagingTemplate.convertAndSend("/topic/chat-availability", true);
//            simpMessagingTemplate.convertAndSendToUser(Integer.toString(message.getReceiverId()), "/chat-availability", true);
            return new ChatStatusResponse(2, true);
        }
////        if(messages.get(0).getReceiverId() == senderId) return true;
//        System.out.println(93);
//        System.out.println(chatroom);

        // simpMessagingTemplate.convertAndSendToUser(Integer.toString(senderId), "/chat-availability", chatroom.isAccepted());
        return new ChatStatusResponse(3, chatroom.isAccepted());
    }

    public boolean deleteChatroom(int user1, int user2) {
        try {
            String chatroomId = generatePrivateChatroom(user1, user2);
            Chatroom chatroom = chatRepository.findByChatroomId(chatroomId);
            if(chatroom != null) {
                chatRepository.delete(chatroom);
                return true;
            }
            return false;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
