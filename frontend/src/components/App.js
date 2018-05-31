import React from "react";
import ReactDOM from "react-dom";
import MainFrame from "./chat/mainframe";

const App = () => (
    <MainFrame/>
);
const wrapper = document.getElementById("mainFrame");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
