import React from "react";
import PropTypes from "prop-types";
import Moment from "moment";
import shortid from "shortid";
const uuid = shortid.generate;




class Message extends React.Component{

    getMessageClass(){
        if (window.django.userId == this.props.value.sender.id){
            return 'msg-wrapper sender-message'
        }
        return 'msg-wrapper receiver-message'
    }

    render() {
        var dt = Moment(this.props.value.send_time).format('HH:mm')
        return (
        <div className='post'>
        <div><img className='user-image' src={this.props.value.sender.profile.image} key={uuid()}></img></div>
            <div className={this.getMessageClass()} key={uuid()}><p>{this.props.value.msg}</p></div>
            <div className='msg-time' key={uuid()}>{dt}</div>
        </div>
        );
    }

}

class Messages extends React.Component{

    render(){
        var data = this.props.value;
        return(
          <div id='post-wrapper' className='post-wrapper'>
            {data.map(el => (
                    <Message key={uuid()} value={el}/>
              ))}
          </div>



      );
    }

}
export default Messages;
