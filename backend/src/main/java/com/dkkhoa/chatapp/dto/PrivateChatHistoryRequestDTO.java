package com.dkkhoa.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrivateChatHistoryRequestDTO {
    private int senderId;
    private int receiverId;
    private String token;
}
