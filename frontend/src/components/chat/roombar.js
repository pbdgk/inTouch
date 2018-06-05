import React from 'react';
import shortid from "shortid";


import {BrowserRouter as Router, Link, Route } from 'react-router-dom'
import DataProvider from "../DataProvider";
import MessageBox from "./message";
import DropDownContactBtn from "./contactbar"

const uuid = shortid.generate;

class RoomCard extends React.Component{
    render(){
        let message = this.props.value
        let info = message.last_message ? {
            msg: message.last_message.msg,
            send_time: message.last_message.send_time,
            sender: message.last_message.sender.username,
            contact: message.contact
        }:{
            msg: 'No messages yet',
            send_time: '',
            sender: '',
            contact: message.contact

        }
        return(
            // <div className="card border-primary contact-card-bounds image-bounds">

            <div rn={message.room_name} className="card contact-card-bounds image-bounds">
                <Link to={`/chat/${message.room_name}`}>
                    <div className="card-header">
                        <div className='username'>{info.contact.username}</div>
                    </div>
                    <MessageBox value={info}/>
                </Link>
            </div>
        )
    }
};

class AddContact extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text: '',
        }
        this.updateChange = this.updateChange.bind(this);
        this.addContact = this.addContact.bind(this);
    }

    updateChange(e){
        this.setState({text: e.target.value});
    }

    addContact(){
        let username = this.state.text;
        let url = '/api/addcontact/';
        let data = {
            currentUser: window.django.userId,
            contact: this.state.text,
        }
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.created){

            }
        })
    }


    render(){
        let btnStyle =  {
            height: '20px'
        }
        return(
            <div>
                <input onChange={this.updateChange}/>
                <button onClick={this.addContact} style={btnStyle}>add contact</button>
            </div>
        )
    }
}

class RoomBar extends React.Component{

    render(){
        return(
            <div className="col-sm-4 no-padding">
                <div className='wrapper-bar right-border'>
                    <DropDownContactBtn/>
                    <AddContact/>
                    {this.props.value.map(el => (
                        <RoomCard key={uuid()} value={el}/>
                    ))}
                </div>

            </div>
        )
    }
};

export default RoomBar;
