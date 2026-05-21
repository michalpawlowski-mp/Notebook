let notes = [];
let editNoteId = null;

const notesContainer = document.getElementById("notesContainer");
const noteDialog = document.getElementById("noteDialog");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const dialogTitle = document.getElementById("dialogTitle");
const noteForm = document.getElementById("noteForm");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const addNoteBtn = document.getElementById("addNoteBtn");
const closeDialogBtn = document.getElementById("closeDialogBtn");
const cancelDialogBtn = document.getElementById("cancelDialogBtn");

const loadNotes = () => JSON.parse(localStorage.getItem("notes") || "[]");
const saveNotes = () => localStorage.setItem("notes", JSON.stringify(notes));
const closeNoteDialog = () => noteDialog.close();
const today = () => new Date().toLocaleDateString("pl-PL");

const saveNote = (event) => {
  event.preventDefault();

  const [title, content] = [titleInput, contentInput].map((el) => el.value.trim());

  if (editNoteId) {
    const noteIndex = notes.findIndex((note) => note.id === editNoteId);
    notes[noteIndex] = {
      ...notes[noteIndex],
      date: today(),
      title,
      content,
    };
  } else {
    notes.unshift({
      id: Date.now().toString(),
      date: today(),
      title,
      content,
    });
  }

  closeNoteDialog();
  saveNotes();
  renderNotes();
};

const deleteNote = (noteId) => {
  notes = notes.filter((note) => note.id !== noteId);
  saveNotes();
  renderNotes();
};

const renderNotes = () => {
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    notesContainer.classList.add("notes-grid--empty");
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>Brak notatek</h2>
        <p>Dodaj swoją pierwszą notatkę!</p>
      </div>
    `;
    return;
  }

  notesContainer.classList.remove("notes-grid--empty");

  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.dataset.id = note.id;

    const header = document.createElement("div");
    header.className = "note-header";

    const title = document.createElement("h3");
    title.className = "note-title";
    title.textContent = note.title;

    const date = document.createElement("h4");
    date.className = "note-date";
    date.textContent = note.date;

    header.appendChild(title);
    header.appendChild(date);

    const content = document.createElement("p");
    content.className = "note-content";
    content.textContent = note.content;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✏️";
    editBtn.title = "Edytuj notatkę";
    editBtn.addEventListener("click", () => openNoteDialog(note.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Usuń notatkę";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(actions);

    notesContainer.appendChild(card);
  });
};

const openNoteDialog = (noteId = null) => {
  const noteToEdit = noteId ? notes.find((note) => note.id === noteId) : null;

  editNoteId = noteId;
  dialogTitle.textContent = noteId ? "Edytuj notatkę" : "Dodaj nową notatkę";
  titleInput.value = noteToEdit?.title ?? "";
  contentInput.value = noteToEdit?.content ?? "";

  noteDialog.showModal();
  titleInput.focus();
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggleBtn.textContent = "🌞";
  } else {
    document.body.classList.remove("dark-theme");
    themeToggleBtn.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
};

notes = loadNotes();
renderNotes();

noteForm.addEventListener("submit", saveNote);
addNoteBtn.addEventListener("click", () => openNoteDialog());
closeDialogBtn.addEventListener("click", closeNoteDialog);
cancelDialogBtn.addEventListener("click", closeNoteDialog);

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-theme");
  applyTheme(isDark ? "light" : "dark");
});

applyTheme(localStorage.getItem("theme") || "light");
