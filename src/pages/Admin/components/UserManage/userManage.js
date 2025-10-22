import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js"; 
import {
  getAllUsers,
  blockUser,
  unBlockUser,
  resetPasswordUser,
} from "../../../../services/userService.js";

let allUsers = [];

/**
 * Render khung HTML chính của trang
 */
function renderUserManageLayout() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content__admin">
          <div class="user-manage">
            <div class="user-manage__head">
              <h1 class="user-manage-header">Danh Sách Người Dùng</h1>
            </div>

            <div class="user-manage-main">
              <div class="user-manage-search">
                <input type="text" placeholder="Tìm theo email người dùng..." /><button class="user-manage-search__button-reset">Làm mới</button>
              </div>
              <div class="user-manage-result">
                <div class="cart product-result">
                  <div class="cart-info product-result-info">
                    <div class="product-stt">STT</div>
                    <div class="product-status">Trạng thái</div>
                    <div class="product-main product-result-info__main">Email</div>
                    <div class="product-price product-result-info__price">Mật khẩu</div>
                    <div class="product-action">Thao tác</div>
                  </div>
                  <div class="user-list-container"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render danh sách người dùng cho trang hiện tại
 */
function renderUserList(usersToRender) {
  const userListContainer = document.querySelector(".user-list-container");
  if (!userListContainer) return;

  if (!usersToRender || usersToRender.length === 0) {
    userListContainer.innerHTML = `<p style="padding: 20px; text-align: center;">Không có người dùng nào.</p>`;
    return;
  }

  userListContainer.innerHTML = usersToRender.map((user, index) => {
      const statusText = user.status === "active" ? "Hoạt động" : "Bị khóa";
      const statusClass = user.status === "active" ? "status-public" : "status-private";
      const lockActionText = user.status === "active" ? "Khóa" : "Mở khóa";
      const lockActionClass = user.status === "active" ? "" : "unlock-action";

      return `
        <div class="product-item-container" data-user-id="${user.id}">
          <div class="cart-item product-result-item__product">
            <div class="product-stt"><span>${index + 1}</span></div>
            <div class="product-status ${statusClass}"><span>${statusText}</span></div>
            <div class="product-main">
              <span>${user.email}</span>
            </div>
            <div class="product-price">
              <span class="password-text" data-password="${user.password}">********</span>
              <i class="fa-solid fa-eye-slash toggle-password-visibility"></i>
            </div>
            <div class="product-action">
              <a href="#!" class="reset-password-link" data-user-id="${user.id}">Reset Mật khẩu</a>
              <br/><br/>
              <a href="#!" class="delete-link lock-action ${lockActionClass}" data-user-id="${user.id}">${lockActionText}</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
}

/**
 * Lấy dữ liệu, tính toán và render ra giao diện
 */
function fetchAndRenderUsers() {
  const keyword = document.querySelector('.user-manage-search input')?.value.toLowerCase() || '';
  const filteredUsers = allUsers.filter(user => user.email.toLowerCase().includes(keyword));

  renderUserList(filteredUsers);
}

function setUpUserManagePage() {
  setUpAdminNav();
  
  // Xử lý các sự kiện trên danh sách người dùng
  const userListContainer = document.querySelector(".user-list-container");
  if (userListContainer) {
    userListContainer.addEventListener("click", (event) => {
      const target = event.target;
      const toggleIcon = target.closest(".toggle-password-visibility");
      const lockLink = target.closest(".lock-action");
      const resetLink = target.closest(".reset-password-link");

      // Xử lý khóa/mở khóa
      if (lockLink) {
        event.preventDefault();
        const userId = lockLink.dataset.userId;
        const user = allUsers.find((u) => u.id === userId);
        if (!user) return;

        const actionText = user.status === "active" ? "khóa" : "mở khóa";
        if (confirm(`Bạn có chắc chắn muốn ${actionText} người dùng này không?`)) {
          if (user.status === "active") {
            blockUser(userId);
          } else {
            unBlockUser(userId);
          }
          loadUserManagePage(); // Tải lại trang để cập nhật giao diện
        }
        return; // Dừng lại sau khi xử lý
      }

      // Xử lý reset mật khẩu
      if (resetLink) {
        event.preventDefault();
        const userId = resetLink.dataset.userId;
        if (confirm(`Bạn có chắc muốn reset mật khẩu cho người dùng này về "123456" không?`)) {
          if (resetPasswordUser(userId)) {
            alert("Reset mật khẩu thành công!");
            loadUserManagePage(); // Tải lại để cập nhật
          } else {
            alert("Có lỗi xảy ra, không thể reset mật khẩu.");
          }
        }
        return;
      }

      // Xử lý ẩn/hiện mật khẩu
      if (!toggleIcon) return; 

      const passwordSpan = toggleIcon.previousElementSibling;
      const isHidden = passwordSpan.textContent === "********";

      if (isHidden) {
        passwordSpan.textContent = passwordSpan.dataset.password;
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
      } else {
        passwordSpan.textContent = "********";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
      }
    });
  }

  // Thêm tìm kiếm tự động khi người dùng gõ
  const searchInput = document.querySelector('.user-manage-search input');
  searchInput?.addEventListener('input', () => {
    fetchAndRenderUsers();
  });

  // Xử lý nút làm mới
  document.querySelector(".user-manage-search__button-reset")?.addEventListener("click", () => {
    document.querySelector('.user-manage-search input').value = '';
    fetchAndRenderUsers();
  });

}

export function loadUserManagePage() {
  allUsers = getAllUsers(); // Lấy tất cả user một lần
  renderUserManageLayout();
  setUpUserManagePage();
  fetchAndRenderUsers(); // Render lần đầu
}