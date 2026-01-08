export const scenario = {
  start: {
    text: "目が覚めると、知らない部屋にいた。",
    next: "choice1"
  },

  choice1: {
    text: "どうする？",
    choices: [
      { text: "周囲を見る", next: "look" },
      { text: "もう一度寝る", next: "sleep" }
    ]
  },

  look: {
    text: "古い机と椅子がある。",
    next: "end"
  },

  sleep: {
    text: "そのまま眠り続けた……。",
    next: "end"
  },

  end: {
    text: "― END ―"
  }
};
