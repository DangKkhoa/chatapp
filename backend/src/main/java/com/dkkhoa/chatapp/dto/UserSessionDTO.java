package com.dkkhoa.chatapp.dto;

public class UserSessionDTO {
    private int id;
    private String email;
    private String username;
    private String avatar;
    private String status;
    private String thinking;
    private String borderColor;

    public UserSessionDTO() {}

    public UserSessionDTO(int id, String email, String username, String avatar, String status, String thinking, String borderColor) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.avatar = avatar;
        this.status = status;
        this.thinking = thinking;
        this.borderColor = borderColor;
    }

    public int getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getThinking() {
        return thinking;
    }

    public void setThinking(String thinking) {
        this.thinking = thinking;
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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        this.borderColor = borderColor;
    }

    @Override
    public String toString() {
        return "UserSessionDTO{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", avatar='" + avatar + '\'' +
                ", status='" + status + '\'' +
                ", thinking='" + thinking + '\'' +
                ", borderColor='" + borderColor + '\'' +
                '}';
    }
}





