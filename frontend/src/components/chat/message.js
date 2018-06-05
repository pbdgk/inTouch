
import React from 'react';
import Moment from "moment";
import shortid from "shortid";

import PropTypes from "prop-types";

const uuid = shortid.generate;



class MessageBox extends React.Component{
    render(){
        console.log('ey')
        console.log(this.props)
        var dt = this.props.value.time ?
            Moment(this.props.value.time).format('HH:mm') : ''
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

export default MessageBox;
