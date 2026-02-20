module.exports = function(scoreA, scoreB, bo) {
  const win = bo === "BO3" ? 2 : 3;
  if (scoreA >= win) return "A";
  if (scoreB >= win) return "B";
  return null;
};
