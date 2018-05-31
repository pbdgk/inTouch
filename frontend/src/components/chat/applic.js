class InputBox extends Component{

    render(){
        return(
            <textarea id='chat-message-input' name='user_message' class="msg-input" placeholder="Write message here ..."></textarea>
    )}
}


class ChatForm extends Component{

    state = {
        text: ''
    }
    render(){
        return(
        <div class="">
        <form class='send-form message-wrapper' action="." method='post'>
            <InputBox onChange={this.handleTextChange} text={this.state.text}/>
            <input id='chat-message-submit' class="btn btn-success send-btn" type="submit" value="OK">
        </form>
        </div>
    )}
    handleTextChange = (e) => {this.setState({text: e.target.value})
  };
}


class Messages extends Component{

    render(){
        var data = this.props.value;
        return(
          <div id='post-wrapper' className='post-wrapper'>
            {data.map(el => (
                    <Message key={uuid()} value={el}/>
              ))}
          </div>
         <ChatForm/>
      );
    }
}



class TodoApp extends Component {

  state = {
    text: '',
    todos: [
      {id: 0, text: 'apple'},
      {id: 1, text: 'orange'},
      {id: 2, text: 'banana'},
      {id: 3, text: 'apricot'},
      {id: 4, text: 'tangerine'},
      {id: 5, text: 'pomegranate'}
    ]
  };

  render() {
    return (
      <div style={this.styleA()}>
        <div style={this.styleB()}>
          <AddButton onClick={this.handleAddTodo(this.state.text)}/>
          <InputBox onChange={this.handleTextChange} text={this.state.text}/>
        </div>
        <ul>
          {
            this.state.todos.map((todoItem) => {
              return <TodoItem
                key={todoItem.id}
                id={todoItem.id}
                text={todoItem.text}
                handleRemove={this.handleRemove(todoItem.id)}/>
            })
          }
        </ul>
      </div>
    );
  };

  handleAddTodo = (text) => () => {

    this.setState({
      text: '',
      todos: this.state.todos.concat({
        id: this.state.todos.length,
        text: text
      })
    })
  };

  handleTextChange = (e) => {

    this.setState({text: e.target.value})
  };

  handleRemove = (id) => () => {

    this.setState({
      todos: this.state.todos.filter((todoItem) => {
        return todoItem.id !== id
      })
    })
  };

  styleA() {
    return {
      padding: '1rem',
      width: '100%',
      height: '100vh',
      backgroundColor: '#ccc',
    }
  }

  styleB() {
    return {
      display: 'flex'
    }
  }
}

class AddButton extends React.Component {

  render() {
    return <div>
      <button onClick={this.props.onClick} style={this.styleA()}>ADD</button>
      <br/>
    </div>
  }

  styleA() {
    return {
      padding: '0 1.5rem',
      height: 36,
      fontSize: '0.85rem'
    }
  }
}

class InputBox extends React.Component {

  render() {
    return <div>
      <input onChange={this.props.onChange} value={this.props.text} style={this.styleA()}/>
      <br/>
    </div>
  }

  styleA() {
    return {
      height: 30
    }
  }
}

class TodoItem extends React.Component {

  state = {
    showUpdateStyle: false
  };

  render() {
    return <li>
      {this.props.text}
      <button onClick={this.props.handleRemove}>
        <i className="material-icons tiny"}>clear</i>
      </button>
    </li>
  }
}

React.render(<TodoApp />, document.body);
