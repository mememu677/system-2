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
    date.textContent = new Date(e.date).toLocaleString('ko-KR');
    header.appendChild(title);
    header.appendChild(date);
    const content = document.createElement('div');
    content.className = 'entry-content';
    content.textContent = e.content;
    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editDiaryEntry(i);
    const delBtn = document.createElement('button');
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

// You can add the rest here...