import React from 'react';
import Moment from "moment";
import shortid from "shortid";


import {BrowserRouter as Router, Link, Route } from 'react-router-dom'


import PropTypes from "prop-types";
import DataProvider from "../DataProvider";



import MessageBox from "./message";
import RoomBar from "./roombar"


const uuid = shortid.generate;



class ChatMessage extends React.Component{
    render(){
        return(
                <div>
                <Link to='/chat/1'>
                    <div className='chat-message'>
                        <MessageBox value={this.props.value}/>
                    </div>
                </Link>
                <Route path='/1' render={()=>(<h1>Hello</h1>)}/>
                </div>
        );
    };
};


class ChatInputBox extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            message: ''
        };
        this.update = this.update.bind(this);
        this.onChange = this.onChange.bind(this);
        this.ref = React.createRef();
    }

    update(){
        let message = this.state.message;
        {
            message = message.trim()
            if (message !== '')
            {
                this.props.updateFn(message);
                this.ref.current.value = '';
            }
        }
    }

    onChange(event){
        this.setState({message: event.target.value})
    }

    render(){
        return(
            <div className='chat-bottom-area'>
                <div className="chat-input-area">
                    <textarea ref={this.ref} onChange={this.onChange} id='sendMessage'/>
                    <button onClick={this.update}/>
                </div>
            </div>
        )
    }
}


class ChatBar extends React.Component{
    render(){
        let data = this.props.value;
        return(
            <div className="col-sm">
                <div className='wrapper-bar'>
                    <div className='chat-messages-wrapper'>
                        {data.map(el => (
                            <ChatMessage key={uuid()} value={el}/>
                        ))}
                    </div>
                </div>
                <ChatInputBox updateFn={this.props.updateFn}/>
            </div>
        )
    }
};


class MainFrame extends React.Component{
    state = {
        userId: window.django.userId,
        roomName: 'main'
    };
    render(){
        let roomsUrl = `/api/room_list/${this.state.userId}`;
        let messagesEndpointUrl = `/api/messages/${this.state.roomName}`;
        return(
            <div className="container main-frame">
                <Router>
                    <div className="row">
                        <DataProvider endpoint={roomsUrl}
                            render={data => <RoomBar value={data} />}/>
                    </div>
                </Router>
            </div>
        )
    }
}


export default MainFrame;
