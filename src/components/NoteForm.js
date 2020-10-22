import React, { useState } from 'react'
import './NoteForm.css'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: Math.random() > 0.5
    })

    setNewNote('')
  }

  return (
    <form className="note-form" onSubmit={addNote}>
      <input
        className="note-form-input"
        placeholder={'Add a note'}
        value={newNote}
        onChange={handleChange}
      />
      <button type="submit" disabled={newNote.length ? false : true}>save</button>
    </form>
  )
}

export default NoteForm
