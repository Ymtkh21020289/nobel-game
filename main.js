import { scenario } from "./scenario.js";

const backlog = [];
let isLogOpen = false;
let currentEntry = null;

let textIndex = 0;
let current = "start";
const flags = {};
let isTyping = false;     // 今文字表示中か？
let typingTimer = null; // setInterval管理用

let isAuto = false;
let autoTimer = null;
const AUTO_WAIT = 1200; // 全文表示後の待ち時間(ms)

const bgImg = document.getElementById("bg");
const charaImg = document.getElementById("chara");

const titleDiv = document.getElementById("title");
const gameDiv = document.getElementById("game");

const nameBox = document.getElementById("nameBox");
const textDiv = document.getElementById("text");
const choicesDiv = document.getElementById("choices");

const logDiv = document.getElementById("log");
const logContent = document.getElementById("logContent");

const newGameBtn = document.getElementById("newGame");
const openLoadBtn = document.getElementById("openLoad");
const loadMenu = document.getElementById("loadMenu");
const toTitleBtn = document.getElementById("toTitle");
const autoBtn = document.getElementById("autoBtn");

// --------------------
// 基本ロジック
// --------------------
function checkCondition(choice) {
  if (choice.if && !flags[choice.if]) return false;
  if (choice.ifNot && flags[choice.ifNot]) return false;

  if (choice.ifValue) {
    const k = Object.keys(choice.ifValue)[0];
    if ((flags[k] || 0) < choice.ifValue[k]) return false;
  }
  if (choice.ifValueLess) {
    const k = Object.keys(choice.ifValueLess)[0];
    if ((flags[k] || 0) >= choice.ifValueLess[k]) return false;
  }
  return true;
}

function showScene(key) {
  const scene = scenario[key];
  current = key;
  textIndex = 0;

  // 背景
  if (scene.bg !== undefined) {
    bgImg.src = scene.bg ? "images/" + scene.bg : "";
  }

  // 立ち絵
  if (scene.chara !== undefined) {
    if (scene.chara === null) {
      charaImg.style.display = "none";
    } else {
      charaImg.src = "images/" + scene.chara;
      charaImg.style.display = "block";
    }
  }

  choicesDiv.innerHTML = "";
  const entry = scene.texts[textIndex];
  updateName(entry.name);
  typeText(entry.text);
}

function typeText(text) {
  let i = 0;
  textDiv.textContent = "";
  isTyping = true;

  typingTimer = setInterval(() => {
    textDiv.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(typingTimer);
      isTyping = false;

      // 🔔 表示完了通知
      onTextFinished();
    }
  }, 30);
}


function updateName(name) {
  if (!name) {
    nameBox.textContent = "";
    nameBox.style.visibility = "hidden";
  } else {
    nameBox.textContent = name;
    nameBox.style.visibility = "visible";
  }
}

function advanceText() {
  const scene = scenario[current];
  const entry = scene.texts[textIndex];

  // ① 文字表示中 → 即全文
  if (isTyping) {
    clearInterval(typingTimer);
    textDiv.textContent = entry.text;
    isTyping = false;

    onTextFinished();
    return;
  }

  // ② 次のテキスト
  if (textIndex < scene.texts.length - 1) {
    textIndex++;
    const next = scene.texts[textIndex];

    currentEntry = next;
    updateName(next.name);
    typeText(next.text);
    return;
  }

  // ③ 選択肢
  if (scene.choices) {
    stopAuto();
    showChoices(scene.choices);
    return;
  }

  // ④ 次シーン
  if (scene.next) {
    showScene(scene.next);
  }
}

function onTextFinished() {
  if (!currentEntry) return;

  const logText = currentEntry.name
    ? `${currentEntry.name}：${currentEntry.text}`
    : currentEntry.text;

  backlog.push(logText);

  scheduleAutoAdvance();
}

function startAuto() {
  isAuto = true;
  scheduleAutoAdvance();
}

function stopAuto() {
  isAuto = false;
  clearTimeout(autoTimer);
}

function scheduleAutoAdvance() {
  clearTimeout(autoTimer);
  if (!isAuto) return;

  autoTimer = setTimeout(() => {
    // ログ表示中・選択肢中は止める
    const scene = scenario[current];
    if (isLogOpen || scene.choices) {
      stopAuto();
      return;
    }
    advanceText();
  }, AUTO_WAIT);
}

function openLog() {
  isLogOpen = true;
  logDiv.style.display = "block";
  logContent.innerHTML = "";

  backlog.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    logContent.appendChild(p);
  });
}

function closeLog() {
  isLogOpen = false;
  logDiv.style.display = "none";
}

textDiv.addEventListener("click", advanceText);

logDiv.addEventListener("click", closeLog);

document.addEventListener("keydown", (e) => {
  if (e.key === "l" || e.key === "L") {
    if (!isLogOpen) openLog();
    return;
  }

  if (e.key === "a" || e.key === "A") {
    if (isAuto) stopAuto();
    else startAuto();
    return;
  }

  if (isLogOpen) {
    if (e.key === "Enter" || e.key === " ") {
      closeLog();
    }
    return;
  }

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    advanceText();
  }
});

function showChoices(choices) {
  choicesDiv.innerHTML = "";

  choices.forEach(choice => {
    if (!checkCondition(choice)) return;

    const btn = document.createElement("button");
    btn.textContent = choice.text;

    btn.onclick = () => {
      if (choice.add) {
        for (const k in choice.add) {
          flags[k] = (flags[k] || 0) + choice.add[k];
        }
      }
      if (choice.setFlag) flags[choice.setFlag] = true;

      showScene(choice.next);
    };

    choicesDiv.appendChild(btn);
  });
}

// --------------------
// タイトル関連
// --------------------
function startGame() {
  titleDiv.style.display = "none";
  gameDiv.style.display = "block";
  showScene(current);
}

function resetGame() {
  current = "start";
  for (const k in flags) delete flags[k];
}

// ニューゲーム
newGameBtn.onclick = () => {
  resetGame();
  startGame();
};

// ロードメニュー表示
openLoadBtn.onclick = () => {
  loadMenu.style.display =
    loadMenu.style.display === "none" ? "block" : "none";
};

// タイトルへ戻る
toTitleBtn.onclick = () => {
  gameDiv.style.display = "none";
  titleDiv.style.display = "block";
};

autoBtn.onclick = () => {
  if (isAuto) stopAuto();
  else startAuto();
  autoBtn.textContent = isAuto ? "AUTO ON" : "AUTO";
};

// --------------------
// セーブ／ロード
// --------------------
function save(slot) {
  const data = { current, flags };
  localStorage.setItem("novelSave" + slot, JSON.stringify(data));
  alert(`スロット${slot}にセーブしました`);
}

function load(slot) {
  const json = localStorage.getItem("novelSave" + slot);
  if (!json) {
    alert(`スロット${slot}は空です`);
    return;
  }

  const data = JSON.parse(json);
  resetGame();

  current = data.current;
  for (const k in data.flags) {
    flags[k] = data.flags[k];
  }

  startGame();
}

document.querySelectorAll(".save").forEach(btn => {
  btn.onclick = () => save(btn.dataset.slot);
});

document.querySelectorAll(".load").forEach(btn => {
  btn.onclick = () => load(btn.dataset.slot);
});
