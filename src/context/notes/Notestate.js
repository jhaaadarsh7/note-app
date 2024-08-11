import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)



  const getNotes = async () => {
    try {
      // API Call 
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVhMzhkZjMwZjM3NTEwMzc1NGJmNWMwIn0sImlhdCI6MTcwNTkyNzgxM30.pUAG2PYZF8_cKObXzfsXLhHJ2Bbw5Ub5onTO2GNEVJ4' // Replace with your actual auth token
        }
      });
  
      if (!response.ok) {
        // Handle non-successful responses (e.g., 4xx or 5xx status codes)
        throw new Error(`Failed to fetch notes. Status: ${response.status}`);
      }
  
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error('Error fetching notes:', error.message);
      // You might want to set an error state or show an error message to the user
    }
  };
  

  const addNote = async (title, description, tag) => {
    try {
        console.log('Before fetch');
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVhMzhkZjMwZjM3NTEwMzc1NGJmNWMwIn0sImlhdCI6MTcwNTkyNzgxM30.pUAG2PYZF8_cKObXzfsXLhHJ2Bbw5Ub5onTO2GNEVJ4'
            },
            body: JSON.stringify({ title, description, tag })
        });
        console.log('After fetch');

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`Failed to add note. Status: ${response.status}`);
        }

        const note = await response.json();
        setNotes(notes.concat(note));
        return response;
    } catch (error) {
        console.error('Error adding note:', error.message);
        throw error;
    }
};


  // Delete a Note
  const deleteNote = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVhMzhkZjMwZjM3NTEwMzc1NGJmNWMwIn0sImlhdCI6MTcwNTkyNzgxM30.pUAG2PYZF8_cKObXzfsXLhHJ2Bbw5Ub5onTO2GNEVJ4"
      }
    });
    const json = response.json(); 
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API Call 
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVhMzhkZjMwZjM3NTEwMzc1NGJmNWMwIn0sImlhdCI6MTcwNTkyNzgxM30.pUAG2PYZF8_cKObXzfsXLhHJ2Bbw5Ub5onTO2GNEVJ4",
      },
      body: JSON.stringify({title, description, tag})
    });
    
    const json = await response.json(); 

     let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag; 
        break; 
      }
    }  
    setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )

}
export default NoteState;