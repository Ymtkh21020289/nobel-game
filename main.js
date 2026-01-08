import { scenario } from "./scenario.js";

const flags = {};

let current = "start";

const textDiv = document.getElementById("text");
const choicesDiv = document.getElementById("choices");

function showScene(key) {
  const scene = scenario[key];
  current = key;

  textDiv.textContent = scene.text;
  choicesDiv.innerHTML = "";

  // 選択肢がある場合
  if (scene.choices) {
    scene.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.onclick = () => showScene(choice.next);
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

// 開始
showScene(current);
