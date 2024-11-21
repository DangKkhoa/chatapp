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
            if(publicChatroom == null) {
                publicChatroom = new Chatroom("chatroom-1");
                chatRepository.save(publicChatroom);
            }
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

        String chatroomId = generatePrivateChatroom(message.getSender().getId(), message.getReceiver().getId());
        System.out.println("chatroomId: " + chatroomId);
        Chatroom privateChatroom = chatRepository.findByChatroomId(chatroomId);


        if(privateChatroom == null) {
            Chatroom newPrivateChatroom = new Chatroom(chatroomId, false, message.getSender().getId(), message.getReceiver().getId());
            chatRepository.save(newPrivateChatroom);
            message.setChatroom(newPrivateChatroom);
        }
        else {
            List<Message> messages = messageRepository.findAllByChatroom(privateChatroom);
            System.out.println(58);
            System.out.println(messages.get(0));
            if(messages.get(0).getReceiver().getId() == message.getSender().getId()) {
                privateChatroom.setAccepted(true);
                chatRepository.save(privateChatroom);

            }

            if(!privateChatroom.isAccepted()) return null;
            message.setChatroom(privateChatroom);
        }

        message.setSeen(false);

        return messageRepository.save(message);
    }

    public List<Message> findPrivateMessages(int senderId, int receiverId) {
        Chatroom privateChatroom = chatRepository.findByChatroomId(generatePrivateChatroom(senderId, receiverId));
        return messageRepository.findAllByChatroom(privateChatroom);
    }

    public Map<String, Map<String, Message>> getMessagesGroupedBySender(int userId) {
        List<Chatroom> chatrooms = chatRepository.findAllByUserId(userId);

//        List<Message> messages = messageRepository.findAllMessagesSentToUser(userId);
        Map<String, Message> usersInChatroom = new HashMap<>();
        Map<String, Map<String, Message>> messagesOfUsersInChatroom = new HashMap<>();
        for(Chatroom chatroom : chatrooms) {
            List<Message> messagesByChatroom = messageRepository.findAllByChatroom(chatroom);
            Message lastMessage = messagesByChatroom.get(messagesByChatroom.size() - 1);
            int otherUserId = chatroom.getUser1() == userId ? chatroom.getUser2() : chatroom.getUser1();
            User otherUserData = userRepository.findById(otherUserId);
            // List<Message> messages = messageRepository.findAllBySenderIdAndReceiverId(otherUserId, userId);
            if(otherUserData != null) {
                usersInChatroom.put(otherUserData.getUsername(), lastMessage);
                messagesOfUsersInChatroom.put(Integer.toString(otherUserData.getId()), usersInChatroom);
            };
        }




        return messagesOfUsersInChatroom;
    }


    public ChatStatusResponse isAcceptedByReceiver(Message message) {
        String chatroomId = generatePrivateChatroom(message.getSender().getId(), message.getReceiver().getId());
        Chatroom chatroom = chatRepository.findByChatroomId(chatroomId);
        if (chatroom == null) {
            // simpMessagingTemplate.convertAndSendToUser(Integer.toString(receiverId), "/chat-availability", true);
            return new ChatStatusResponse(1, true);
        }
//
        List<Message> messages = messageRepository.findAllByChatroom(chatroom);
        if (messages.size() <= 2 && messages.get(0).getReceiver().getId() == message.getSender().getId()) {

            return new ChatStatusResponse(2, true);
        }

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
