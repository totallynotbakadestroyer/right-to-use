import "./App.css";
import React, { useState } from "react";
import Form from "./components/Form.js";
import AuthInfo from "./components/AuthInfo.js";

const App = () => {
  const [auth, setAuth] = useState(null);

  return (
    <div>
      <AuthInfo auth={auth} setAuth={setAuth} />
      <Form setAuth={setAuth} auth={auth} />
    </div>
  );
};

export default App;
