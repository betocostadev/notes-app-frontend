import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link, Redirect
} from 'react-router-dom'
import noteService from './services/notes'
import loginService from './services/login'

import Note from './components/Note'
import NoteForm from './components/NoteForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Togglable from './components/Togglable'

import './App.css'

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [notifyType, setNotifyType] = useState(null)
  const [user, setUser] = useState(null)

  // useEffect(() => {
  //   console.log('effect')

  //   const eventHandler = response => {
  //     console.log('promise fulfilled')
  //     setNotes(response.data)
  //   }

  //   const promise = axios.get('http://localhost:3001/notes')
  //   promise.then(eventHandler)
  // }, [])

  const hook = () => {
    // console.log('effect')
    async function fetchNotes() {
      let initialNotes = await noteService.getAll()
      try {
        // console.log('promise fulfilled')
        setNotes(initialNotes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotes()
  }

  useEffect(hook, [])
  // console.log('render', notes.length, 'notes')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const clearNotificationState = () => {
    setTimeout(() => {
      setSuccessMessage(null)
      setErrorMessage(null)
      setNotifyType(null)
    }, 3800)
  }

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)

      setSuccessMessage(`Welcome ${user.username}!`)
      setNotifyType('success')
      clearNotificationState()

    } catch (error) {
      setErrorMessage('Wrong credentials')
      setNotifyType('error')
      clearNotificationState()
    }
  }

  const handleLogout = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    setUser(null)
    setSuccessMessage('Logout success!')
    setNotifyType('success')
    clearNotificationState()

    if (loggedUserJSON) {
      window.localStorage.removeItem('loggedNoteAppUser')
    }
  }

  const addNote = async (noteObject) => {
    try {
      noteFormRef.current.toggleVisibility()
      let newNote = await noteService.create(noteObject)
      setNotes(notes.concat(newNote))
      showNotification('add-success')
    } catch (error) {
      showNotification('add-error')
      console.log(error)
    }
  }

  const showNotification = (type, content) => {
    if (type === 'add-error') {
      setErrorMessage('Error adding a new note!')
      setNotifyType('error')
      clearNotificationState()
    }
    else if(type === 'note-not-found') {
      setErrorMessage(`The note '${content}' was already deleted from the server`)
      setNotifyType('error')
      clearNotificationState()
    }
    else if(type === 'add-success') {
      setSuccessMessage('note added!')
      setNotifyType('success')
      clearNotificationState()
    }
  }

  const toggleImportanceOf = id => {
    // const noteEndpoint = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(e => {
        console.log(e)
        showNotification('note-not-found', note.content)
        setNotes(notes.filter(n => n.id !== id))
        clearNotificationState()
      })
  }

  const removeNote = id => {
    const note = notes.find(n => n.id === id)
    noteService
      .remove(id)
      .then(() => {
        setNotes(notes.filter(n => n.id !== id))
        setSuccessMessage('note removed')
        setNotifyType('success')
        clearNotificationState()
      })
      .catch(e => {
        console.log(e)
        showNotification('note-not-found', note.content)
        setNotes(notes.filter(n => n.id !== id))
        clearNotificationState()
      })
  }

  const padding = {
    padding: 5
  }

  const noteFormRef = useRef()

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const noteList = notesToShow
    .map((note) => <Note key={note.id} toggleImportance={() => toggleImportanceOf(note.id)} deleteNote={() => removeNote(note.id)} note={note} />)

  // DOM
  return (
    <Router>
      <div className="page-links">
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ? <em style={padding}>{user.name}</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>

      <Switch>
        <Route path="/notes">
          <div className='app'>
            <h1>Notes App</h1>
            {
              errorMessage
                ? <Notification message={errorMessage} type={notifyType} />
                : successMessage
                  ? <Notification message={successMessage} type={notifyType} />
                  : null
            }
            {
              user === null
                ?
                <div>
                  <Togglable buttonLabel='login'>
                    <LoginForm login={handleLogin}
                    />
                  </Togglable>
                </div>
                :
                <div>
                  <p>{user.name} logged-in</p><button onClick={handleLogout}>Logout</button>
                  <Togglable buttonLabel='new note' ref={noteFormRef}>
                    <NoteForm createNote={addNote} />
                  </Togglable>
                </div>
            }

            <div>
              <button onClick={() => setShowAll(!showAll)}>
                show { showAll ? 'important' : 'all' }
              </button>
            </div>

            <ul className="note-list">
              { noteList }
            </ul>
          </div>
        </Route>

        <Route path="/users" render={() =>
          user ? <Users /> : <Redirect to="/login" />
        } />

        <Route path="/login">
          <div>
            <Togglable buttonLabel='login'>
              <LoginForm login={handleLogin}
              />
            </Togglable>
          </div>
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>

      <Footer />

    </Router>
  )
}

export default App
