import { useState } from "react";

export default function GameModal({ game, onClose, onCreateRoom, onJoinRoom }) {
  if (!game) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fadeIn"
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] px-8 pt-9 pb-8 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative animate-slideUp"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-lg hover:bg-slate-200 transition"
        >
          ✕
        </button>

        {/* ICON + TITLE */}
        <div className="text-center mb-7">
          <div
            className="w-[72px] h-[72px] rounded-[18px] flex items-center justify-center text-[32px] mx-auto mb-4 shadow-md"
            style={{ background: game.bgColor || "#dbeafe" }}
          >
            {game.icon}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
            {game.title}
          </h2>
          <p className="text-sm text-slate-500">
            What would you like to do?
          </p>
        </div>

        {/* CREATE ROOM */}
        <div className="bg-blue-50 border-[1.5px] border-blue-200 rounded-[14px] p-5 mb-3">
          <div className="font-bold text-[13px] tracking-wider text-blue-800 mb-1">
            CREATE A ROOM
          </div>
          <div className="text-[13px] text-slate-500 mb-4">
            Get unique code & invite friends
          </div>

          <button
            onClick={onCreateRoom}
            className="w-full py-3 text-white font-bold text-sm tracking-wider rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md hover:translate-y-[-1px] hover:shadow-lg transition"
          >
            CREATE ROOM
          </button>
        </div>

        {/* JOIN ROOM */}
        <div className="bg-purple-50 border-[1.5px] border-purple-200 rounded-[14px] p-5">
          <div className="font-bold text-[13px] tracking-wider text-purple-700 mb-1">
            JOIN A ROOM
          </div>
          <div className="text-[13px] text-slate-500 mb-4">
            Have a code from a friend?
          </div>

          <button
            onClick={onJoinRoom}
            className="w-full py-3 text-white font-bold text-sm tracking-wider rounded-[10px] bg-gradient-to-br from-purple-500 to-purple-700 shadow-md hover:translate-y-[-1px] hover:shadow-lg transition"
          >
            JOIN ROOM
          </button>
        </div>
      </div>
    </div>
  );
}
