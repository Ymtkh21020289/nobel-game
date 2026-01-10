import { scenario } from "./scenario.js";

const backlog = [];
let isLogOpen = false;

let textIndex = 0;
let current = "start";
const flags = {};
let isTyping = false;     // 今文字表示中か？
let typingTimer = null; // setInterval管理用

const bgImg = document.getElementById("bg");
const charaImg = document.getElementById("chara");

const titleDiv = document.getElementById("title");
const gameDiv = document.getElementById("game");

const textDiv = document.getElementById("text");
const choicesDiv = document.getElementById("choices");

const newGameBtn = document.getElementById("newGame");
const openLoadBtn = document.getElementById("openLoad");
const loadMenu = document.getElementById("loadMenu");
const toTitleBtn = document.getElementById("toTitle");

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
  typeText(scene.texts[textIndex]);
}

function typeText(text) {
  clearInterval(typingTimer);
  textDiv.textContent = "";
  isTyping = true;

  let i = 0;
  typingTimer = setInterval(() => {
    textDiv.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(typingTimer);
      isTyping = false;

      // 🔽 ログに追加
      backlog.push(text);
    }
  }, 30);
}

function advanceText() {
  const scene = scenario[current];

  // ① 文字表示中 → 全文表示
  if (isTyping) {
    clearInterval(typingTimer);
    textDiv.textContent = scene.texts[textIndex];
    isTyping = false;
    return;
  }

  // ② 次のテキストへ
  if (textIndex < scene.texts.length - 1) {
    textIndex++;
    typeText(scene.texts[textIndex]);
    return;
  }

  // ③ 選択肢表示
  if (scene.choices) {
    showChoices(scene.choices);
    return;
  }

  // ④ 次のシーン
  if (scene.next) {
    showScene(scene.next);
  }
}

textDiv.addEventListener("click", advanceText);

document.addEventListener("keydown", (e) => {
  // 入力欄にフォーカスがある時は無視（将来の名前入力など対策）
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault(); // スペースのスクロール防止
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
