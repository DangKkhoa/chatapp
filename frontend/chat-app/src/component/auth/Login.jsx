import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../style/auth.css"
import axios from "axios";
import Button from "./Button";
import chatLogo from "../../assets/chat.png";

const Login = () => {
    
    const [userData, setUserData] = useState({
        email: "",
        password: "", 
        
    })
    const [isChecked, setIsChecked] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false) 

    const handleValueChange = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
    }

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    }

    const toggleViewPassword = () => {
        if(passwordVisible) {
            setPasswordVisible(false);
        }
        else {
            setPasswordVisible(true);
        }
    }

    return(
        <div className="container login" >
            <div id="logo" className="">
                <h1 className="title">QuickChat</h1>
                <p className="sub-title">Connect and send messages to everyone with superior speed <span style={{color: "#f5c938"}}><i class="fa-solid fa-bolt"></i></span></p>
            </div>
            <form id="login-form" action="">
                <div className="form-group">
                    <input 
                        type="email" 
                        name="email" 
                        className="form-input"
                        id="email"
                        placeholder="Enter your email address"
                        value={userData.email}
                        onChange={handleValueChange}/>
                </div>

                <div className="form-group password">
                    <input 
                        type={passwordVisible ? "text" : "password"} 
                        name="password" 
                        className="form-input"
                        id="password"
                        placeholder="Enter your password"
                        value={userData.password}
                        onChange={handleValueChange}
                        
                        />
                    <div onClick={toggleViewPassword} className={`toggle-password ${userData.password && "visible"}`}>
                        {passwordVisible ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                    </div>
                </div>
                <div className="remember-login">
                    <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        />
                    Remember Login
                </div>
                <Button type="login" userData={userData} isRememberLoginChecked={isChecked}/>
                <a href="/forgot-password" className="reset-password-link">Forgot password ?</a>
                <hr/>
                <a href="/auth/register" id="register-btn" className="btn register-btn">Create new account</a>
            </form>
        </div>
    );
}

export default Login;