import UserAvatar from "./UserAvatar"

const Message = ({ chat, userData, splitIntoLines }) => {
    return (
        <div className="message">
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
        </div>
    );
}

export default Message;