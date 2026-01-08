import { scenario } from "./scenario.js";

let current = "start";
const flags = {};

const textDiv = document.getElementById("text");
const choicesDiv = document.getElementById("choices");

function checkCondition(choice) {
  if (choice.if && !flags[choice.if]) return false;
  if (choice.ifNot && flags[choice.ifNot]) return false;
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
        if (choice.setFlag) {
          flags[choice.setFlag] = true;
        }
        showScene(choice.next);
      };

      choicesDiv.appendChild(btn);
    });
  }
}

textDiv.addEventListener("click", () => {
  const scene = scenario[current];
  if (scene.next && !scene.choices) {
    showScene(scene.next);
  }
});

showScene(current);
