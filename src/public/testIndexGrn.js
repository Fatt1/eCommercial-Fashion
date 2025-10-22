import {
  AdminNav,
  setUpAdminNav,
} from "../pages/Admin/components/AdminNav/AdminNav.js";
import { loadProductAdmin } from "../pages/ProductManage/productManage.js"; // Giả sử đường dẫn
import { loadGoodsReceivedNoteList } from "./testGrn.js";

// Render layout admin chính
const root = document.getElementById("root");
root.innerHTML = `
  <div class="admin">
    ${AdminNav()}
    <div class="admin__main" id="admin__main-content">
      <!-- Nội dung các trang sẽ được tải vào đây -->
    </div>
  </div>
`;

// Lấy container chính
const mainContent = document.getElementById("admin__main-content");

// --- Thiết lập Navigation ---
// Bọc các hàm load trang để chúng render vào đúng container
const loadProducts = () => {
  mainContent.innerHTML = ""; // Xóa nội dung cũ
  loadProductAdmin(mainContent); // Yêu cầu `loadProductAdmin` render vào đây
};

const loadGRN = () => {
  mainContent.innerHTML = ""; // Xóa nội dung cũ
  loadGoodsReceivedNoteList(mainContent); // Yêu cầu `loadGRN` render vào đây
};

// Gọi setUpAdminNav với các hàm load trang
// (Bạn cần điều chỉnh file AdminNav.js để chấp nhận các hàm này)
setUpAdminNav({
  onProductClick: loadProducts,
  onGRNClick: loadGRN,
  // Thêm các hàm khác cho các mục nav khác
});

// Tải trang Nhập hàng làm trang mặc định
loadGRN();
