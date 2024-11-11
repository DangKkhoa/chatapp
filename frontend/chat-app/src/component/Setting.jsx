import axios from "axios";
import { useEffect, useState } from "react";
import "../style/setting.css"
import UserAvatar from "./chat/UserAvatar";
const Setting = () => {
    const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    const [userData, setUserData] = useState({
        id: 0,
        username: "jjjjj",
        avatar: "",
        status: "",
        thinking: ""
    })

    const [newAvatar, setNewAvatar] = useState("");
    useEffect(() => {
        verifyToken(token)
    }, [])
    const verifyToken = (token) => {
        axios.get("http://localhost:8080/auth/jwt-verify", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                const responseData = response.data;
                if (responseData.code === 10) {
                    const user = responseData.userSessionDTO;
                    console.log(user.avatarColor);
                    setUserData(userData => ({
                        ...userData,
                        username: user.username,
                        id: user.id,
                        avatar: user.avatar
                    }))
                }
                else {
                    navigate("/auth/login");
                }
            })
            .catch(err => {
                console.error(err);
                navigate("/auth/login");
            })

    }

    const avatarStyle = {
        backgroundImage: `url(/src/assets/${userData.avatar}.jpg)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        width: "100%",
        height: "100%"
    };

    const changeAvatar = () => {
        const avatars = [
            "user_1", "user_2", "user_3",
            "user_4", "user_5", "user_6",
            "user_7", "user_8", "user_9"
        ];

        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        setUserData(prevUserData => ({
            ...prevUserData,
            avatar: randomAvatar
        }))
    }

    const handleUserDataChange = (e) => {
        const {name, value} = e.target;
        console.log(name + ": " + value);
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: [value]
        }))
    }

    const handleSaveClick = () => {
        axios.post("http://localhost:8080/user/update", {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            userData
        })
    }

    return (
        <div className="setting-container">
            <div>
                <button className="go-back">Go back</button>
            </div>
            <div className="setting-user-data">
                <div className="setting-avatar-container" onClick={changeAvatar}>
                    <UserAvatar avatar={userData.avatar} />
                </div>
                <div className="setting-input-container">
                    <div className="">
                        Display name:
                        <input type="text" name="username" value={userData.username} onChange={handleUserDataChange}/>
                    </div>
                    <div>
                        What are you thinking?
                        <input type="text" name="thinking" onChange={handleUserDataChange}/>
                    </div>
                    <div>
                        Status
                        <select name="status" id="" onChange={handleUserDataChange} defaultValue="want_to_chat">
                            <option value="online">Online</option>
                            <option value="busy">Busy</option>
                            <option value="tired">Tired</option>
                            <option value="want_to_chat">Want to chat</option>
                        </select>
                    </div>
                    
                </div>
            </div>
            <button onClick={handleSaveClick}>Save</button>
        </div>
    );
}

export default Setting;
