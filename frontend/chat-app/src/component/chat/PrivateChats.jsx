import { useEffect, useState } from "react";
import ChatPending from "./ChatPending";
import InputField from "./InputField";
import UserAvatar from "./UserAvatar";
import Message from "./Message";
import ChatHeader from "./ChatHeader";
import DeletedMessage from "./DeletedMessage";
import { calculateOfflineTime } from "../../util/timeUtils";


const PrivateChats = ({
    id, privateChats, userData, splitIntoLines,
    onlineUsers, messageEndRef, sendPrivateMessage,
    receiverData, accepted, deletedMessage,
    isDeleted, setUserData }) => {

    const [status, setStatus] = useState("");

    useEffect(() => {
        if(receiverData.lastLogin) {
            
        }

        const isUserOnline = onlineUsers.some(user => user.id == id);

        const offlineMessage = calculateOfflineTime(receiverData.lastLogin);
        console.log(offlineMessage)
            
        setStatus(isUserOnline ? "Dang hoat dong" : offlineMessage ?? "Dang hoat dong");
        
    }, [onlineUsers, receiverData])

    
    return (
        <>
            {receiverData.id && 
                <ChatHeader 
                    receiverName={receiverData.username}
                    receiverImg={receiverData.avatar}
                    status={status} 
                    thinking={receiverData.thinking}
                    borderColor={receiverData.borderColor} />
            }

            {isDeleted && <DeletedMessage />}

            {/* Display chat messages */}
            <div className="chat-messages" ref={messageEndRef}>
                {/* {console.log(privateChats)} */}
                
                {privateChats.has(`${id}`) && (privateChats.get(`${id}`).map((chat, index) => (
                    
                    <Message 
                        chat={chat} 
                        userData={userData}
                        // receiverData={receiverData} 
                        splitIntoLines={splitIntoLines}
                        key={index}/>
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
