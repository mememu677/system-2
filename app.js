const form = document.getElementById('entry-form');
const titleInput = document.getElementById('entry-title');
const contentInput = document.getElementById('entry-content');
const entriesDiv = document.getElementById('entries');

// localStorage에서 불러오기 (없으면 빈 배열)
let entries = JSON.parse(localStorage.getItem('entries')) || [];

function saveEntries() {
  localStorage.setItem('entries', JSON.stringify(entries));
}

function renderEntries() {
  entriesDiv.innerHTML = '';
  entries.forEach((e, index) => {
    const div = document.createElement('div');
    div.className = 'entry';

    const header = document.createElement('div');
    header.className = 'entry-header';

    const title = document.createElement('div');
    title.className = 'entry-title';
    title.textContent = e.title;

    const date = document.createElement('div');
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

  entries[index].title = newTitle;
  entries[index].content = newContent;
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

// 최초 렌더링
renderEntries();
