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
saveBtn.onclick = () => {
  const data = {
    current,
    flags
  };
  localStorage.setItem("novelSave", JSON.stringify(data));
  alert("セーブしました");
};

// 📂 ロード
loadBtn.onclick = () => {
  const json = localStorage.getItem("novelSave");
  if (!json) {
    alert("セーブデータがありません");
    return;
  }

  const data = JSON.parse(json);
  current = data.current;

  // flags を復元
  for (const key in data.flags) {
    flags[key] = data.flags[key];
  }

  showScene(current);
};

showScene(current);
