import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { replace, useNavigate, useParams } from "react-router-dom"
import sockjs from "sockjs-client/dist/sockjs"
import Stomp, { over } from 'stompjs';
import EmojiPicker from "emoji-picker-react";
import PrivateChats from "./PrivateChats.jsx";
import "../../style/home.css";
import OnlineUsers from "./OnlineUsers.jsx";
import UserAvatar from "./UserAvatar.jsx";
import PublicChat from "./PublicChat.jsx";
import ChatHeader from "./ChatHeader.jsx";
import { verifyToken } from "../../js/verifyToken.js";

const Chatroom = () => {
    const token = sessionStorage.getItem("jwtToken") || localStorage.getItem("jwtToken");
    const { type, id } = useParams();
    const navigate = useNavigate();
    const messageEndRef = useRef(null); // Create a ref for the end of the message list
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [publicChats, setPublicChats] = useState([]);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [receivedMessages, setReceivedMessages] = useState(new Map());
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [systemMessage, setSystemMessage] = useState("");
    const [accepted, setAccepted] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [deletedMessage, setDeletedMEssage] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
    const [receiverData, setReceiverData] = useState({
        id: 0,
        username: "",
        avatar: "",
        status: "",
        thinking: "",
        borderColor: ""
    })
    
    const [userData, setUserData] = useState({
        id: 0,
        username: "",
        avatar: "",
        connected: false,
        message: "",
        borderColor: ""

    })

    useEffect(() => {
        document.title = "Quickchat";
    }, [])

    const stompClient = useRef(null);
    
    useEffect(() => {
        verifyToken(token, setUserData);

        if (userData.id) {
            fetchSenderMessages(userData.id, token);
            if(type === "public") {
                fetchPublicChatHistory(token, "public");
            }
            
            if (type == "private" && id) {
                fetchReceiverData(id);
                fetchPrivateChatHistory(token, userData.id, id, token);
            }
        }
    }, [type, userData.id, id])

    

    
    useEffect(() => {
        if(userData.id) {
            register();
        }
        
    }, [userData.id])

    useEffect(() => {
        messageEndRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll to the bottom
    }, [publicChats, privateChats]);

    const fetchPublicChatHistory = async (token, type) => {

        try {
            if(type == "public") {
                const historyResponse = await axios.get("http://localhost:8080/chat/public/history", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setPublicChats(historyResponse.data);
            }
        }
        catch(error) {
            console.error(error);
        }

    }

    const fetchPrivateChatHistory = async(token, senderId, receiverId) => {
        const historyResponse = await axios.get("http://localhost:8080/chat/private/history", {
            headers: {
                "Authorization": `Bearer ${token}`
            },

            params: {
                senderId: senderId,
                receiverId: receiverId,
            }
        });
        const privateChatHistory = historyResponse.data;
        privateChats.set(`${receiverId}`, privateChatHistory);
        privateChats.set(`${senderId}`, privateChatHistory);
        setPrivateChats(new Map(privateChats));
        
    }


    const fetchSenderMessages = async (receiverId, token) => {
        const response = await axios.post("http://localhost:8080/chat/private/incoming-message", receiverId, {
            headers: {
                'Content-Type': 'application/json'
            }
        }); 

        console.log(response.data);

        const messagesMap = new Map(Object.entries(response.data));
        console.log(messagesMap.get('2'));
        setReceivedMessages(new Map(messagesMap));
    }

    const fetchReceiverData = async (receiverId) => { 
        const response = await axios.get(`http://localhost:8080/chat/private/${receiverId}`);
        const responseData = response.data;
        setReceiverData(prev => ({
            ...prev, 
            id: responseData.id,
            username: responseData.username,
            avatar: responseData.avatar,
            status: responseData.status || "Online",
            thinking: responseData.thinking,
            borderColor: responseData.borderColor
        }))
        
    }


    const register = () => {
        let Sock = new sockjs("http://localhost:8080/ws");
        stompClient.current = over(Sock);
        stompClient.current.connect({}, onConnect, onError);
        stompClient.current.debug = null;
        
    }

    const onConnect = () => {
        setUserData(prev => ({...prev, connected: true})),
        stompClient.current.subscribe('/topic/online-users', onUsersJoinReceived);
        stompClient.current.subscribe('/chatroom/public', onPublicMessageReceived);
        stompClient.current.subscribe(`/user/${userData.id}/private`, onPrivateMessageReceived);
        stompClient.current.subscribe(`/topic/delete/${userData.id}`, onPrivateMessageDeleted);
        stompClient.current.subscribe(`/topic/update`, onUserUpdateReceived);

        userJoinPublic();
        if(type == "private" && id) {
            stompClient.current.subscribe(`/user/${userData.id}/chat-availability`, onChatroomStatusReceived);
            userJoinPrivate(userData.id, id);
        }
    }

    

    useEffect(() => {
        if(stompClient.current) {
            stompClient.current.subscribe(`/user/${userData.id}/chat-availability`, onChatroomStatusReceived);
        }
    }, [isNewMessage])

    

    const userJoinPublic = () => {
        if(stompClient.current) {
            let chatMessage = {
                senderName: userData.username,
                senderId: userData.id,
                senderAvatar: userData.avatar,
                status: "JOIN"
            }            
            stompClient.current.send('/app/join/public', {}, JSON.stringify(chatMessage));
        
        }
    }

    const userJoinPrivate = (senderId, receiverId) => {
        if(stompClient.current) {
            let message = {
                // senderName: userData.username,
                senderId: senderId,
                receiverId: receiverId,
                status: "JOIN"
            }
            stompClient.current.send('/app/join/private', {}, JSON.stringify(message));
        }
    }

    const onChatroomStatusReceived = (message) => {
        const chatroomAvailable = message.body === "true";
        setAccepted(chatroomAvailable);

        console.log(chatroomAvailable)
    }

    const updateInfoInChat = (chats, updatedUserData) => {
        return chats.map(chat => 
            (chat.sender.id == updatedUserData.id ? {
                    ...chat,
                    sender: {
                        ...chat.sender,
                        username: updatedUserData.username,
                        avatar: updatedUserData.avatar
                    }
                }
                :
                chat
        ))
    }

    const onUserUpdateReceived = (updatedUser) => {
        const updatedUserData = JSON.parse(updatedUser.body)
        console.log(updatedUserData);
        setPublicChats(prevPublicChats => (updateInfoInChat(prevPublicChats, updatedUserData)))

        
        if(type == "private" && id) {
            setPrivateChats(prevMap => {
                const newMap = new Map(prevMap);
                const udpatedChat = updateInfoInChat(newMap.get(`${id}`), updatedUserData);

                newMap.set(`${id}`, udpatedChat);
                newMap.set(`${userData.id}`, udpatedChat);

                return newMap;
            })

            setReceiverData(prev => ({
                ...prev,
                username: updatedUserData.username,
                avatar: updatedUserData.avatar,
                status: updatedUserData.status,
                thinking: updatedUserData.thinking,
                borderColor: updatedUserData.borderColor
            }))
        }
    }

    const onPublicMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        // fetchSenderMessages(payloadData.receiverId);

        // fetchChatroomStatus(userData.id, id, token);
        switch(payloadData.status) {
            case "JOIN":
                
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats(prevChats => [...prevChats, payloadData]);
        }
    }

    const onPrivateMessageReceived = (payload) => {
        // console.log(payload);
        // return ;
        let payloadData = JSON.parse(payload.body);
        console.log(payloadData.sender);
        // console.log(isDeleted);
        
        setPrivateChats(prevMap => {
            const newMap = new Map(prevMap);
            let currentMessages = newMap.get(`${payloadData.sender.id}`) || [];
            currentMessages.push(payloadData);
            newMap.set(`${payloadData.sender.id}`, currentMessages);
            return newMap;
        })
        // setPrivateChats(prevMap => new Map(prevMap.set(`${payloadData.senderId}`, [...prevMap.get(`${payloadData.senderId}`), payloadData])));
        
        
        setReceivedMessages(map => new Map(map.set(`${payloadData.sender.id}`, payloadData.sender.username)));
        setIsNewMessage(true);
        setAccepted(true);
        setIsDeleted(false);

    }

    const onUsersJoinReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        // console.log(payloadData);
        setOnlineUsers(payloadData);
        
    }

    const onError = (err) => {
        console.error(err);
    }


    const onPrivateMessageDeleted = (payload) => {
        console.log(payload.body);
        const idToDelete = payload.body
        fetchSenderMessages(userData.id, token);
        // privateChats.set(idToDelete, []);
        // privateChats.set(`${userData.id}`, []);
        // privateChats.clear();
        setPrivateChats(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(`${idToDelete}`, []);
            newMap.set(`${userData.id}`, []);
            return newMap;
        })

        setDeletedMEssage("Message has been deleted");
        setIsDeleted(true);
        setAccepted(false);        
    }

    const sendPublicMessage = (message) => {
        const token = sessionStorage.getItem("jwtToken") || localStorage.getItem("jwtToken");
        if(stompClient.current) {
            let chatMessage = {
                senderId: userData.id,
                // senderName: userData.username,
                // senderAvatar: userData.avatar,
                message: message || "❤️",
                status: 'MESSAGE',
                token: token
            };
            stompClient.current.send('/app/message', {}, JSON.stringify(chatMessage));
        }
        
        setUserData({...userData, message: ""});
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        
    }

    const sendPrivateMessage = (message) => {
        const token = sessionStorage.getItem("jwtToken") || localStorage.getItem("jwtToken");
        console.log('Click');
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        if(stompClient) {
            let chatMessage = {
                sender: {
                    id: userData.id,
                    username: userData.username,
                    avatar: userData.avatar
                },
                receiver: {
                    id: id
                },
                senderId: `${userData.id}`,
                // senderName: userData.username,
                // senderAvatar: userData.avatar,
                receiverId: `${id}`,
                // receiverName: receiverData.username,
                message: message || "❤️",
                sentTime: `${h}:${m}`,
                status: "MESSAGE",
                token: token
            }
            console.log(chatMessage);
            if(userData.id != id) {

                setPrivateChats(prevMap => new Map(prevMap.set(`${id}`, [...prevMap.get(`${id}`), chatMessage])));
                
                stompClient.current.send('/app/private-message', {}, JSON.stringify(chatMessage));
                setUserData(prevUserData => ({...prevUserData, message: ""}));
                setReceivedMessages(map => new Map(map.set(`${id}`, receiverData.username)))
                setIsNewMessage(true);
                setIsDeleted(false);

                // fetchChatroomStatus(userData.id, id, token);
            }

            
        }
    }




    const handleClick = (type, userId) => {
        window.location.href = `/chat/${type}/${userId}`
    }
    const handleValue = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
    }

    const handleInputMessage = (e) => {
        setUserData(prevUserData => ({...prevUserData, message: e.target.innerText}));
    }

    const  splitIntoLines = (inputString, lineLength) => {
        const regex = new RegExp(`.{1,${lineLength}}`, 'g');  
        return inputString.match(regex).join('\n'); 
    }
    
    const emojiPickerClick = () => {
        if(emojiPickerVisible) {
            setEmojiPickerVisible(false);
        }
        else {
            setEmojiPickerVisible(true);
        }
        
    }

    const onEmojiClick = (emojiObject) => {
        setUserData(prevUserData => ({...prevUserData, message: prevUserData.message + emojiObject.emoji}));
    }

    const handleOptionClick = () => {
        if(menuVisible) {
            setMenuVisible(false);
        }
        else {
            setMenuVisible(true);
        }
    }

    const onDeleteButtonClick = (e, otherUserId) => {
        e.stopPropagation();
        console.log(id);
        console.log(otherUserId);
        if(stompClient.current) {
            let chatroom = {
                user1: userData.id,
                user2: otherUserId,
            }

            // stompClient.current.send('/app/private-chat/delete', {}, JSON.stringify(chatroom));
            axios.delete(`http://localhost:8080/private-chat/delete`, {
                data: {
                    user1: userData.id,
                    user2: otherUserId,
                }
            })
            .then(response => {
                console.log(response.data.code);
                if(response.data.code == 1) {
                    receivedMessages.delete(otherUserId);
                    setReceivedMessages(new Map(receivedMessages));
                    
                    if(privateChats.has(`${otherUserId}`)) {
                        setPrivateChats(prevMap => {
                            const newMap = new Map(prevMap);
                            newMap.set(`${otherUserId}`, []);
                            newMap.set(`${userData.id}`, []);
                            setIsDeleted(true);
                            return newMap;  
                        })
                    }
                    setAccepted(true);
                    // setIsDeleted(true);
                    
                    stompClient.current.send('/app/private-chat/delete', {}, JSON.stringify(chatroom));

                    if(type == "private" && otherUserId == id) {
                        navigate("/chat");
                    }
                }

            })
        }
        
    }

    const onSettingClick = () => {
        navigate("/setting");
    }

    const onLogoutClick = () => {
        if(stompClient.current) {
            let chatMessage = {
                senderName: userData.username,
                senderId: userData.id,
                senderAvatar: userData.avatar,
                status: "LEAVE"
            }     
            stompClient.current.send('/app/disconnect/public', {}, JSON.stringify(chatMessage));
            localStorage.getItem("jwtToken") ? localStorage.removeItem("jwtToken") : sessionStorage.removeItem("jwtToken");
            stompClient.current.disconnect(() => {
                console.log(`User ${userData.username} disconnected`);
            });
            navigate("/auth/login");
        }
        
    }


    return (
      <div className="container home">
        {token ? <>
            <OnlineUsers
              onlineUsers={onlineUsers}
              userData={userData}
              handleClick={handleClick}
            />
            <div className="chat-box">
              <div className="member-list">
                {/* {onlineUsers.length > 1 && <ul className="online-users">
                            {onlineUsers.filter(user => user.username !== userData.username).map((user) => (
                                <li onClick={() => handleClick("private", user.id)} className="user"  key={user.id}>
                                    <div className="user-color" style={{backgroundColor: `${user.avatarColor}`, color: user.avatarColor}}></div>
                                    <div className="online-sign"></div>
                                    {user.username}
                                </li>
                            ))}
                        </ul>} */}

                <ul className="chat-users">
                  <li
                    onClick={() => handleClick("public", 1, "Chatroom")}
                    className="member"
                    key={1}
                  >
                    <div>
                      <span>Chatroom</span>
                      {type != "public" && (
                        <div className="new-message-preview">
                          Click to join public chat
                        </div>
                      )}
                      {id && type == "public" && publicChats.length > 0 && publicChats[publicChats.length - 1].sender && (
                        <div className="new-message-preview">
                          {publicChats[publicChats.length - 1].sender.username !=
                          userData.username
                            ? `${
                                publicChats[publicChats.length - 1].sender.username
                              }: `
                            : ""}
                          {publicChats[publicChats.length - 1].message}
                        </div>
                      )}
                      {/* {console.log(publicChats)} */}
                    </div>
                  </li>

                  {[...receivedMessages.keys()]
                    .filter((otherUserId) => otherUserId != userData.id)
                    .map((otherUserId, index = index + 1) => (
                      <li
                        className={`member ${
                          otherUserId == id && type == "private" ? "active" : ""
                        }`}
                        onClick={() => handleClick("private", otherUserId, "")}
                        key={index}
                      >
                        <div className="name-and-message">
                          {/* <span>{receivedMessages.get(otherUserId).sender.username}</span> */}
                          {console.log(otherUserId)}
                          {receivedMessages.has(otherUserId) && <span>
                                {Object.entries(receivedMessages.get(otherUserId))[0][0]}
                            </span>}
                          {privateChats.has(`${otherUserId}`) &&
                            privateChats.get(`${otherUserId}`).length > 0 && (
                              <div className="new-message-preview">
                                {
                                //   privateChats.get(`${otherUserId}`)[
                                //     privateChats.get(`${otherUserId}`).length - 1
                                //   ].message
                                
                                }
                              </div>
                            )}
                        </div>

                        <button
                          onClick={(e) => onDeleteButtonClick(e, otherUserId)}
                          className="delete-chat-button"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </li>
                    ))}
                </ul>

                <div className="setting" onClick={handleOptionClick}>
                  {/* <i className="fa-solid fa-bars"></i> */}
                  <div style={{ width: "50px", height: "50px" }}>
                    <UserAvatar avatar={userData.avatar} />
                  </div>
                  <span>{userData.username}</span>
                </div>
              </div>

              {menuVisible && (
                <div className="setting-options">
                  <div href="/settings" onClick={onSettingClick}>
                    <i className="fa-solid fa-gear"></i> Setting
                  </div>
                  <div onClick={onLogoutClick}>
                    <i className="fa-solid fa-right-from-bracket"></i> Log out
                  </div>
                </div>
              )}
              <div className="chat-content">
                {!id && (
                  <div style={{ textAlign: "center", color: "#737373" }}>
                    Select a person or group you want to chat.
                  </div>
                )}

                {type == "public" && (
                  <PublicChat
                    publicChats={publicChats}
                    messageEndRef={messageEndRef}
                    userData={userData}
                    splitIntoLines={splitIntoLines}
                    setUserData={setUserData}
                    sendPublicMessage={sendPublicMessage}
                  />
                )}

                {type == "private" && receiverData.id && (
                  <PrivateChats
                    id={id}
                    privateChats={privateChats}
                    userData={userData}
                    splitIntoLines={splitIntoLines}
                    onlineUsers={onlineUsers}
                    messageEndRef={messageEndRef}
                    emojiPickerVisible={emojiPickerVisible}
                    onEmojiClick={onEmojiClick}
                    sendPrivateMessage={sendPrivateMessage}
                    handleValue={handleValue}
                    EmojiPicker={EmojiPicker}
                    receiverData={receiverData}
                    systemMessage={systemMessage}
                    accepted={accepted}
                    deletedMessage={deletedMessage}
                    isDeleted={isDeleted}
                    setUserData={setUserData}
                  />
                )}
              </div>
            </div>
        </>
        : 
            ""
        }
      </div>
    );
}

export default Chatroom;
