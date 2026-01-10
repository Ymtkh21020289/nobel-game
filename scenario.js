export const scenario = {
  start: {
    bg: "bg/bright_ruins.jpg",

    texts: [
      { name: "アリス", text: "こんにちは。" },
      { name: "アリス", text: "今日はいい天気ですね。" },
      { name: null, text: "静かな午後だった。" } // ナレーション
    ],

    next: "hall"
  },

  hall: {
    bg: "bg/bright_ruins.jpg",

    texts: [
      { name: "アリス", text: "こんにちは。" },
      { name: "アリス", text: "今日はいい天気ですね。" },
      { name: null, text: "静かな午後だった。" } // ナレーション
    ],

    choices: [
      { text: "進む", next: "forward" },
      { text: "戻る", next: "start" }
    ]
  }
};
