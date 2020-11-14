import React from 'react'
import { Link } from 'react-router-dom'
import './Note.css'

const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className={note.important ? 'note important' : 'note'}>
      <button className='note-button' onClick={toggleImportance}>{label}</button>
      <button className='delete-note-button' onClick={deleteNote}>X</button>
      <Link to={`/notes/${note.id}`}>{note.content}</Link>
    </li>
  )
}

export default Note
