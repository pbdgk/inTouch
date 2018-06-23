
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
        const token = cookies.get('csrftoken') || '';
        this.setState({ token: token });
    }

    fileChangedHandler = (event) => {
      this.setState({ selectedFile: event.target.files[0] })
    }
    uploadHandler = () => {
      const self = this.state;
        const formData = new FormData()
        formData.append('image', this.state.selectedFile)
        const url = `/api/v1/profiles/upload_image/${window.django.userId}/`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-CSRFTOKEN': self.token,
            },
            body: formData
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
