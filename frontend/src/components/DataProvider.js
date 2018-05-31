import React, { Component } from "react";
import PropTypes from "prop-types";



class DataProvider extends Component {
    constructor(props){
        super(props)

        this.state = {
          data: [],
          loaded: false,
          placeholder: "Loading...",
        };


    }
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired
  };

   componentDidMount() {
     this.fetchData();
     this.addWs();
    }

    componentWillUnmount() {
      this.ws.close()
    }


    addWs(){
        const wsUrl = 'ws://' + window.location.host + '/ws/chat/';
        this.ws = new WebSocket(wsUrl)
        this.ws.onmessage = e => console.log(e)
        this.ws.onerror = e => console.log(e)
        this.ws.onclose = e => function(e) {
            var recTimeout = 3000
            console.error('Chat socket closed unexpectedly. Waiting ' + recTimeout);
            setTimeout(function(){start(websocketServerLocation)}, recTimeout);
            print('ok')
        };
    }

    fetchData(){
        fetch(this.props.endpoint)
          .then(response => {
            if (response.status !== 200) {
              return this.setState({ placeholder: "Something went wrong" });
            }
            return response.json();
          })
          .then(data => {this.setState({data: data, loaded: true })});
    };

    render() {
        const { data, loaded, placeholder } = this.state
        return loaded ? this.props.render(data): <p>placeholder</p>;
  }
}
export default DataProvider;
