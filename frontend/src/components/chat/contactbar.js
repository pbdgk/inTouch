
import React from 'react';
import Moment from "moment";
import shortid from "shortid";


import {BrowserRouter as Router, Link, Route } from 'react-router-dom'


import PropTypes from "prop-types";
import DataProvider from "../DataProvider";

import MessageBox from "./message";


const uuid = shortid.generate;

class Contact extends React.Component{

    handleClick(e){
        e.preventDefault();
        let id = e.target.attributes.userid.value
        fetch(`/api/createroom/${id}/${window.django.userId}`, {
            method: "post"
        })
          .then(response => {
            return response.json();
          })
          .then(data => {
    })
}

    render(){
        return(
            <div>
                <a onClick={this.handleClick} userid={this.props.value.id} className="dropdown-item" href="#">
                    {this.props.value.username}
                </a>
            </div>
        )
    }
}


class ContactBox extends React.Component{
    render(){
        let data = this.props.value;
        let contacts = data.contacts;
        console.log(contacts)
        return(
            <div>
                {
                    contacts.map(el => (<Contact key={uuid()} value={el}/>))
                }
            </div>
        )
    }
}
class DropDownContactBtn extends React.Component{
    render(){
        return(
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Write Message
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <div>
                        <DataProvider endpoint={`/api/contact/${window.django.userId}`}
                            render={data => <ContactBox value={data} />}/>
                    </div>
                </div>
            </div>


        )
    }
}

export default DropDownContactBtn;
