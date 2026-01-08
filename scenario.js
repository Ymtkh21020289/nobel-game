export const scenario = {
  start: {
    text: "机の上に鍵が置いてある。",
    choices: [
      { text: "鍵を拾う", setFlag: "key", next: "room" },
      { text: "何もしない", next: "room" }
    ]
  },

  room: {
    text: "ドアの前に立っている。",
    choices: [
      { text: "ドアを開ける", if: "key", next: "escape" },
      { text: "ドアを開ける", ifNot: "key", next: "locked" }
    ]
  },

  locked: {
    text: "鍵がかかっているようだ。",
    next: "room"
  },

  escape: {
    text: "鍵を使って脱出した！",
  }
};
