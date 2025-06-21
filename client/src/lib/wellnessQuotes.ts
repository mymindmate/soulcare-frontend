// Defines the wellnessQuotes array for the QuotePopup feature

export interface WellnessQuote {
  text: string;
  author: string;
}

export const wellnessQuotes: WellnessQuote[] = [
  {
    text: "Your mind is a garden, your thoughts are the seeds. You can grow flowers or you can grow weeds.",
    author: "Mind Wellness Institute"
  },
  {
    text: "Self-care is not self-indulgence, it is self-preservation.",
    author: "Audre Lorde"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  },
  {
    text: "Calm mind brings inner strength and self-confidence, so that's very important for good health.",
    author: "Dalai Lama"
  },
  {
    text: "The greatest weapon against stress is our ability to choose one thought over another.",
    author: "William James"
  },
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein"
  },
  {
    text: "The way I see it, if you want the rainbow, you gotta put up with the rain.",
    author: "Dolly Parton"
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair"
  },
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama"
  },
  {
    text: "Life isn't about waiting for the storm to pass. It's about learning how to dance in the rain.",
    author: "Vivian Greene"
  },
  {
    text: "Breath is the power behind all things. I breathe in and know that good things will happen.",
    author: "Tao Porchon-Lynch"
  },
  {
    text: "You are the sky. Everything else is just the weather.",
    author: "Pema Chödrön"
  },
  {
    text: "Sometimes the most important thing in a whole day is the rest we take between two deep breaths.",
    author: "Etty Hillesum"
  },
  {
    text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse"
  }
];

/**
 * Returns a random wellness quote from the collection
 */
export function getRandomQuote(): WellnessQuote {
  const randomIndex = Math.floor(Math.random() * wellnessQuotes.length);
  return wellnessQuotes[randomIndex];
}
