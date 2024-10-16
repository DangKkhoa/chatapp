import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../style/auth.css"
import axios from "axios";
import Button from "./Button";


const Login = () => {
    
    const [userData, setUserData] = useState({
        email: "",
        password: "", 
        
    })
    const [isChecked, setIsChecked] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false) 
    const [isFocus, setIsFocus] = useState(false);

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     console.log(userData);

    //     const response = await axios.post("http://localhost:8080/api/auth/v1/login", userData)
            
    //     console.log(response);
    // }

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
            <div id="logo" className="login">
            <h1 className="title">Messenger Clone</h1>
            <p className="sub-title">Connect and send message to everyone.</p>

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
                        {passwordVisible ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
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