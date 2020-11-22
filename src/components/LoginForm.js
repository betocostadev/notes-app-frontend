import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './LoginForm.css'
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory()

  const handleSubmit = (event) => {
    event.preventDefault()
    login({ username, password })
    history.push('/')
  }

  const handleFields = (event) => {
    event.target.name === 'username-input'
      ? setUsername(event.target.value)
      : setPassword(event.target.value)
  }

  return (
    <div>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username-input">Username:</label>
          <input
            className="login-input"
            id="username-input"
            type="text"
            value={username}
            name="username-input"
            onChange={handleFields}
          />
        </div>
        <div>
          <label htmlFor="password-input">Password:</label>
          <input
            className="login-input"
            id="password-input"
            type="password"
            value={password}
            name="password-input"
            onChange={handleFields}
          />
        </div>
        <button type="submit" disabled={!username.length || !password.length}>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm
