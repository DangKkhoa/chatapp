package com.dkkhoa.chatapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int messageId;
    private int senderId;
    private String senderName;
    private String senderAvatar;
    private String receiverName;
    private int receiverId;
    private String message;
    private String time;
    private Status status;

    @ManyToOne
    @JoinColumn(name = "chatroom_id", nullable = true)
    @JsonBackReference
    private Chatroom chatroom;
}
