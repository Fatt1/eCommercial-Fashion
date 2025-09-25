export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hàm bỏ dấu chấm để convert lại thành số
export function unFormatNumber(str) {
  return Number(str.replace(/\./g, ""));
}
