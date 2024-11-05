
const OnlineUsers = ({ onlineUsers, userData, handleClick }) => {
    return(
        <>
            {onlineUsers.length > 1 && <ul className="online-users">
            {onlineUsers.filter(user => user.username !== userData.username).map((user) => (
                <li onClick={() => handleClick("private", user.id)} className="user"  key={user.id}>
                    <div className="user-color" style={{backgroundColor: `${user.avatarColor}`, color: user.avatarColor}}></div>
                    <div className="online-sign"></div>
                    {user.username}
                </li>
            ))}
        </ul>}
        </>
        
    );
}

export default OnlineUsers;