import React, { useState } from "react";

const GuessNumber = ({ gameState, myId, onMakeMove }) => {
  const { players, pickerIndex, guesserIndex, secretNumber, guessesLeft } = gameState;
  const myIndex = players.findIndex((p) => p.userId === myId);
  const isPicker = myIndex === pickerIndex;

  const [inputVal, setInputVal] = useState("");
  const [hint, setHint] = useState("");

  React.useEffect(() => {
      // Clear hint on new round
      setHint("");
  }, [gameState.currentRound]);

  // Hooking into opponent moves for hints (this could be improved by passing events differently, 
  // but for simplicity, we can rely on a specific prop or check if guesses left changed)
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal) return;
    
    if (isPicker && !secretNumber) {
        onMakeMove({ type: "set-number", number: inputVal });
    } else if (!isPicker) {
        onMakeMove({ type: "guess", guess: inputVal });
    }
    setInputVal("");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Guess the Number</h2>
      <p className="text-sm text-gray-500 mb-6">Round {gameState.currentRound} of 3</p>

      {isPicker ? (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 w-full text-center">
            <h3 className="font-bold text-blue-800 mb-2">You are the Picker</h3>
            {!secretNumber ? (
               <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                   <p className="text-sm text-gray-600">Pick a secret number between 1 and 100.</p>
                   <input type="number" min="1" max="100" required value={inputVal} onChange={e => setInputVal(e.target.value)} className="p-3 border rounded-lg text-center font-bold text-xl" placeholder="e.g. 42" />
                   <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md">Set Secret Number</button>
               </form>
            ) : (
                <div>
                    <p className="text-lg mb-2">Your secret number is <span className="font-bold text-2xl text-blue-600">{secretNumber}</span></p>
                    <p className="text-gray-500 animate-pulse">Waiting for opponent to guess...</p>
                    <p className="mt-4 text-sm font-semibold">Opponent has {guessesLeft} guesses left.</p>
                </div>
            )}
        </div>
      ) : (
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 w-full text-center">
             <h3 className="font-bold text-green-800 mb-2">You are the Guesser</h3>
             {secretNumber === null ? (
                 <div className="p-4">
                     <p className="text-gray-600 animate-pulse">Waiting for opponent to pick a number...</p>
                 </div>
             ) : (
                 <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                     <p className="text-sm text-gray-600">Guess the secret number! (1-100)</p>
                     <p className="font-bold text-red-500">{guessesLeft} guesses remaining</p>
                     <input type="number" min="1" max="100" required value={inputVal} onChange={e => setInputVal(e.target.value)} className="p-3 border rounded-lg text-center font-bold text-xl" placeholder="Your guess" />
                     <button type="submit" className="bg-green-600 text-white font-bold py-3 rounded-lg shadow-md">Submit Guess</button>
                     {hint && <p className="mt-2 text-lg font-bold text-orange-600">{hint}</p>}
                 </form>
             )}
        </div>
      )}
    </div>
  );
};

export default GuessNumber;
