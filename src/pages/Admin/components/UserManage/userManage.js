import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  getAllUsers,
  blockUser,
  unBlockUser,
  resetPasswordUser,
} from "../../../../services/userService.js";

let allUsers = [];
const PAGE_SIZE = 10;
let filter = {
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  searchKey: null,
};

/**
 * Render khung HTML chính của trang
 */
function renderUserManageLayout() {
  const pageResult = filterUsers();

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
                <input type="text" placeholder="Tìm theo email người dùng..." id="user-search-input" />
                <button class="user-manage-search__button blue__button" id="user-search-btn">SEARCH</button>
                <button class="user-manage-search__button-reset">Làm mới</button>
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
              
              <!-- Pagination Section -->
              <div class="product-manage-main-result__end">
                <div class="noti-message">Tổng ${
                  pageResult.totalItems
                } người dùng | Mỗi trang tối đa ${PAGE_SIZE} người dùng</div>
                <div class="pagination"></div>
                <div class="page-index-track">Trang ${filter.pageNumber}/${
    pageResult.totalPages
  }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Filter users với phân trang
 */
function filterUsers() {
  let filteredUsers = [...allUsers];

  // Filter by search key
  if (filter.searchKey) {
    filteredUsers = filteredUsers.filter((user) =>
      user.email.toLowerCase().includes(filter.searchKey.toLowerCase())
    );
  }

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / filter.pageSize) || 1;
  const startIndex = (filter.pageNumber - 1) * filter.pageSize;
  const endIndex = startIndex + filter.pageSize;
  const items = filteredUsers.slice(startIndex, endIndex);

  return {
    items,
    totalItems,
    totalPages,
    currentPage: filter.pageNumber,
  };
}

/**
 * Render pagination
 */
function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.querySelector(".pagination");
  const pageIndexTrack = document.querySelector(".page-index-track");

  if (!paginationContainer) return;

  let html = "";

  // Previous button
  html += `
    <a href="#" class="prev-btn pagination-btn ${
      currentPage === 1 ? "disable-pagination-link" : ""
    }" data-page="${currentPage - 1}">
      <img src="../assets/prev-btn.svg" alt="Previous" />
    </a>
  `;

  // Page numbers with smart ellipsis
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<a href="#" class="pagination-btn active" data-page="${i}">${i}</a>`;
    } else if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      html += `<a href="#" class="pagination-btn" data-page="${i}">${i}</a>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="pagination-ellipsis">...</span>`;
    }
  }

  // Next button
  html += `
    <a href="#" class="pagination-btn next-btn ${
      currentPage === totalPages ? "disable-pagination-link" : ""
    }" data-page="${currentPage + 1}">
      <img src="../assets/prev-btn.svg" alt="Next" style="transform: rotate(180deg);" />
    </a>
  `;

  paginationContainer.innerHTML = html;

  if (pageIndexTrack) {
    pageIndexTrack.textContent = `Trang ${currentPage}/${totalPages}`;
  }

  setupPaginationEvents(totalPages);
}

/**
 * Setup pagination event listeners
 */
function setupPaginationEvents(totalPages) {
  const paginationBtns = document.querySelectorAll(
    ".pagination-btn:not(.disable-pagination-link)"
  );

  paginationBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(btn.dataset.page);
      if (page && page > 0 && page <= totalPages) {
        filter.pageNumber = page;
        updateUserList();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

/**
 * Update user list khi filter/search/pagination thay đổi
 */
function updateUserList() {
  const pageResult = filterUsers();

  // Update user list
  renderUserList(pageResult.items);

  // Update notification message
  const notiMessage = document.querySelector(".noti-message");
  if (notiMessage) {
    notiMessage.textContent = `Tổng ${pageResult.totalItems} người dùng | Mỗi trang tối đa ${PAGE_SIZE} người dùng`;
  }

  // Re-render pagination
  renderPagination(pageResult.totalPages, filter.pageNumber);

  // Re-attach event listeners
  attachUserActionListeners();
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

  // Calculate global index based on current page
  const startIndex = (filter.pageNumber - 1) * filter.pageSize;

  userListContainer.innerHTML = usersToRender
    .map((user, index) => {
      const globalIndex = startIndex + index + 1;
      const statusText = user.status === "active" ? "Hoạt động" : "Bị khóa";
      const statusClass =
        user.status === "active" ? "status-public" : "status-private";
      const lockActionText = user.status === "active" ? "Khóa" : "Mở khóa";
      const lockActionClass = user.status === "active" ? "" : "unlock-action";

      return `
        <div class="product-item-container" data-user-id="${user.id}">
          <div class="cart-item product-result-item__product">
            <div class="product-stt"><span>${globalIndex}</span></div>
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
    })
    .join("");
}

/**
 * Attach event listeners cho các action của user
 */
function attachUserActionListeners() {
  const userListContainer = document.querySelector(".user-list-container");
  if (!userListContainer) return;

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
      if (
        confirm(`Bạn có chắc chắn muốn ${actionText} người dùng này không?`)
      ) {
        if (user.status === "active") {
          blockUser(userId);
        } else {
          unBlockUser(userId);
        }
        loadUserManagePage(); // Tải lại trang để cập nhật giao diện
      }
      return;
    }

    // Xử lý reset mật khẩu
    if (resetLink) {
      event.preventDefault();
      const userId = resetLink.dataset.userId;
      if (
        confirm(
          `Bạn có chắc muốn reset mật khẩu cho người dùng này về "123456" không?`
        )
      ) {
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

function setUpUserManagePage() {
  setUpAdminNav();

  const searchInput = document.getElementById("user-search-input");
  const searchBtn = document.getElementById("user-search-btn");
  const resetBtn = document.querySelector(".user-manage-search__button-reset");

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const keyword = searchInput.value.trim();
    filter.searchKey = keyword || null;
    filter.pageNumber = 1; // Reset về trang 1
    updateUserList();
  };

  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Xử lý nút làm mới
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    filter.searchKey = null;
    filter.pageNumber = 1;
    updateUserList();
  });

  // Initial pagination render
  const pageResult = filterUsers();
  renderPagination(pageResult.totalPages, filter.pageNumber);

  // Attach user action listeners
  attachUserActionListeners();
}

export function loadUserManagePage() {
  allUsers = getAllUsers(); // Lấy tất cả user một lần

  // Reset filter
  filter = {
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    searchKey: null,
  };

  renderUserManageLayout();
  setUpUserManagePage();

  // Render lần đầu
  const pageResult = filterUsers();
  renderUserList(pageResult.items);
}
