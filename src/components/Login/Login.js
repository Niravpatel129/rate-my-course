import React from "react";
import Axios from "axios";

function Login() {
  const handleLoginUser = () => {
    console.log("login user");
    Axios.get("http://localhost:8080/login/facebook");
  };

  return (
    <div>
      <button onClick={handleLoginUser}>Login</button>
    </div>
  );
}

export default Login;
