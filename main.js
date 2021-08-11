const background = document.querySelector('.background');
const grassZone = document.querySelector('.grass-zone');
const stateZoneBox = document.querySelector('.state-zone__box');
const itemZone = document.querySelector('.item-zone');
const popupBackground = document.querySelector('.popup');
const popup = document.querySelector('.popup__inner');
const scoreBox = document.querySelector('.score');
const timerBox = document.querySelector('.timer');
const buttonBox = document.querySelector('.button-box');
const startBtn = document.querySelector('.start-btn');

grassZone.addEventListener('click', (e) => onDelete(e));
startBtn.addEventListener('click', onPopDifficulty);

let maxItem;
const maxTime = 10;
let score = 0;

// TIMER 설정
let time = maxTime;
let interval;
function startTimer() {
  stopTimer();
  interval = setInterval(updateTimer, 1000);
}
function stopTimer() {
  clearInterval(interval);
}
function updateTimer() {
  time--;
  timerBox.textContent = `00:${time}`;
  if (time === 0) {
    stopTimer();
    onLose();
  }
}

function startGame() {
  score = 0;
  time = maxTime;
  scoreBox.textContent = `Score 0`;
  timerBox.textContent = `00:${maxTime}`;
  buttonBox.innerHTML = `
  <button class="state-zone__btn pause-btn"><span>
  Pause</span><i class="fas fa-stop"></i></button>
  `;
  const pauseBtn = document.querySelector('.pause-btn');
  pauseBtn.addEventListener('click', onPause);

  // 아이템 화면에 그리기
  for (let i = 0; i < maxItem; i++) {
    const carrot = document.createElement('img');
    carrot.setAttribute('src', './src/carrot.png');
    carrot.setAttribute('id', i);
    carrot.className = 'carrot';
    const x = Math.floor(Math.random() * 90);
    const y = Math.floor(Math.random() * 90);
    carrot.style.top = `${y}%`;
    carrot.style.left = `${x}%`;
    itemZone.appendChild(carrot);
  }
  for (let i = 0; i < maxItem; i++) {
    const bug = document.createElement('img');
    bug.setAttribute('src', './src/bug.png');
    bug.setAttribute('id', i + maxItem);
    bug.className = 'bug';
    const x = Math.floor(Math.random() * 90);
    const y = Math.floor(Math.random() * 90);
    bug.style.top = `${y}%`;
    bug.style.left = `${x}%`;
    itemZone.appendChild(bug);
  }
  startTimer();
}
function onPause() {
  stopTimer();
  popupBackground.className = 'popup';
  popup.innerHTML = `
      <button class="popup__btn btn-continue"><i class="fas fa-play"></i></button></button>
      <span class="popup__text">Continue?</span>
      `;
  const continueBtn = document.querySelector('.btn-continue');
  continueBtn.addEventListener('click', (e) => onContinue(e));
}
function onContinue(e) {
  if (
    e.target.className.includes('btn-continue') ||
    e.target.parentNode.className.includes('btn-continue')
  ) {
    popupBackground.className = 'popup popup--none';
    startTimer();
  }
}

// 아이템 클릭에 따른 이벤트
function onDelete(e) {
  if (e.target.tagName === 'IMG') {
    const id = e.target.id;
    // Carrot 클릭
    if (e.target.className.includes('carrot')) {
      const toBeDeleted = document.querySelector(`.carrot[id="${id}"]`);
      toBeDeleted.remove();
      score++;
      scoreBox.textContent = `Score ${score}`;
      if (score === maxItem) {
        stopTimer();
        popupBackground.className = 'popup';
        popup.innerHTML = `
        <button class="popup__btn btn-replay"><i class="fas fa-reply"></i></button>
        <span class="popup__text">You Won</span>
        `;
        const replayBtn = document.querySelector('.btn-replay');
        replayBtn.addEventListener('click', (e) => onReplay(e));
      }
      // Bug 클릭
    } else {
      onLose();
    }
  }
}
function onLose() {
  stopTimer();
  popupBackground.className = 'popup';
  popup.innerHTML = `
  <button class="popup__btn btn-replay"><i class="fas fa-reply"></i></button>
  <span class="popup__text">You Lost</span>
  `;
  const replayBtn = document.querySelector('.btn-replay');
  replayBtn.addEventListener('click', (e) => onReplay(e));
}

function onReplay(e) {
  if (
    e.target.className.includes('btn-replay') ||
    e.target.parentNode.className.includes('btn-replay')
  ) {
    onPopDifficulty();
  }
}

// 난이도 선정에 따른 Game 설정
function onPopDifficulty() {
  popupBackground.className = 'popup';
  popup.innerHTML = `
  <span class="popup__level-title">Difficulty</span>
  <div class="level-box">
    <button class="popup__level level--easy">Easy</button>
    <button class="popup__level level--normal">Normal</button>
    <button class="popup__level level--hard">Hard</button>
  </div>
        `;
  const levelBox = document.querySelector('.level-box');
  levelBox.addEventListener('click', (e) => selectLevel(e));
}
function selectLevel(e) {
  if (e.target.className.includes('popup__level')) {
    if (e.target.className.includes('level--easy')) {
      maxItem = 5;
    } else if (e.target.className.includes('level--normal')) {
      maxItem = 10;
    } else {
      maxItem = 20;
    }
    popupBackground.className = 'popup popup--none';
    itemZone.innerHTML = ``;
    startGame();
  }
}
