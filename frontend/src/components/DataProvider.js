import React, { Component } from "react";
import PropTypes from "prop-types";


class WSocketBox extends Component{
    constructor(props){
        super(props)
        this.ws = this.addWs()
        this.state = {
          data: [],
          loaded: false,
          placeholder: "Loading...",
        };
        this.handleUpdate = this.handleUpdate.bind(this)
        this.updateState = this.updateState.bind(this)

    }

    componentWillUnmount() {
      this.ws.close()
    }

    handleUpdate(message){
        this.ws.send(JSON.stringify({'message': message}));
    }

    updateState = (message) =>{
        this.setState({data: [...this.state.data, message]})
    }

    addWs(){
        const wsUrl = 'ws://' + window.location.host + '/ws/chat/';
        let ws = new WebSocket(wsUrl)
        ws.onopen = e => console.log(e)
        ws.onmessage = e => this.updateState(JSON.parse(e.data).message)
        ws.onerror = e => console.log('error')
        ws.onclose = e => function(e) {
            var recTimeout = 3000
            console.error('Chat socket closed unexpectedly. Waiting ' + recTimeout);
            setTimeout(function(){start(websocketServerLocation)}, recTimeout);
            print('ok')
        };
        console.log(ws);
        return ws;
    }

}



class DataProvider extends Component {
    constructor(props){
        super(props)
        this.ws = this.addWs()
        this.state = {
          data: [],
          loaded: false,
          placeholder: "Loading...",
        };
        this.handleUpdate = this.handleUpdate.bind(this)
        this.updateState = this.updateState.bind(this)

    }
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired
  };

   componentDidMount() {
     this.fetchData();
    }

    componentWillUnmount() {
      this.ws.close()
    }

    handleUpdate(message){
        this.ws.send(JSON.stringify({'message': message}));
    }

    updateState = (message) =>{
        this.setState({data: [...this.state.data, message]})
    }

    addWs(){
        const wsUrl = 'ws://' + window.location.host + '/ws/chat/';
        let ws = new WebSocket(wsUrl)
        ws.onopen = e => console.log(e)
        ws.onmessage = e => this.updateState(JSON.parse(e.data).message)
        ws.onerror = e => console.log('error')
        ws.onclose = e => function(e) {
            var recTimeout = 3000
            console.error('Chat socket closed unexpectedly. Waiting ' + recTimeout);
            setTimeout(function(){start(websocketServerLocation)}, recTimeout);
            print('ok')
        };
        console.log(ws);
        return ws;
    }

    fetchData(){
        fetch(this.props.endpoint)
          .then(response => {
            if (response.status !== 200) {
              return this.setState({ placeholder: "Something went wrong" });
            }
            return response.json();
          })
          .then(data => {
              this.setState({data: data, loaded: true })});
    };

    render() {
        const { data, loaded, placeholder } = this.state
        return loaded ? this.props.render(data, this.handleUpdate): <p>placeholder</p>;
  }
}
export default DataProvider;
