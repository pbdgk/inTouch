import React from "react";
import ReactDOM from "react-dom";
import ProfileForm from "./ProfileForm";

const url = `/api/profile/${window.django.userId}/`;
const Profile = () => (
    <ProfileForm endpoint={url}></ProfileForm>
);
const wrapper = document.getElementById("profile");
wrapper ? ReactDOM.render(<Profile />, wrapper) : null;
