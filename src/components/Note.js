import React from 'react'
import './Note.css'

const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className={note.important ? 'note important' : 'note'}>
      <button className='note-button' onClick={toggleImportance}>{label}</button>
      <button className='delete-note-button' onClick={deleteNote}>X</button>
      {note.content}
    </li>
  )
}

export default Note
