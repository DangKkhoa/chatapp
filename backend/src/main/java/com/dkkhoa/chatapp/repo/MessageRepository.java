package com.dkkhoa.chatapp.repo;

import com.dkkhoa.chatapp.model.Chatroom;
import com.dkkhoa.chatapp.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    public Message save(Message message);
    public List<Message> findAllByChatroom(Chatroom chatroom);

    @Query("SELECT m FROM Message m WHERE ((m.sender.id = :senderId AND m.receiver.id = :receiverId) OR (m.sender.id = :receiverId And m.sender.id = :senderId))")
    public List<Message> findAllBySenderIdAndReceiverId(@Param("senderId") int senderId,@Param("receiverId") int receiverId);

    @Query("SELECT m FROM Message m WHERE (m.receiver.id = :userId OR m.sender.id = :userId)")
    public List<Message> findAllMessagesSentToUser(@Param("userId") int userId);


    public int countAllByChatroom(Chatroom chatroom);
}
