package com.dkkhoa.chatapp.repo;

import com.dkkhoa.chatapp.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    User findByEmail(String email);
    User findById(int id);
    User save(User user);
}
