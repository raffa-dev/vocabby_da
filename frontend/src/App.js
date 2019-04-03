import React, { Component } from 'react';
import axios from 'axios';
import FileBase64 from 'react-file-base64';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      user: '',
      author: '',
      file: [],
      bookname: '',
      index: true,
      stats: false,
      statsResponse: {},
      words: false,
      wordList: [],
      activityPage: false,
      activity: {},
      answer: ""
    }
  }
  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  uploadText = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      user: stateData.user,
      author: stateData.author,
      file: stateData.file,
      bookname: stateData.bookname,
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/posttext', user, config)
      .then(response => {
        this.setState({ index: false, stats: true, words: false, activityPage: false, statsResponse: response.data.stats })
      })
  }

  getFiles(files) {
    this.setState({ file: files })
  }

  getWordList = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      user: stateData.user,
      author: stateData.author,
      file: stateData.file,
      bookname: stateData.bookname,
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/getwordlist', user, config)
      .then(response => {
        this.setState({ index: false, stats: false, words: true, activityPage: false, wordList: response.data.words })
      })
  }

  getActivity = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      user: stateData.user,
      author: stateData.author,
      file: stateData.file,
      bookname: stateData.bookname,
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/getactivity', user, config)
      .then(response => {
        this.setState({ index: false, stats: false, words: false, activityPage: true, activity: response.data.activity })
      })
  }

  answerCheck = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      user: stateData.user,
      author: stateData.author,
      file: stateData.file,
      bookname: stateData.bookname,
      answer: stateData.answer,
      activity: stateData.activity
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/postactivity', user, config)
      .then(response => {
        console.log(response.data.isCorrect)
        console.log("New Activity Waiting and then change previous one with new one in loop")
      })
  }
  render() {
    return (
      <div>
        {
          this.state.index === true ?
            <form onSubmit={this.uploadText}>
              <div>
                Upload textfile:
                <div>
                  <input type="text" onChange={this.handleChange} name="user" placeholder="Name of User" />
                </div>
                <div >
                  <input type="text" onChange={this.handleChange} name="author" placeholder="Author" />
                </div>
                <div >
                  <input type="text" onChange={this.handleChange} name="bookname" placeholder="Book Name" />
                </div>
                <FileBase64
                  multiple={false}
                  onDone={this.getFiles.bind(this)} />
                <div>
                  <button type="submit">
                    Submit
              </button>
                </div>
              </div>
            </form>
            : this.state.stats === true ?
              <div>
                Difficult words: {this.state.statsResponse.difficult} <br />
                Number of words: {this.state.statsResponse.wordCount} <br />
                Level: {this.state.statsResponse.level} <br />
                Text Quality : {this.state.statsResponse.textQuality} <br />
                <form onSubmit={this.getWordList}>
                  <div>
                    <div>
                      <button type="submit">
                        Continue
                  </button>
                    </div>
                  </div>
                </form>
              </div>
              :
              this.state.words === true ?
                <div>
                  Word List so that you can go through:
               {this.state.wordList.map((value, index) => {
                    return <div key={index}>{value} <br /></div>
                  })}
                  <form onSubmit={this.getActivity}>
                    <div>
                      <div>
                        <button type="submit">
                          Continue
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                :
                this.state.activityPage === true ?
                  <div>
                    Sentences: <br />
                    {this.state.activity.sentences.map((value, index) => {
                      return <p key={index}>{index + 1} : {value}<br/></p>
                    })}
                    Options: <br />
                    {this.state.activity.options.map((value, index) => {
                      return <button key={index} name="answer" onClick={ () => {this.setState({answer: value})}}
                      style={this.state.answer === value? {color: "blue"}:{color:"red"}}
                      >
                        {value}
                      </button>
                    })}
                    <br />
                    <form onSubmit={this.answerCheck}>
                    <div>
                      <div>
                        <button type="submit">
                          Submit Answer
                        </button>
                      </div>
                    </div>
                  </form>
                  </div>
                  
                  :
                  <div>Feature Coming Soon</div>
        }
      </div>
    );
  }
}

export default App;
