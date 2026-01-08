import { scenario } from "./scenario.js";

let current = "start";
const flags = {};

const textDiv = document.getElementById("text");
const choicesDiv = document.getElementById("choices");
const saveBtn = document.getElementById("save");
const loadBtn = document.getElementById("load");

function checkCondition(choice) {
  // true / false フラグ
  if (choice.if && !flags[choice.if]) return false;
  if (choice.ifNot && flags[choice.ifNot]) return false;

  // 数値条件（以上）
  if (choice.ifValue) {
    const key = Object.keys(choice.ifValue)[0];
    const value = choice.ifValue[key];
    if ((flags[key] || 0) < value) return false;
  }

  // 数値条件（未満）
  if (choice.ifValueLess) {
    const key = Object.keys(choice.ifValueLess)[0];
    const value = choice.ifValueLess[key];
    if ((flags[key] || 0) >= value) return false;
  }

  return true;
}

function showScene(key) {
  const scene = scenario[key];
  current = key;

  textDiv.textContent = scene.text;
  choicesDiv.innerHTML = "";

  if (scene.choices) {
    scene.choices.forEach(choice => {
      if (!checkCondition(choice)) return;

      const btn = document.createElement("button");
      btn.textContent = choice.text;

      btn.onclick = () => {
        // 数値加算
        if (choice.add) {
          for (const key in choice.add) {
            flags[key] = (flags[key] || 0) + choice.add[key];
          }
        }

        // boolean フラグ
        if (choice.setFlag) {
          flags[choice.setFlag] = true;
        }

        showScene(choice.next);
      };

      choicesDiv.appendChild(btn);
    });
  }
}

// クリックで次へ
textDiv.addEventListener("click", () => {
  const scene = scenario[current];
  if (scene.next && !scene.choices) {
    showScene(scene.next);
  }
});

// 💾 セーブ
function save(slot) {
  const data = {
    current,
    flags
  };
  localStorage.setItem("novelSave" + slot, JSON.stringify(data));
  alert(`スロット${slot}にセーブしました`);
}

// 📂 ロード処理
function load(slot) {
  const json = localStorage.getItem("novelSave" + slot);
  if (!json) {
    alert(`スロット${slot}は空です`);
    return;
  }

  const data = JSON.parse(json);

  // flags 初期化
  for (const k in flags) delete flags[k];

  current = data.current;
  for (const k in data.flags) {
    flags[k] = data.flags[k];
  }

  showScene(current);
}

// ボタンにイベント付与
document.querySelectorAll(".save").forEach(btn => {
  btn.onclick = () => save(btn.dataset.slot);
});

document.querySelectorAll(".load").forEach(btn => {
  btn.onclick = () => load(btn.dataset.slot);
});

showScene(current);
