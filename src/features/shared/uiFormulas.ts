import { Transaction } from "../auth/profile.type";

export const transactionTotalEstimate = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    const sideMultiplier = transaction.transactionType === "BUY" ? 1 : -1;
    const estimatedPrice = transaction.executedPrice ?? transaction.cashAmount;
    return total + sideMultiplier * estimatedPrice * transaction.quantity;
  }, 0);
};

export const transactionQuantity = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + transaction.quantity;
  }, 0);
};