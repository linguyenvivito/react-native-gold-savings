export const FenToMace = (fen: number): number => {
  return fen / 10;
};

export const MaceToFen = (mace: number): number => {
  return mace * 10;
};

export const FenToTael = (fen: number): number => {
  return fen / 100;
};

export const TaelToFen = (tael: number): number => {
  return tael * 100;
};
