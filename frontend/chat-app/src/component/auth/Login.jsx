import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../style/auth.css"
import axios from "axios";
import Button from "./Button";

const Login = () => {
    const [loginUserData, setLoginUserData] = useState({
        email: "",
        password: ""
    })
    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     console.log(userData);

    //     const response = await axios.post("http://localhost:8080/api/auth/v1/login", userData)
            
    //     console.log(response);
    // }

    const handleValueChange = (event) => {
        const { name, value } = event.target;
        setLoginUserData({...loginUserData, [name]: value});
    }
    return(
        <div className="container login" >
            <div id="logo" className="login">
            <h1 className="title">Messenger Clone</h1>
            <p className="sub-title">Connect and send message to everyone.</p>

        </div>
            <form id="login-form" action="">
                <div className="form-group">
                    <label htmlFor="email">Email</label><br/>
                    <input 
                        type="email" 
                        name="email" 
                        className="form-input"
                        id="email"
                        placeholder="Enter your email address"
                        value={loginUserData.email}
                        onChange={handleValueChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="">Password:</label><br/>
                    <input 
                        type="password" 
                        name="password" 
                        className="form-input"
                        id="password"
                        placeholder="Enter your password"
                        value={loginUserData.password}
                        onChange={handleValueChange}/>
                </div>

                <Button type="login" loginUserData={loginUserData} />
                <a href="/forgot-password" className="reset-password-link">Forgot password ?</a>
                <hr/>
                <a href="/auth/register" id="register-btn" className="btn register-btn">Create new account</a>
            </form>
        </div>
    );
}

export default Login;