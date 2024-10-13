package com.dkkhoa.chatapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private String time;
    private Status status;
}
