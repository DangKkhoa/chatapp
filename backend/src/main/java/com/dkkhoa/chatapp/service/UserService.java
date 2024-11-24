package com.dkkhoa.chatapp.service;

import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UserService {
    @Autowired
    public UserRepository userRepository;
    
    public String getRandomAvatar() {
         String[] avatars = {
                "user_1", "user_2", "user_3",
                "user_4", "user_5", "user_6",
                "user_7", "user_8", "user_9"
        };

//        String userAvatar = avatars[(int)(Math.random() * avatars.length)];
        Random generator = new Random();
        int randomAvatarIndex = generator.nextInt(avatars.length);
        return avatars[randomAvatarIndex];
    }
    public User registerUser(User user) {
        if(userRepository.findByEmail(user.getEmail()) != null) {
            return null;
        }

        user.setAvatar(getRandomAvatar());
        User savedUser = userRepository.save(user);
        System.out.println(savedUser);
        return savedUser;
    }

    public User getUser(User user) {
        User userFound = userRepository.findByEmail(user.getEmail());
        if(userFound != null && userFound.getPassword().equals(user.getPassword())) {
            return userFound;
        }

        return null;

    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }



    public  boolean userExists(String email) {
        User user = userRepository.findByEmail(email);
        return user != null;
    }

    public User getUserById(int id) {
        return userRepository.findById(id);
    }

    public User updateUser(User userToUpdate) {
        User existingUser = userRepository.findById(userToUpdate.getId());
        boolean isUpdated = false;

        if(existingUser == null) {
            return null;
        }

        if(userToUpdate.getUsername() != null && !userToUpdate.getUsername().equals(existingUser.getUsername())) {
            existingUser.setUsername(userToUpdate.getUsername());
            isUpdated = true;
        }

        if(userToUpdate.getAvatar() != null && !userToUpdate.getAvatar().equals(existingUser.getAvatar())) {
            existingUser.setAvatar(userToUpdate.getAvatar());
            isUpdated = true;
        }

        if(userToUpdate.getStatus() != null && !userToUpdate.getStatus().equals(existingUser.getStatus())) {
            existingUser.setStatus(userToUpdate.getStatus());
            isUpdated = true;
        }

        if(userToUpdate.getThinking() != null && !userToUpdate.getThinking().equals(existingUser.getThinking())) {
            existingUser.setThinking(userToUpdate.getThinking());
            isUpdated = true;
        }

        if(userToUpdate.getBorderColor() != null && !userToUpdate.getBorderColor().equals(existingUser.getBorderColor())) {
            existingUser.setBorderColor(userToUpdate.getBorderColor());
            isUpdated = true;
        }

        if(userToUpdate.getLastLogin() != null) {
            existingUser.setLastLogin(userToUpdate.getLastLogin());
            isUpdated = true;
        }

        if(isUpdated) {
            return userRepository.save(existingUser);
        }



        return existingUser;






    }
}
