import axios from "axios";
import { useEffect, useState } from "react";
import "../style/setting.css"
import UserAvatar from "./chat/UserAvatar";
import { verifyToken } from "../js/verifyToken";
import { HexColorPicker } from "react-colorful";

const Setting = () => {
    const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    const [color, setColor] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState();
    const [userData, setUserData] = useState({
        id: 0,
        email: "",
        username: "",
        avatar: "",
        status: "",
        thinking: "",
        borderColor: ""
    })

    

    
    useEffect(() => {
        verifyToken(token, setUserData)
    }, [])
    
    const handleBorderColorChange = (color) => {
        setColor(color);
        setUserData(prevUserData => ({
            ...prevUserData,
            borderColor: color
        }))
    }

    const changeAvatar = () => {
        const avatars = [
            "user_1", "user_2", "user_3",
            "user_4", "user_5", "user_6",
            "user_7", "user_8", "user_9",
            "user_10", "user_11"
        ];

        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        console.log(randomAvatar)
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
            [name]: value
        }))

    }

    const handleSaveClick = () => {
        axios.post(
            "http://localhost:8080/user/update", 
            userData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(response => {
            const responseData = response.data;
            if(responseData.code == 1) {
              setIsSuccess(true);
            }
            else {
              setIsSuccess(false);
            }
            setUpdateMessage(responseData.message);
        })
    }

    const onCloseButtonClick = () => {
      setUpdateMessage("");
    }

    

    return (
      <div className="setting-container">
        {updateMessage && <div className={`update ${isSuccess ? "success" : "failed"}`}>
          <p>
            {updateMessage} {isSuccess ? <i class="fa-regular fa-face-smile-wink"></i> : <i class="fa-regular fa-face-frown"></i>} 
          </p>
          <button onClick={onCloseButtonClick} className={`${isSuccess ? "success" : "failed"}`}>Ok</button>
        </div>}
        <div>
          <button className="go-back">Go back</button>
        </div>
        <div className="setting-user-data">
          <div className="setting-avatar-container" onClick={changeAvatar}>
            <UserAvatar avatar={userData.avatar} borderColor={userData.borderColor} />
          </div>
          <div className="setting-input-container">
          <div className="" >
              <label htmlFor="email">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={userData.email}
                style={{opacity: ".6"}}
                readOnly />
            </div>
            <div className="">
              <label htmlFor="name">
                Display name <span style={{color: "gray", fontSize: ".8rem"}}>{userData.username.length} / 30</span>
              </label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleUserDataChange} />
            </div>
            <div>
              <label htmlFor="thinking">
                Share your thought <span style={{color: "gray", fontSize: ".8rem"}}>{userData.thinking.length} / 30</span>
              </label>
              <input
                type="text"
                name="thinking"
                value={userData.thinking || ""}
                onChange={handleUserDataChange}
              />
            </div>
            
            <div className="border-color-pickers">
                Choose border color: 
                <HexColorPicker color={userData.borderColor} onChange={(color) => handleBorderColorChange(color)} style={{width: "100%"}}/>
                
            </div>
          </div>
        </div>
        <button onClick={handleSaveClick} className="save-btn">
          Save
        </button>
      </div>
    );
}

export default Setting;
