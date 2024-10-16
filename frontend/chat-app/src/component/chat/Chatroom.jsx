import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import sockjs from "sockjs-client/dist/sockjs"
import { StompLogging } from "stomp/lib/stomp-utils";
import Stomp, { over } from 'stompjs';

var stompClient = null;
const Chatroom = () => {
    const navigate = useNavigate();
    
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [publicChats, setPublicChats] = useState([]);
    const [receieverId, setReceiverId] = useState();
    const [userData, setUserData] = useState({
        id: 0,
        username: "",
        avatarColor: "",
        connected: false,
        message: ""
    })
    

    useEffect(() => {
        let token = sessionStorage.getItem("jwtToken");
        if(!token) {
            token = localStorage.getItem("jwtToken");
        }
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

                }
                else {
                    navigate("/auth/login");
                }
            })
            .catch(err => {
                console.error(err);
                navigate("/auth/login");
            }) 
    }, []);

    useEffect(() => {
        if(userData.id !== 0 && userData.username) {
            register();

        }
    }, [userData.id])

    const register = () => {
        let Sock = new sockjs("http://localhost:8080/ws");
        stompClient = over(Sock);
        stompClient.connect({}, onConnect, onError);
    }

    const onConnect = () => {
        setUserData(prev => ({...prev, connected: true})),
        stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
        stompClient.subscribe('/topic/online-users', onUsersJoinReceived);
        userJoin();
    }

    const userJoin = () => {
        if(stompClient) {
            let chatMessage = {
                senderName: userData.username,
                senderId: userData.id,
                senderAvatarColor: userData.avatarColor,
                status: "JOIN"
            }            
            
            stompClient.send('/app/join', {}, JSON.stringify(chatMessage));
        
        }
    }

    const onPublicMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        switch(payloadData.status) {
            case "JOIN":
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
        }
    }

    const onUsersJoinReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        
        console.log(payloadData[0]);
        setOnlineUsers(payloadData);
    }

    const onError = (err) => {
        console.error(err);
    }

    const sendPublicMessage = async () => {
        if(stompClient) {
            let chatMessage = {
                senderId: userData.id,
                senderName: userData.username,
                senderAvatarColor: userData.avatarColor,
                message: userData.message,
                status: 'MESSAGE'
            };
            console.log(chatMessage);
            await stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
            setUserData({...userData, message: ""});
        }
    }

    const handleClick = (id) => {
        setReceiverId(id);
        navigate(`/chat/private/${id}`);
    }
    const handleValue = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
    }
    

    return(
        <div className="container home">
                <div className="chat-box">
                    <div className="member-list">
                        
                        <ul>
                            <li onClick={() => {window.location.href = "/chat"}} className={`member active`}>Chatroom</li>
                            {onlineUsers.filter(user => user.username !== userData.username).map((user, index) => (
                                <li className="member" style={{backgroundColor: "white", border: `2px solid ${user.avatarColor}`, color: user.avatarColor}} key={index}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="chat-content">
                        "Chatroom"
                        
                        
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                
                                <li className={`message ${chat.senderName === "System" ? "system" : chat.senderName !== userData.username ? "guest" : "self"}`}key={index}>
                                    {chat.senderName !== userData.username && <div className={`avatar guest`} style={{backgroundColor: chat.senderAvatarColor}}>{}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self" style={{backgroundColor: userData.avatarColor}}>{}</div>}
                                    
                                </li>
                                
                            ))}
                            
                        </ul>
                        
                        
                        <div className="send-message">
                            <input 
                                type="text" 
                                className="input-message" 
                                name="message"
                                placeholder={`Enter message to CHATROOM`} 
                                value={userData.message}
                                onChange={handleValue}/>
                            
                            <button type='button' className='send-button' onClick={sendPublicMessage}>Send</button>
                        </div>
                    </div>
                    
                    {/* {tab !== "CHATROOM" && <div className="chat-content">
                        {tab}
                        
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.senderName !== userData.username ? "guest" : "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName !== userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>


                        <div className="send-message">
                            <input 
                                type="text" 
                                className="input-message"
                                name="message" 
                                placeholder={`Enter message to ${tab}`}  
                                value={userData.message}
                                onChange={handleValue}/>
                            <button type='button' className='send-button' onClick={sendPrivateMessage}>Send</button>
                        </div>
                        
                    </div>
                    } */}
                </div>
                
                
            
        </div>
    );
}

export default Chatroom;