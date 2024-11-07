import DeletedMessage from "./DeletedMessage";
import "../../style/chatPending.css"

const ChatAcceptPending = ({isDeleted, receiverName}) => {
    return(
        <>
            {!isDeleted ? <div className="chat-pending-message">
                <h3>Invitation send</h3>
                <span>You can send more messages after chat is accepted</span>
            </div>
            :
            <DeletedMessage />}
        </>
        
    );
}

export default ChatAcceptPending;