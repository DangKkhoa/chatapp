package com.dkkhoa.chatapp.dto;

public class OnlineUser {
    private int id;
    private String username;
    private String avatarColor;

    public OnlineUser() {
    }

    public OnlineUser(int id, String username, String avatarColor) {
        this.id = id;
        this.username = username;
        this.avatarColor = avatarColor;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
        return "OnlineUser{" +
                "id: " + id +
                ", username: " + username +
                ", avatarColor: " + avatarColor +
                '}';
    }
}
