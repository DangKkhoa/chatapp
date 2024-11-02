import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import sockjs from "sockjs-client/dist/sockjs"
import Stomp, { over } from 'stompjs';
import EmojiPicker from "emoji-picker-react";
import PrivateChats from "./PrivateChats.jsx";
import "../../style/home.css";
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
    const [isConnected, setConnect] = useState(false);
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [deletedMessage, setDeletedMEssage] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
    const [receiverData, setReceiverData] = useState({
        id: 0,
        username: "",
        avatarColor: "",
    })
    
    const [userData, setUserData] = useState({
        id: 0,
        username: "",
        avatarColor: "",
        connected: false,
        message: ""
    })


    const stompClient = useRef(null);
    
    useEffect(() => {
        verifyToken(token, id);
    }, [type, userData.id, id])


    const verifyToken = (token, id) => {
        axios.get("http://localhost:8080/auth/jwt-verify", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                const responseData = response.data;
                if(responseData.code === 10) {                    
                    const user = responseData.userSessionDTO;
                    setUserData(userData => ({
                        ...userData, 
                        username: user.username,
                        id: user.id,
                        avatarColor: user.avatarColor
                    }))
                    if(userData.id) {
                        fetchPublicChatHistory("public");
                        fetchSenderMessages(userData.id, token);
                        if(type == "private" && id) {
                            fetchReceiverData(id);                         
                            fetchPrivateChatHistory(userData.id, id, token);
                            // fetchChatroomStatus(userData.id, id, token);
                        }
                    }
                    
                }
                else {
                    navigate("/auth/login");
                }
            })
            .catch(err => {
                console.error(err);
                navigate("/auth/login");
            })
        
    }

    
    useEffect(() => {
        if(userData.id !== 0 && userData.username) {
            register();
        }
        
    }, [userData.id, id, type])

    useEffect(() => {
        messageEndRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll to the bottom
    }, [publicChats, privateChats]);

    const fetchPublicChatHistory = async (type) => {

        try {
            if(type == "public") {
                const historyResponse = await axios.post("http://localhost:8080/chat/history");
                setPublicChats(historyResponse.data);
            }
        }
        catch(error) {
            console.error(error);
        }

    }

    const fetchPrivateChatHistory = async(senderId, receiverId, token) => {
        const historyResponse = await axios.post("http://localhost:8080/chat/private/history", {
            senderId: senderId,
            receiverId: receiverId,
            token: token
        });
        const privateChatHistory = historyResponse.data;
        privateChats.set(`${receiverId}`, privateChatHistory);
        privateChats.set(`${senderId}`, privateChatHistory);
        setPrivateChats(prev => new Map(prev.set(`${receiverId}`, privateChatHistory)));
    }


    const fetchSenderMessages = async (receiverId, token) => {
        const response = await axios.post("http://localhost:8080/chat/private/incoming-message", receiverId, {
            headers: {
                'Content-Type': 'application/json'
            }
        }); 

        console.log(response.data);

        const messagesMap = new Map(Object.entries(response.data));
        setReceivedMessages(new Map(messagesMap));
    }

    const fetchReceiverData = async (receiverId) => { 
        const response = await axios.get(`http://localhost:8080/chat/private/${receiverId}`);
        const responseData = response.data;
        setReceiverData(prev => ({
            ...prev, 
            id: responseData.id,
            username: responseData.username,
            avatarColor: responseData.avatarColor,

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



        // setConnect(true);
        userJoinPublic();
        if(type == "private" && id) {
            stompClient.current.subscribe(`/user/${userData.id}/chat-availability`, onChatroomStatusReceived);
            userJoinPrivate(userData.id, id);
        }
    }

    useEffect(() => {
        if(stompClient.current) {
            stompClient.current.subscribe(`/user/${userData.id}/chat-availability`, onChatroomStatusReceived);
            console.log(200);
        }
    }, [isNewMessage])

    

    const userJoinPublic = () => {
        if(stompClient.current) {
            let chatMessage = {
                senderName: userData.username,
                senderId: userData.id,
                senderAvatarColor: userData.avatarColor,
                status: "JOIN"
            }            
            stompClient.current.send('/app/join/public', {}, JSON.stringify(chatMessage));
        
        }
    }

    const userJoinPrivate = (senderId, receiverId) => {
        if(stompClient.current) {
            let message = {
                senderName: "Khoa",
                senderId: senderId,
                receiverId: receiverId,
                status: "JOIN"
            }
            stompClient.current.send('/app/join/private', {}, JSON.stringify(message));
            setConnect(true);
        }
    }

    const onChatroomStatusReceived = (message) => {
        const chatroomAvailable = message.body === "true";
        setAccepted(chatroomAvailable);

        console.log(chatroomAvailable)
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
        let payloadData = JSON.parse(payload.body);
        console.log(payloadData);
        // console.log(privateChats);
        if(payloadData.senderId == 0) {
            // privateChats.set(`${payloadData.senderid}`, payloadData);
            
            setPrivateChats(prev => new Map(prev.set(`${payloadData.senderId}`, payloadData)))
            // setMessageDisabled(true);
            return ;
        }

        if(privateChats.has(`${payloadData.senderId}`)) {
            privateChats.get(`${payloadData.senderId}`).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } 
        else {
            let list = [];
            list.push(payloadData);
            privateChats.set(`${payloadData.senderId}`, list);
            setPrivateChats(privateChats);
        }
        setReceivedMessages(map => new Map(map.set(`${payloadData.senderId}`, payloadData.senderName)));
        setIsNewMessage(prev => !prev);
        setIsDeleted(true);
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
        console.log(idToDelete);

        console.log(receivedMessages);

        fetchSenderMessages(userData.id, token);

        setPrivateChats(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(`${idToDelete}`, []);
            return newMap;
        });
        setDeletedMEssage("Message has been deleted");
        setIsDeleted(true);
        setAccepted(false);        
    }

    const sendPublicMessage = () => {
        const token = sessionStorage.getItem("jwtToken") || localStorage.getItem("jwtToken");
        if(stompClient.current) {
            let chatMessage = {
                senderId: userData.id,
                senderName: userData.username,
                senderAvatarColor: userData.avatarColor,
                message: userData.message || "❤️",
                status: 'MESSAGE',
                token: token
            };
            stompClient.current.send('/app/message', {}, JSON.stringify(chatMessage));
        }
        
        setUserData({...userData, message: ""});
        messageEndRef.current?.scrollIntoView({ behaviour: "smooth" });
    }

    const sendPrivateMessage = () => {
        const token = sessionStorage.getItem("jwtToken") || localStorage.getItem("jwtToken");
        if(stompClient) {
            let chatMessage = {
                senderId: `${userData.id}`,
                senderName: userData.username,
                senderAvatarColor: userData.avatarColor,
                receiverId: `${id}`,
                receiverName: receiverData.username,
                message: userData.message || "❤️",
                // time: `${h}:${m}`,
                status: "MESSAGE",
                token: token
            }
            console.log(chatMessage);
            if(userData.id != id) {
                const newPrivateChat = new Map(privateChats);

                const existingMessages = newPrivateChat.get(`${id}`) || [];
                
                const updatedMessages = [...existingMessages, chatMessage];
                // newPrivateChat.set(`${id}`, updatedMessages);
                privateChats.get(`${id}`).push(chatMessage);
                setPrivateChats(new Map(privateChats));               
                console.log(privateChats);
                stompClient.current.send('/app/private-message', {}, JSON.stringify(chatMessage));
                setUserData({...userData, message: ""});
                setReceivedMessages(map => new Map(map.set(`${id}`, receiverData.username)))
                // setIsNewMessage(true);

                // fetchChatroomStatus(userData.id, id, token);
                

            }

            
        }

        
        
    }

    const handleClick = (type, userId, username) => {
        
        navigate(`/chat/${type}/${userId}`, { replace: false });

    }
    const handleValue = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
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

    const onDeleteButtonClick = (id) => {
        // console.log(id);
        if(stompClient.current) {
            let chatroom = {
                user1: userData.id,
                user2: id,
            }

            stompClient.current.send('/app/private-chat/delete', {}, JSON.stringify(chatroom));
            receivedMessages.delete(id);
            setReceivedMessages(receivedMessages);

            privateChats.delete(`${id}`)
            setPrivateChats(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(`${id}`, []);
                return newMap;
            });

            // setAccepted(true);

        }

        
    }

    const adjustTextareaHeight = (e) => {
        e.target.style.maxHeight = "100px";
        e.target.style.height = (e.target.scrollHeight) + "px";
    } 



    return(
        
        <div className="container home">
            {token ? <div className="chat-box">
                <div className="member-list">
                    {onlineUsers.length > 1 && <ul className="online-users">
                        {onlineUsers.filter(user => user.username !== userData.username).map((user) => (
                            <li onClick={() => handleClick("private", user.id, user.username)} className="user"  key={user.id}>
                                <div className="user-color" style={{backgroundColor: `${user.avatarColor}`, color: user.avatarColor}}></div>
                                <div className="online-sign"></div>
                                {user.username}
                            </li>
                        ))}
                    </ul>}
                    <ul className="chat-users">
                        <li onClick={() => handleClick("public", 1, "Chatroom")} className={`member active`} key={1}>
                            <div>
                            <span>Chatroom</span>
                                {type != "public" && <div className="new-message-preview">Click to join public chat</div>}
                                {id && type == "public" && publicChats.length > 0 && (<div className="new-message-preview">
                                    {publicChats[publicChats.length - 1].senderName != userData.username ? `${publicChats[publicChats.length - 1].senderName}: ` : ""}
                                        {publicChats[publicChats.length - 1].message}
                                    
                                </div>)}
                            </div>
                        </li>
                        
                        {[...receivedMessages.keys()].filter(id => id != userData.id).map((id, index=index + 1) => (
                            <li className="member" onClick={() => handleClick("private", id, "")} key={index}>
                                {console.log(privateChats)}
                                <div>
                                    <span>{receivedMessages.get(id)}</span>   
                                    {privateChats.has(`${id}`) && console.log(privateChats.get(`${id}`))}
                                    {privateChats.has(`${id}`) && privateChats.get(`${id}`).length > 0 && (<div className="new-message-preview">
                                        
                                        {privateChats.get(`${id}`)[privateChats.get(`${id}`).length - 1].message}
                                    </div>)}
                                </div>
                                
                                <button onClick={() => onDeleteButtonClick(id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    

                    <div className="setting" onClick={handleOptionClick}>
                        <i className="fa-solid fa-bars"></i>
                        <span>More</span>
                    </div>

                    {menuVisible && <div className="setting-detail">
                        <div href="/settings"><i className="fa-solid fa-gear"></i> Setting</div>
                        <div ><i className="fa-solid fa-right-from-bracket"></i> Log out</div>
                    </div>}
                </div>
                
                    
                <div className="chat-content">
                    {!id && <div style={{textAlign: "center", color: "#737373"}}>
                        Select a person or group you want to chat.
                    </div>}
                    
                    {type == "public" && 
                        <>
                            <div className="chat-header">
                                <div className="chat-information">
                                    <div className="chat-image"></div>
                                    
                                    <div>
                                        <p className="chat-name">Chatroom</p>
                                        <p className="chat-status">Online</p>
                                    </div>
                                </div>
                                <div className="chat-setting">
                                
                                </div>
                            </div>
                            <ul className="chat-messages" ref={messageEndRef}>
                                {/* {console.log(publicChats)} */}
                                {publicChats.map((chat, index) => (
                                    
                                    <li className="message" key={index}>
                                        <div className={`${chat.senderId != userData.id ? "guest" : "self"}`}>
                                            {chat.senderId !== userData.id && <div className={`avatar guest`} style={{backgroundColor: chat.senderAvatarColor}}></div>}
                                            <div className="message-data">
                                                <div className="sender-name">{chat.senderName }</div>
                                                {splitIntoLines(chat.message, 50)}
                                            </div>
                                            {chat.senderId === userData.id && <div className="avatar self" style={{backgroundColor: userData.avatarColor}}>{}</div>}
                                        </div>
                                    </li>
                                ))}
                                
                                {/* <div ref={messageEndRef} /> */}
                            </ul>
                            
                        
                        
                            <div className="send-message">
                            
                                {emojiPickerVisible && <EmojiPicker className="emoji-picker" onEmojiClick={onEmojiClick}/>}
                                <button className="emoji-toggle" onClick={emojiPickerClick}><i className="fa-regular fa-face-smile " ></i></button>
                                <textarea 
                                    className="input-message" 
                                    name="message"
                                    placeholder="Message..."
                                    value={userData.message}
                                    // rows={"auto"}
                                    rows={1}
                                    onChange={(e) => {
                                        handleValue(e);
                                        adjustTextareaHeight(e);
                                    }}
                                    style={{
                                        display: "block",
                                        overflow: "hidden",
                                        resize: "none",
                                        minHeight: "40px"
                                    }}>

                                </textarea>
                                    
                                
                                <button type='button' className='send-button' onClick={sendPublicMessage} style={{color: userData.avatarColor}}>
                                    {userData.message && <i className="fa-solid fa-paper-plane"></i>}
                                    {!userData.message && <i className="fa-regular fa-heart"></i>}
                                </button>
                                
                            </div>
                        </>
                    }

                    {type == "private" && receiverData.id && (<PrivateChats 
                            id={id} 
                            privateChats={privateChats} 
                            userData={userData} 
                            splitIntoLines={splitIntoLines}
                            onlineUsers={onlineUsers}
                            messageEndRef={messageEndRef}
                            emojiPickerVisible={emojiPickerVisible}
                            emojiPickerClick={emojiPickerClick}
                            onEmojiClick={onEmojiClick}
                            sendPrivateMessage={sendPrivateMessage}
                            handleValue={handleValue}
                            EmojiPicker={EmojiPicker}
                            receiverData={receiverData}
                            systemMessage={systemMessage}
                            accepted={accepted}
                            deletedMessage={deletedMessage}
                            isDeleted={isDeleted}
                            />)
                    }
                </div>
            </div>
            :
            ""}
        </div>
    );
}

export default Chatroom;
