import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { loadAddProduct } from "./addProduct.js";

// Import services
import {
  searchProducts,
  getSkusByProductId,
  getDetailOneSku,
  getAllProductForAdmin,
  getProductById,
} from "../../../../services/productService.js";
import { formatNumber } from "../../../../helper/formatNumber.js";

// === CÁC HÀM TẠO HTML TĨNH ===

function ProductManageHead() {
  return `
    <div class="product-manage__head">
      <div class="product-manage__head-left">
        <a class="selected">Danh sách sản phẩm</a>
        <a class="">Đang hoạt động</a>
        <a class="">Đang ẩn</a>
      </div>
      <div class="product-manage__head-right">
        <button class="add-product-btn">Thêm sản phẩm</button>
      </div>
    </div>
  `;
}

function ProductSearch() {
  return `
    <div class="product-manage-main-search">
      <input
        type="text"
        size="50"
        placeholder="Tìm kiếm sản phẩm..."
        class='product-manage-main-search__text'
      />
      <button class="product-manage-main-search__button product-manage-main-search__button1">
        Áp Dụng
      </button>
      <button class="product-manage-main-search__button product-manage-main-search__button2">
        Nhập Lại
      </button>
    </div>
  `;
}

// Hàm này chỉ render khung và tiêu đề của bảng, không chứa sản phẩm
function ProductList() {
  return `
    <div class="cart product-result">
      
      <div class="cart-info product-result-info">
        <div class="product-status">Trạng thái</div>
        <div class="product-main product-result-info__main">Sản phẩm</div>
        <div class="product-price product-result-info__price">Giá</div>
        <div class="product-quantity product-result-info__stock">Kho hàng</div>
        <div class="product-action">Thao tác</div>
      </div>
      
      <div class="product-list-container"></div>
    </div>
  `;
}

// Hàm render toàn bộ trang quản lý
export function renderProductAdminHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content__admin">
          <div class="product-manage">
            ${ProductManageHead()}
            <div class="product-manage-main">
              ${ProductSearch()}
              <div class="product-manage-main-result">
                <div class="product-manage-main-result__top">
                  <span class="product-manage-main-result__top--quantity">0 Sản Phẩm</span>
                </div>
                <div class="product-manage-main-result__bot">
                  ${ProductList()}
                </div>
                <div class="product-manage-main-result__end">
                  <div class="noti-message">Mỗi trang tối đa 5 sản phẩm</div>
                  <div class="pagination">
                    
                  </div>
                  <div class="page-index-track">Trang 1/12</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  `;
}

// === LOGIC VÀ SỰ KIỆN ===

// Hàm tính tổng kho hàng
function calculateStock(productId) {
  let stockSum = 0;
  const skus = getSkusByProductId(productId);
  skus.forEach((sku) => {
    stockSum += sku.stock;
  });
  return stockSum;
}

/**
 * HÀM RENDER CHÍNH:
 * - Dùng cho cả lần tải đầu tiên, tìm kiếm và lọc.
 * - Luôn tạo ra giao diện mới (hình 1).
 */
function renderSearchResults(products) {
  const resultContainer = document.querySelector(".product-list-container");
  resultContainer.innerHTML = ""; // Xóa kết quả cũ

  if (!products || products.length === 0) {
    resultContainer.innerHTML = `<p style="padding: 16px;">Không tìm thấy sản phẩm nào.</p>`;
    document.querySelector(
      ".product-manage-main-result__top--quantity"
    ).textContent = "0 Sản Phẩm";
    return;
  }

  document.querySelector(
    ".product-manage-main-result__top--quantity"
  ).textContent = products.length + " Sản Phẩm";

  const productItemsHtml = products
    .map((p) => {
      const skus = getSkusByProductId(p.id);
      const totalSkus = skus.length;
      const statusText = p.status === "public" ? "Đang hoạt động" : "Đã ẩn";
      const statusClass =
        p.status === "public" ? "status-public" : "status-private";

      return `
          <div class="product-item-container" data-product-id="${p.id}">
            <div class="cart-item product-result-item__product">
              <div class="product-status ${statusClass}"><span>${statusText}</span></div>
              <div class="product-main">
                <img class="product-main__img" src="../assets/large-img-detail.png" />
                <span>${p.name}</span>
              </div>
              <div class="product-price">
                <span class="product-price__current-price">${formatNumber(
                  p.priceInfo.currentlyPrice
                )}đ</span>
              </div>
              <div class="product-quantity"><span>${calculateStock(
                p.id
              )}</span></div>
              <div class="product-action">
              <a href="#!" class="update-link">Cập nhật</a>
              <br/>
              <br/>
              <a href="#!" class="delete-link">Xóa</a>
              </div>
            </div>
            ${
              totalSkus > 0
                ? `
              <div class="link-see-more">
                <a href="#!" class="show-sku-btn" data-product-id="${p.id}" data-sku-count="${totalSkus}">
                  Xem Thêm ( Còn ${totalSkus} sản phẩm )
                </a>
              </div>`
                : ""
            }
            <div class="sku-container" id="sku-container-${p.id}"></div>
          </div>
        `;
    })
    .join("");

  resultContainer.innerHTML = productItemsHtml;

  // Hàm render danh sách SKU
  function renderSkuList(skus) {
    if (!skus || skus.length === 0)
      return `<div class="sku-empty">Không có SKU nào</div>`;

    let htmlSku = skus
      .map((sku) => {
        const detail = getDetailOneSku(sku, sku.productId);
        const p = getProductById(sku.productId);
        if (detail) {
          return `
              <div class="sku">
                <div class="cart-item">
                  <div class="product-status"></div>
                  <div class="product-main product-main-sku">
                    <img class="product-main__img product-main__img-sku" src="../assets/large-img-detail.png" />
                    <div class="name-sku">
                      <span>${p.name}</span> 
                      <div>${detail.selectedDetails[0].name}, ${
            detail.selectedDetails[1].name
          }</div>
                    </div>
                  </div>
                  <div class="product-price"><span class="product-price__current-price">${formatNumber(
                    p.priceInfo.currentlyPrice || 0
                  )}đ</span></div>
                  <div class="product-quantity"><span>${
                    sku.stock || 0
                  }</span></div>
                  <div class="product-action"></div>
                </div>
              </div>`;
        }
        return "";
      })
      .join("");
    return `<div class="skus product-result-item__skus">${htmlSku}</div>`;
  }

  // Gắn sự kiện click cho nút "Xem Thêm"
  document.querySelectorAll(".show-sku-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = e.target.dataset.productId;
      const skuCount = e.target.dataset.skuCount;
      const container = document.getElementById(`sku-container-${productId}`);

      if (container.classList.contains("opened")) {
        container.classList.remove("opened");
        container.innerHTML = "";
        e.target.textContent = `Xem Thêm ( Còn ${skuCount} sản phẩm )`;
      } else {
        const skus = getSkusByProductId(productId);
        container.innerHTML = renderSkuList(skus);
        container.classList.add("opened");
        e.target.textContent = "Thu gọn";
      }
    });
  });
}

// Hàm gắn tất cả sự kiện cho trang
export function setUpProductManagePlayable() {
  const searchInput = document.querySelector(
    ".product-manage-main-search__text"
  );
  const searchBtn = document.querySelector(
    ".product-manage-main-search__button1"
  );
  const clearBtn = document.querySelector(
    ".product-manage-main-search__button2"
  );

  // Tải dữ liệu lần đầu tiên
  function renderFirstTime() {
    const { items } = getAllProductForAdmin({});
    renderSearchResults(items);
  }
  renderFirstTime();

  // Sự kiện tìm kiếm
  function handleSearch() {
    const keyword = searchInput.value.trim();
    const { items } = searchProducts({
      searchKey: keyword,
      pageSize: 5,
      pageNumber: 1,
    });
    renderSearchResults(items); // Dùng lại hàm render chính
  }

  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    handleSearch();
  });

  // Sự kiện cho các tab lọc
  const tabLinks = document.querySelectorAll(".product-manage__head-left a");
  tabLinks.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabLinks.forEach((link) => link.classList.remove("selected"));
      tab.classList.add("selected");

      const { items } = getAllProductForAdmin({});
      let filtered = items;
      if (index === 1) {
        // Đang hoạt động
        filtered = items.filter((p) => p.status === "public");
      } else if (index === 2) {
        // Đang ẩn
        filtered = items.filter((p) => p.status !== "public");
      }
      renderSearchResults(filtered); // Dùng lại hàm render chính
    });
  });
}

// === HÀM KHỞI TẠO CHÍNH ===

function setUpProductAdmin() {
  setUpAdminNav();
  document.querySelector(".add-product-btn").addEventListener("click", () => {
    loadAddProduct();
  });
  setUpProductManagePlayable();
}

export function loadProductAdmin() {
  renderProductAdminHtml();
  setUpProductAdmin();
}
