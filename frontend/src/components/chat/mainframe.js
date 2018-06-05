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
                    <div className='chat-message'>
                        <MessageBox value={this.props.value}/>
                    </div>
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
            <div className='chat-messages-wrapper'>
                {data.map(el => (
                    <ChatMessage key={uuid()} value={el}/>
                ))}
            </div>
        )
    }
};

class Profile extends React.Component {
  state = {
      path: null,
      data: null,
      isFetched: false,
      profileOrError: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.handle !== prevState.path) {
      return {
        path: nextProps.match.params.handle,
        data: null,
        isFetched: false,
      };
    }
    return null;
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.isFetched === false) {
      // At this point, we're in the "commit" phase, so it's safe to load the new data.
        this.fetchData(this.state.path);
    }
  }
    componentDidMount () {
        const { handle } = this.props.match.params
        this.fetchData(handle)
    }

    fetchData(handle){
        fetch(`/api/messages/${handle}`)
          .then((res) => {return res.json()})
          .then((data => {
              this.setState({ data: data, isFetched: true});
      }))
    }
  render() {
      if (!this.state.isFetched && !this.state.data){
      return(
        <div className="col-sm">
            <div className='wrapper-bar'>
            </div>
            <ChatInputBox updateFn={this.props.updateFn}/>
        </div>
      )
      } else{
        return(
        <div className="col-sm">
                 <div className='wrapper-bar'>
                     <ChatBar value={this.state.data}/>
                </div>
                <ChatInputBox updateFn={this.props.updateFn}/>
        </div>
            )
        }
    }
}


class MainFrame extends React.Component{
    state = {
        userId: window.django.userId,
    };
    render(){
        let roomsUrl = `/api/room_list/${this.state.userId}`;
        return(
            <Router>
                <div className="container main-frame">
                    <div className="row">
                        <DataProvider endpoint={roomsUrl}
                            render={data => <RoomBar value={data} />}/>
                        <Route exact path='/chat/' render={() => (<div>Choose your contact to start message</div>)} />
                        <Route path='/chat/:handle' component={Profile} />
                    </div>
                </div>
            </Router>
        )
    }
}


export default MainFrame;
