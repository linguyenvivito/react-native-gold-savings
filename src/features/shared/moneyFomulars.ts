export const sumBy = <T>(items: T[], pick: (item: T) => number) =>
  items.reduce((acc, item) => acc + pick(item), 0);

export const calcGoldValue = (price: number, quantity: number) =>
  price * quantity;

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const formatVND = (amount: number) => vndFormatter.format(amount);
