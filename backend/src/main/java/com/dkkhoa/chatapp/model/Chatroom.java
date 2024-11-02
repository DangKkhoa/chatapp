package com.dkkhoa.chatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Entity
@NoArgsConstructor
@Data
public class Chatroom {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String chatroomId;
    private int user1;
    private int user2;
    private boolean isAccepted;

    @OneToMany(mappedBy = "chatroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    public Chatroom(String chatroomId) {
        this.chatroomId = chatroomId;
        this.isAccepted = true;
    }

    public Chatroom(String chatroomId, boolean isAccepted, int user1, int user2) {
        this.chatroomId = chatroomId;
        this.isAccepted = isAccepted;
        this.user1 = user1;
        this.user2 = user2;
    }



    @Override
    public String toString() {
        return chatroomId;
    }
}
