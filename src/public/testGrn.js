// Import các service cần thiết
import {
  getAllProductForAdmin,
  searchProducts,
  getSkusByProductId,
  getDetailOneSku,
  getProductById,
} from "../services/productService.js";
import { getAllGRNs, addGRN } from "../services/gRnService.js";

// --- State cục bộ cho module ---
let currentStagingItems = []; // Lưu các chi tiết SP cho phiếu nhập tạm thời
let selectedProductId = null; // Chỉ cho phép chọn 1 sản phẩm
const rootElement = document.getElementById("root");

// --- Hàm Format (Helper) ---
// Tạo hàm formatNumber vì nó không có trong helper.js
function formatNumber(num) {
  return new Intl.NumberFormat("vi-VN").format(num);
}
// Lấy ngày hôm nay theo format YYYY-MM-DD
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// ===================================================================
// VIEW 1: DANH SÁCH PHIẾU NHẬP (Hình 2)
// ===================================================================

export function loadGoodsReceivedNoteList() {
  rootElement.innerHTML = renderGRNListPage();
  setUpGRNListPage();
}

function renderGRNListPage() {
  const grns = getAllGRNs();

  return `
    <div class="grn-list-container">
      <div class="product-manage__head">
        <div class="product-manage__head-left">
          <a>Danh sách phiếu nhập</a>
        </div>
        <div class="product-manage__head-right">
          <button class="black-yellow__button" id="add-grn-btn">Thêm phiếu hàng</button>
        </div>
      </div>
      <div class="product-manage-main">
        <div class="product-manage-main-search">
          <input type="text" placeholder="Tìm kiếm mã phiếu..." />
          <button class="product-manage-main-search__button blue__button">SEARCH</button>
        </div>
        <div class="cart product-result">
          <div class="cart-info">
            <div class="grn-status">Trạng thái</div>
            <div class="grn-id">Mã phiếu</div>
            <div class="grn-date">Ngày nhập</div>
            <div class="grn-total-price">Giá nhập</div>
            <div class="grn-total-quantity">Số Lượng</div>
            <div class="grn-action">Hành động</div>
          </div>
          <div class="grn-list-item-container">
            ${
              grns.length === 0
                ? `<p style="padding: 20px; text-align: center;">Chưa có phiếu nhập nào.</p>`
                : ""
            }
            ${grns.map(renderGRNItem).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGRNItem(grn) {
  return `
    <div class="cart-item">
      <div class="grn-status">${grn.status}</div>
      <div class="grn-id">${grn.id}</div>
      <div class="grn-date">${grn.createdAt}</div>
      <div class="grn-total-price">${formatNumber(grn.totalPrice)}đ</div>
      <div class="grn-total-quantity">${formatNumber(grn.totalQuantity)}</div>
      <div class="grn-action">
        <button title="Xem">👁️</button>
        <button title="Sửa">✏️</button>
      </div>
    </div>
  `;
}

function setUpGRNListPage() {
  document.getElementById("add-grn-btn").addEventListener("click", () => {
    loadAddGoodsReceivedNote(); // Chuyển sang màn hình Thêm
  });
  // (Thêm sự kiện cho search/filter sau)
}

// ===================================================================
// VIEW 2: THÊM PHIẾU NHẬP (Hình 1)
// ===================================================================

export function loadAddGoodsReceivedNote() {
  // Reset state khi vào trang
  currentStagingItems = [];
  selectedProductId = null;
  rootElement.innerHTML = renderAddGRNPage();
  setUpAddGRNPage();
}

function renderAddGRNPage() {
  return `
    <div class="add-grn-container">
      <div class="admin__main--top">
        <div class="admin__main--title">Thông Tin Phiếu Nhập</div>
        <div class="date-flexbox">
          <label for="grn-date">Ngày nhập</label>
          <input type="date" id="grn-date" value="${getTodayDate()}" readonly />
        </div>
      </div>

      <div class="admin__main--middle">
        <div class="middle--left">
          <div class="inputs-flexbox">
            <div class="inputs">
              <label for="grn-cost-price">Giá nhập</label>
              <input type="number" id="grn-cost-price" placeholder="0" />
            </div>
            <div class="inputs">
              <label for="grn-quantity">Số lượng</label>
              <input type="number" id="grn-quantity" placeholder="0" />
            </div>
          </div>
          <div class="save-button-container">
            <button class="black-yellow__button" id="add-item-btn">Lưu (Thêm SP)</button>
          </div>
          <table class="sku__container">
            <thead>
              <tr>
                <th>Mã SKU</th>
                <th>Tên sản phẩm</th>
                <th>Giá nhập</th>
                <th>Số lượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody id="staging-table-body">
              <!-- Các chi tiết phiếu nhập sẽ được render vào đây -->
            </tbody>
          </table>
        </div>
        <div class="middle--right">
          <div class="search-bar">
            <input type="text" id="product-search-input" placeholder="Tìm kiếm theo tên sản phẩm" />
            <button class="blue__button" id="product-search-btn">SEARCH</button>
          </div>
          <div class="product-list-selector" id="product-list-selector">
            <!-- Danh sách sản phẩm sẽ được render vào đây -->
          </div>
        </div>
      </div>

      <div class="admin__main--bottom">
        <button class_name="black-yellow__button" id="cancel-grn-btn" style="background-color: #6c757d">Quay lại</button>
        <button class="black-yellow__button" id="save-grn-btn">Lưu Thay Đổi</button>
      </div>
    </div>
  `;
}

// --- Logic cho Trang Thêm Phiếu Nhập ---

function setUpAddGRNPage() {
  const productSearchInput = document.getElementById("product-search-input");
  const productSearchBtn = document.getElementById("product-search-btn");
  const productListContainer = document.getElementById("product-list-selector");
  const addItemBtn = document.getElementById("add-item-btn");
  const saveGRNBtn = document.getElementById("save-grn-btn");
  const cancelGRNBtn = document.getElementById("cancel-grn-btn");

  // Tải danh sách sản phẩm ban đầu
  const allProducts = getAllProductForAdmin({ pageSize: 1000 }).items;
  renderProductSelector(allProducts);

  // Gắn sự kiện Search
  productSearchBtn.addEventListener("click", () => {
    const keyword = productSearchInput.value.trim();
    const searchResult = searchProducts({
      searchKey: keyword,
      pageSize: 1000,
    }).items;
    renderProductSelector(searchResult);
  });
  productSearchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") productSearchBtn.click();
  });

  // Gắn sự kiện nút "Lưu (Thêm SP)" (Bên trái)
  addItemBtn.addEventListener("click", handleAddItemToStage);

  // Gắn sự kiện nút "Lưu Thay Đổi" (Dưới cùng)
  saveGRNBtn.addEventListener("click", handleSaveGRN);

  // Gắn sự kiện nút "Quay lại"
  cancelGRNBtn.addEventListener("click", () => {
    if (
      confirm("Bạn có chắc muốn hủy phiếu nhập này? Mọi thay đổi sẽ bị mất.")
    ) {
      loadGoodsReceivedNoteList();
    }
  });
}

// Render danh sách sản phẩm (bên phải)
function renderProductSelector(products) {
  const container = document.getElementById("product-list-selector");
  container.innerHTML = products.map(renderProductSelectorItem).join("");

  // Gắn sự kiện cho các nút "Xem thêm SKU"
  container.querySelectorAll(".view-more__sku").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.dataset.productId;
      const skuListId = `sku-list-${productId}`;
      const skuContainer = document.getElementById(skuListId);

      if (skuContainer.classList.contains("open")) {
        skuContainer.innerHTML = "";
        skuContainer.classList.remove("open");
        e.target.textContent = "Xem thêm SKU";
      } else {
        const skus = getSkusByProductId(productId);
        skuContainer.innerHTML = skus.map(renderSKUSelectorItem).join("");
        skuContainer.classList.add("open");
        e.target.textContent = "Thu gọn";
        // Gắn sự kiện cho các checkbox SKU
        attachSKUCheckboxListeners(productId);
      }
    });
  });

  // Gắn sự kiện cho các checkbox Product (Master)
  attachProductCheckboxListeners();
}

function renderProductSelectorItem(product) {
  return `
    <div class="product--columns">
      <div class="import-products">
        <input type="checkbox" class="product-master-check" data-product-id="${
          product.id
        }" />
        <img src="../assets/${product.thumbnail || "sample-image.jpg"}" alt="${
    product.name
  }" />
        <div class="import-products-name">${product.name}</div>
      </div>
      <button class="black-yellow__button view-more__sku" data-product-id="${
        product.id
      }">
        Xem thêm SKU
      </button>
      <div class="sku-selector-list" id="sku-list-${product.id}">
        <!-- SKU items render ở đây -->
      </div>
    </div>
  `;
}

function renderSKUSelectorItem(sku) {
  const detail = getDetailOneSku(sku, sku.productId);
  const skuName = detail.selectedDetails.map((d) => d.name).join(", ");
  return `
    <div class="sku-item">
      <input type="checkbox" class="sku-check" data-sku-id="${sku.id}" data-product-id="${sku.productId}" />
      <span class="sku-item-name">${skuName} (Tồn: ${sku.stock})</span>
    </div>
  `;
}

// Logic Checkbox (Phần phức tạp)
function attachProductCheckboxListeners() {
  document.querySelectorAll(".product-master-check").forEach((chk) => {
    chk.addEventListener("change", (e) => {
      const productId = e.target.dataset.productId;
      const isChecked = e.target.checked;

      // Logic "chỉ 1 product được chọn"
      if (isChecked) {
        if (selectedProductId && selectedProductId !== productId) {
          // Bỏ tick master cũ
          const oldMaster = document.querySelector(
            `.product-master-check[data-product-id="${selectedProductId}"]`
          );
          if (oldMaster) oldMaster.checked = false;
          // Bỏ tick tất cả SKU con của master cũ
          document
            .querySelectorAll(
              `.sku-check[data-product-id="${selectedProductId}"]`
            )
            .forEach((oldSku) => (oldSku.checked = false));
        }
        selectedProductId = productId;
      } else {
        selectedProductId = null;
      }

      // Tick tất cả SKU con
      document
        .querySelectorAll(`.sku-check[data-product-id="${productId}"]`)
        .forEach((skuChk) => {
          skuChk.checked = isChecked;
        });
    });
  });
}

function attachSKUCheckboxListeners(productId) {
  const skuCheckboxes = document.querySelectorAll(
    `.sku-check[data-product-id="${productId}"]`
  );
  const masterCheckbox = document.querySelector(
    `.product-master-check[data-product-id="${productId}"]`
  );

  skuCheckboxes.forEach((chk) => {
    chk.addEventListener("change", (e) => {
      const isChecked = e.target.checked;

      // Logic "chỉ 1 product được chọn"
      if (isChecked) {
        if (selectedProductId && selectedProductId !== productId) {
          // Nếu user tick vào SKU của 1 product MỚI,
          // Bỏ tick master cũ
          const oldMaster = document.querySelector(
            `.product-master-check[data-product-id="${selectedProductId}"]`
          );
          if (oldMaster) oldMaster.checked = false;
          // Bỏ tick tất cả SKU con của master cũ
          document
            .querySelectorAll(
              `.sku-check[data-product-id="${selectedProductId}"]`
            )
            .forEach((oldSku) => (oldSku.checked = false));
        }
        selectedProductId = productId;
        masterCheckbox.checked = true; // Tick master hiện tại
      }

      // Kiểm tra xem có nên untick master không
      const allSkus = Array.from(skuCheckboxes);
      if (allSkus.every((sku) => !sku.checked)) {
        masterCheckbox.checked = false;
        selectedProductId = null;
      }
    });
  });
}

// Logic Thêm SP vào Bảng Tạm (Bên trái)
function handleAddItemToStage() {
  const costPrice = parseFloat(document.getElementById("grn-cost-price").value);
  const quantity = parseInt(document.getElementById("grn-quantity").value);

  if (isNaN(costPrice) || costPrice <= 0) {
    alert("Vui lòng nhập giá nhập hợp lệ.");
    return;
  }
  if (isNaN(quantity) || quantity <= 0) {
    alert("Vui lòng nhập số lượng hợp lệ.");
    return;
  }
  if (!selectedProductId) {
    alert("Vui lòng chọn ít nhất 1 sản phẩm hoặc SKU.");
    return;
  }

  const tickedSkuCheckboxes = document.querySelectorAll(
    `.sku-check[data-product-id="${selectedProductId}"]:checked`
  );

  if (tickedSkuCheckboxes.length === 0) {
    alert("Vui lòng chọn ít nhất 1 SKU của sản phẩm đã chọn.");
    return;
  }

  tickedSkuCheckboxes.forEach((chk) => {
    const skuId = chk.dataset.skuId;
    // Tránh thêm trùng lặp
    if (!currentStagingItems.some((item) => item.skuId === skuId)) {
      const product = getProductById(selectedProductId);
      const sku = getSkusByProductId(selectedProductId).find(
        (s) => s.id === skuId
      );
      const detail = getDetailOneSku(sku, selectedProductId);
      const skuName = detail.selectedDetails.map((d) => d.name).join(", ");

      currentStagingItems.push({
        skuId: skuId,
        productId: selectedProductId,
        productName: product.name,
        skuName: skuName,
        costPrice: costPrice,
        quantity: quantity,
      });
    }
  });

  renderStagingTable();
  // Reset input
  document.getElementById("grn-cost-price").value = "";
  document.getElementById("grn-quantity").value = "";
}

// Vẽ lại bảng tạm (bên trái)
function renderStagingTable() {
  const tableBody = document.getElementById("staging-table-body");
  tableBody.innerHTML = currentStagingItems
    .map(
      (item, index) => `
    <tr>
      <td>${item.skuId}</td>
      <td>${item.productName} (${item.skuName})</td>
      <td>${formatNumber(item.costPrice)}đ</td>
      <td>${item.quantity}</td>
      <td><button class="delete-stage-item" data-index="${index}">Xóa</button></td>
    </tr>
  `
    )
    .join("");

  // Gắn sự kiện Xóa cho các item
  document.querySelectorAll(".delete-stage-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      currentStagingItems.splice(index, 1); // Xóa item khỏi mảng
      renderStagingTable(); // Vẽ lại bảng
    });
  });
}

// Logic Lưu Toàn Bộ Phiếu Nhập
function handleSaveGRN() {
  if (currentStagingItems.length === 0) {
    alert("Bạn chưa thêm sản phẩm nào vào phiếu nhập.");
    return;
  }

  const createdAt = document.getElementById("grn-date").value;
  let totalPrice = 0;
  let totalQuantity = 0;

  currentStagingItems.forEach((item) => {
    totalPrice += item.costPrice * item.quantity;
    totalQuantity += item.quantity;
  });

  const grnData = {
    createdAt: createdAt,
    totalPrice: totalPrice,
    totalQuantity: totalQuantity,
    items: currentStagingItems, // Mảng chi tiết
  };

  addGRN(grnData); // Lưu vào service

  alert("Đã tạo phiếu nhập hàng thành công!");
  loadGoodsReceivedNoteList(); // Quay về trang danh sách
}
