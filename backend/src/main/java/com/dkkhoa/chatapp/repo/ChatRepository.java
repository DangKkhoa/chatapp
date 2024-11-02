package com.dkkhoa.chatapp.repo;

import com.dkkhoa.chatapp.model.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@ResponseBody
public interface ChatRepository extends JpaRepository<Chatroom, String> {
    public Chatroom findByChatroomId(String id);

    @Query("SELECT c FROM Chatroom c WHERE (c.user1 = :userId OR c.user2 = :userId)")
    public List<Chatroom> findAllByUserId(@Param("userId") int userId);

}
