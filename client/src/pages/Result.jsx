import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrophy, FaSadTear, FaGamepad, FaClock, FaCalendarAlt, FaHistory, FaHome } from "react-icons/fa";
import API from "../services/api";

const Result = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const myUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = myUser._id || myUser.id || null;

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/matches/room/${roomCode}`);
        setMatch(res.data.match);
      } catch (err) {
        console.error("Error fetching match result:", err);
        setError("Failed to load match results or room code is invalid.");
      } finally {
        setLoading(false);
      }
    };

    if (roomCode) {
      fetchResult();
    }
  }, [roomCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading match results...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl text-center border border-slate-700">
          <FaSadTear className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error || "Match not found"}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-xl font-bold transition w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isPlayer1 = match.player1Id?._id === myId;
  const isWinner = (isPlayer1 && match.finalWinner === "player1") || (!isPlayer1 && match.finalWinner === "player2");
  const isDraw = match.finalWinner === "draw";

  const opponent = isPlayer1 ? match.player2Id : match.player1Id;
  const player = isPlayer1 ? match.player1Id : match.player2Id;

  const scoreText = isPlayer1 
    ? `${match.player1Score} - ${match.player2Score}` 
    : `${match.player2Score} - ${match.player1Score}`;

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl w-full bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-800 text-center">
        
        {/* Outcome Header */}
        <div className="mb-8">
          {isDraw ? (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-500/10 border-2 border-yellow-500 text-yellow-500 mb-4 animate-bounce">
              <FaGamepad className="text-5xl" />
            </div>
          ) : isWinner ? (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 text-green-500 mb-4 animate-bounce">
              <FaTrophy className="text-5xl" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 text-red-500 mb-4 animate-bounce">
              <FaSadTear className="text-5xl" />
            </div>
          )}

          <h1 className="text-4xl font-extrabold tracking-tight mt-2">
            {isDraw ? (
              <span className="text-yellow-500">It's a Draw! 🤝</span>
            ) : isWinner ? (
              <span className="text-green-500">Victory! 🎉</span>
            ) : (
              <span className="text-red-500">Defeat! 😔</span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">
            Room Code: <span className="font-mono text-white font-bold">{roomCode}</span>
          </p>
        </div>

        {/* Score and Players Display */}
        <div className="flex items-center justify-center gap-6 md:gap-12 mb-10">
          {/* You */}
          <div className="flex-1 text-center bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
            <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center text-2xl font-bold shadow-md">
              {player?.name?.charAt(0).toUpperCase() || "Y"}
            </div>
            <p className="font-bold text-lg mt-3 truncate">{player?.name || "You"}</p>
            <span className="text-xs text-sky-400 font-semibold tracking-wider bg-sky-950/50 border border-sky-800/50 px-2 py-0.5 rounded-full mt-1 inline-block">
              YOU
            </span>
          </div>

          {/* Versus Score */}
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">SCORE</p>
            <div className="text-4xl md:text-5xl font-black tracking-widest text-white drop-shadow">
              {scoreText}
            </div>
          </div>

          {/* Opponent */}
          <div className="flex-1 text-center bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
            <div className="w-16 h-16 bg-gradient-to-tr from-rose-400 to-red-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold shadow-md">
              {opponent?.name?.charAt(0).toUpperCase() || "O"}
            </div>
            <p className="font-bold text-lg mt-3 truncate">{opponent?.name || "Opponent"}</p>
            <span className="text-xs text-rose-400 font-semibold tracking-wider bg-rose-950/50 border border-rose-800/50 px-2 py-0.5 rounded-full mt-1 inline-block">
              OPPONENT
            </span>
          </div>
        </div>

        {/* Match Details List */}
        <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-6 text-left space-y-4 mb-8">
          <h3 className="font-bold text-lg text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
            <FaGamepad /> Match Summary
          </h3>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div className="flex items-center gap-2.5">
              <FaGamepad className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500 font-semibold">GAME TYPE</p>
                <p className="font-bold text-slate-200 capitalize">{match.gameType.replace("-", " ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <FaClock className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500 font-semibold">DURATION</p>
                <p className="font-bold text-slate-200">{formatDuration(match.totalDuration)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 col-span-2 md:col-span-1">
              <FaCalendarAlt className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500 font-semibold">PLAYED ON</p>
                <p className="font-bold text-slate-200">
                  {new Date(match.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 col-span-2">
              <div className="w-full text-slate-500 text-xs truncate">
                MATCH ID: <span className="font-mono text-slate-400 select-all">{match._id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Button Group */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/home")}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-sky-500/10 active:scale-[0.98]"
          >
            <FaGamepad /> Play Again
          </button>
          
          <button
            onClick={() => navigate("/home")} // In future can link to history tab/page
            className="flex-1 py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition border border-slate-700/60 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <FaHistory /> Match History
          </button>

          <button
            onClick={() => navigate("/home")}
            className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition border border-slate-700/60 flex items-center justify-center gap-2 active:scale-[0.98]"
            title="Home"
          >
            <FaHome />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;
