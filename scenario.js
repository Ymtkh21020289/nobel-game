export const scenario = {
  start: {
    bg: "bg/bright_ruins.jpg",
    chara: null,
    text: "目が覚めると、知らない部屋にいた。",
    next: "street"
  },

  street: {
    bg: "bg/bright_ruins.jpg",
    chara: null,
    text: "彼女がこちらを見ている。",
    choices: [
      {
        text: "話しかける",
        add: { love: 1 },
        next: "talk"
      },
      {
        text: "立ち去る",
        next: "end"
      }
    ]
  },

  talk: {
    chara: null,
    text: "二人はしばらく話をした。",
    next: "end"
  },

  end: {
    text: "― END ―"
  }
};
