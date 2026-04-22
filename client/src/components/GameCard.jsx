const GameCard = ({ game, onClick }) => {
  return (
    <div
      onClick={() => onClick(game)}
      className="bg-white rounded-2xl px-6 pt-7 pb-5 min-w-[220px] flex-1 shadow-sm flex flex-col gap-2.5 cursor-pointer hover:shadow-md hover:-translate-y-1 transition"
    >
      {/* Icon */}
      <div
        className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl mb-2"
        style={{ background: game.bgColor }}
      >
        {game.icon}
      </div>

      <div className="font-bold text-[17px] text-gray-900">
        {game.title}
      </div>

      <div
        className="text-[13px] font-semibold"
        style={{ color: game.diffColor }}
      >
        {game.difficulty}
      </div>

      <button className="mt-2.5 py-3 w-full bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-900">
        Play Now
      </button>
    </div>
  );
};