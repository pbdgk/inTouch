
import React from "react";
import axios from 'axios';
import cookie from "react-cookie";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';


class ImageComponent extends React.Component{
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    componentWillMount() {
        const { cookies } = this.props;
        let token = cookies.get('csrftoken') || '';
        this.setState({ token });
    }

    fileChangedHandler = (event) => {
      this.setState({selectedFile: event.target.files[0]})
    }
    uploadHandler = () => {
        {console.log(this.state)}
        const formData = new FormData()
        formData.append('myFile', this.state.selectedFile)
        const url = `/api/profile/upload-image/${window.django.userId}/`;
        axios('/api/profile/upload-data/', {
            method: 'post',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Accept': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFTOKEN': this.state.token,
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log(response);
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            throw("Error: ",error);
        });
    }


    render(){
        return(
        <React.Fragment>
            <input type="file" name='profileimage' onChange={this.fileChangedHandler}></input>
            <button onClick={this.uploadHandler}>Upload!</button>
        </React.Fragment>
    )};

}

export default withCookies(ImageComponent);
