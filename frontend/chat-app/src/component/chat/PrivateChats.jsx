import { useEffect, useState } from "react";
import Stomp, { over } from 'stompjs';
import axios from "axios";
import sockjs from "sockjs-client/dist/sockjs"
import Register from "../auth/Register";
import { useNavigate } from "react-router-dom";
import "../../style/home.css"

const PrivateChats = () => {
    const navigate = useNavigate();
    const [privateChats, setPrivateChats] = useState(new Map());
    const [tab, setTab] = useState("CHATROOM");
    const [time, setTime] = useState();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userData, setUserData] = useState({
        username: JSON.parse(localStorage.getItem("user")) == null ? "" : JSON.parse(localStorage.getItem("user")).username,
        avatarUrl: "",
        receiverName: "",
        connected: false,
        message: ""
    })

    

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const userDataJson = JSON.parse(localStorage.getItem("user"));  
        
        const registerUser = () => {
        
            let Sock = new sockjs("http://localhost:8080/ws");
            stompClient = over(Sock);
            stompClient.debug = null;
            stompClient.connect({}, onConnected, onError);
        }

        const verifyToken = async (token) => {
            try {
                const responseJwt = await axios.get("http://localhost:8080/auth/jwt-verify", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const responseJwtData = responseJwt.data;
                
                if(responseJwtData.code === 10) {
                    // const userDataJson = JSON.parse(localStorage.getItem("user"));
                    console.log(userDataJson.username);
                    setUserData(prevUser => ({...prevUser, username: userDataJson.username}));
                    await registerUser();
                }
                else {
                    navigate("/auth/login");
                }
            }
            catch(error) {
                // console.error(error.message);
                navigate("/auth/login");

            }
        }

        verifyToken(token);
        
    }, []);
    
    const handleValue = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
    }

    const onConnected = () => {
        setUserData({...userData, connected: true});
        stompClient.subscribe('/chatroom/public', onPublicMessageRecieved);
        stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessageRecieved);
        stompClient.subscribe('/topic/online-users', onOnlineUsersReceived);
        userJoin();
    }

    const userJoin = () => {
        if(stompClient) {
            let chatMessage = {
                senderName: userData.username,
                status: "JOIN"
            }            
            
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
        }
    }

    const onPrivateMessageRecieved = (payload) => {
        let payloadData = JSON.parse(payload.body);
        // console.log(privateChats);
        if(privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } 
        else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onOnlineUsersReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        console.log("Payload: ")
        console.log(payloadData);
    }

    const onError = (err) => {
        console.error(err);
    }

    const sendPrivateMessage = () => {
        
        const h = date.getHours();
        const m = date.getMinutes();
        if(stompClient) {
            setTime(`${h}:${m}`);
            let chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                time: `${h}:${m}`,
                status: "MESSAGE"
            }

            if(userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
            setUserData({...userData, message: ""});
        }

        console.log(privateChats);
    }

    const handleClick = (name, id) => {
        if(name === "CHATROOM") {
            setTab(name);
            navigate(`/chat`)
        }
        else {
            setTab(name);
            navigate(`/chat/private/${id}`)
        }
        
    }
    return(
        <div className="container">
                <div className="chat-box">
                    <div className="member-list">
                        
                        <ul>
                            <li onClick={handleClick("CHATROOM", null)} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                            {[...privateChats.keys()].filter(name => name !== userData.username).map((name, index) => (
                                
                                <li onClick={handleClick(name, 1)} className={`member ${tab === name && "active"}`} key={index}>
                                    {name}
                                </li>
                                
                            ))}
                        </ul>
                    </div>
                    
                    {/* {tab === "CHATROOM" && <div className="chat-content">
                        {tab}
                        
                        
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                
                                <li className={`message ${chat.senderName === "System" ? "system" : chat.senderName !== userData.username ? "guest" : "self"}`}key={index}>
                                    {chat.senderName !== userData.username && <div className={`avatar guest`}>{}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{}</div>}
                                    
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
                            
                            <button type='button' className='send-button' onClick={sendPublicMessage}>Send</button>
                        </div>
                    </div>
                    } */}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        {tab}
                        
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.senderName !== userData.username ? "guest" : "self"}`} key={index}>
                                    {/* {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>} */}
                                    <div className="message-data">{chat.message}</div>
                                    {/* {chat.senderName !== userData.username && <div className="avatar self">{chat.senderName}</div>} */}
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
                    }
                </div>
                
                
            
        </div>
    );
}

export default PrivateChats;