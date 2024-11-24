import UserAvatar from "./UserAvatar";

const ChatHeader = ({ receiverName, receiverImg, status, thinking, borderColor }) => {

    return(
        <div className="chat-header">
            <div className="chat-information">
                <div style={{ width: "50px", height: "50px" }}>
                    <UserAvatar avatar={receiverImg} borderColor={borderColor}/>
                </div>
                <div>
                    <p className="chat-name">{receiverName} <span style={{color: "gray", fontSize: ".8rem", fontWeight: "400"}}>{thinking}</span></p>
                    <p className="chat-status">{status}</p>
                </div>
            </div>
            <div className="chat-setting">

            </div>
        </div>
    );
}

export default ChatHeader;