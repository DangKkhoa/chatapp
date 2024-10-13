document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");

    if(!token) {
        window.location.href = "/auth/login";
    }
    else {
        fetch("http://localhost:8080/", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "Application/json"

            }
        })
            .then(response => console.log(response))
            .catch(error => console.error(error))


    }


})