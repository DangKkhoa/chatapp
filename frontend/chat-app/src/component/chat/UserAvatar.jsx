import user_1 from "../../assets/user_1.jpg";


const UserAvatar = ({ avatar }) => {
    const avatarStyle = {
        backgroundImage: `url(/src/assets/${avatar}.jpg)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    };

    
    return(
        <div className="user-color" style={avatarStyle}></div>
    )
}

export default UserAvatar;