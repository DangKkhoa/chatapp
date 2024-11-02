package com.dkkhoa.chatapp.service;

import com.dkkhoa.chatapp.model.User;
import com.dkkhoa.chatapp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    public UserRepository userRepository;

    public User registerUser(User user) {
        if(userRepository.findByEmail(user.getEmail()) != null) {
            return null;
        }

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
