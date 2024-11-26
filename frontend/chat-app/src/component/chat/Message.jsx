import UserAvatar from "./UserAvatar"

const Message = ({ chat, userData, splitIntoLines }) => {
    // console.log(chat)
    const getHourAndMinute = (sentTime) => {
        const [hour, minute] = sentTime.split(":");
        
        return `${hour > 12 ? hour - 12 : hour}:${minute} ${hour > 12 ? "PM" : "AM"}`;
    }

    return (
        <div className="message">
            {console.log(chat.sender.id)}
            {chat && <div className={`${chat.sender.id != userData.id ? "guest" : "self"}`}>
                {chat.sender.id != userData.id && <div className={`avatar guest`}>
                    <UserAvatar avatar={chat.sender.avatar} />
                </div>}
                <div className="message-data">
                    <span className="sender-name">{chat.sender.username}</span>
                    <span className="message-content">{splitIntoLines(chat.message, 50)}</span>
                </div>
                
            </div>}
            <div className="message-time">{getHourAndMinute(chat.sentTime)}</div>
        </div>
    );
}

export default Message;