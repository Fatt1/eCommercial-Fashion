import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  getAllProducts,
  getProductById,
  getSkusByProductId,
  searchProducts,
} from "../../../../services/productService.js";
import { getDbContextFromLocalStorage } from "../../../../helper/initialData.js";
import { createPagination } from "../../../../helper/helper.js";

// Render HTML cho trang Quản lý Tồn kho
export function renderInventoryManageHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content__admin">
          <!-- Inventory Management Section -->
          <div class="inventory-manage">
            <!-- Header Section -->
            <div class="admin__header">
              <div class="admin__header--left">
                <h1 class="admin__homepage--text">Thống Kê</h1>
                <div class="vertical-line"></div>
                <div class="admin__search-bar">
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    class="search-bar-inadmin"
                    id="inventory-search-input"
                  />
                  <button id="inventory-search-btn">SEARCH</button>
                </div>
              </div>
              <div class="admin__header--right">
                <img src="../assets/notification-icon.png" class="icon" />
                <img src="../assets/defaut-avatar.png" class="icon2" />
                ADMIN
              </div>
            </div>

            <!-- Filter Section -->
            <div class="inventory-manage__filter">
              <div class="filter-tabs">
                <select class="filter-select" id="inventory-filter-type">
                  <option value="ton-kho">Số Lượng Tồn Kho</option>
                  <option value="ban-ra">Số Lượng Bán Ra</option>
                  <option value="nhap">Số lượng Nhập</option>
                </select>
              </div>
            </div>

            <!-- Inventory Table -->
            <div class="inventory-manage__table">
              <div class="cart product-result">
                <div class="cart-info product-result-info">
                  <div class="product-stt">STT</div>
                  <div class="product-status">TRẠNG THÁI</div>
                  <div class="product-main product-result-info__main">TÊN SẢN PHẨM</div>
                  <div class="product-stock-in">SỐ LƯỢNG NHẬP</div>
                  <div class="product-stock-current">SỐ LƯỢNG CÒN LẠI</div>
                  <div class="product-stock-sold">SỐ LƯỢNG ĐÃ BÁN</div>
                </div>
                <div class="inventory-table__body">
                  <!-- Data will be loaded here -->
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="product-manage-main-result__end">
              <div class="noti-message">Mỗi trang tối đa 10 sản phẩm</div>
              <div class="pagination">
                <!-- Pagination buttons will be generated here -->
              </div>
              <div class="page-index-track">Trang 1/1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// State management
let currentFilter = {
  pageNumber: 1,
  pageSize: 10,
  searchKey: "",
  filterType: "ton-kho",
  dateFrom: "",
  dateTo: "",
};

// Setup tất cả event listeners
function setupInventoryManage() {
  setUpAdminNav();

  // Load dữ liệu ban đầu
  loadInventoryData();

  // Setup search
  setupSearch();

  // Setup filter
  setupFilter();

  // Setup refresh
  setupRefresh();
}

// Load dữ liệu tồn kho từ database
function loadInventoryData(pageNumber = 1, pageSize = 10) {
  currentFilter.pageNumber = pageNumber;
  currentFilter.pageSize = pageSize;

  const tbody = document.querySelector(".inventory-table__body");

  // Lấy tất cả sản phẩm
  const dbContext = getDbContextFromLocalStorage();
  let products = dbContext.products.filter((p) => !p.isDeleted);

  // Apply search filter
  if (currentFilter.searchKey) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(currentFilter.searchKey.toLowerCase()) ||
        p.desc.toLowerCase().includes(currentFilter.searchKey.toLowerCase())
    );
  }

  // Tính toán tồn kho cho mỗi sản phẩm
  const inventoryData = products.map((product) => {
    const skus = getSkusByProductId(product.id);

    // Tổng số lượng tồn kho hiện tại
    const stockCurrent = skus.reduce((sum, sku) => sum + sku.stock, 0);

    // Tính số lượng đã bán từ orders
    const stockSold = calculateStockSold(product.id, dbContext.orders);

    // Tổng số lượng nhập = hiện tại + đã bán
    const stockIn = stockCurrent + stockSold;

    return {
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      stockIn: stockIn,
      stockCurrent: stockCurrent,
      stockSold: stockSold,
      status: getStockStatus(stockCurrent),
    };
  });

  // Sort theo số lượng còn lại (ít nhất lên đầu)
  inventoryData.sort((a, b) => a.stockCurrent - b.stockCurrent);

  // Pagination
  const paginatedData = createPagination(inventoryData, pageSize, pageNumber);

  renderInventoryTable(paginatedData.items);
  renderPagination(paginatedData.pageNumber, paginatedData.totalPages);

  // Update total count
  const totalElement = document.querySelector(".noti-message");
  if (totalElement) {
    totalElement.textContent = `Tổng ${inventoryData.length} sản phẩm - Mỗi trang tối đa ${pageSize} sản phẩm`;
  }
}

// Tính số lượng đã bán từ orders
function calculateStockSold(productId, orders) {
  let totalSold = 0;

  orders.forEach((order) => {
    // Chỉ tính orders đã hoàn thành
    if (order.status === "COMPLETED" && order.items) {
      order.items.forEach((item) => {
        if (item.productId === productId) {
          totalSold += item.quantity || 0;
        }
      });
    }
  });

  return totalSold;
}

// Xác định trạng thái tồn kho
function getStockStatus(stockCurrent) {
  if (stockCurrent < 10) {
    return "out";
  } else if (stockCurrent < 30) {
    return "warning";
  } else {
    return "normal";
  }
}

// Render bảng tồn kho
function renderInventoryTable(data) {
  const tbody = document.querySelector(".inventory-table__body");

  if (!data || data.length === 0) {
    tbody.innerHTML = `<p style="padding: 16px; text-align: center;">Không tìm thấy sản phẩm nào.</p>`;
    return;
  }

  tbody.innerHTML = data
    .map((item, index) => {
      const statusBadge = getStatusBadge(item.status, item.stockCurrent);
      const startIndex =
        (currentFilter.pageNumber - 1) * currentFilter.pageSize;

      return `
      <div class="product-item-container">
        <div class="cart-item product-result-item__product">
          <div class="product-stt"><span>${startIndex + index + 1}</span></div>
          <div class="product-status">
            ${statusBadge}
          </div>
          <div class="product-main">
            <div class="product-info">
              <img src="../assets/products/${
                item.thumbnail
              }" alt="Product" class="product-main__img" />
              <span class="product-name">${item.name}</span>
            </div>
          </div>
          <div class="product-stock-in"><span>${item.stockIn}</span></div>
          <div class="product-stock-current"><span>${
            item.stockCurrent
          }</span></div>
          <div class="product-stock-sold"><span>${item.stockSold}</span></div>
        </div>
      </div>
    `;
    })
    .join("");
}

// Get status badge theo trạng thái
function getStatusBadge(status, stockCurrent) {
  if (status === "out" || stockCurrent < 10) {
    return '<span class="status-out">Sắp hết hàng</span>';
  } else if (status === "warning" || stockCurrent < 30) {
    return '<span class="status-warning">Cảnh báo</span>';
  } else {
    return '<span class="status-normal">Bình thường</span>';
  }
}

// Render pagination
function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  const pageIndexTrack = document.querySelector(".page-index-track");

  let html = "";

  // Previous button
  html += `
    <a href="#" class="prev-btn pagination-btn ${
      currentPage === 1 ? "disable-pagination-link" : ""
    }" data-page="${currentPage - 1}">
      <img src="../assets/prev-btn.svg" alt="Previous" />
    </a>
  `;

  // Page numbers
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
      html += `<span>...</span>`;
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
  pageIndexTrack.textContent = `Trang ${currentPage}/${totalPages}`;

  // Setup pagination click events
  setupPaginationEvents();
}

// Setup pagination events
function setupPaginationEvents() {
  const paginationBtns = document.querySelectorAll(
    ".pagination-btn:not(.disable-pagination-link)"
  );

  paginationBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(btn.dataset.page);
      if (page && page > 0) {
        loadInventoryData(page);
      }
    });
  });
}

// Setup search functionality
function setupSearch() {
  const searchBtn = document.getElementById("inventory-search-btn");
  const searchInput = document.getElementById("inventory-search-input");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      currentFilter.searchKey = searchTerm;
      currentFilter.pageNumber = 1; // Reset về trang 1
      loadInventoryData(1, currentFilter.pageSize);
    });
  }

  // Enter key search
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  }
}

// Setup filter functionality
function setupFilter() {
  const filterSelect = document.getElementById("inventory-filter-type");
  const dateFrom = document.getElementById("date-from");
  const dateTo = document.getElementById("date-to");
  const filterBtn = document.getElementById("refresh-filter-btn");

  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      currentFilter.filterType = filterSelect ? filterSelect.value : "ton-kho";
      currentFilter.dateFrom = dateFrom ? dateFrom.value : "";
      currentFilter.dateTo = dateTo ? dateTo.value : "";
      currentFilter.pageNumber = 1;

      loadInventoryData(1, currentFilter.pageSize);
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      currentFilter.filterType = filterSelect.value;
    });
  }
}

// Setup refresh button - Reset tất cả filter
function setupRefresh() {
  // Note: refresh-filter-btn đã được dùng làm nút "Lọc" ở trên
  // Có thể thêm nút reset riêng nếu cần
}

// Main load function
export function loadInventoryManagePage() {
  renderInventoryManageHtml();
  setupInventoryManage();
}
