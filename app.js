const form = document.getElementById('entry-form');
const titleInput = document.getElementById('entry-title');
const contentInput = document.getElementById('entry-content');
const entriesDiv = document.getElementById('entries');
const catSelect = document.getElementById('entry-category');
const catFilter = document.getElementById('category-select');

// localStorage에서 불러오기 (없으면 빈 배열)
let entries = JSON.parse(localStorage.getItem('entries_v2')) || [];
let lastHealth = JSON.parse(localStorage.getItem('health_v2')) || null;

// --- 건강 체크 관련 ---
const healthForm = document.getElementById('health-form');
const lastHealthDiv = document.getElementById('last-health');
function renderHealth() {
  if (lastHealth) {
    let checked = [];
    if (lastHealth.sleep) checked.push('수면');
    if (lastHealth.meal) checked.push('식사');
    if (lastHealth.med) checked.push('약 복용');
    if (lastHealth.mood) checked.push('기분 기록');
    if (lastHealth.exercise) checked.push('운동');
    lastHealthDiv.textContent = '최근 건강기록: ' + checked.join(', ') + ' ('+ new Date(lastHealth.date).toLocaleDateString('ko-KR') + ')';
  } else {
    lastHealthDiv.textContent = '최근 건강기록 없음';
  }
}
healthForm.onsubmit = e => {
  e.preventDefault();
  lastHealth = {
    sleep: healthForm.sleep.checked,
    meal: healthForm.meal.checked,
    med: healthForm.med.checked,
    mood: healthForm.mood.checked,
    exercise: healthForm.exercise.checked,
    date: new Date()
  };
  localStorage.setItem('health_v2', JSON.stringify(lastHealth));
  renderHealth();
};
renderHealth();

// --- 다이어리 기능 ---
function saveEntries() {
  localStorage.setItem('entries_v2', JSON.stringify(entries));
}

function renderEntries() {
  const filter = catFilter.value;
  entriesDiv.innerHTML = '';
  entries.forEach((e, index) => {
    if (filter !== "전체" && e.category !== filter) return;

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
    editBtn.onclick = () => editEntry(index);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = '삭제';
    delBtn.onclick = () => deleteEntry(index);

    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);

    div.appendChild(header);
    div.appendChild(content);
    div.appendChild(buttons);

    entriesDiv.appendChild(div);
  });
}

function addEntry(e) {
  e.preventDefault();
  entries.unshift({
    title: titleInput.value,
    content: contentInput.value,
    category: catSelect.value,
    date: new Date()
  });
  saveEntries();
  renderEntries();
  form.reset();
}

function editEntry(index) {
  const e = entries[index];
  const newTitle = prompt('새 제목을 입력하세요', e.title);
  if (newTitle === null) return;
  const newContent = prompt('새 내용을 입력하세요', e.content);
  if (newContent === null) return;
  const newCategory = prompt('새 카테고리 입력(기본/건강/일정/기록/잡담)', e.category);
  if (newCategory === null) return;
  entries[index].title = newTitle;
  entries[index].content = newContent;
  entries[index].category = newCategory;
  saveEntries();
  renderEntries();
}

function deleteEntry(index) {
  if (confirm('정말 삭제하시겠습니까?')) {
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
  }
}

form.addEventListener('submit', addEntry);
catFilter.addEventListener('change', renderEntries);

// 최초 렌더링
renderEntries();

