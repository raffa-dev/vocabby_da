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
      answer: "",
      username: "",
      bookCode: "",
      isLoading: false,
      event : ""
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
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/posttext', user, config)
      .then(response => {
        console.log(response.data)
        this.setState({
          index: false, stats: true, words: false, activityPage: false, statsResponse: response.data.stats, username: response.data.username,
          bookCode: response.data.bookCode, isLoading: false
        })
      })
  }

  getFiles(files) {
    this.setState({ file: files })
  }

  getWordList = event => {
    event.preventDefault();
    let stateData = this.state;
    console.log(stateData.bookCode)
    const user = {
      username: stateData.user,
      bookCode: stateData.bookCode,
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/getwordlist', user, config)
      .then(response => {
        this.setState({ index: false, stats: false, words: true, activityPage: false, wordList: response.data.words, isLoading: false })
      })
  }

  getActivity = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      username: stateData.user,
      bookCode: stateData.bookCode,
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/getactivity', user, config)
      .then(response => {
        this.setState({ index: false, stats: false, words: false, activityPage: true, activity: response.data.activity, isLoading: false })
      })
  }

  answerCheck = event => {
    event.preventDefault();
    this.setState({event: event})
    let stateData = this.state;
    let selection;
    if (stateData.answer == ""){
      selection = 0
    }else{
      selection = stateData.answer
    }
    const user = {
      username: stateData.user,
      bookCode: stateData.bookCode,
      selection: selection,
      activityId: stateData.activity
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/postactivity', user, config)
      .then(response => {
        this.setState({answer: ""})
        alert ("Hey you have given " + response.data.result.isCorrect + " answer for previous question")
        console.log(response.data.result)
        if (response.data.result.remaining > 0){
          this.getActivity(event)
        }
        else{
         alert("Hey you answered all questions for day 1")
        }
      })
  }
  render() {
    return (
      <div>
        <header>
          <section>
            <a href="#" id="logo" target="_blank">Vocabby</a>

            <label htmlFor="toggle-1" className="toggle-menu"><ul><li></li> <li></li> <li></li></ul></label>

            <nav>
              <ul>
                <li><a href="#logo"><i className="icon-home"></i>Home</a></li>
                <li><a href="#services"><i className="icon-gear"></i>Books</a></li>
                <li><a href="#about"><i className="icon-user"></i>About</a></li>
                <li><a href="#gallery"><i className="icon-picture"></i>Papers</a></li>
              </ul>
            </nav>
          </section>
        </header>

        {
          this.state.index === true ?
            <div className="container">
              <section id="content">
                <form onSubmit={this.uploadText}>
                  <h1>Upload Text File:</h1>
                  <div>
                    <input type="text" id="password" onChange={this.handleChange} name="user" placeholder="Name of User" />
                  </div>
                  <div >
                    <input type="text" id="password" onChange={this.handleChange} name="author" placeholder="Author" />
                  </div>
                  <div >
                    <input type="text" id="password" onChange={this.handleChange} name="bookname" placeholder="Book Name" />
                  </div>
                  <FileBase64
                    multiple={false}
                    onDone={this.getFiles.bind(this)}
                  />
                  <div>
                    <input type="submit" value="Submit" />
                  </div>
                </form>
              </section>
            </div>

            : this.state.stats === true ?
              <div>
                <h1>Word Statistics</h1>
                <div className="row">
                  <div className="column">
                    <div className="card">
                      <h2>Total Words</h2>
                      <h3>{this.state.statsResponse.totalWords}</h3>
                    </div>
                  </div>
                  <div className="column">
                    <div className="card">
                      <h2>Total Words with frequency more than 10</h2>
                      <h3>{this.state.statsResponse.totalAbove5}</h3>
                    </div>
                  </div>
                  <div className="column">
                    <div className="card">
                      <h2>Total Words with frequency more than 5</h2>
                      <h3>{this.state.statsResponse.totalAbove10}</h3>
                    </div>
                  </div>
                  <div className="column">
                    <div className="card">
                      <h2>Total Families</h2>
                      <h3>{this.state.statsResponse.totalFamilies}</h3>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <h2>Most 20 Frequent words</h2>
                  {this.state.statsResponse.mostFrequent.map((value, index) => {
                    return (
                      <div className="column" key={index}>
                        <div className="card">
                          <h3>{value[1]}</h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <form onSubmit={this.getWordList}>
                  <section id="content">
                    <div>
                      <button type="submit">
                        Continue
                        </button>
                    </div>
                  </section>
                </form>
              </div>
              :
              this.state.words === true ?
                <div>
                  <h1>Word List so that you can go through:</h1>
                  <div className="row">
                    {this.state.wordList.map((value, index) => {
                      return <div className="column" key={index}>
                        <div className="card">
                          <h3>{value}</h3>
                        </div>
                      </div>
                    })}
                  </div>
                  <form onSubmit={this.getActivity}>
                    <section id="content">
                      <button type="submit">
                        Continue
                        </button>
                    </section>
                  </form>
                </div>
                :
                this.state.activityPage === true ?
                  <div>
                    <h1>Sentences:</h1>
                    <br />
                    {this.state.activity.sentences.map((value, index) => {
                      return <div className="card" key={index} style={{textAlign: 'left'}}>
                          <h3>{index + 1} : {value}</h3>
                      </div>
                    })}
                    <h3>Options:</h3> <br />
                    <section>
                      {this.state.activity.options.map((value, index) => {
                        return <button key={index} name="answer" onClick={() => { this.setState({ answer: index }) }}
                          style={this.state.answer === index ? { color: "blue", background:'olive' } : { color: "red" }}
                        >
                          {value}
                        </button>
                      })}
                    </section>
                    <br />
                    <form onSubmit={this.answerCheck}>
                      <div>
                        <div style={{marginLeft: '40%'}}>
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
        {this.state.isLoading ?
          <div className="overlay">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div> : null
        }
      </div>
    );
  }
}

export default App;
