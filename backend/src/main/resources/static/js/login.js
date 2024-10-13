const button = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorBox = document.querySelector(".error-message");



button.addEventListener('click', async (e) => {
    const userData = {
        email: emailInput.value,
        username: null,
        password: passwordInput.value,
        avatarUrl: null
    }
    console.log(emailInput.value);
    e.preventDefault();
    const response = await fetch("http://localhost:8080/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })

    const responseData = await response.json();
    if(responseData.code !== 1) {
        errorBox.style.display = "block";
        errorBox.textContent = responseData.message;
    }



})
