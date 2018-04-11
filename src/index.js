document.addEventListener('DOMContentLoaded', () => {
  const appContent = $('#app-content')
  const url = "http://localhost:3000/api/v1/"
  const noteContainer = document.getElementById('note-container')
  const noteList = document.getElementById("note-list")
  let activeNote = null

  document.getElementById("create-note").addEventListener('click', e => {
    noteContainer.innerHTML = renderForm()
    const noteForm = document.getElementById('create-note-form')
    noteForm.addEventListener('submit', e => {
      e.preventDefault()
      let title = document.getElementById('new-note-title').value
      let body = document.getElementById('new-note-content').value
      fetch(url+'/notes', {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({title: title, body: body})
      }).then(r => r.json()).then(json => {
        noteContainer.innerHTML = renderNote(json);
        renderList();
      })
    })

  })
  function renderList() {
    fetch(url+'users/1').then(r => r.json()).then(r => {
      noteList.innerHTML = r.notes.map(note => renderListOption(note)).join('')
    })
  }

  renderList()

  noteContainer.addEventListener('click', e => {
    e.preventDefault()
    switch (e.target.id) {
      case 'edit-note':
        console.log("IT IS NOT A FORM")
        fetch(url+`notes/${activeNote}`).then(r => r.json()).then(note => {
          noteContainer.innerHTML = renderEditForm(note)
        })
        break;
      case 'submit-edit':
        let title = document.getElementById('edit-note-title').value
        let body = document.getElementById('edit-note-content').value
        fetch(url+`/notes/${activeNote}`, {
          method: "PATCH",
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({title: title, body: body})
        }).then(r => r.json()).then(json => {
          noteContainer.innerHTML = renderNote(json);
          renderList();
        })
        break;
      case 'delete-note':
        fetch(url+`/notes/${activeNote}`, {
          method: "DELETE"
        }).then(r => r.json()).then(e => {
          renderList(); 
          noteContainer.innerHTML = ""
        })
        break;
      default:

    }
  })

  noteList.addEventListener('click', e => {
    if (e.target.className === "list-option") {
      activeNote = e.target.id
      fetch(url+`notes/${e.target.id}`).then(r => r.json()).then(note => {
        noteContainer.innerHTML = renderNote(note);
        let edit = document.getElementById('edit-note')
        // edit.addEventListener('click', e => {
        //
        // })
      })
    }
  })

  function renderForm() {
    return `<form id="create-note-form" action="#" method="post">
      <label for="new-note-title">Title:</label>
      <input required type="text" id="new-note-title" name="new-note-title" placeholder="title"><br>
      <label for="new-note-content">Content:</label><br>
      <textarea id="new-note-content" rows="30" cols="50"></textarea><br>
      <input type="submit" value="Create New Note">
    </form>`
  }

  function renderEditForm(note) {
    return `<form id="edit-note-form" action="#" method="post">
      <input type="hidden" value="${note.id}" id="hidden-id">
      <label for="edit-note-title">Title:</label>
      <input required type="text" id="edit-note-title" name="new-note-title" value="${note.title}"><br>
      <label for="edit-note-content">Content:</label><br>
      <textarea id="edit-note-content" rows="30" cols="50">${note.body}</textarea><br>
      <button type="button" id="submit-edit">Submit Changes</button>
    </form>`
  }

  function renderNote(note) {
    return `
    <div class="note-div"id="${note.id}-note-div" data-noteid="${note.id}">
      <h1>${note.title}</h1>
      <h3>By ${note.user.name}</h3>
      <p>${note.body}</p>
      <button type="button" id="edit-note">Edit</button> <button type="button" id="delete-note">Delete</button>
    </div>
    `
  }

  function renderListOption(note) {
    return `
        <p class="list-option" id="${note.id}">${note.title}</p>
    `
  }

})
