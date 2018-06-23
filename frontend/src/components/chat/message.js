
import React, { Component } from 'react';
import Moment from "moment";


export const MessageHeader = ({ username }) => (
  <div className="card-header">
    <div className='username'>{ username }</div>
  </div>
)
export const MessageBody = ({ msg }) => (
  <div className="card-body text-primary">
    <div className='space-btw-wrapper'>
      <div className='card-left'>
        <img src='../../../static/frontend/img/tmp.jpeg' className='contact-img-wrapper rounded-circle border border-primary'></img>
      </div>
      { msg ? <Message value={ msg }/> : null}
    </div>
  </div>
)

class Message extends Component{
  render(){
    let { msg, send_time } = this.props.value
    return(
      <React.Fragment>
        <div className='card-center'><p className="card-text">{ msg }</p></div>
        <div className='card-right'>{ Moment(send_time).format('HH:mm') }</div>
      </React.Fragment>
    )
  }
}
