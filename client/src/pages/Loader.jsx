import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingTexts = [
    "Whipping up something sweet... just like you 😉`",
    "You had us at hunger 😍",
    "Hang tight, your cravings are being charmed!",
    "We’re not saying you're a snack... but 🍪",
    "Loading love, laughter & ladoos 💛",
    "Almost done... just tying the apron (and our feelings) 💕",
    "You + sweets = a perfect batch 🧁",
    "Oven’s hot, and so are these treats 🔥",
    "We knead a moment... it's almost ready 🍞",
    "You’ve got great taste — and we’re baking for it!",
    "Just like you, our cookies are worth the wait 🍪",
    "Putting the ‘crush’ in ‘crushed cashews’",
    "Sprinkling charm on every bite ✨",
    "Freshly baked and hopelessly sweet — like this moment",
    "Raising dough and eyebrows 😉",
    "Is it hot in here, or is it just the oven... and you?",
    "Adding sweetness to your screen and your day 🍬",
    "One sec...we’re flirting with perfection 😌",
    "Warming hearts and puff pastries 💗",
    "Serving treats with a side of attention 😋"
  ];
  

const Loader = () => {
  const [text, setText] = useState("Loading...");

  useEffect(() => {
    const randomText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
    setText(randomText);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center flex justify-center items-center flex-col h-screen bg-white"
    >
      <div className="animate-spin rounded-full border-t-4 border-orange-500 border-r-4 border-gray-200 w-16 h-16 mx-auto" />
      <p className="mt-4 text-lg font-semibold text-orange-600">{text}</p>
    </motion.div>
  );
};

export default Loader;
