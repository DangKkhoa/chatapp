package com.dkkhoa.chatapp.mapper;

import com.dkkhoa.chatapp.controller.UserInfoMessageDTO;
import com.dkkhoa.chatapp.dto.UserSessionDTO;
import com.dkkhoa.chatapp.model.User;

public class UserMapper {
    public static User toEntity(UserSessionDTO userSessionDTO) {
        User user = new User();
        user.setId(userSessionDTO.getId());
        user.setUsername(userSessionDTO.getUsername());
        user.setEmail(userSessionDTO.getEmail());
        user.setAvatar(userSessionDTO.getAvatar());
        user.setStatus(userSessionDTO.getStatus());
        user.setThinking(userSessionDTO.getThinking());
        user.setBorderColor(userSessionDTO.getBorderColor());

        return user;
    }

    public static UserSessionDTO toUserSessionDTO(User user) {
        UserSessionDTO userSessionDTO = new UserSessionDTO();
        userSessionDTO.setId(user.getId());
        userSessionDTO.setUsername(user.getUsername());
        userSessionDTO.setEmail(user.getEmail());
        userSessionDTO.setAvatar(user.getAvatar());
        userSessionDTO.setStatus(user.getStatus());
        userSessionDTO.setThinking(user.getThinking());
        userSessionDTO.setBorderColor(user.getBorderColor());

        return userSessionDTO;
    }

    public static UserInfoMessageDTO toUserInfoMessageDTO(User user) {
        UserInfoMessageDTO userInfoMessageDTO = new UserInfoMessageDTO();
        userInfoMessageDTO.setId(user.getId());
        userInfoMessageDTO.setUsername(user.getUsername());
        userInfoMessageDTO.setAvatar(user.getAvatar());

        return userInfoMessageDTO;
    }
}
