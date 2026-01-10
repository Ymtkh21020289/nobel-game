export const scenario = {
  start: {
    bg: "bg/room.jpg",

    texts: [
      "目が覚めると、知らない部屋にいた。",
      "頭が少し痛む。",
      "ここは……どこだ？"
    ],

    next: "hall"
  },

  hall: {
    bg: "bg/hall.jpg",

    texts: [
      "廊下に出た。",
      "静まり返っている。"
    ],

    choices: [
      { text: "進む", next: "forward" },
      { text: "戻る", next: "start" }
    ]
  }
};
