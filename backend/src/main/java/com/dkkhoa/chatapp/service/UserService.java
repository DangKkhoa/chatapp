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
        User user = userRepository.findByEmail(email);
        return user;
    }



    public  boolean userExists(String email) {
        User user = userRepository.findByEmail(email);
        if(user != null) {
            return true;
        }
        return false;
    }

    public User getUserById(int id) {
        return userRepository.findById(id);
    }
}
