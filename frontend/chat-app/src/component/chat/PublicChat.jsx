import ChatHeader from "./ChatHeader";
import UserAvatar from "./UserAvatar";
import InputField from "./InputField";


const PublicChat = ({ publicChats, messageEndRef, 
                    splitIntoLines, userData, 
                    setUserData, sendPublicMessage }) => {
    return (
        <>
            <ChatHeader chatName="Chatroom" status="Online" />
            <div className="chat-messages" ref={messageEndRef}>
                {console.log(publicChats)}

                {publicChats.map((chat, index) => (
                    <div className="message" key={index}>
                        <div className={`${chat.senderId != userData.id ? "guest" : "self"}`}>
                            {chat.senderId !== userData.id && <div className={`avatar guest`} style={{}}>
                                <UserAvatar avatar={chat.senderAvatar} />
                            </div>}
                            <div className="message-data">
                                <div className="sender-name">{chat.senderName}</div>
                                {splitIntoLines(chat.message, 50)}
                            </div>
                        </div>
                    </div>
                ))}

                {/* <div ref={messageEndRef} /> */}
            </div>
            <InputField
                sendFunction={sendPublicMessage}
                userData={userData}
                setUserData={setUserData} />
        </>
    );
}

export default PublicChat;