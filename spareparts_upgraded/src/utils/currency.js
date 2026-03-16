export const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`
export const convertCurrency = (price, rate) => price * rate
