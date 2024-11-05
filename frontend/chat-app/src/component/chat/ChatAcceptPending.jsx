import DeletedMessage from "./DeletedMessage";

const ChatAcceptPending = ({isDeleted, receiverName}) => {
    return(
        <>
            {!isDeleted ? <div>
                <p>Invitation has been sent. Please wait for <b>{receiverName}</b> to accept.</p>
            </div>
            :
            <DeletedMessage />}
        </>
        
    );
}

export default ChatAcceptPending;