package com.dkkhoa.chatapp.dto;

import com.dkkhoa.chatapp.model.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private int messageId;
    private int senderId;
    private String senderName;
    private String senderAvatar;
    private String receiverId;
    private String receiverName;
    private String message;
    private String time;
    private Status status;
    private String token;

}
