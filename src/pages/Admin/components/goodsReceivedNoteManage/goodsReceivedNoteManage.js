import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  getAllProductForAdmin,
  searchProducts,
  getSkusByProductId,
  getDetailOneSku,
  getProductById,
} from "../../../../services/productService.js";
import { formatNumber } from "../../../../helper/formatNumber.js";
import { getTodayDate } from "../../../../helper/helper.js";
import {
  getAllGRNs,
  addGRN,
} from "../../../../services/goodsReceivedNoteService.js";

let currentStagingItems = [];
let selectedProductId = null;
const rootElement = document.getElementById("root");

export function loadGoodsReceivedNoteList() {
  rootElement.innerHTML = `
        <div class="admin">
            ${AdminNav()} 
            <div class="admin__main">
                ${renderGRNListPageContent()} 
            </div>
        </div>
    `;
  setUpGRNListPage();
}

function renderGRNListPageContent() {
  const grns = getAllGRNs();
  return `
    <div class="grn-list-container">
      <div class="product-manage__head">
        <div class="product-manage__head-left"><a>Danh sách phiếu nhập</a></div>
        <div class="product-manage__head-right">
          <button class="black-yellow__button" id="add-grn-btn">Thêm phiếu hàng</button>
        </div>
      </div>
      <div class="product-manage-main">
        <div class="product-manage-main-search ">
          <input type="text" placeholder="Tìm kiếm mã phiếu..." id="grn-search-input" />
          <button class="product-manage-main-search__button blue__button" id="grn-search-btn">SEARCH</button>
        </div>
        <div class="cart product-result">
          <div class="cart-info">
            <div class="grn-status">Trạng thái</div><div class="grn-id">Mã phiếu</div>
            <div class="grn-date">Ngày nhập</div><div class="grn-total-price">Giá nhập</div>
            <div class="grn-total-quantity">Số Lượng</div><div class="grn-action">Hành động</div>
          </div>
          <div class="grn-list-item-container" id="grn-list-body">
            ${
              grns.length === 0
                ? `<p style="padding: 20px; text-align: center;">Chưa có phiếu nhập nào.</p>`
                : grns.map(renderGRNItem).join("")
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGRNItem(grn) {
  return `
    <div class="cart-item">
      <div class="grn-status">${grn.status}</div><div class="grn-id">${
    grn.id
  }</div>
      <div class="grn-date">${
        grn.createdAt
      }</div><div class="grn-total-price">${formatNumber(grn.totalPrice)}đ</div>
      <div class="grn-total-quantity">${formatNumber(grn.totalQuantity)}</div>
      <div class="grn-action"><button title="Xem">👁️</button><button title="Sửa">✏️</button></div>
    </div>`;
}

function setUpGRNListPage() {
  setUpAdminNav();
  document.getElementById("add-grn-btn").addEventListener("click", () => {
    loadAddGoodsReceivedNote();
  });

  const searchInput = document.getElementById("grn-search-input");
  const searchBtn = document.getElementById("grn-search-btn");
  const listBody = document.getElementById("grn-list-body");

  const handleSearchGRN = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const allGrns = getAllGRNs();
    const filteredGrns = keyword
      ? allGrns.filter((grn) => grn.id.toLowerCase().includes(keyword))
      : allGrns;

    listBody.innerHTML =
      filteredGrns.length === 0
        ? `<p style="padding: 20px; text-align: center;">Không tìm thấy phiếu nhập nào.</p>`
        : filteredGrns.map(renderGRNItem).join("");
  };

  searchBtn.addEventListener("click", handleSearchGRN);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearchGRN();
  });
}

function loadAddGoodsReceivedNote() {
  currentStagingItems = [];
  selectedProductId = null;
  rootElement.innerHTML = `
        <div class="admin">
             ${AdminNav()} 
            <div class="admin__main">
                ${renderAddGRNPageContent()}
            </div>
        </div>
    `;
  setUpAddGRNPage();
}

function renderAddGRNPageContent() {
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
            <thead><tr><th>Mã SKU</th><th>Tên sản phẩm</th><th>Giá nhập</th><th>Số lượng</th><th>Thao tác</th></tr></thead>
            <tbody id="staging-table-body"></tbody>
          </table>
        </div>
        <div class="middle--right">
          <div class="search-bar">
            <input type="text" id="product-search-input" placeholder="Tìm kiếm theo tên sản phẩm" />
            <button class="blue__button" id="product-search-btn">SEARCH</button>
          </div>
          <div class="product-list-selector" id="product-list-selector"></div>
        </div>
      </div>
      <div class="admin__main--bottom">
        <button class="black-yellow__button" id="cancel-grn-btn" style="background-color: #6c757d">Quay lại</button>
        <button class="black-yellow__button" id="save-grn-btn">Lưu Thay Đổi</button>
      </div>
    </div>
  `;
}

function setUpAddGRNPage() {
  const productSearchInput = document.getElementById("product-search-input");
  const productSearchBtn = document.getElementById("product-search-btn");
  const addItemBtn = document.getElementById("add-item-btn");
  const saveGRNBtn = document.getElementById("save-grn-btn");
  const cancelGRNBtn = document.getElementById("cancel-grn-btn");

  const { items: allProducts } = getAllProductForAdmin({ pageSize: 1000 });
  renderProductSelector(allProducts);

  productSearchBtn.addEventListener("click", () => {
    const keyword = productSearchInput.value.trim().toLowerCase();
    const filteredProducts = keyword
      ? allProducts.filter((p) => p.name.toLowerCase().includes(keyword))
      : allProducts;
    renderProductSelector(filteredProducts);
  });
  productSearchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") productSearchBtn.click();
  });
  addItemBtn.addEventListener("click", handleAddItemToStage);
  saveGRNBtn.addEventListener("click", handleSaveGRN);
  cancelGRNBtn.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn hủy phiếu nhập này?")) {
      loadGoodsReceivedNoteList();
    }
  });
}

function renderProductSelector(products) {
  const container = document.getElementById("product-list-selector");
  if (!container) return;
  container.innerHTML = products.map(renderProductSelectorItem).join("");
  attachProductCheckboxListeners();
  container.querySelectorAll(".view-more__sku").forEach((btn) => {
    btn.addEventListener("click", handleToggleSKUList);
  });
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
      }">Xem thêm SKU</button>
      <div class="sku-selector-list" id="sku-list-${product.id}"></div>
    </div>`;
}

function handleToggleSKUList(e) {
  const productId = e.target.dataset.productId;
  const skuListId = `sku-list-${productId}`;
  const skuContainer = document.getElementById(skuListId);
  const masterCheckbox = document.querySelector(
    `.product-master-check[data-product-id="${productId}"]`
  );
  if (!skuContainer) return;

  if (skuContainer.classList.contains("open")) {
    skuContainer.innerHTML = "";
    skuContainer.classList.remove("open");
    e.target.textContent = "Xem thêm SKU";
  } else {
    const skus = getSkusByProductId(productId);
    skuContainer.innerHTML = skus.map(renderSKUSelectorItem).join("");
    skuContainer.classList.add("open");
    e.target.textContent = "Thu gọn";
    const isMasterChecked = masterCheckbox ? masterCheckbox.checked : false;
    skuContainer.querySelectorAll(".sku-check").forEach((chk) => {
      chk.checked = isMasterChecked;
    });
    attachSKUCheckboxListeners(productId);
  }
}

function renderSKUSelectorItem(sku) {
  const detail = getDetailOneSku(sku, sku.productId);
  const skuName =
    detail && detail.selectedDetails && detail.selectedDetails.length >= 2
      ? `${detail.selectedDetails[0].name}, ${detail.selectedDetails[1].name}`
      : "N/A";
  return `
        <div class="sku-item">
            <input type="checkbox" class="sku-check" data-sku-id="${sku.id}" data-product-id="${sku.productId}" />
            <span class="sku-item-name">${skuName} (Tồn: ${sku.stock})</span>
        </div>`;
}

function attachProductCheckboxListeners() {
  document.querySelectorAll(".product-master-check").forEach((chk) => {
    const newChk = chk.cloneNode(true);
    chk.parentNode.replaceChild(newChk, chk);

    newChk.addEventListener("change", (e) => {
      const productId = e.target.dataset.productId;
      const isChecked = e.target.checked;

      if (isChecked) {
        if (selectedProductId && selectedProductId !== productId) {
          const oldMaster = document.querySelector(
            `.product-master-check[data-product-id="${selectedProductId}"]`
          );
          if (oldMaster) oldMaster.checked = false;
          document
            .querySelectorAll(
              `.sku-check[data-product-id="${selectedProductId}"]`
            )
            .forEach((oldSku) => (oldSku.checked = false));
        }
        selectedProductId = productId;
      } else {
        if (selectedProductId === productId) {
          selectedProductId = null;
        }
      }
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
    const newChk = chk.cloneNode(true);
    chk.parentNode.replaceChild(newChk, chk);

    newChk.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      const currentSkuProductId = e.target.dataset.productId;

      if (isChecked) {
        if (selectedProductId && selectedProductId !== currentSkuProductId) {
          const oldMaster = document.querySelector(
            `.product-master-check[data-product-id="${selectedProductId}"]`
          );
          if (oldMaster) oldMaster.checked = false;
          document
            .querySelectorAll(
              `.sku-check[data-product-id="${selectedProductId}"]`
            )
            .forEach((oldSku) => (oldSku.checked = false));
        }
        selectedProductId = currentSkuProductId;
        if (masterCheckbox) masterCheckbox.checked = true;
      } else {
        const allSkusForProduct = Array.from(
          document.querySelectorAll(
            `.sku-check[data-product-id="${currentSkuProductId}"]`
          )
        );
        if (allSkusForProduct.every((sku) => !sku.checked)) {
          if (masterCheckbox) masterCheckbox.checked = false;
          if (selectedProductId === currentSkuProductId) {
            selectedProductId = null;
          }
        }
      }
    });
  });
}

function handleAddItemToStage() {
  const costPriceInput = document.getElementById("grn-cost-price");
  const quantityInput = document.getElementById("grn-quantity");
  const costPrice = parseFloat(costPriceInput.value);
  const quantity = parseInt(quantityInput.value);

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
    if (!currentStagingItems.some((item) => item.skuId === skuId)) {
      const product = getProductById(selectedProductId);
      const sku = getSkusByProductId(selectedProductId).find(
        (s) => s.id === skuId
      );
      const detail = getDetailOneSku(sku, selectedProductId);
      const skuName =
        detail && detail.selectedDetails && detail.selectedDetails.length >= 2
          ? `${detail.selectedDetails[0].name}, ${detail.selectedDetails[1].name}`
          : "N/A";
      currentStagingItems.push({
        skuId,
        productId: selectedProductId,
        productName: product.name,
        skuName,
        costPrice,
        quantity,
      });
    } else {
      alert(`SKU ${skuName} đã được thêm vào phiếu.`);
    }
  });

  renderStagingTable();
  costPriceInput.value = "";
  quantityInput.value = "";
}

function renderStagingTable() {
  const tableBody = document.getElementById("staging-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = currentStagingItems
    .map(
      (item, index) => `
        <tr>
            <td>${item.skuId}</td><td>${item.productName} (${item.skuName})</td>
            <td>${formatNumber(item.costPrice)}đ</td><td>${item.quantity}</td>
            <td><button class="delete-stage-item" data-index="${index}">Xóa</button></td>
        </tr>`
    )
    .join("");

  document.querySelectorAll(".delete-stage-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      currentStagingItems.splice(index, 1);
      renderStagingTable();
    });
  });
}

function handleSaveGRN() {
  if (currentStagingItems.length === 0) {
    alert("Bạn chưa thêm sản phẩm nào vào phiếu nhập.");
    return;
  }
  const createdAtInput = document.getElementById("grn-date");
  const createdAt = createdAtInput ? createdAtInput.value : getTodayDate();
  let totalPrice = 0;
  let totalQuantity = 0;
  currentStagingItems.forEach((item) => {
    totalPrice += item.costPrice * item.quantity;
    totalQuantity += item.quantity;
  });
  const grnData = {
    createdAt,
    totalPrice,
    totalQuantity,
    items: currentStagingItems,
  };
  addGRN(grnData);
  alert("Đã tạo phiếu nhập hàng thành công!");
  loadGoodsReceivedNoteList();
}
