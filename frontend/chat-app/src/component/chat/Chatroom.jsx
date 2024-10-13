import { useEffect, useState } from "react";
import Stomp, { over } from 'stompjs';
import sockjs from "sockjs-client/dist/sockjs"
import Register from "../auth/Register";
import { useNavigate } from "react-router-dom";
import "../../style/home.css"

var stompClient = null;
const date = new Date();

const Chatroom = () => {
    const navigate = useNavigate();
    const [publicChats, setPublicChats] = useState([]);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [tab, setTab] = useState("CHATROOM");
    const [time, setTime] = useState();
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    
    const [userData, setUserData] = useState({
        username: localStorage.getItem("jwtToken"),
        receiverName: "",
        connected: false,
        message: ""
    })

    useEffect(() => {
        const username = localStorage.getItem("jwtToken");
        console.log("Username is: ");
        console.log(username);
        if(!username) {
            navigate("/auth/login");
            return ;
        }

        setUserData({...userData, username: username});

        registerUser();
        
    }, []);

    

    const handleValue = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
    }

    const registerUser = async () => {
        let Sock = new sockjs("http://localhost:8080/ws");
        stompClient = over(Sock);
        stompClient.connect({}, await onConnected, await onError);
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

    const onPublicMessageRecieved = (payload) => {
        let payloadData = JSON.parse(payload.body);
        // console.log("Payload: ");
        // console.log(payloadData);
        switch(payloadData.status) {
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                // console.log(payloadData)
                onlineUsers.push(payloadData.senderName);
                setOnlineUsers([...onlineUsers]);

                publicChats.push({
                    senderName: "System", 
                    message: `${payloadData.senderName} has joined the chat!`,
                });
                setPublicChats([...publicChats]);
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
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

    const sendPublicMessage = () => {
        
        const h = date.getHours();
        const m = date.getMinutes();
        if(stompClient) {
            setTime(`${h}:${m}`);
            let chatMessage = {
                senderName: userData.username,
                message: userData.message,
                time: time,
                status: "MESSAGE"
            }
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
            setUserData({...userData, message: ""});
        }
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

    // registerUser();
    return(
        <div className="container">
                <div className="chat-box">
                    <div className="member-list">
                        
                        <ul>
                            <li onClick={() => {setTab("CHATROOM")}} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                            {[...privateChats.keys()].filter(name => name !== userData.username).map((name, index) => (
                                
                                <a href="/1" onClick={() => {setTab(name)}} className={`member ${tab === name && "active"}`} key={index}>
                                    {name}
                                </a>
                                
                            ))}
                        </ul>
                    </div>
                    
                    {tab === "CHATROOM" && <div className="chat-content">
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
                    }
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

export default Chatroom;