// --- Service quản lý dữ liệu Phiếu Nhập Hàng (GRN) ---

// Lấy hàm tạo ID duy nhất (giả sử nó nằm ở đây, theo productService)
import { generateUniqueId } from "../helper/helper.js";

let grns = []; // Biến local để lưu trữ danh sách GRN

// Tải GRN từ localStorage khi service được import
function loadGRNs() {
  const grnsFromStorage = localStorage.getItem("goodsReceivedNotes");
  grns = grnsFromStorage ? JSON.parse(grnsFromStorage) : [];
}

// Lưu GRN vào localStorage
function saveGRNs() {
  localStorage.setItem("goodsReceivedNotes", JSON.stringify(grns));
}

// Lấy tất cả GRN
export function getAllGRNs() {
  loadGRNs();
  return grns;
}

// Thêm một GRN mới
export function addGRN(grnData) {
  loadGRNs();
  const newGRN = {
    id: generateGRNId(), // Tạo ID mới
    createdAt: grnData.createdAt,
    totalPrice: grnData.totalPrice,
    totalQuantity: grnData.totalQuantity,
    items: grnData.items,
    status: "Đã hoàn thành", // Hoặc "Chưa hoàn thành" tùy logic
  };
  grns.push(newGRN);
  saveGRNs();
}

// Tạo ID Phiếu Nhập Hàng (ví dụ: GRN-20251022-XXXX)
function generateGRNId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GRN-${y}${m}${d}-${randomPart}`;
}

// Hàm lấy 1 GRN theo ID (chưa dùng nhưng sẽ cần)
export function getGRNById(id) {
  loadGRNs();
  return grns.find((grn) => grn.id === id);
}

// (Có thể thêm các hàm update/delete sau)
