import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import shortid from "shortid";
import Moment from "moment";
import { CookiesProvider } from 'react-cookie';
import ImageComponent from "./Image";


const uuid = shortid.generate;


class ProfileForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            bio: '',
            city: '',
            birthdate: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.getData();
        $(ReactDOM.findDOMNode(this.refs.date)).datepicker({
            orientation: "top left",
            autoclose: true,
            todayHighlight: true,
            format: 'yyyy-mm-dd',
        });
        var _this = this;
        $(ReactDOM.findDOMNode(this.refs.date)).on('changeDate', function(e) {
            _this.handleChange(e);
        })
    }
    getData(){
        fetch(this.props.endpoint, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
        .then((resp) => {
            if (resp.status == 200){
                return resp.json()
            }
        })
        .then((data) => {
            this.setStateFromGet(data)
        });
    };

    setStateFromGet(data) {
        this.setState({
            username: data.username,
            email: data.email,
            bio: data.profile.bio || '',
            city: data.profile.location || '',
            birthdate: data.profile.birthdate || ''
        })
    }

    fetchData = () => {
        const self = this.state;
        fetch(this.props.endpoint, {
            method: "PUT",
            dataType: "JSON",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              'Accept': 'application/json'
            },
            body: JSON.stringify({
                'id': self.id,
                'username': self.username,
                'email': self.email,
                'profile': {
                    'bio' : self.bio,
                    'location': self.city,
                    'birthdate': self.birthdate
                }
            })
        })
        .then((resp) => {return resp.json()})
        .then((data) => {console.log(data)})
        .catch((error) => { console.log(error, "catch the hoop")})
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        return (
            <React.Fragment>
                <CookiesProvider>
                    <ImageComponent></ImageComponent>
                </CookiesProvider>
            <div className='modal-body'>
                <form>
                    <div className='form-group'>
                        <label htmlFor="username">Username</label>
                        <input type="text" name='username' className="form-control" id="inputUsername" value={this.state.username} onChange={this.handleChange} placeholder="example@email.com"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="text" name='email' readOnly className="form-control-plaintext" id="staticEmail" value={this.state.email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea id='bio' name='bio' className="form-control" onChange={this.handleChange} rows="3" value={this.state.bio}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" name='city' className="form-control" id="city" onChange={this.handleChange} placeholder="Your location" value={this.state.city}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthdate">Birth date</label>
                      <input ref='date' id='birthdate' type="text" name='birthdate' className="form-control" onChange={this.handleChange} value={this.state.birthdate}/><span className="input-group-addon"><i className="glyphicon glyphicon-th"></i></span>
                    </div>

                </form>
            </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button onClick={this.fetchData} id="change_profile_btn" type="button" className="btn btn-primary">Save changes</button>
              </div>
            </React.Fragment>
        );
    }

}



export default ProfileForm;
