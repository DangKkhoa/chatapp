package com.dkkhoa.chatapp.mapper;

import com.dkkhoa.chatapp.dto.MessageDTO;
import com.dkkhoa.chatapp.model.Message;

public class MessageMapper {
    public static Message toEntity(MessageDTO messageDTO) {
        Message message = new Message();
        message.setSenderId(messageDTO.getSenderId());
        message.setSenderName(messageDTO.getSenderName());
        message.setMessageId(messageDTO.getMessageId());
        message.setMessage(messageDTO.getMessage());
        if(messageDTO.getReceiverId() != null) {
            message.setReceiverId(Integer.parseInt(messageDTO.getReceiverId()));
        }
        message.setReceiverName(messageDTO.getReceiverName());
        message.setStatus(messageDTO.getStatus());
        message.setSenderAvatar(messageDTO.getSenderAvatar());
        return message;
    }
}
