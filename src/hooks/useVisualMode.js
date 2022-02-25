import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace) => {
    // if we want to go back 2 modes, must pass true to 2nd argument
    if (replace === true) {
      let copyHistory = [...history];
      copyHistory.pop();
      setHistory([...copyHistory, newMode])
      setMode(newMode);
    } else {
    // copy history state and add newMode to the history
    setHistory([...history, newMode])
    // set the new mode
    setMode(newMode);
    }
  };

  
  const back = () => {
    if (history.length > 1) {
      // make a copy of the history
      const copyHistory = [...history];
      // remove the last element of the history
      copyHistory.pop();
      // set the new history array
      setHistory(copyHistory);
      // set the mode to the last mode in the array (After removing last one)
      setMode(copyHistory[copyHistory.length - 1]);
    }

  };

  return { mode, transition, back };
}; 