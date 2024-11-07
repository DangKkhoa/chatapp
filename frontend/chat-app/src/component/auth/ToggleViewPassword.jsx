
const ToggleViewPassword = ({ passwordVisible, setPasswordVisible, userData }) => {
    const toggleViewPassword = () => {
        setPasswordVisible(!passwordVisible);
    }


    return(
        <>
            <div onClick={toggleViewPassword} className={`toggle-password ${userData.password && "visible"}`}>
                {passwordVisible ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </div>
        </>
        
    );
}

export default ToggleViewPassword;