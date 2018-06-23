import React from 'react';
import Moment from "moment";
import shortid from "shortid";

import {BrowserRouter as Router, Route } from 'react-router-dom'

import DataProvider from "../DataProvider";

import WSocketBox from "./wsbox";

import { MessageBody } from "./message";
import RoomBar from "./RoomBar"


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
    let { message } = this.state;
    message = message.trim()
    if (message !== '') {
      this.props.liftMessageToWebSocket({message: message, id: this.props.roomId});
      this.ref.current.value = '';
    }
  }

  onChange(event){
    this.setState({ message: event.target.value})
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

const ChatBar = ({ value }) => (
      <div className='chat-messages-wrapper'>
        {value.map(msg => (
          <MessageBody key={uuid()} msg={ msg }/>
        ))}
      </div>
    )

class Chat extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      path: null,
      data: null,
      isFetched: false,
    }
    this.updateState = this.updateState.bind(this);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.id !== prevState.path) {
      return {
        path: nextProps.match.params.id,
        data: null,
        isFetched: false,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isFetched === false) {
      let { path } = this.state;
      this.fetchData(path);
    }

    let { data, isUpdated} = this.state
    let { newMessage } = this.props
    if (newMessage !== prevProps.newMessage && newMessage !== null){
      this.setState({data: [ ...data, newMessage ]})
    }

  }

  updateState(message){
    this.state({data: [...data, message]})
  }

  componentDidMount () {
      const { id } = this.props.match.params
      this.fetchData(id)
  }

  fetchData(id){
    fetch(`/api/v1/messages/${id}`)
      .then((res) => { return res.json()} )
      .then((data => { this.setState({ data: data, isFetched: true}) }))
  }

  render() {
    if (!this.state.isFetched && !this.state.data){
    return(
      <div className="col-sm">
        <ChatInputBox/>
      </div>
    )
    } else{
      let {liftMessageToWebSocket} = this.props
      return(
      <div className="col-sm">
        <div className='wrapper-bar'>
          <ChatBar value={this.state.data}/>
        </div>
        <ChatInputBox roomId={ this.state.path } liftMessageToWebSocket={liftMessageToWebSocket}/>
      </div>
          )
      }
  }
}


class MainFrame extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      userId: window.django.userId,
      newMessage: null,
    }
    this.ws = this.addWs()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.updateState = this.updateState.bind(this)
  }

  componentWillUnmount() {
    this.ws.close()
  }

  handleUpdate(message){
    this.ws.send(JSON.stringify(message))
  }

  updateState(message){
    this.setState({newMessage: message})
  }

  addWs = () => {
    const wsUrl = `ws://${window.location.host}/ws/chat/`;
    let ws = new WebSocket(wsUrl)
    ws.onopen = e => console.log(e);
    ws.onmessage = e => { this.updateState(JSON.parse(e.data).message) }
    ws.onerror = e => console.log('error');
    ws.onclose = e => console.error('Chat socket closed unexpectedly');
    return ws;
  };


  render(){
    let roomsUrl = `/api/v1/rooms/${this.state.userId}/`;
    let { newMessage } = this.state;
    return (
      <Router>
        <div className="container main-frame">
          <div className="row">
            <DataProvider newMessage={ newMessage } endpoint={roomsUrl}
              render={data => <RoomBar rooms={data} />}/>
            <Route exact path='/chat/' render={() => (<div>Choose your contact to start message</div>)} />
            <Route path='/chat/:id' render={(props) => (
              <Chat {...props} newMessage={ newMessage } liftMessageToWebSocket={ this.handleUpdate }/>
            )} />
          </div>
        </div>
      </Router>
    )
  };
}

export default MainFrame;
