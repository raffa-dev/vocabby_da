import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      user: '',
      author: '',
      file: [],
      bookname: ''
    }
  }
  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  uploadText = event => {
    event.preventDefault();
    let stateData = this.state;
    if (stateData.email !== "" && stateData.password !== "") {
      const user = {
        user: stateData.user,
        author: stateData.author,
        file: stateData.file,
        bookname: stateData.bookname,
      };
      let config = { "Content-Type": "application/json" };
      axios.post('http://localhost:8000/api/v1/posttext', user, config)
        .then(response => {
          console.log(response.data)
        })
    }
  }

  uploadText = event => {
    event.preventDefault();
    let stateData = this.state;
    if (stateData.email !== "" && stateData.password !== "") {
      const user = {
        user: stateData.user,
        author: stateData.author,
        file: stateData.file,
        bookname: stateData.bookname,
      };
      let config = { "Content-Type": "application/json" };
      axios.post('http://localhost:8000/api/v1/posttext', user, config)
        .then(response => {
          console.log(response.data)
        })
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.uploadText}>
          <div className="App">
            Upload textfile:
        <div >
              <input type="text" onChange={this.handleChange} name="user" placeholder="Name of User" />
            </div>
            <div >
              <input type="text" onChange={this.handleChange} name="author" placeholder="Author" />
            </div>
            <div >
              <input type="text" onChange={this.handleChange} name="bookname" placeholder="Book Name" />
            </div>
            <div >
              <input type="textarea" onChange={this.handleChange} name="file" placeholder="Text" />
            </div>
            <div>
              <button type="submit">
                Submit
          </button>
            </div>
          </div>
        </form>


        {/* Stats */}
        <form onSubmit={this.handleSession}>
        <div>
          <button type="submit">
            Learn
          </button>
        </div>
        </form>
      </div>
    );
  }
}

export default App;
