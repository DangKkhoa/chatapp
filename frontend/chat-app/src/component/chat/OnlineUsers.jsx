import UserAvatar from "./UserAvatar";

const OnlineUsers = ({ onlineUsers, userData, handleClick }) => {
    
    return(
        <div className="online-users-container">
            {console.log(onlineUsers)}
            {onlineUsers.length <= 1 && <div className="no-user-online">Nobody is online yet</div>}
            {onlineUsers.length > 1 && <div className="online-users">
                {onlineUsers.filter(user => user.username !== userData.username).map((user) => (
                    <div onClick={() => handleClick("private", user.id)} className="user" key={user.id}>
                        {/* <div className="user-color" style={{ backgroundColor: `${user.avatarColor}`, color: user.avatarColor }}></div> */}
                        <div style={{ width: "50px", height: "50px" }}>
                            <UserAvatar avatar={user.avatar} />
                        </div>
                        <div className="online-sign"></div>
                        {user.username}
                    </div>
                ))}
            </div>}
        </div>
        
    );
}

export default OnlineUsers;