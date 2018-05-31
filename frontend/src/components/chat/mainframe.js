import React from 'react';
import Moment from "moment";
import shortid from "shortid";

import PropTypes from "prop-types";
import DataProvider from "../DataProvider";

const uuid = shortid.generate;





class ContactCard extends React.Component{
    render(){
        return(
            // <div className="card border-primary contact-card-bounds image-bounds">
            <div className="card contact-card-bounds image-bounds">
              <div className="card-header">
                <div className='username'>Username</div>
                <div className='send-time'>12:44</div>

              </div>

             <MessageBox/>

            </div>
        )
    }
};




class MessageBox extends React.Component{
    render(){
        var dt = this.props.value ?
            Moment(this.props.value.send_time).format('HH:mm') : ''
        return(
            <div className="card-body text-primary">
            <div className='space-btw-wrapper'>
            <div className='card-left'>
            <img src='../../../static/frontend/img/tmp.jpeg' className='contact-img-wrapper rounded-circle border border-primary'></img>
            </div>
            <div className='card-center'><p className="card-text">{this.props.value?this.props.value.msg:''}</p></div>
            <div className='card-right'>{dt}</div>
            </div>
            <hr/>
            </div>
        )
    }
}


class ChatMessage extends React.Component{
    render(){
        return(
                <div className='chat-message'>
                    <MessageBox value={this.props.value}/>
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



class ContactBar extends React.Component{
    render(){
        return(
            <div className="col-sm-4 no-padding">
                <div className='wrapper-bar right-border'>

                    <ContactCard/>
                    <ContactCard/>
                    <ContactCard/>
                    <ContactCard/>
                    <ContactCard/>
                    <ContactCard/>
                    <ContactCard/>
                    <ContactCard/>
                    <ContactCard/>

                </div>
            </div>
        )
    }
};

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
                    <ChatInputBox updateFn={this.props.updateFn}/>
                </div>
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
        let chatContactsUrl = `/api/chat/contacts/${this.state.userId}`;
        let messagesEndpointUrl = `/api/messages/${this.state.roomName}`;
        return(
            <div className="container main-frame">
              <div className="row">

                <DataProvider endpoint={chatContactsUrl}
                    render={data => <ContactBar value={data} />}/>
                <DataProvider endpoint={messagesEndpointUrl}
                    render={(data, updateFn) => <ChatBar updateFn={updateFn} value={data} /> }/>

                </div>
              </div>
        )
    }
}




export default MainFrame;
