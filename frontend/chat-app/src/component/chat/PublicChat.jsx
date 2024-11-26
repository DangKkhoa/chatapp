import ChatHeader from "./ChatHeader";
import UserAvatar from "./UserAvatar";
import InputField from "./InputField";
import Message from "./Message";


const PublicChat = ({ publicChats, messageEndRef, 
                    splitIntoLines, userData, 
                    setUserData, sendPublicMessage }) => {
    
    
    return (
        <>
            <ChatHeader 
                receiverName="Chatroom" 
                status="Online" 
                receiverImg="Anonify"/>

            <div className="chat-messages" ref={messageEndRef}>
                {/* {console.log(publicChats)} */}

                {publicChats.map((chat, index) => (
                    <Message 
                        chat={chat} 
                        userData={userData} 
                        splitIntoLines={splitIntoLines}
                        key={index}/>
                ))}
            </div>
            <InputField
                sendFunction={sendPublicMessage}
                userData={userData}
                setUserData={setUserData} />
        </>
    );
}

export default PublicChat;