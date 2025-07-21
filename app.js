// --- Main Tab switching
const diaryTab = document.getElementById('tab-diary');
const healthTab = document.getElementById('tab-health');
const memoTab = document.getElementById('tab-memo');
const diarySection = document.getElementById('diary-section');
const healthSection = document.getElementById('health-section');
const memoSection = document.getElementById('memo-section');

function showTab(tab) {
  [diaryTab, healthTab, memoTab].forEach(t=>t.classList.remove('active'));
  [diarySection, healthSection, memoSection].forEach(s=>s.style.display='none');
  if(tab==='diary') {diaryTab.classList.add('active');diarySection.style.display='';}
  if(tab==='health') {healthTab.classList.add('active');healthSection.style.display='';}
  if(tab==='memo') {memoTab.classList.add('active');memoSection.style.display='';}
}
diaryTab.onclick = ()=>showTab('diary');
healthTab.onclick = ()=>showTab('health');
memoTab.onclick = ()=>showTab('memo');
showTab('diary');

// --- Category Filter
const catBtns = Array.from(document.querySelectorAll('.cat-btn'));
let selectedCat = "All";
catBtns.forEach(btn => {
  btn.onclick = () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCat = btn.dataset.cat;
    updateWhTagFilters();
    renderDiaryEntries();
  };
});

// --- WH Tag Filter
const whTags = ['All','Planning','In Progress','Completed','English Study'];
const whTagFiltersDiv = document.getElementById('wh-tag-filters');
let selectedWhTag = "All";
function updateWhTagFilters() {
  if (selectedCat === "Working Holiday") {
    whTagFiltersDiv.style.display = "";
    whTagFiltersDiv.innerHTML = whTags.map(
      tag => `<button class="wh-tag-btn${tag==="All"?" active":""}" data-wh="${tag}">${tag}</button>`
    ).join('');
    Array.from(whTagFiltersDiv.querySelectorAll('.wh-tag-btn')).forEach(btn => {
      btn.onclick = () => {
        Array.from(whTagFiltersDiv.querySelectorAll('.wh-tag-btn')).forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        selectedWhTag = btn.dataset.wh;
        renderDiaryEntries();
      }
    });
    selectedWhTag = "All";
  } else {
    whTagFiltersDiv.style.display = "none";
    selectedWhTag = "All";
  }
}
updateWhTagFilters();

// --- Diary Board
const diaryForm = document.getElementById('diary-form');
const diaryCat = document.getElementById('diary-category');
const diaryTitleGroup = document.getElementById('title-input-group');
let diaryTitle = document.getElementById('diary-title');
const diaryEntriesDiv = document.getElementById('diary-entries');
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries_en')) || [];

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

function saveDiaryEntries() {
  localStorage.setItem('diaryEntries_en', JSON.stringify(diaryEntries));
}
function renderDiaryEntries() {
  diaryEntriesDiv.innerHTML = '';
  diaryEntries.forEach((e, i) => {
    if (selectedCat !== "All" && e.category !== selectedCat) return;
    if (selectedCat === "Working Holiday" && selectedWhTag !== "All" && e.title !== selectedWhTag) return;
    const div = document.createElement('div');
    div.className = 'entry';
    const header = document.createElement('div');
    header.className = 'entry-header';

    const cat = document.createElement('span');
    cat.className = 'entry-category';
    cat.textContent = e.category;

    if (e.category === "Working Holiday") {
      const tag = document.createElement('span');
      tag.className = 'entry-tag';
      tag.textContent = `[${e.title}]`;
      header.appendChild(cat);
      header.appendChild(tag);
    } else {
      const title = document.createElement('span');
      title.className = 'entry-title';
      title.textContent = e.title;
      header.appendChild(cat);
      header.appendChild(title);
    }

    const date = document.createElement('span');
    date.className = 'entry-date';
    date.textContent = new Date(e.date).toLocaleString('en-US');
    header.appendChild(date);

    const content = document.createElement('div');
    content.className = 'entry-content';
    content.textContent = e.content;

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editDiaryEntry(i);
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteDiaryEntry(i);
    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);

    div.appendChild(header);
    div.appendChild(content);
    div.appendChild(buttons);

    diaryEntriesDiv.appendChild(div);
  });
}
function addDiaryEntry(e) {
  e.preventDefault();
  diaryEntries.unshift({
    category: diaryCat.value,
    title: diaryTitle.value,
    content: document.getElementById('diary-content').value,
    date: new Date()
  });
  saveDiaryEntries();
  renderDiaryEntries();
  diaryForm.reset();
  updateTitleInput();
}
function editDiaryEntry(idx) {
  const e = diaryEntries[idx];
  if (e.category === "Working Holiday") {
    const newTag = prompt('New tag (Planning/In Progress/Completed/English Study):', e.title);
    if (newTag === null) return;
    const newContent = prompt('New content:', e.content);
    if (newContent === null) return;
    diaryEntries[idx].title = newTag;
    diaryEntries[idx].content = newContent;
  } else {
    const newTitle = prompt('New title:', e.title);
    if (newTitle === null) return;
    const newContent = prompt('New content:', e.content);
    if (newContent === null) return;
    const newCategory = prompt('New category (General/Health/Schedule/Record/Chat/Working Holiday):', e.category);
    if (newCategory === null) return;
    diaryEntries[idx].title = newTitle;
    diaryEntries[idx].content = newContent;
    diaryEntries[idx].category = newCategory;
  }
  saveDiaryEntries();
  renderDiaryEntries();
}
function deleteDiaryEntry(idx) {
  if (confirm('Delete this entry?')) {
    diaryEntries.splice(idx, 1);
    saveDiaryEntries();
    renderDiaryEntries();
  }
}
diaryForm.addEventListener('submit', addDiaryEntry);

// --- Health Check Board
const healthForm = document.getElementById('health-form');
const healthEntriesDiv = document.getElementById('health-entries');
const healthMemo = document.getElementById('health-memo');
let healthEntries = JSON.parse(localStorage.getItem('healthEntries_en')) || [];

function saveHealthEntries() {
  localStorage.setItem('healthEntries_en', JSON.stringify(healthEntries));
}
function renderHealthEntries() {
  healthEntriesDiv.innerHTML = '';
  healthEntries.forEach((e, i) => {
    const div = document.createElement('div');
    div.className = 'health-entry';
    const header = document.createElement('div');
    header.className = 'health-header';
    const date = document.createElement('span');
    date.className = 'health-date';
    date.textContent = new Date(e.date).toLocaleString('en-US');
    header.appendChild(date);

    const status = document.createElement('div');
    status.className = 'health-status';
    let statusArr = [];
    if (e.sleep) statusArr.push('Sleep');
    if (e.meal) statusArr.push('Meal');
    if (e.med) statusArr.push('Medication');
    if (e.mood) statusArr.push('Mood');
    if (e.exercise) statusArr.push('Exercise');
    status.textContent = statusArr.length ? 'Checked: ' + statusArr.join(', ') : 'No Check';

    const memo = document.createElement('div');
    memo.className = 'health-memo';
    memo.textContent = e.memo || '';

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editHealthEntry(i);
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteHealthEntry(i);
    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);

    div.appendChild(header);
    div.appendChild(status);
    div.appendChild(memo);
    div.appendChild(buttons);

    healthEntriesDiv.appendChild(div);
  });
}
function addHealthEntry(e) {
  e.preventDefault();
  const f = healthForm;
  healthEntries.unshift({
    sleep: f.sleep.checked,
    meal: f.meal.checked,
    med: f.med.checked,
    mood: f.mood.checked,
    exercise: f.exercise.checked,
    memo: healthMemo.value,
    date: new Date()
  });
  saveHealthEntries();
  renderHealthEntries();
  healthForm.reset();
}
function editHealthEntry(idx) {
  const e = healthEntries[idx];
  const newMemo = prompt('New memo:', e.memo || "");
  if (newMemo === null) return;
  healthEntries[idx].memo = newMemo;
  saveHealthEntries();
  renderHealthEntries();
}
function deleteHealthEntry(idx) {
  if (confirm('Delete this entry?')) {
    healthEntries.splice(idx, 1);
    saveHealthEntries();
    renderHealthEntries();
  }
}
healthForm.addEventListener('submit', addHealthEntry);

// --- Memo Board
const memoForm = document.getElementById('memo-form');
const memoEntriesDiv = document.getElementById('memo-entries');
let memoEntries = JSON.parse(localStorage.getItem('memoEntries_en')) || [];

function saveMemoEntries() {
  localStorage.setItem('memoEntries_en', JSON.stringify(memoEntries));
}
function renderMemoEntries() {
  memoEntriesDiv.innerHTML = '';
  memoEntries.forEach((e, i) => {
    const div = document.createElement('div');
    div.className = 'memo-entry';
    const header = document.createElement('div');
    header.className = 'memo-header';

    const title = document.createElement('span');
    title.className = 'memo-title';
    title.textContent = e.title;

    const date = document.createElement('span');
    date.className = 'memo-date';
    date.textContent = new Date(e.date).toLocaleString('en-US');
    header.appendChild(title);
    header.appendChild(date);

    const content = document.createElement('div');
    content.className = 'memo-content';
    content.textContent = e.content;

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editMemoEntry(i);
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteMemoEntry(i);
    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);

    div.appendChild(header);
    div.appendChild(content);
    div.appendChild(buttons);

    memoEntriesDiv.appendChild(div);
  });
}
function addMemoEntry(e) {
  e.preventDefault();
  memoEntries.unshift({
    title: document.getElementById('memo-title').value,
    content: document.getElementById('memo-content').value,
    date: new Date()
  });
  saveMemoEntries();
  renderMemoEntries();
  memoForm.reset();
}
function editMemoEntry(idx) {
  const e = memoEntries[idx];
  const newTitle = prompt('New title:', e.title);
  if (newTitle === null) return;
  const newContent = prompt('New memo:', e.content);
  if (newContent === null) return;
  memoEntries[idx].title = newTitle;
  memoEntries[idx].content = newContent;
  saveMemoEntries();
  renderMemoEntries();
}
function deleteMemoEntry(idx) {
  if (confirm('Delete this memo?')) {
    memoEntries.splice(idx, 1);
    saveMemoEntries();
    renderMemoEntries();
  }
}
memoForm.addEventListener('submit', addMemoEntry);

// --- First render
renderDiaryEntries();
renderHealthEntries();
renderMemoEntries();
