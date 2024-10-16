package com.dkkhoa.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class UserRegistrationDTO {
    private String email;
    private String username;
    private String password;
    private String confirmedPassword;
    private String avatarColor;
}
