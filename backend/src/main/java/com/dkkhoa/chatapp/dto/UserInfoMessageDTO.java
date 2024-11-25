package com.dkkhoa.chatapp.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserInfoMessageDTO {
    private int id;
    private String username;
    private String avatar;

}