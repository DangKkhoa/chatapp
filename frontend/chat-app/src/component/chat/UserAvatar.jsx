const UserAvatar = ({ avatar, borderColor }) => {
    const avatarStyle = {
        backgroundImage: `url(/src/assets/avatars/${avatar}.png)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        border: `2px solid ${borderColor}`
    };

    
    return(
        <div className="user-avatar" style={avatarStyle}></div>
    )
}

export default UserAvatar;