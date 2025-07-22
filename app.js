// --- Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyA5iUOC2ssspPcWiOUIufvcsSvxRKxq9tQ",
  authDomain: "seonyul-diary.firebaseapp.com",
  projectId: "seonyul-diary",
  storageBucket: "seonyul-diary.firebasestorage.app",
  messagingSenderId: "878348511022",
  appId: "1:878348511022:web:bed753af7c021cc44dfcbf"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Diary Firebase 저장 및 렌더
const diaryForm = document.getElementById('diary-form');
const diaryCat = document.getElementById('diary-category');
const diaryTitleGroup = document.getElementById('title-input-group');
let diaryTitle = document.getElementById('diary-title');
const diaryEntriesDiv = document.getElementById('diary-entries');

function updateTitleInput() {
  if (diaryCat.value === "Working Holiday") {
    diaryTitleGroup.innerHTML = `
      <select id="diary-title" required>
        <option value="Planning">Planning</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="English Study">English Study</option>
      </select>
    `;
  } else {
    diaryTitleGroup.innerHTML = `<input type="text" id="diary-title" placeholder="Title" required />`;
  }
  diaryTitle = document.getElementById('diary-title');
}
diaryCat.addEventListener('change', updateTitleInput);
updateTitleInput();

diaryForm.addEventListener('submit', async e => {
  e.preventDefault();
  const entry = {
    category: diaryCat.value,
    title: diaryTitle.value,
    content: document.getElementById('diary-content').value,
    date: new Date().toISOString()
  };
  await db.collection("diaryEntries").add(entry);
  diaryForm.reset();
  updateTitleInput();
  renderDiaryEntries();
});

async function renderDiaryEntries() {
  const snapshot = await db.collection("diaryEntries").orderBy("date", "desc").get();
  const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  diaryEntriesDiv.innerHTML = '';
  entries.forEach(entry => {
    const { category, title, content, date } = entry;
    const div = document.createElement('div');
    div.className = 'entry';

    const header = document.createElement('div');
    header.className = 'entry-header';

    const cat = document.createElement('span');
    cat.className = 'entry-category';
    cat.textContent = category;

    const dateEl = document.createElement('span');
    dateEl.className = 'entry-date';
    dateEl.textContent = new Date(date).toLocaleString('en-US');

    if (category === "Working Holiday") {
      const tag = document.createElement('span');
      tag.className = 'entry-tag';
      tag.textContent = `[${title}]`;
      header.appendChild(cat);
      header.appendChild(tag);
    } else {
      const titleEl = document.createElement('span');
      titleEl.className = 'entry-title';
      titleEl.textContent = title;
      header.appendChild(cat);
      header.appendChild(titleEl);
    }
    header.appendChild(dateEl);

    const contentEl = document.createElement('div');
    contentEl.className = 'entry-content';
    contentEl.textContent = content;

    div.appendChild(header);
    div.appendChild(contentEl);
    diaryEntriesDiv.appendChild(div);
  });
}

// 기본 실행
renderDiaryEntries();
