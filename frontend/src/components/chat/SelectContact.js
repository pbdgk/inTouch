import React from 'react';
import shortid from "shortid";
import DataProvider from "../DataProvider";
import MessageBox from "./message";

const uuid = shortid.generate;

class Contact extends React.Component{
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e){
    e.preventDefault();
    let data = {
      receiver: e.target.attributes.userid.value
    };
    console.log(data)
    fetch(`/api/v1/rooms/create/${window.django.userId}/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {
      return response.json();
    })
    .then(room => {
      this.props.updateRooms(room)
    })
    .catch(err => {
      console.log(err)
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
    console.log(this.props)
      let { contacts } = this.props.value;
      let { updateRooms } = this.props;
      console.log(contacts)
      return(
          <div>
            {contacts.map(el =>
              (<Contact key={uuid()} updateRooms={ updateRooms } value={el}/>))
            }
          </div>
      )
  }
}
const SelectContact = ({ updateRooms }) => (
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <div>
          <DataProvider endpoint={`/api/v1/contacts/${window.django.userId}/`}
            render={data => <ContactBox updateRooms={ updateRooms } value={data} />}/>
        </div>
      </div>
    </div>
)

export default SelectContact;
