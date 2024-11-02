import DeletedMessage from "./DeletedMessage";

const ChatAcceptPending = ({isDeleted}) => {
    return(
        <>
            {!isDeleted ? <div>
                <p>Invitation has been sent. Please wait for the receiver to accept.</p>
            </div>
            :
            <DeletedMessage />}
        </>
        
    );
}

export default ChatAcceptPending;