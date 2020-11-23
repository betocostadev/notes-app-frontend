import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router} from 'react-router-dom'
import './index.css'

import App from './App'

// axios
//   .get('http://localhost:3001/notes')
//   .then(response => {
//     const notes = response.data
//     console.log(notes)
// })

// const brokenPromise = axios.get('http://localhost:3001/foobar')
// console.log(brokenPromise)


ReactDOM.render(
  <Router>
    <App />
  </Router>,  document.getElementById('root')
)
