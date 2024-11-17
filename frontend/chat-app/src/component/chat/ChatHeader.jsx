import UserAvatar from "./UserAvatar";

const ChatHeader = ({ receiverName, receiverImg, status }) => {
    return(
        <div className="chat-header">
            <div className="chat-information">
                <div style={{ width: "50px", height: "50px" }}>
                    <UserAvatar avatar={receiverImg} />
                </div>
                <div>
                    <p className="chat-name">{receiverName}</p>
                    <p className="chat-status">{status}</p>
                </div>
            </div>
            <div className="chat-setting">

            </div>
        </div>
    );
}

export default ChatHeader;