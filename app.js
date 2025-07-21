// --- Main Tab switching
const diaryTab = document.getElementById('tab-diary');
const healthTab = document.getElementById('tab-health');
const memoTab = document.getElementById('tab-memo');
const whTab = document.getElementById('tab-wh');
const diarySection = document.getElementById('diary-section');
const healthSection = document.getElementById('health-section');
const memoSection = document.getElementById('memo-section');
const whSection = document.getElementById('wh-section');

function showTab(tab) {
  [diaryTab, healthTab, memoTab, whTab].forEach(t=>t.classList.remove('active'));
  [diarySection, healthSection, memoSection, whSection].forEach(s=>s.style.display='none');
  if(tab==='diary') {diaryTab.classList.add('active');diarySection.style.display='';}
  if(tab==='health') {healthTab.classList.add('active');healthSection.style.display='';}
  if(tab==='memo') {memoTab.classList.add('active');memoSection.style.display='';}
  if(tab==='wh') {whTab.classList.add('active');whSection.style.display='';}
}
diaryTab.onclick = ()=>showTab('diary');
healthTab.onclick = ()=>showTab('health');
memoTab.onclick = ()=>showTab('memo');
whTab.onclick = ()=>showTab('wh');
showTab('diary');

// --- Diary Board
const diaryForm = document.getElementById('diary-form');
const diaryTitle = document.getElementById('diary-title');
const diaryEntriesDiv = document.getElementById('diary-entries');
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries_goth')) || [];
function saveDiaryEntries() { localStorage.setItem('diaryEntries_goth', JSON.stringify(diaryEntries)); }
function renderDiaryEntries() {
  diaryEntriesDiv.innerHTML = '';
  diaryEntries.forEach((e, i) => {
    const div = document.createElement('div');
    div.className = 'entry';
    const header = document.createElement('div');
    header.className = 'entry-header';
    const title = document.createElement('span');
    title.className = 'entry-title';
    title.textContent = e.title;
    const date = document.createElement('span');
    date.className = 'entry-date';
    date.textContent = new Date(e.date).toLocaleString('en-US');
    header.appendChild(title);
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
    title: diaryTitle.value,
    content: document.getElementById('diary-content').value,
    date: new Date()
  });
  saveDiaryEntries();
  renderDiaryEntries();
  diaryForm.reset();
}
function editDiaryEntry(idx) {
  const e = diaryEntries[idx];
  const newTitle = prompt('New title:', e.title);
  if (newTitle === null) return;
  const newContent = prompt('New content:', e.content);
  if (newContent === null) return;
  diaryEntries[idx].title = newTitle;
  diaryEntries[idx].content = newContent;
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
let healthEntries = JSON.parse(localStorage.getItem('healthEntries_goth')) || [];
function saveHealthEntries() { localStorage.setItem('healthEntries_goth', JSON.stringify(healthEntries)); }
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
let memoEntries = JSON.parse(localStorage.getItem('memoEntries_goth')) || [];
function saveMemoEntries() { localStorage.setItem('memoEntries_goth', JSON.stringify(memoEntries)); }
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

// --- Working Holiday Board
const whForm = document.getElementById('wh-form');
const whTitle = document.getElementById('wh-title');
const whContent = document.getElementById('wh-content');
const whEntriesDiv = document.getElementById('wh-entries');
const whTagFiltersDiv = document.getElementById('wh-tag-filters');
const whTagBtns = Array.from(document.querySelectorAll('.wh-tag-btn'));
let whEntries = JSON.parse(localStorage.getItem('whEntries_goth')) || [];
let selectedWhTag = "All";
whTagBtns.forEach(btn => {
  btn.onclick = () => {
    whTagBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedWhTag = btn.dataset.wh;
    renderWhEntries();
  }
});
function saveWhEntries() { localStorage.setItem('whEntries_goth', JSON.stringify(whEntries)); }
function renderWhEntries() {
  whEntriesDiv.innerHTML = '';
  whEntries.forEach((e, i) => {
    if (selectedWhTag !== "All" && e.title !== selectedWhTag) return;
    const div = document.createElement('div');
    div.className = 'wh-entry';
    const header = document.createElement('div');
    header.className = 'wh-header';
    const tag = document.createElement('span');
    tag.className = 'wh-tag';
    tag.textContent = `[${e.title}]`;
    const date = document.createElement('span');
    date.className = 'wh-date';
    date.textContent = new Date(e.date).toLocaleString('en-US');
    header.appendChild(tag);
    header.appendChild(date);
    const content = document.createElement('div');
    content.className = 'wh-content';
    content.textContent = e.content;
    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editWhEntry(i);
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteWhEntry(i);
    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);
    div.appendChild(header);
    div.appendChild(content);
    div.appendChild(buttons);
    whEntriesDiv.appendChild(div);
  });
}
function addWhEntry(e) {
  e.preventDefault();
  whEntries.unshift({
    title: whTitle.value,
    content: whContent.value,
    date: new Date()
  });
  saveWhEntries();
  renderWhEntries();
  whForm.reset();
}
function editWhEntry(idx) {
  const e = whEntries[idx];
  const newTag = prompt('New tag (Planning/In Progress/Completed/English Study):', e.title);
  if (newTag === null) return;
  const newContent = prompt('New content:', e.content);
  if (newContent === null) return;
  whEntries[idx].title = newTag;
  whEntries[idx].content = newContent;
  saveWhEntries();
  renderWhEntries();
}
function deleteWhEntry(idx) {
  if (confirm('Delete this entry?')) {
    whEntries.splice(idx, 1);
    saveWhEntries();
    renderWhEntries();
  }
}
whForm.addEventListener('submit', addWhEntry);

// --- First render
renderDiaryEntries();
renderHealthEntries();
renderMemoEntries();
renderWhEntries();

