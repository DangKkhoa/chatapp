
const ChatHeader = ({ chatName, status }) => {
    return(
        <div className="chat-header">
            <div className="chat-information">
                <div className="chat-image"></div>
                <div>
                    <p className="chat-name">{chatName}</p>
                    <p className="chat-status">{status}</p>
                </div>
            </div>
            <div className="chat-setting">

            </div>
        </div>
    );
}

export default ChatHeader;