package com.dkkhoa.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ForgetPasswordDTO {
    private String email;
    private String password;
    private String confirmPassword;
}
