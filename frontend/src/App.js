import React, { Component } from 'react';
import axios from 'axios';
import FileBase64 from 'react-file-base64';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import Modal from 'react-modal';
import Highlight from 'react-highlighter';
import Graph from '../src/Graph.js';

var LOCALHOST = '192.168.0.17'
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
      user: 'HP',
      username: "",

      // Current Book
      author: '',
      genre: 'Fiction',
      year: "2000",
      publisher: "ABC",
      bookname: '',
      bookCode: '',
      file: [],
      statsResponse: {},
      neighbourhood: {},
      neighbourhoodWc: {},
      
      // Session Handling
  	  wordNeighbors: [],
      wordList: [],
      activity: {},
      answer: "",
      event: "",
      volume: 0,
      progress: 20,
      showMessage: false,
      feedback: '',
      errorColor: true,
      remaining_words: 0,
      scrambledForm: [],
      scrambledActivity: [],
      selected_answer: "",
      activatedAnswer: "______",

      // UI Handling
      isLoading: false,
      modalIsOpen: false,
      activePage: "index",
  	  activeWordIndex: 0,

      // Index
      books: [],
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.pages = {"words": this.renderWords.bind(this),
                  "stats": this.renderStats.bind(this),
                  "index": this.renderIndex.bind(this),
                  "activity": this.renderActivity.bind(this),
                  "book": this.renderBook.bind(this),
                  // ""
                  "model": this.renderModel.bind(this),
                  "modelWc": this.renderModelWc.bind(this),
                  "bookshelf": this.renderBookShelf.bind(this)};
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
    axios.post('http://' + LOCALHOST + ':8080/api/v1/getlevel', user, config)
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
    axios.post('http://' + LOCALHOST + ':8080/api/v1/postlevel', user, config)
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
    axios.post('http://' + LOCALHOST + ':8080/api/v1/posttext', user, config)
      .then(response => {
        this.setState({activePage: "stats",
                       statsResponse: response.data.stats,
                       username: response.data.username,
                       bookCode: response.data.bookCode,
                       isLoading: false})
      })
  }

  getFiles(files) {
    this.setState({ file: files })
  }

  getActivity = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      username: stateData.user,
      bookCode: stateData.bookCode,
    };
    this.setState({ isLoading: true })
    this.setState({scrambledActivity: []})
    this.setState({scrambledForm: []})
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + LOCALHOST + ':8080/api/v1/getactivity', user, config)
      .then(response => {
        let total_word = [];
        if (response.data.activity.activityType === 1) {
          for (let i = 0; i < response.data.activity.options.length; i++) {
            const dic = {};
            dic[response.data.activity.options[i]] = i
            total_word.push(dic)
          }
          this.setState({scrambledActivity: total_word})
          }
        
        this.setState({activePage: "activity",
                       activity: response.data.activity,
                       progress: response.data.progress,
                       isLoading: false})
      })
  }

  openBookShelf = (event) => {
    event.preventDefault();
    let stateData = this.state;
    const users = {
      username: stateData.user,
    }
    this.setState({ isLoading: true })

    let config = { "Content-Type": "application/json" };
    axios.post('http://' + LOCALHOST + ':8080/api/v1/getbooks', users, config)
      .then(response => {
        this.setState({isLoading: false, activePage: "bookshelf", books: response.data })
      })
  }

  answerCheck = event => {
    event.preventDefault();
    this.setState({ event: event })
    let stateData = this.state;
    this.setState({ isLoading: true })
    let selection;
    if (stateData.answer === "") {
      selection = 0
    } else {
      selection = stateData.answer
    }

    if (stateData.activity.activityType === 1){
      let word = "";
      for (let i = 0; i < this.state.scrambledForm.length; i++) {
      word = word + Object.keys(this.state.scrambledForm[i])
      }
      selection = word
    }

    const user = {
      username: stateData.user,
      bookCode: stateData.bookCode,
      selection: selection,
      activityId: stateData.activity
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + LOCALHOST + ':8080/api/v1/postactivity', user, config)
      .then(response => {
        this.setState({ feedback: response.data.result.feedback, errorColor: response.data.result.isCorrect })
        this.setState({ answer: "", progress: response.data.result.remaining, showMessage: true })
        this.setState({ remaining_words: response.data.result.remaining, answer: selection })
      })
  }

  next_activity = (event) => {
    this.setState({ showMessage: false, answer: "" })
    if (this.state.remaining_words > 0) {
      let stateData = this.state;
      const user = {
        username: stateData.user,
        bookCode: stateData.bookCode,
      };
      this.setState({ isLoading: true, activatedAnswer: "______" })
      this.setState({scrambledActivity: []})
      this.setState({scrambledForm: []})
      let config = { "Content-Type": "application/json" };
      axios.post('http://' + LOCALHOST + ':8080/api/v1/getactivity', user, config)
        .then(response => {
          let total_word = [];
        if (response.data.activity.activityType === 1) {
          for (let i = 0; i < response.data.activity.options.length; i++) {
            const dic = {};
            dic[response.data.activity.options[i]] = i
            total_word.push(dic)
          }
          this.setState({scrambledActivity: total_word})
          }
          this.setState({activePage: "activity",
                         activity: response.data.activity,
                         progress: response.data.progress,
                         isLoading: false})
        })
    }
    else {
      alert("Hey you answered all questions for the day")
    }
  }

  openBook = (book) => {
    let stateData = this.state;
    const user = {
      username: stateData.user,
      author: book.author,
      bookCode: book.code,
      file: [],
      genre: book.gener,
      year: book.year,
      publisher: book.publisher,
      bookname: book.title,
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + LOCALHOST + ':8080/api/v1/getwordlist', user, config)
      .then(response => {
        this.setState({
          activePage: "book",
          wordList: response.data.words,
          progress: response.data.words.length,
          neighbourhood: response.data.neighbours,
          neighbourhoodWc: response.data.neighboursWc,
		      wordNeighbors: response.data.wordNeighbors,
          statsResponse: response.data.stats,
          author: book.author,
          genre: book.gener,
          year: book.year,
          publisher: book.publisher,
          bookname: book.title,
          bookCode: book.code,
          overallProgress: response.data.progress,
          isLoading: false
        })
      })
  }
  scrambledWord = (button) => {
    this.setState({
      scrambledForm: [...this.state.scrambledForm, button]
    })

    let filteredArray = this.state.scrambledActivity.filter(item => item !== button)
    this.setState({ scrambledActivity: filteredArray });
  }
  removeScrambledWord = (button) => {
    let filteredArray = this.state.scrambledForm.filter(item => item !== button)
    this.setState({ scrambledForm: filteredArray });
    this.setState({
      scrambledActivity: [...this.state.scrambledActivity, button]
    })
  }

   renderIndex() {
     return (
              <div className="container">
                <section id="content">
                  <form onSubmit={this.uploadText}>
                    <h1>Upload Text File:</h1>

                    <div >
                      <input type="text" id="password" onChange={this.handleChange} name="bookname" placeholder="Book Name" required />
                    </div>
                    <div >
                      <input type="text" id="password" onChange={this.handleChange} name="author" placeholder="Author" required />
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
      );
   }

  renderStats() {
    return (
            <div style={{ width: '80%', margin: '0px auto' }}>
                              <div className="row">
                                <div className="column">
                                  <div className="card" style={{borderRadius: 10 }}>
                                    <h4>Families</h4><br />
                                    <h2>{this.state.statsResponse.totalFamilies}</h2>
                                  </div>
                                </div>
							 </div>
                             <div className="row">
                                <div className="column">
                                  <div className="card" style={{borderRadius: 10 }}>
                                    <h4>Words</h4><br />
                                    <h2>{this.state.statsResponse.totalWords}</h2>
                                  </div>
                                </div>
                                <div className="column">
                                  <div className="card" style={{borderRadius: 10 }}>
                                    <h4>Words(freq. > 5)</h4><br />
                                    <h2>{this.state.statsResponse.totalAbove5}</h2>
                                  </div>
                                </div>
                                <div className="column">
                                  <div className="card" style={{borderRadius: 10 }}>
                                    <h4>Words(freq. > 10)</h4><br />
                                    <h2>{this.state.statsResponse.totalAbove10}</h2>
                                  </div>
                                </div>
                              </div>
            
                              <div className="row">
								<br />
								<br />
                                <h2 style={{ marginBottom: 30 }}>Frequent words</h2>
                                {this.state.statsResponse.mostFrequent.map((value, index) => {
                                  return (
                                    <div className="column" key={index}>
                                      <div className="card" style={{borderRadius: 10}}>
                                        <h4>{value[1]}</h4>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              <div>
                                  <button className="button pulse" onClick={() => {this.setState({activePage: "book"})}}>
                                    back 
                                  </button>
                              </div>
                            </div>
            
     );}

  renderBook() {
    return (
      <div className="container" >
        <h1 className="booktitle">{this.state.bookname}</h1>
        <h4 className="subtitle">by {this.state.author}</h4>
        <div id="progressbar" >
          <div style={{ width: this.state.overallProgress + "%" }}></div>
        </div>
        <div className="col-md-12">
          <div className="row card_ctr">
            <button className="button blue" onClick={() => {this.setState({activePage: "words"})}}> Learn </button>
            <button className="button green" onClick={() => {this.setState({activePage: "words"})}}> Practice </button>
          </div>
		  <br />
		  <br />
		  <br />
		  <div className="row card_ctr">
          	<div className="book_card card_content" onClick={() => {this.setState({activePage: "model"})}}>
				<div className="card_label"> LearnerModel</div>
			</div>
          	<div className="book_card card_content" onClick={() => {this.setState({activePage: "modelWc"})}}>
				<div className="card_label"> LearnerModel without children</div>
			</div>
          	<div className="book_card card_content" onClick={() => {this.setState({activePage: "stats"})}}>
				<div className="card_label"> Details </div>
			</div>
		  </div>
        </div>
        <div >
        </div>
      </div>
    );
  }

  renderModel() {
    return (
        <div className="container">
		    <fieldset className="container">
            <div className="graphContainer" >
                <Graph data={this.state.neighbourhood} />
            </div>
			</fieldset>
            <div className="row">
                <button className="button pulse" onClick={() => {this.setState({activePage: "book"})}}>
                    back 
                </button>
            </div>
        </div>

    )

  }


  renderModelWc() {
    return (
        <div className="container">
		    <fieldset className="container">
            <div className="graphContainer" >
                <Graph data={this.state.neighbourhoodWc} />
            </div>
			</fieldset>
            <div className="row">
                <button className="button pulse" onClick={() => {this.setState({activePage: "book"})}}>
                    back 
                </button>
            </div>
        </div>

    )
  }

  renderWords() {
    return (
              <div style={{ width: '80%', margin: '0px auto' }}>
              <h1>Session</h1>
		    		<fieldset className="container">
            		<div className="graphContainer" >
            		    <Graph data={this.state.wordNeighbors[this.state.activeWordIndex]} />
            		</div>
					</fieldset>
                    <div className="row">
                      {this.state.wordList.map((value, index) => {
                              return <button key={index} className="card" onClick={() => { this.setState({ activeWordIndex: index, })}}
                                style={this.state.activeWordIndex === index ? { color: 'white', background: 'yellow', marginRight: 20, textTransform: "uppercase", fontWeight: "bold", borderRadius: 20} :
                                  { color: "black", marginRight: 20, textTransform: "uppercase", border: '1 px solid black', background: 'white'}}
                              >
                            <h2>{value}</h2>
                              </button>
                            })}
                    </div>
                    <div className="row">
                        <button className="button pulse" onClick={() => {this.setState({activePage: "book"})}}>
                            back 
                        </button>
                        <button className="button pulse" onClick={this.getActivity}>
                          Start
                        </button>
                    </div>
                  </div>
    );
  }

  renderBookShelf() {
    return (
                      <div style={{ width: '80%', margin: '0 auto' }}>
                        <div className="row">
                          {this.state.books.map((value, index) => {
                            return <div className="col-md-3" key={index} onClick={() => { this.openBook(value) }}>
                              <div className="index_card card" style={{ borderRadius: 20, textAlign: 'left' }}>
								                <div className="index_card_title">
                                	<h3 style={{textAlign: 'center', color: 'white', fontWeight: '700'}}>{value.title}</h3><br />
								</div>
                                  <h5>Author: {value.author}</h5><br />
                                  <h5>Genre: {value.gener}</h5><br />
                                  <h5>Year: {value.year}</h5><br />
                                  <h5>Publisher: {value.publisher}</h5>
                                </div>
                            </div>
                          })}
                        </div>
                      </div>
    );
  }

  renderActivity() {
    return (
                    <div style={{ width: '80%', margin: '0 auto' }}>
                      <div id="progressbar" >
                        <div style={{ width: (this.state.wordList.length / this.state.progress) * 100 + "%" }}></div>
                        {/* <div style={{ width: this.state.progress + "%" }}></div> */}
                      </div>
                      <br />
                      {this.state.activity.activityType === 0 ?
                        <div className="card-activity" style={{ textAlign: 'left', padding: 30, borderRadius: 5 }}>
                          <h2 style={{ marginBottom: 20 }}>Choose a word which satisfies all the blanks</h2>
                          {this.state.activity.sentences.map((value, index) => {
			    //let replacedValue = value.replace("______", '<u style= {{fontWeight: "bold", color:"yellow"}}>this.state.activatedAnswer</u>'))
                            return <h4 style={{ background: 'white', marginBottom: 20, borderRadius: 5, boxShadow: '0px 2px 4px 1px darkgrey', padding: 20, textTransform: "cap" }} key={index + Math.random()}> {value.split("______")[0] }<u style= {{fontWeight: "bold", color:"lightseagreen"}}>{this.state.activatedAnswer}</u> {value.split("______")[1]}</h4>
                          })}
                        <br />
                          <section style={{ maxWidth: '100%' }}>
                            {this.state.activity.options.map((value, index) => {
                              return <button key={index} name="answer" onClick={() => { this.setState({ answer: index, selected_answer: value, activatedAnswer: value }) }}
                                style={this.state.answer === index ? { color: "white", background: 'blue', marginRight: 20, textTransform: "uppercase", fontWeight: "bold" } :
                                  { marginRight: 20, textTransform: "uppercase", fontWeight: "bold", border: '1 px solid black', color: "blue", background: 'white', }}
                              >
                                {value}
                              </button>
                            })}
                          </section>
                        </div> :
                        <div className="card-activity" style={{ textAlign: 'left', padding: 30, borderRadius: 5 }}>
                          <h2 style={{ marginBottom: 20 }}>Re-arrange the characters</h2>
                          <h3>{this.state.activity.sentences[0]}</h3><br />

                          {this.state.scrambledActivity.map((value, index) => {
                            return (
                              <button key={index + Math.random()} onClick={() => { this.scrambledWord(value) }}>{Object.keys(value)}</button>
                            )
                          })}

                          <br /><br />
                          {this.state.scrambledForm.map((value, index) => {
                            return (
                              <button key={index + Math.random()} onClick={() => { this.removeScrambledWord(value) }}>{Object.keys(value)}</button>
                            )
                          })}
                        </div>
                      }

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
                    </div> 
    );
  }

  renderHeader() {
    return (
          <header>
            <section>
              <a href="#" id="logo" target="_blank">Vocabby</a>
              <label htmlFor="toggle-1" className="toggle-menu"><ul><li></li> <li></li> <li></li></ul></label>
              <nav>
                <ul>
                  <li><a href="#books" onClick={this.openBookShelf}><i className="icon-gear"></i>Books</a></li>
                  <li><a href="#upload" onClick={() => { this.setState({ index: true }) }}><i className="icon-home"></i>Upload</a></li>
                  <li><a href="#graph" onClick={this.openBookShelf}><i className="icon-picture"></i>Graph</a></li>
                  <li><a href="#user"><i className="icon-picture"></i>{this.state.user}</a>
                    <ul className="dropdown">
                      <li> <a href="#" onClick={this.openModal}>Select Level</a></li>
                    </ul></li>
                </ul>
              </nav>

            </section>
          </header>
    );
  }

  renderModal() {
    return (
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
    );
  }

  renderFeedback() {
    return (
          this.state.showMessage === true ?
            <div id="snackbar" style={{
              backgroundColor:
                this.state.errorColor === true ? 'green' : 'red',
              bottom: 0,
              padding: 30
            }}>
              

              {this.state.errorColor === true ? "" :
                <React.Fragment>
                  {
                    this.state.feedback.length > 3 ? <h4>The word you chose is generaly used in following context.</h4>: null
                  }
                  
                  <br />
                  <h2 style={{color: "#fff"}}>
                    <Highlight
                      search={this.state.selected_answer}>{this.state.feedback}</Highlight>
                  </h2>
                  <br />
                </React.Fragment>
              }

              <div style={{ bottom: 0 }}>
                {this.state.errorColor === true ? "Good Job!! Correct Answer" : 'Sorry your answer is wrong.'}
                <button className="button pulse" style={{ float: 'right', background:'#0300dc' }} onClick={() => { this.next_activity() }}>Continue</button>
              </div>
            </div> : null
    );
  }

  render() {
    return (
      <div>
        <div style={{ opacity: this.state.showMessage ? 0.4 : 1, pointerEvents: this.state.showMessage ? 'none' : 'auto' }}>
          {this.renderHeader()}
          {this.pages[this.state.activePage]()}
          {this.state.isLoading ?
            <div className="overlay">
              <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div> : null
          }
          {this.renderModal() }
        </div>
        {this.renderFeedback()}
     </div>
    );
  }
}



export default App;
