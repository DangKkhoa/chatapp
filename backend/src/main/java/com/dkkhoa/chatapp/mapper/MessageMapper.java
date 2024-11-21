package com.dkkhoa.chatapp.mapper;

import com.dkkhoa.chatapp.dto.MessageDTO;
import com.dkkhoa.chatapp.model.Message;
import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class MessageMapper {

    @Autowired
    private UserService userService;

    public Message toEntity(MessageDTO messageDTO) {
        Message message = new Message();
        User sender = userService.getUserById(messageDTO.getSenderId());
        message.setSender(sender);
        message.setMessageId(messageDTO.getMessageId());
        message.setMessage(messageDTO.getMessage());
        message.setSentDate(LocalDate.now());
        message.setSentTime(LocalTime.now());

        if(messageDTO.getReceiverId() != null) {

            User receiver = userService.getUserById(Integer.parseInt(messageDTO.getReceiverId()));
            message.setReceiver(receiver);
        }

        message.setStatus(messageDTO.getStatus());

        return message;
    }
}
