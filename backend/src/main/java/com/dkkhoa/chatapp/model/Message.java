package com.dkkhoa.chatapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int messageId;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({"password", "email"})
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", referencedColumnName = "id", nullable = true)
    @JsonIgnoreProperties({"password"})
    private User receiver;
    private String message;
//    private String time;
    private LocalDate sentDate;
    private LocalTime sentTime;
    private Status status;
    private boolean isSeen;

    @ManyToOne
    @JoinColumn(name = "chatroom_id", nullable = true)
    @JsonBackReference
    private Chatroom chatroom;
}
