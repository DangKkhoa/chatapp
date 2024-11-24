package com.dkkhoa.chatapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

//    @JsonIgnore

    private String email;

    @Column(length = 30)
    private String username;

//    @JsonIgnore
    private String password;

    private String avatar;
    @Column(length = 20)
    private String status;
    @Column(length = 30)
    private String thinking;
    private String borderColor = "#64d3c6";
    private LocalDateTime lastLogin;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", avatar='" + avatar + '\'' +
                ", status='" + status + '\'' +
                ", thinking='" + thinking + '\'' +
                ", borderColor='" + borderColor + '\'' +
                ", lastLogin=" + lastLogin +
                '}';
    }
}
