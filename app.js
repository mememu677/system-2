<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SeonYul System Diary</title>
  <!-- Fonts: Goth-Punk (Creepster + Roboto Mono) -->
  <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
</head>
<body>
  <div class="container">
    <header>
      <h1>SeonYul System Diary</h1>
      <nav>
        <button id="tab-diary" class="tab active">Diary</button>
        <button id="tab-health" class="tab">Health Check</button>
        <button id="tab-memo" class="tab">Memo</button>
        <button id="tab-wh" class="tab">Working Holiday</button>
      </nav>
    </header>

    <!-- Diary Board -->
    <section id="diary-section">
      <form id="diary-form">
        <select id="diary-category">
          <option value="Diary">Diary</option>
          <option value="Working Holiday">Working Holiday</option>
        </select>
        <div id="title-input-group"></div>
        <textarea id="diary-content" placeholder="Content" required></textarea>
        <button type="submit">Save</button>
      </form>
      <div id="diary-entries"></div>
    </section>

    <!-- 추가 섹션들 (Health, Memo, WH) 여기에 배치 -->
  </div>

  <!-- 내 코드 -->
  <script src="app.js" defer></script>

  <script>
    // 탭 전환 스크립트 (기존 코드 유지)
    const tabs = { diary: 'diary-section', health: 'health-section', memo: 'memo-section', wh: 'wh-section' };
    Object.keys(tabs).forEach(key => {
      const btn = document.getElementById(`tab-${key}`);
      const sec = document.getElementById(tabs[key]);
      btn && btn.addEventListener('click', () => {
        Object.keys(tabs).forEach(k => document.getElementById(`tab-${k}`).classList.remove('active'));
        Object.values(tabs).forEach(id => { const el = document.getElementById(id); if(el) el.style.display='none'; });
        btn.classList.add('active');
        sec && (sec.style.display = '');
      });
    });
    // 초기 탭 설정
    document.getElementById('tab-diary').click();
  </script>

</body>
</html>

<!-- app.js -->
// --- Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyA5iUOC2ssspPcWiOUIufvcsSvxRKxq9tQ",
  authDomain: "seonyul-diary.firebaseapp.com",
  projectId: "seonyul-diary",
  storageBucket: "seonyul-diary.appspot.com",    // 수정된 부분
  messagingSenderId: "878348511022",
  appId: "1:878348511022:web:bed753af7c021cc44dfcbf"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Diary Firebase 저장 및 렌더
const diaryForm = document.getElementById('diary-form');
const diaryCat = document.getElementById('diary-category');
const diaryTitleGroup = document.getElementById('title-input-group');
let diaryTitle = null;
const diaryEntriesDiv = document.getElementById('diary-entries');

function updateTitleInput() {
  diaryTitleGroup.innerHTML = '';
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
  try {
    await db.collection("diaryEntries").add(entry);
    diaryForm.reset();
    updateTitleInput();
  } catch(err) {
    console.error("Firestore 저장 오류", err);
    alert('저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
  }
});

// 실시간 리스너로 자동 갱신
db.collection("diaryEntries")
  .orderBy("date", "desc")
  .onSnapshot(snapshot => {
    diaryEntriesDiv.innerHTML = '';
    snapshot.docs.forEach(doc => {
      const { category, title, content, date } = doc.data();
      const div = document.createElement('div'); div.className = 'entry';
      const header = document.createElement('div'); header.className = 'entry-header';
      const cat = document.createElement('span'); cat.className = 'entry-category'; cat.textContent = category;
      const dateEl = document.createElement('span'); dateEl.className = 'entry-date'; dateEl.textContent = new Date(date).toLocaleString('en-US');
      header.appendChild(cat);
      if (category === "Working Holiday") {
        const tag = document.createElement('span'); tag.className = 'entry-tag'; tag.textContent = `[${title}]`;
        header.appendChild(tag);
      } else {
        const titleEl = document.createElement('span'); titleEl.className = 'entry-title'; titleEl.textContent = title;
        header.appendChild(titleEl);
      }
      header.appendChild(dateEl);
      const contentEl = document.createElement('div'); contentEl.className = 'entry-content'; contentEl.textContent = content;
      div.appendChild(header);
      div.appendChild(contentEl);
      diaryEntriesDiv.appendChild(div);
    });
  });

