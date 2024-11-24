import user_1 from "../../assets/user_1.jpg";


const UserAvatar = ({ avatar, borderColor }) => {
    const avatarStyle = {
        backgroundImage: `url(/src/assets/user_12.png)`,
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