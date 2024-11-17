
const DeletedMessage = () => {
    return(
        <div className="deleted-alert">
            <h2 className="deleted-message">Chat has been deleted</h2>
            <a href="/chat" className="go-back-btn">Go back to home</a>
        </div>
    )
}

export default DeletedMessage;