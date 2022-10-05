const addBox = document.querySelector('.add-box'),
      popupBox = document.querySelector('.popup-box'),
      popupTitle = popupBox.querySelector('header p'),
      closeIcon = popupBox.querySelector('header i'),
      titleTag = popupBox.querySelector('input'),
      descTag = popupBox.querySelector('textarea'),
      addBtn = popupBox.querySelector('.note-btn')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December']
//getting the notes if they exist and parsing to JS object else passing it to an empty array to notes
const notes = JSON.parse(localStorage.getItem('notes') || '[]')
let isUpdate = false, updateId

addBox.addEventListener('click', () => {
    titleTag.focus()
    popupBox.classList.add('show')
})

closeIcon.addEventListener('click', () => {
    isUpdate = false
    titleTag.value = ''
    descTag.value = '' 
    popupBox.classList.remove('show')
    addBtn.innerText = 'Add Note'
    popupTitle.innerText = 'Add a New Note'
})

function showNotes(){
    document.querySelectorAll('.note').forEach(note => note.remove())
    notes.forEach((note, index) => {
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick='showMenus(this)' class='bx bx-dots-horizontal-rounded'></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class='bx bx-pencil'></i>Edit</li>
                                    <li onclick='deleteNote(${index})'><i class='bx bx-trash'></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`

    addBox.insertAdjacentHTML('afterend', liTag)
    }) 
}

showNotes()

function showMenus(elem){
    elem.parentElement.classList.add('show')
    document.addEventListener('click', e => {
        //removes show class from settings menu on document click
        if(e.target.tagName != 'I' || e.target != elem){
            elem.parentElement.classList.remove('show')
        }
    })
}

function deleteNote(noteId){
    let confirmDel = confirm('Are you sure you want to delete the note?')
    if(!confirmDel) return
    notes.splice(noteId, 1) //removes selected note from array
    //deleting from localStorage
    localStorage.setItem('notes', JSON.stringify(notes))
    showNotes()
}

function updateNote(noteId, title, description){
    updateId = noteId
    isUpdate = true
    addBox.click()
    titleTag.value = title
    descTag.value = description
    addBtn.innerText = 'Update Note'
    popupTitle.innerText = 'Update The Note' 
}

addBtn.addEventListener('click', e => {
    e.preventDefault();
    let noteTitle = titleTag.value,
    noteDesc = descTag.value

    if(noteTitle || noteDesc){
        //getting the current date
        let dateObj = new Date(),
        day = dateObj.getDate(),
        month = months[dateObj.getMonth()],
        year = dateObj.getFullYear()

        let noteInfo = {
            title: noteTitle, description: noteDesc,
            date: `${day} ${month}, ${year}`
        }
        if(!isUpdate){
            notes.push(noteInfo)
        }else{
            isUpdate = false
            notes[updateId] = noteInfo
        }
        localStorage.setItem('notes', JSON.stringify(notes))
        closeIcon.click()
        showNotes()
    }
})