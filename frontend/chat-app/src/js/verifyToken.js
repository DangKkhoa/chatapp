import axios from "axios";

export const verifyToken = (token, setUserData) => {
  axios
    .get("http://localhost:8080/auth/jwt-verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const responseData = response.data;
      if (responseData.code === 10) {
        const user = responseData.userSessionDTO;
        console.log(user);
        setUserData((userData) => ({
          ...userData,
          email: user.email,
          username: user.username,
          id: user.id,
          avatar: user.avatar,
          status: user.status || "",
          thinking: user.thinking || "",
          borderColor: user.borderColor
        }));
      } else {
        window.location.href = "/auth/login";
      }
    })
    .catch((err) => {
      console.error(err);
        window.location.href = "/auth/login";
    });
};
