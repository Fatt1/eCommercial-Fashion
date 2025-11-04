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

            <!-- Warning Alert Section -->
            <div id="stock-warning-alert" style="display: none; margin: 15px 0; padding: 15px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px; color: #856404;">
              <strong>⚠️ Cảnh báo:</strong> <span id="warning-message"></span>
            </div>

            <!-- Filter Section -->
            <div class="inventory-manage__filter">
              <div class="filter-tabs" style="display: flex; gap: 10px; align-items: center;">
                <label style="font-weight: 500;">Xem theo:</label>
                <select class="filter-select" id="inventory-filter-type">
                  <option value="ton-kho">Số Lượng Tồn Kho</option>
                  <option value="ban-ra">Số Lượng Bán Ra</option>
                  <option value="nhap">Số lượng Nhập</option>
                </select>
              </div>
              
              <!-- Lọc theo khoảng số lượng (động theo filter type) -->
              <div class="filter-range" style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
                <label id="filter-range-label" style="font-weight: 500;">Lọc theo số lượng tồn kho:</label>
                <input 
                  type="number" 
                  id="quantity-min" 
                  placeholder="Từ" 
                  min="0"
                  style="width: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                />
                <span>-</span>
                <input 
                  type="number" 
                  id="quantity-max" 
                  placeholder="Đến" 
                  min="0"
                  style="width: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                />
                <button 
                  id="apply-quantity-filter-btn"
                  style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
                >
                  Áp dụng
                </button>
                <button 
                  id="reset-quantity-filter-btn"
                  style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"
                >
                  Xóa lọc
                </button>
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
  quantityMin: null,  // Số lượng tối thiểu (áp dụng cho tiêu chí đang chọn)
  quantityMax: null,  // Số lượng tối đa (áp dụng cho tiêu chí đang chọn)
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

  // Setup stock range filter
  setupStockRangeFilter();

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

  /**
   * Tính toán tồn kho cho mỗi sản phẩm
   * 
   * Logic tính toán:
   * 1. stockCurrent (Số lượng còn lại): Tổng stock từ tất cả SKUs của sản phẩm
   * 2. stockSold (Số lượng đã bán): Tổng số lượng từ các đơn hàng hợp lệ
   * 3. stockIn (Số lượng nhập): stockCurrent + stockSold
   * 
   * Công thức: Số lượng nhập = Số lượng còn lại + Số lượng đã bán
   */
  const inventoryData = products.map((product) => {
    const skus = getSkusByProductId(product.id);

    // Tổng số lượng tồn kho hiện tại (còn lại trong kho)
    const stockCurrent = skus.reduce((sum, sku) => sum + (sku.stock || 0), 0);

    // Tính số lượng đã bán từ orders (bao gồm cả đơn đang xử lý và hoàn thành)
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

  // Apply quantity range filter (lọc theo số lượng dựa trên filterType)
  let filteredInventoryData = inventoryData;
  if (currentFilter.quantityMin !== null || currentFilter.quantityMax !== null) {
    filteredInventoryData = inventoryData.filter((item) => {
      // Chọn giá trị để lọc dựa theo filterType
      let quantity;
      switch (currentFilter.filterType) {
        case "ton-kho":
          quantity = item.stockCurrent;
          break;
        case "ban-ra":
          quantity = item.stockSold;
          break;
        case "nhap":
          quantity = item.stockIn;
          break;
        default:
          quantity = item.stockCurrent;
      }
      
      const min = currentFilter.quantityMin !== null ? currentFilter.quantityMin : 0;
      const max = currentFilter.quantityMax !== null ? currentFilter.quantityMax : Infinity;
      return quantity >= min && quantity <= max;
    });
  }

  // Sort dựa vào filter type
  switch (currentFilter.filterType) {
    case "ton-kho":
      // Sort theo số lượng còn lại (ít nhất lên đầu)
      filteredInventoryData.sort((a, b) => a.stockCurrent - b.stockCurrent);
      break;
    case "ban-ra":
      // Sort theo số lượng bán ra (nhiều nhất lên đầu)
      filteredInventoryData.sort((a, b) => b.stockSold - a.stockSold);
      break;
    case "nhap":
      // Sort theo số lượng nhập (nhiều nhất lên đầu)
      filteredInventoryData.sort((a, b) => b.stockIn - a.stockIn);
      break;
    default:
      filteredInventoryData.sort((a, b) => a.stockCurrent - b.stockCurrent);
  }

  // Pagination
  const paginatedData = createPagination(filteredInventoryData, pageSize, pageNumber);

  renderInventoryTable(paginatedData.items);
  renderPagination(paginatedData.pageNumber, paginatedData.totalPages);

  // Update total count with statistics (dùng filteredInventoryData sau khi đã lọc)
  const totalElement = document.querySelector(".noti-message");
  if (totalElement) {
    // Tính tổng số liệu từ dữ liệu đã được lọc
    const totalStockIn = filteredInventoryData.reduce((sum, item) => sum + item.stockIn, 0);
    const totalStockCurrent = filteredInventoryData.reduce((sum, item) => sum + item.stockCurrent, 0);
    const totalStockSold = filteredInventoryData.reduce((sum, item) => sum + item.stockSold, 0);
    
    // Hiển thị thông tin lọc nếu có
    let filterInfo = '';
    if (currentFilter.quantityMin !== null || currentFilter.quantityMax !== null) {
      const filterTypeText = {
        'ton-kho': 'Tồn kho',
        'ban-ra': 'Bán ra',
        'nhap': 'Nhập'
      };
      const typeLabel = filterTypeText[currentFilter.filterType] || 'Tồn kho';
      filterInfo = ` (Lọc ${typeLabel}: ${currentFilter.quantityMin ?? 0} - ${currentFilter.quantityMax ?? '∞'})`;
    }
    
    totalElement.textContent = `Tổng ${filteredInventoryData.length} sản phẩm${filterInfo} | Nhập: ${totalStockIn} | Còn lại: ${totalStockCurrent} | Đã bán: ${totalStockSold} | Mỗi trang tối đa ${pageSize} sản phẩm`;
  }

  // Hiển thị cảnh báo nếu có sản phẩm sắp hết hàng hoặc hết hàng
  showStockWarning(inventoryData);
}

/**
 * Hiển thị cảnh báo khi có sản phẩm hết hàng hoặc sắp hết hàng
 */
function showStockWarning(inventoryData) {
  const warningAlert = document.getElementById("stock-warning-alert");
  const warningMessage = document.getElementById("warning-message");

  if (!warningAlert || !warningMessage) return;

  // Đếm số sản phẩm theo trạng thái
  const outOfStock = inventoryData.filter(item => item.stockCurrent === 0);
  const lowStock = inventoryData.filter(item => item.stockCurrent > 0 && item.stockCurrent <= 20);

  // Tạo thông báo cảnh báo
  if (outOfStock.length > 0 || lowStock.length > 0) {
    let messages = [];
    
    if (outOfStock.length > 0) {
      messages.push(`<strong>${outOfStock.length}</strong> sản phẩm <strong>hết hàng</strong>`);
    }
    
    if (lowStock.length > 0) {
      messages.push(`<strong>${lowStock.length}</strong> sản phẩm <strong>sắp hết hàng</strong> (≤ 20 sp)`);
    }

    warningMessage.innerHTML = `Có ${messages.join(' và ')}. Vui lòng nhập hàng kịp thời!`;
    warningAlert.style.display = "block";
  } else {
    warningAlert.style.display = "none";
  }
}

/**
 * Tính số lượng đã bán từ orders
 * 
 * Logic tính toán:
 * - Chỉ tính các đơn hàng có trạng thái hợp lệ (COMPLETED, PENDING, PROCESSING, SHIPPING)
 * - Không tính đơn hàng đã hủy (CANCELLED) hoặc trả lại (RETURNED)
 * - Tổng hợp số lượng từ tất cả các items trong order có productId trùng khớp
 * 
 * @param {string} productId - ID của sản phẩm cần tính
 * @param {Array} orders - Danh sách tất cả đơn hàng
 * @returns {number} Tổng số lượng đã bán
 */
function calculateStockSold(productId, orders) {
  let totalSold = 0;

  // Các trạng thái đơn hàng được tính vào số lượng đã bán
  const validStatuses = ["COMPLETED", "PENDING", "PROCESSING", "SHIPPING"];

  orders.forEach((order) => {
    // Tính orders có trạng thái hợp lệ (không tính CANCELLED và RETURNED)
    if (validStatuses.includes(order.status) && order.items) {
      order.items.forEach((item) => {
        if (item.productId === productId) {
          totalSold += item.quantity || 0;
        }
      });
    }
  });

  return totalSold;
}

/**
 * Xác định trạng thái tồn kho
 * - Hết hàng: stockCurrent = 0
 * - Sắp hết hàng: 0 < stockCurrent <= 20
 * - Bình thường: stockCurrent > 20
 */
function getStockStatus(stockCurrent) {
  if (stockCurrent === 0) {
    return "out";
  } else if (stockCurrent <= 20) {
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

/**
 * Get status badge theo trạng thái
 * - Hết hàng: stockCurrent = 0
 * - Sắp hết hàng: 0 < stockCurrent <= 20
 * - Bình thường: stockCurrent > 20
 */
function getStatusBadge(status, stockCurrent) {
  if (stockCurrent === 0) {
    return '<span class="status-out">Hết hàng</span>';
  } else if (stockCurrent <= 20) {
    return '<span class="status-warning">Sắp hết hàng</span>';
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
  const filterRangeLabel = document.getElementById("filter-range-label");
  const dateFrom = document.getElementById("date-from");
  const dateTo = document.getElementById("date-to");
  const filterBtn = document.getElementById("refresh-filter-btn");

  // Hàm cập nhật label theo filter type
  function updateFilterLabel(filterType) {
    if (filterRangeLabel) {
      const labels = {
        'ton-kho': 'Lọc theo số lượng tồn kho:',
        'ban-ra': 'Lọc theo số lượng bán ra:',
        'nhap': 'Lọc theo số lượng nhập:'
      };
      filterRangeLabel.textContent = labels[filterType] || 'Lọc theo số lượng:';
    }
  }

  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      currentFilter.filterType = filterSelect ? filterSelect.value : "ton-kho";
      currentFilter.dateFrom = dateFrom ? dateFrom.value : "";
      currentFilter.dateTo = dateTo ? dateTo.value : "";
      currentFilter.pageNumber = 1;

      loadInventoryData(1, currentFilter.pageSize);
    });
  }

  // Tự động cập nhật khi thay đổi filter type
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      currentFilter.filterType = filterSelect.value;
      currentFilter.pageNumber = 1; // Reset về trang 1
      updateFilterLabel(filterSelect.value); // Cập nhật label
      loadInventoryData(1, currentFilter.pageSize);
    });
  }

  // Set label ban đầu
  updateFilterLabel(currentFilter.filterType);
}

// Setup quantity range filter (lọc theo số lượng động)
function setupStockRangeFilter() {
  const quantityMinInput = document.getElementById("quantity-min");
  const quantityMaxInput = document.getElementById("quantity-max");
  const applyBtn = document.getElementById("apply-quantity-filter-btn");
  const resetBtn = document.getElementById("reset-quantity-filter-btn");

  // Áp dụng filter
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const minValue = quantityMinInput.value.trim();
      const maxValue = quantityMaxInput.value.trim();

      // Cập nhật filter state
      currentFilter.quantityMin = minValue !== "" ? parseInt(minValue) : null;
      currentFilter.quantityMax = maxValue !== "" ? parseInt(maxValue) : null;
      currentFilter.pageNumber = 1; // Reset về trang 1

      // Validate
      if (currentFilter.quantityMin !== null && currentFilter.quantityMax !== null) {
        if (currentFilter.quantityMin > currentFilter.quantityMax) {
          alert("Giá trị 'Từ' không thể lớn hơn giá trị 'Đến'");
          return;
        }
      }

      loadInventoryData(1, currentFilter.pageSize);
    });
  }

  // Reset filter
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // Clear inputs
      if (quantityMinInput) quantityMinInput.value = "";
      if (quantityMaxInput) quantityMaxInput.value = "";

      // Reset filter state
      currentFilter.quantityMin = null;
      currentFilter.quantityMax = null;
      currentFilter.pageNumber = 1;

      loadInventoryData(1, currentFilter.pageSize);
    });
  }

  // Enter key để apply filter
  [quantityMinInput, quantityMaxInput].forEach((input) => {
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyBtn.click();
        }
      });
    }
  });
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
