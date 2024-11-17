import { useEffect, useState } from "react";
import ChatPending from "./ChatPending";
import InputField from "./InputField";
import UserAvatar from "./UserAvatar";
import Message from "./Message";
import ChatHeader from "./ChatHeader";
import DeletedMessage from "./DeletedMessage";

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
            {/* Display name and status of chat */}
            {/* {receiverData.id && <div className="chat-header">
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
            </div>} */}

            {receiverData.id && 
                <ChatHeader 
                    receiverName={receiverData.username}
                    receiverImg={receiverData.avatar}
                    status={status} />
            }

            {isDeleted && <DeletedMessage />}

            {/* Display chat messages */}
            <div className="chat-messages" ref={messageEndRef}>
                {console.log(privateChats)}
                
                {privateChats.get(`${id}`) && (privateChats.get(`${id}`).map((chat, index) => (
                    <Message 
                        chat={chat} 
                        userData={userData} 
                        splitIntoLines={splitIntoLines}/>
                )))}
            </div>

            {accepted ? <div className="send-message-container">

                <InputField
                    sendFunction={sendPrivateMessage}
                    userData={userData}
                    setUserData={setUserData}

                />

            </div>
                :
                <ChatPending isDeleted={isDeleted} receiverName={receiverData.username} />
            }
        </>
    );
}

export default PrivateChats;
