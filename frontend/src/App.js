import React, { Component } from 'react';
import axios from 'axios';
import FileBase64 from 'react-file-base64';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import Modal from 'react-modal';
import { FaGrinAlt, FaLess } from "react-icons/fa";
import { FaGrimace } from "react-icons/fa";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 100
  }
};


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      user: 'Himanshu',
      author: '',
      genre: 'Fiction',
      year: "2000",
      publisher: "ABC",
      file: [],
      bookname: '',
      modalIsOpen: false,
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
      event: "",
      volume: 0,
      progress: 20,
      activityLength: 0,
      showMessage: false,
      error: '',
      errorColor: true,
      bookshelf: false,
      books: []
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal = event => {
    this.setState({ modalIsOpen: true });
    event.preventDefault();
    let stateData = this.state;
    const user = {
      username: stateData.user,
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/getlevel', user, config)
      .then(response => {
        this.setState({
          volume: response.data.level,
          isLoading: false
        })
      })
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleOnChange = (value) => {
    this.setState({
      volume: value
    })
    let stateData = this.state;
    const user = {
      username: stateData.user,
      level: value
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/postlevel', user, config)
      .then(response => {
        this.setState({ isLoading: false })
      })
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
      genre: stateData.genre,
      year: stateData.year,
      publisher: stateData.publisher,
      bookname: stateData.bookname,
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/posttext', user, config)
      .then(response => {
        console.log(response.data)
        this.setState({
          index: false, stats: true, words: false, activityPage: false, statsResponse: response.data.stats, username: response.data.username,
          bookCode: response.data.bookCode, isLoading: false,
          bookshelf: false
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
        this.setState({ index: false, stats: false, words: true, activityPage: false, wordList: response.data.words, isLoading: false, bookshelf: false })
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
        this.setState({ index: false, stats: false, words: false, activityPage: true, activity: response.data.activity, isLoading: false, bookshelf: false })
      })
  }

  openBookShelf = (event) => {
    event.preventDefault();
    let stateData = this.state;
    const users = {

    }
    this.setState({ isLoading: true })

    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/getbooks', users, config)
      .then(response => {
        this.setState({ index: false, stats: false, words: false, activityPage: false, isLoading: false, bookshelf: true, books: response.data })
      })
  }

  answerCheck = event => {
    event.preventDefault();
    this.setState({ event: event })
    let stateData = this.state;
    let selection;
    if (stateData.answer === "") {
      selection = 0
    } else {
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
        this.setState({ answer: "", progress: response.data.result.remaining, showMessage: true })
        this.setState({ error: "Hey you have given " + response.data.result.isCorrect + " answer for previous question", errorColor: response.data.result.isCorrect })

        if (response.data.result.remaining > 0) {
          this.getActivity(event)
        }
        else {
          alert("Hey you answered all questions for day 1")
        }
      })
  }
  render() {
    const randomColor = ['#fffeed']
    return (
      <div>
        <div style={{ opacity: this.state.showMessage ? 0.4 : 1, pointerEvents: this.state.showMessage ? 'none' : 'auto' }}>
          <header>
            <section>
              <a href="#" id="logo" target="_blank">Vocabby</a>
              <label htmlFor="toggle-1" className="toggle-menu"><ul><li></li> <li></li> <li></li></ul></label>
              <nav>
                <ul>
                  <li><a href="#logo" onClick={() => { this.setState({ index: true }) }}><i className="icon-home"></i>Home</a></li>
                  <li><a href="#books" onClick={this.openBookShelf}><i className="icon-gear"></i>Books</a></li>
                  <li><a href="#about"><i className="icon-user"></i>About</a></li>
                  <li><a href="#gallery"><i className="icon-picture"></i>Papers</a></li>
                  <li><a href="#level"><i className="icon-picture"></i>{this.state.user}</a>
                    <ul className="dropdown">
                      <li> <a href="#" onClick={this.openModal}>Select Level</a></li>
                    </ul></li>
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

                    <div >
                      <input type="text" id="password" onChange={this.handleChange} name="bookname" placeholder="Book Name" required/>
                    </div>
                    <div >
                      <input type="text" id="password" onChange={this.handleChange} name="author" placeholder="Author" required/>
                    </div>
                    <div >
                      <input type="text" id="password" onChange={this.handleChange} name="genre" placeholder="Genre (Optional)" />
                    </div>
                    <div >
                      <input type="text" id="password" onChange={this.handleChange} name="year" placeholder="Year (Optional)" />
                    </div>
                    <div >
                      <input type="text" id="password" onChange={this.handleChange} name="publisher" placeholder="Publisher (Optional)" />
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
                <div style={{ width: '80%', margin: '0px auto' }}>
                  <h1>Word Statistics</h1>
                  <div className="row">
                    <div className="column">
                      <div className="card" style={{ background: randomColor[Math.floor(Math.random() * randomColor.length)], height: 174, borderRadius: 30 }}>
                        <h4>Total Words</h4>
                        <h1>{this.state.statsResponse.totalWords}</h1>
                      </div>
                    </div>
                    <div className="column">
                      <div className="card" style={{ background: randomColor[Math.floor(Math.random() * randomColor.length)], height: 174, borderRadius: 30 }}>
                        <h4>Total Words with frequency more than 10</h4>
                        <h1>{this.state.statsResponse.totalAbove5}</h1>
                      </div>
                    </div>
                    <div className="column">
                      <div className="card" style={{ background: randomColor[Math.floor(Math.random() * randomColor.length)], height: 174, borderRadius: 30 }}>
                        <h4>Total Words with frequency more than 5</h4>
                        <h1>{this.state.statsResponse.totalAbove10}</h1>
                      </div>
                    </div>
                    <div className="column">
                      <div className="card" style={{ background: randomColor[Math.floor(Math.random() * randomColor.length)], height: 174, borderRadius: 30 }}>
                        <h4>Total Families</h4>
                        <h1>{this.state.statsResponse.totalFamilies}</h1>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <h2 style={{ marginBottom: 30 }}>Most 20 Frequent words</h2>
                    {this.state.statsResponse.mostFrequent.map((value, index) => {
                      return (
                        <div className="column" key={index}>
                          <div className="card" style={{ background: randomColor[Math.floor(Math.random() * randomColor.length)] }}>
                            <h3>{value[1]}</h3>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <form onSubmit={this.getWordList}>
                      <div style={{ marginBottom: 20 }}>
                        <button type="submit" className="button pulse">
                          Continue
                        </button>
                      </div>
                  </form>
                </div>
                :
                this.state.words === true ?
                  <div style={{ width: '80%', margin: '0px auto' }}>
                    <h1>Word List so that you can go through:</h1>
                    <div className="row">
                      {this.state.wordList.map((value, index) => {
                        return <div className="column" key={index}>
                          <div className="card" style={{ background: randomColor[Math.floor(Math.random() * randomColor.length)] }}>
                            <h3>{value}</h3>
                          </div>
                        </div>
                      })}
                    </div>
                    <form onSubmit={this.getActivity}>
                        <div style={{ marginBottom: 20 }}>
                          <button type="submit" className="button pulse">
                            Continue
                        </button>
                        </div>
                    </form>
                  </div>
                  :
                  this.state.activityPage === true ?
                    <div style={{ width: '80%', margin: '0 auto' }}>
                      <div id="progressbar" >
                        <div style={{ width: (this.state.wordList.length - this.state.progress) * 5 + "%" }}></div>
                      </div>
                      <br/>
                      <div className="card-activity" style={{ textAlign: 'left', padding: 30, borderRadius: 5 }}>
                      <h2 style={{marginBottom: 20}}>Choose a word which satisfies all the blanks</h2>
                        {this.state.activity.sentences.map((value, index) => {
                          return <h4 style={{ background: 'white', marginBottom: 20, borderRadius: 5, boxShadow: '0px 2px 4px 1px darkgrey', padding: 20, textTransform: "cap" }} key={index + Math.random()}> {value}</h4>
                        })}

                        <br />
                        <section style={{maxWidth: '100%'}}>
                          {this.state.activity.options.map((value, index) => {
                            return <button key={index} name="answer" onClick={() => { this.setState({ answer: index }) }}
                              style={this.state.answer === index ? { color: "white", background: 'blue', marginRight: 20, textTransform: "uppercase", fontWeight: "bold" } : 
                              { color: "red", marginRight: 20, textTransform: "uppercase", fontWeight: "bold", border: '1 px solid black', color: "blue", background: 'white', }}
                            >
                              {value}
                            </button>
                          })}
                        </section>
                      </div>
                      <br />
                      <form onSubmit={this.answerCheck}>
                        <div>
                          <div style={{ marginLeft: '40%' }}>
                            <button type="submit" className="button pulse">
                              Submit Answer
                        </button>
                          </div>
                        </div>
                      </form>
                    </div> : this.state.bookshelf === true ?
                      <div style={{ width: '80%', margin: '0 auto' }}>
                        <div className="row">
                          {this.state.books.map((value, index) => {
                            return <div className="column" key={index}>
                              <div className="card" style={{ background: randomColor[Math.floor(Math.random() * randomColor.length)] }}>
                                <h3>{value.bookname}</h3><br />
                                <h3>{value.author}</h3><br />
                                <h3>{value.genre}</h3><br />
                                <h3>Pages: {value.pages}</h3><br />
                                <h3>Rating: {value.star}</h3>
                              </div>
                            </div>
                          })}
                        </div>
                      </div>
                      : <div>Feature Coming Soon</div>
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
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >

            <h2 ref={subtitle => this.subtitle = subtitle}>Please select your current level</h2>

            <Slider
              value={this.state.volume}
              min={1}
              max={5}
              step={1}
              labels={{ 1: "Very Easy", 2: "Easy", 3: "Average", 4: "Hard", 5: "Super Hard" }}
              onChange={this.handleOnChange}
            />
            <button onClick={this.closeModal} style={{ marginTop: 40, marginLeft: 167 }}>Save</button>
          </Modal>
        </div>
        {
          this.state.showMessage === true ?
            <div id="snackbar" style={{
              backgroundColor:
                this.state.errorColor === true ? 'green' : 'red',
              bottom: 0,
              padding: 30
            }}>

              <div style={{ bottom: 0 }}>
                {this.state.errorColor === true ? <FaGrinAlt style={{ marginRight: 50 }} /> : <FaGrimace style={{ marginRight: 50 }} />}
                {this.state.error}
                <button style={{ marginLeft: 50 }} onClick={() => { this.setState({ showMessage: false }) }}>Continue</button>
              </div>
            </div> : null
        }


      </div>
    );
  }
}

export default App;
