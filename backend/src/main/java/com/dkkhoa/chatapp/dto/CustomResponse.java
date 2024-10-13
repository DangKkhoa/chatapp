package com.dkkhoa.chatapp.dto;

public class CustomResponse {
    private int code;
    private String message;

    public CustomResponse() {
    }

    public CustomResponse(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "CustomResponse{" +
                "code: " + code +
                ", message: '" + message + '\'' +
                '}';
    }
}
