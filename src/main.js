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
// 오디오
const carrotSound = new Audio('./src/sound/carrot_pull.mp3');
const bugSound = new Audio('./src/sound/bug_pull.mp3');
const bgSound = new Audio('./src/sound/bg.mp3');
const winSound = new Audio('./src/sound/game_win.mp3');
const pauseSound = new Audio('./src/sound/alert.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
function stopSound(sound) {
  sound.pause();
}
// 주요 변수
let maxItem;
const maxTime = 10;
let score = 0;

grassZone.addEventListener('click', (e) => onDelete(e));
startBtn.addEventListener('click', onPopDifficulty);

// TIMER 설정
let time = maxTime;
let interval;
function startTimer() {
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

// 게임 시작
function startGame() {
  playSound(bgSound);
  score = 0;
  time = maxTime;
  scoreBox.textContent = `${maxItem}`;
  timerBox.textContent = `00:${maxTime}`;
  buttonBox.innerHTML = `
  <button class="state-zone__btn pause-btn"><span>
  Pause</span><i class="fas fa-stop"></i></button>
  `;
  const pauseBtn = document.querySelector('.pause-btn');
  pauseBtn.addEventListener('click', onPause);

  addItem('carrot', './src/img/carrot.png', 0);
  addItem('bug', './src/img/bug.png', maxItem);

  startTimer();
}
// 아이템 랜덤하게 그리는 함수
function addItem(itemName, src, startIdx) {
  for (let i = 0; i < maxItem; i++) {
    const item = document.createElement('img');
    item.setAttribute('src', `${src}`);
    item.setAttribute('id', i + startIdx);
    item.className = `${itemName}`;
    const x = Math.floor(Math.random() * 93);
    const y = Math.floor(Math.random() * 90);
    item.style.top = `${y}%`;
    item.style.left = `${x}%`;
    itemZone.appendChild(item);
  }
}
function onPause() {
  playSound(pauseSound);
  stopSound(bgSound);
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
    e.target.matches('.btn-continue') ||
    e.target.parentNode.matches('.btn-continue')
  ) {
    playSound(bgSound);
    popupBackground.className = 'popup popup--none';
    startTimer();
  }
}

// 아이템 클릭에 따른 이벤트
function onDelete(e) {
  if (e.target.tagName === 'IMG') {
    const id = e.target.id;
    // Carrot 클릭
    if (e.target.matches('.carrot')) {
      const toBeDeleted = document.querySelector(`.carrot[id="${id}"]`);
      toBeDeleted.remove();
      score++;
      scoreBox.textContent = `${maxItem - score}`;
      if (score === maxItem) {
        playSound(winSound);
        onWin();
      }
      // Bug 클릭
    } else {
      playSound(bugSound);
      onLose();
    }
  }
}

function onWin() {
  stopSound(bgSound);
  playSound(carrotSound);
  stopTimer();
  popupBackground.className = 'popup';
  popup.innerHTML = `
  <button class="popup__btn btn-replay"><i class="fas fa-redo-alt"></i></button>
  <span class="popup__text">🎉 You Won 🎉</span>
  `;
  const replayBtn = document.querySelector('.btn-replay');
  replayBtn.addEventListener('click', (e) => onReplay(e));
}
function onLose() {
  stopSound(bgSound);
  stopTimer();
  popupBackground.className = 'popup';
  popup.innerHTML = `
  <button class="popup__btn btn-replay"><i class="fas fa-redo-alt"></i></button>
  <span class="popup__text">You Lost</span>
  `;
  const replayBtn = document.querySelector('.btn-replay');
  replayBtn.addEventListener('click', (e) => onReplay(e));
}

function onReplay(e) {
  if (
    e.target.matches('.btn-replay') ||
    e.target.parentNode.matches('.btn-replay')
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
  if (e.target.matches('.popup__level')) {
    if (e.target.matches('.level--easy')) {
      maxItem = 5;
    } else if (e.target.matches('.level--normal')) {
      maxItem = 10;
    } else {
      maxItem = 20;
    }
    popupBackground.className = 'popup popup--none';
    itemZone.innerHTML = ``;
    startGame();
  }
}
