export const events = {
  magicMouthWarning: {
    id: "magicMouthWarning",
    type: "magicMouth",

    message:
      "Two magical mouths appear in the opposing alcoves. The eastern mouth challenges the intruders; the western mouth declares them foolhardy and doomed. Together they warn that anyone passing this place will face the wrath of Zelligar and Rogahn. Their loud laughter fades as both mouths disappear.",

    once: false,

    dm: {
      permanent: true,
      trigger: "Party reaches the point between the third pair of alcoves",
      sourceArea: "1. ALCOVES",
    },
  },
};
