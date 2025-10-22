// --- Service quản lý dữ liệu Phiếu Nhập Hàng (GRN) ---
import { generateUniqueId } from "../helper/helper.js"; // Điều chỉnh đường dẫn nếu cần

let grns = [];

function loadGRNs() {
  const grnsFromStorage = localStorage.getItem("goodsReceivedNotes");
  grns = grnsFromStorage ? JSON.parse(grnsFromStorage) : [];
}

function saveGRNs() {
  localStorage.setItem("goodsReceivedNotes", JSON.stringify(grns));
}

export function getAllGRNs() {
  loadGRNs();
  // Sắp xếp theo ngày tạo mới nhất (giả sử ngày tạo là createdAt dạng ISO string)
  grns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return grns;
}

export function addGRN(grnData) {
  loadGRNs();
  const newGRN = {
    id: generateGRNId(),
    createdAt: grnData.createdAt,
    totalPrice: grnData.totalPrice,
    totalQuantity: grnData.totalQuantity,
    items: grnData.items,
    status: "Đã hoàn thành", // Hoặc trạng thái khác tùy logic
  };
  grns.push(newGRN);
  saveGRNs();
}

function generateGRNId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GRN-${y}${m}${d}-${randomPart}`;
}

export function getGRNById(id) {
  loadGRNs();
  return grns.find((grn) => grn.id === id);
}

// Khởi tạo tải dữ liệu khi service được import lần đầu
loadGRNs();
