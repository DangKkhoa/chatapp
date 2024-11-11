import { useEffect, useState } from "react";
import ChatAcceptPending from "./ChatAcceptPending";
import InputField from "./InputField";
import UserAvatar from "./UserAvatar";

const PrivateChats = ({
    id, privateChats, userData, splitIntoLines,
    onlineUsers, messageEndRef, sendPrivateMessage,
    receiverData, accepted, deletedMessage,
    isDeleted, setUserData }) => {

    const [status, setStatus] = useState();

    useEffect(() => {
        const isUserOnline = onlineUsers.some(user => user.id == id);

        setStatus(isUserOnline ? "Online" : "Offline");
    })


    return (
        <>
            {receiverData.id && <div className="chat-header">
                <div className="chat-information">
                    <div style={{ width: "50px", height: "50px" }}>
                        <UserAvatar avatar={receiverData.avatar} />
                    </div>

                    <div>
                        {receiverData.username && <div className="chat-name">{receiverData.username}</div>}
                        <div className="chat-status">{status}</div>
                    </div>
                </div>
                <div className="chat-setting">

                </div>
            </div>}
            <ul className="chat-messages" ref={messageEndRef}>
                {console.log(privateChats)}
                {isDeleted && <h1>{deletedMessage}</h1>}
                {privateChats.get(`${id}`) && (privateChats.get(`${id}`).map((chat, index) => (
                    <li className="message" key={index + 1}>
                        <div className={`${chat.senderId != userData.id ? "guest" : "self"}`}>
                            {chat.senderId != userData.id && <div className={`avatar guest`} style={{ backgroundColor: chat.senderAvatarColor }}>
                                <UserAvatar avatar={chat.senderAvatar} />
                            </div>}
                            <div className="message-data">
                                <div className="sender-name">{chat.senderName}</div>
                                {splitIntoLines(chat.message, 50)}
                            </div>
                            {/* {chat.senderId == userData.id && <div className="avatar self" >
                                <UserAvatar avatar={userData.avatar} />
                            </div>} */}
                        </div>
                    </li>

                )))}



            </ul>

            {accepted ? <div className="send-message-container">

                <InputField
                    sendFunction={sendPrivateMessage}
                    userData={userData}
                    setUserData={setUserData}

                />

            </div>
                :
                <ChatAcceptPending isDeleted={isDeleted} receiverName={receiverData.username} />
            }
        </>
    );
}

export default PrivateChats;
