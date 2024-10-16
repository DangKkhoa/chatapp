package com.dkkhoa.chatapp.dto;

public class UserSessionDTO {
    private int id;
    private String email;
    private String username;
    private String avatarColor;

    public UserSessionDTO() {}

    public UserSessionDTO(int id, String email, String username, String avatarColor) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.avatarColor = avatarColor;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatarColor() {
        return avatarColor;
    }

    public void setAvatarColor(String avatarColor) {
        this.avatarColor = avatarColor;
    }


    @Override
    public String toString() {
        return "{" +
                "id: " + id +
                ", email: " + email +
                ", username: " + username +
                ", avatarColor: " + avatarColor +
                '}';
    }
}
