import React from 'react';

export default class WSocketBox extends React.Component{
    constructor(props){
        super(props)
        this.ws = this.addWs()
        this.state = {
          data: this.props.value,
        };
        this.handleUpdate = this.handleUpdate.bind(this)
        this.updateState = this.updateState.bind(this)

    }

    componentWillUnmount() {
      this.ws.close()
      console.log('closed')
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
        return ws;
    }

    render(){
        return (this.props.render.data, this.handleUpdate)
    }

}
