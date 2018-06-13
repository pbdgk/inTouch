import React, { Component } from 'react';
import shortid from "shortid";

import { Link } from 'react-router-dom'
import { MessageHeader, MessageBody } from "./message";
import SelectContact from "./SelectContact"

const uuid = shortid.generate;

class AddContact extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      contact: '',
      errorMessage: '',
    }
    this.updateChange = this.updateChange.bind(this);
    this.addContact = this.addContact.bind(this);
  }

  updateChange(e){
    $('#contactInput').popover('hide')
    this.setState(
      {
        contact: e.target.value,
        errorMessage: '',
      }
    )
  }

  addContact(){
    let username = this.state.text;
    let url =`/api/v1/contacts/add/${window.django.userId}/`;
    let data = {
      contact: this.state.contact,
    };
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
        if (data.error){
          this.setState({ errorMessage: data.message })
          $('#contactInput').popover('show')
        }
    })
    .catch(e => console.log(e))
  }

  render(){
    let btnStyle =  {
      height: '20px'
    }
    let { errorMessage } = this.state
    return(
      <div>
        <input id='contactInput' onChange={this.updateChange} data-placement="top" data-content={errorMessage}/>
        <button onClick={this.addContact} style={btnStyle}>add contact</button>
      </div>
    )
  }
}

class RoomCard extends React.Component{
  render(){
    let { room } = this.props
    let { username } = room.contact
    return(
      <Link to={`/chat/${room.id}`}  >
        {/* <div className="card border-primary contact-card-bounds image-bounds"> */}
        <div className="card contact-card-bounds image-bounds">
          <MessageHeader username={ username }/>
          <MessageBody msg={ room.msg }/>
        </div>
      </Link>
    )
  }
};

class RoomBar extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      rooms: this.props.rooms,
    }
    this.updateRooms = this.updateRooms.bind(this)
    this.checkRoomExist = this.checkRoomExist.bind(this)
  }

  checkRoomExist(rooms, newRoom){
    return rooms.some(room => room.id === newRoom.id)
  }

  updateRooms(newRoom){
    let { rooms } = this.state
    if (!this.checkRoomExist(rooms, newRoom)){
      this.setState({
        rooms: [...rooms, newRoom]
      })
    }
  }

  render(){
    let { rooms } = this.state;
    return(
      <div className="col-sm-4 no-padding">
        <div className='wrapper-bar right-border'>

        {/* mb tmp wrapper down */}
          <div className="d-flex p-2 bd-highlight">
            <SelectContact updateRooms={ this.updateRooms } />
            <AddContact/>
          </div>
        {/* end wrapper */}
          {rooms.map(room => (
            <RoomCard room={ room } key={uuid()}/>
          ))}
      </div>
    </div>
  )}
}

export default RoomBar;
