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

// --- 카테고리 필터
const catBtns = Array.from(document.querySelectorAll('.cat-btn'));
let selectedCat = "전체";
catBtns.forEach(btn => {
  btn.onclick = () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCat = btn.dataset.cat;
    updateWhTagFilters();
    renderDiaryEntries();
  };
});

// --- 워홀 태그 필터
const whTags = ['전체','계획수립','진행중','완료','영어공부'];
const whTagFiltersDiv = document.getElementById('wh-tag-filters');
let selectedWhTag = "전체";
function updateWhTagFilters() {
  if (selectedCat === "호주 워홀 계획") {
    whTagFiltersDiv.style.display = "";
    whTagFiltersDiv.innerHTML = whTags.map(
      tag => `<button class="wh-tag-btn${tag==="전체"?" active":""}" data-wh="${tag}">${tag}</button>`
    ).join('');
    // 버튼 이벤트 바인딩
    Array.from(whTagFiltersDiv.querySelectorAll('.wh-tag-btn')).forEach(btn => {
      btn.onclick = () => {
        Array.from(whTagFiltersDiv.querySelectorAll('.wh-tag-btn')).forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        selectedWhTag = btn.dataset.wh;
        renderDiaryEntries();
      }
    });
    selectedWhTag = "전체";
  } else {
    whTagFiltersDiv.style.display = "none";
    selectedWhTag = "전체";
  }
}
updateWhTagFilters();

// --- 다이어리 기능 ---
const diaryForm = document.getElementById('diary-form');
const diaryCat = document.getElementById('diary-category');
const diaryTitleGroup = document.getElementById('title-input-group');
let diaryTitle = document.getElementById('diary-title');
const diaryEntriesDiv = document.getElementById('diary-entries');

let diaryEntries = JSON.parse(localStorage.getItem('diaryEntriesV2')) || [];

function updateTitleInput() {
  if (diaryCat.value === "호주 워홀 계획") {
    diaryTitleGroup.innerHTML = `
      <select id="diary-title" required>
        ${whTags.slice(1).map(tag=>`<option value="${tag}">${tag}</option>`).join('')}
      </select>
    `;
  } else {
    diaryTitleGroup.innerHTML = `<input type="text" id="diary-title" placeholder="제목" required />`;
  }
  diaryTitle = document.getElementById('diary-title');
}
diaryCat.addEventListener('change', updateTitleInput);
updateTitleInput();

function saveDiaryEntries() {
  localStorage.setItem('diaryEntriesV2', JSON.stringify(diaryEntries));
}
function renderDiaryEntries() {
  diaryEntriesDiv.innerHTML = '';
  diaryEntries.forEach((e, i) => {
    // 카테고리 필터
    if (selectedCat !== "전체" && e.category !== selectedCat) return;
    // 워홀 태그 필터
    if (selectedCat === "호주 워홀 계획" && selectedWhTag !== "전체" && e.title !== selectedWhTag) return;

    const div = document.createElement('div');
    div.className = 'entry';
    const header = document.createElement('div');
    header.className = 'entry-header';

    const cat = document.createElement('span');
    cat.className = 'entry-category';
    cat.textContent = e.category;

    if (e.category === "호주 워홀 계획") {
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
    date.textContent = new Date(e.date).toLocaleString('ko-KR');
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
  if (e.category === "호주 워홀 계획") {
    const newTag = prompt('새 태그를 입력하세요 (계획수립/진행중/완료/영어공부)', e.title);
    if (newTag === null) return;
    const newContent = prompt('새 내용을 입력하세요', e.content);
    if (newContent === null) return;
    diaryEntries[idx].title = newTag;
    diaryEntries[idx].content = newContent;
  } else {
    const newTitle = prompt('새 제목을 입력하세요', e.title);
    if (newTitle === null) return;
    const newContent = prompt('새 내용을 입력하세요', e.content);
    if (newContent === null) return;
    const newCategory = prompt('새 카테고리(기본/건강/일정/기록/잡담/호주 워홀 계획)', e.category);
    if (newCategory === null) return;
    diaryEntries[idx].title = newTitle;
    diaryEntries[idx].content = newContent;
    diaryEntries[idx].category = newCategory;
  }
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
let healthEntries = JSON.parse(localStorage.getItem('healthEntriesV2')) || [];

function saveHealthEntries() {
  localStorage.setItem('healthEntriesV2', JSON.stringify(healthEntries));
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

renderDiaryEntries();
renderHealthEntries();
