
import React, { Component } from "react";
import PropTypes from "prop-types";


class DataPost extends Component {

    constructor(props) {
        super(props)
        this.state = {suggestion: ""}
    }
  state = {
      data: [],
      loaded: false,
      placeholder: "Loading..."
    };
  componentDidMount() {
      this.fetchData();
  }

        fetchData = () => {
          fetch(this.props.endpoint, {
            method: "POST",
            dataType: "JSON",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            }
          })
          .then((resp) => {
            return  resp.json()

          })
          .then((data) => {
            this.setState({ suggestion: data.suggestion })
            console.log('dd')
          })
          .catch((error) => {
            console.log(error, "catch the hoop")
          })
        }

  render() {
    const { data, loaded, placeholder } = this.state;
    return loaded ? this.props.render(data) : <p>{placeholder}</p>;
  }
}
export default DataPost;
