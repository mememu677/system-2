// --- 탭 전환
const diaryTab = document.getElementById('tab-diary');
const healthTab = document.getElementById('tab-health');
const diarySection = document.getElementById('diary-section');
const healthSection = document.getElementById('health-section');

diaryTab.onclick = () => {
  diaryTab.classList.add('active');
  healthTab.classList.remove('active');
  diarySection.style.display = '';
  healthSection.style.display = 'none';
};
healthTab.onclick = () => {
  diaryTab.classList.remove('active');
  healthTab.classList.add('active');
  diarySection.style.display = 'none';
  healthSection.style.display = '';
};

// --- 다이어리 기능 ---
const diaryForm = document.getElementById('diary-form');
const diaryCat = document.getElementById('diary-category');
const diaryTitle = document.getElementById('diary-title');
const diaryContent = document.getElementById('diary-content');
const diaryEntriesDiv = document.getElementById('diary-entries');
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

function saveDiaryEntries() {
  localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
}

function renderDiaryEntries() {
  diaryEntriesDiv.innerHTML = '';
  diaryEntries.forEach((e, i) => {
    const div = document.createElement('div');
    div.className = 'entry';
    const header = document.createElement('div');
    header.className = 'entry-header';

    const cat = document.createElement('span');
    cat.className = 'entry-category';
    cat.textContent = e.category;

    const title = document.createElement('span');
    title.className = 'entry-title';
    title.textContent = e.title;

    const date = document.createElement('span');
    date.className = 'entry-date';
    date.textContent = new Date(e.date).toLocaleString('ko-KR');

    header.appendChild(cat);
    header.appendChild(title);
    header.appendChild(date);

    const content = document.createElement('div');
    content.className = 'entry-content';
    content.textContent = e.content;

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = '수정';
    editBtn.onclick = () => editDiaryEntry(i);
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = '삭제';
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
    content: diaryContent.value,
    date: new Date()
  });
  saveDiaryEntries();
  renderDiaryEntries();
  diaryForm.reset();
}

function editDiaryEntry(idx) {
  const e = diaryEntries[idx];
  const newTitle = prompt('새 제목을 입력하세요', e.title);
  if (newTitle === null) return;
  const newContent = prompt('새 내용을 입력하세요', e.content);
  if (newContent === null) return;
  const newCategory = prompt('새 카테고리(기본/건강/일정/기록/잡담)', e.category);
  if (newCategory === null) return;
  diaryEntries[idx].title = newTitle;
  diaryEntries[idx].content = newContent;
  diaryEntries[idx].category = newCategory;
  saveDiaryEntries();
  renderDiaryEntries();
}
function deleteDiaryEntry(idx) {
  if (confirm('정말 삭제하시겠습니까?')) {
    diaryEntries.splice(idx, 1);
    saveDiaryEntries();
    renderDiaryEntries();
  }
}
diaryForm.addEventListener('submit', addDiaryEntry);

// --- 건강체크 기능 ---
const healthForm = document.getElementById('health-form');
const healthEntriesDiv = document.getElementById('health-entries');
const healthMemo = document.getElementById('health-memo');
let healthEntries = JSON.parse(localStorage.getItem('healthEntries')) || [];

function saveHealthEntries() {
  localStorage.setItem('healthEntries', JSON.stringify(healthEntries));
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
    date.textContent = new Date(e.date).toLocaleString('ko-KR');
    header.appendChild(date);

    const status = document.createElement('div');
    status.className = 'health-status';
    let statusArr = [];
    if (e.sleep) statusArr.push('수면');
    if (e.meal) statusArr.push('식사');
    if (e.med) statusArr.push('약');
    if (e.mood) statusArr.push('기분');
    if (e.exercise) statusArr.push('운동');
    status.textContent = statusArr.length ? '체크: ' + statusArr.join(', ') : '체크없음';

    const memo = document.createElement('div');
    memo.className = 'health-memo';
    memo.textContent = e.memo || '';

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = '수정';
    editBtn.onclick = () => editHealthEntry(i);
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = '삭제';
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
  // 체크박스 항목은 prompt로 묻기 번거로우니, 메모만 빠르게 수정
  const newMemo = prompt('새 메모를 입력하세요', e.memo || "");
  if (newMemo === null) return;
  healthEntries[idx].memo = newMemo;
  saveHealthEntries();
  renderHealthEntries();
}
function deleteHealthEntry(idx) {
  if (confirm('정말 삭제하시겠습니까?')) {
    healthEntries.splice(idx, 1);
    saveHealthEntries();
    renderHealthEntries();
  }
}
healthForm.addEventListener('submit', addHealthEntry);

// 최초 렌더링
renderDiaryEntries();
renderHealthEntries();


