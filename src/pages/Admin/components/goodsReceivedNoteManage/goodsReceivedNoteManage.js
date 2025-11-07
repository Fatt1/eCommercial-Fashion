import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  getAllProductForAdmin,
  getSkusByProductId,
  getDetailOneSku,
  getProductById,
} from "../../../../services/productService.js";
import { formatNumber } from "../../../../helper/formatNumber.js";
import { getTodayDate } from "../../../../helper/helper.js";
import {
  getAllImportInvoices,
  createImportInvoice,
  updateImportInvoice,
  confirmImportInvoice,
  cancelImportInvoice,
  deleteImportInvoice,
  getImportInvoiceById,
} from "../../../../services/importInvoiceService.js";
import { IMPORT_INVOICE_STATUS } from "../../../../constant/Constant.js";

let currentStagingItems = [];
let selectedProductId = null;
let editingInvoiceId = null;
const rootElement = document.getElementById("root");

const invoiceStatusTranslation = {
  PENDING: "Chờ xác nhận",
  COMPLETED: "Đã hoàn thành",
  CANCELED: "Đã hủy",
};

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
  const grns = getAllImportInvoices();
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
            <div class="grn-status">Trạng thái</div>
            <div class="grn-id">Mã phiếu</div>
            <div class="grn-date">Ngày nhập</div>
            <div class="grn-total-price">Giá nhập</div>
            <div class="grn-total-quantity">Số Lượng</div>
            <div class="grn-action">Hành động</div>
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
  const statusClass =
    grn.status === IMPORT_INVOICE_STATUS.COMPLETED
      ? "status-completed"
      : grn.status === IMPORT_INVOICE_STATUS.CANCELED
      ? "status-canceled"
      : "status-pending";

  return `
    <div class="cart-item">
      <div class="grn-status ${statusClass}">${
    invoiceStatusTranslation[grn.status] || grn.status
  }</div>
      <div class="grn-id">${grn.id}</div>
      <div class="grn-date">${new Date(grn.createdAt).toLocaleDateString(
        "vi-VN"
      )}</div>
      <div class="grn-total-price">${formatNumber(
        grn.totalPrice
      )}<span class="currency">đ</span></div>
      <div class="grn-total-quantity">${formatNumber(grn.quantity)}</div>
      <div class="grn-action">
        <button title="Xem chi tiết" class="view-grn-btn" data-grn-id="${
          grn.id
        }">👁️</button>
        ${
          grn.status === IMPORT_INVOICE_STATUS.PENDING
            ? `
          <button title="Sửa" class="edit-grn-btn" data-grn-id="${grn.id}">✏️</button>
          <button title="Xác nhận" class="confirm-grn-btn" data-grn-id="${grn.id}">✅</button>
          <button title="Hủy" class="cancel-grn-btn" data-grn-id="${grn.id}">❌</button>
          <button title="Xóa" class="delete-grn-btn" data-grn-id="${grn.id}">🗑️</button>
        `
            : ""
        }
      </div>
    </div>`;
}

function setUpGRNListPage() {
  setUpAdminNav();

  document.getElementById("add-grn-btn").addEventListener("click", () => {
    editingInvoiceId = null;
    loadAddGoodsReceivedNote();
  });

  const searchInput = document.getElementById("grn-search-input");
  const searchBtn = document.getElementById("grn-search-btn");
  const listBody = document.getElementById("grn-list-body");

  const handleSearchGRN = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const allGrns = getAllImportInvoices();
    const filteredGrns = keyword
      ? allGrns.filter((grn) => grn.id.toLowerCase().includes(keyword))
      : allGrns;

    listBody.innerHTML =
      filteredGrns.length === 0
        ? `<p style="padding: 20px; text-align: center;">Không tìm thấy phiếu nhập nào.</p>`
        : filteredGrns.map(renderGRNItem).join("");

    attachGRNActionListeners();
  };

  searchBtn.addEventListener("click", handleSearchGRN);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearchGRN();
  });

  attachGRNActionListeners();
}

function attachGRNActionListeners() {
  // View detail
  document.querySelectorAll(".view-grn-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const grnId = e.target.dataset.grnId;
      showGRNDetail(grnId);
    });
  });

  // Edit
  document.querySelectorAll(".edit-grn-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const grnId = e.target.dataset.grnId;
      editingInvoiceId = grnId;
      loadEditGoodsReceivedNote(grnId);
    });
  });

  // Confirm
  document.querySelectorAll(".confirm-grn-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const grnId = e.target.dataset.grnId;
      handleConfirmGRN(grnId);
    });
  });

  // Cancel
  document.querySelectorAll(".cancel-grn-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const grnId = e.target.dataset.grnId;
      handleCancelGRN(grnId);
    });
  });

  // Delete
  document.querySelectorAll(".delete-grn-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const grnId = e.target.dataset.grnId;
      handleDeleteGRN(grnId);
    });
  });
}

function showGRNDetail(grnId) {
  const grn = getImportInvoiceById(grnId);
  if (!grn) {
    alert("Không tìm thấy phiếu nhập!");
    return;
  }

  const detailHTML = `
    <div class="grn-detail-modal">
      <div class="grn-detail-content">
        <h2>Chi tiết phiếu nhập: ${grn.id}</h2>
        <p><strong>Trạng thái:</strong> ${
          invoiceStatusTranslation[grn.status]
        }</p>
        <p><strong>Ngày nhập:</strong> ${new Date(grn.createdAt).toLocaleString(
          "vi-VN"
        )}</p>
        <p><strong>Tổng giá trị:</strong> ${formatNumber(grn.totalPrice)}đ</p>
        <p><strong>Tổng số lượng:</strong> ${grn.quantity}</p>
        <h3>Danh sách sản phẩm:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Mã SKU</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên sản phẩm</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Giá nhập</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${grn.items
              .map(
                (item) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  item.skuId
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  item.productName
                } ${item.skuName ? `(${item.skuName})` : ""}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${formatNumber(
                  item.costPrice || item.importPrice
                )}đ</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  item.quantity
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${formatNumber(
                  (item.costPrice || item.importPrice) * item.quantity
                )}đ</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div style="margin-top: 20px; text-align: right;">
          <button class="black-yellow__button" id="close-detail-modal">Đóng</button>
        </div>
      </div>
    </div>
  `;

  const overlay = document.querySelector(".overlay");
  const overlayContent = document.querySelector(".overlay-content");
  overlay.classList.add("show");
  overlayContent.hidden = false;
  overlayContent.innerHTML = detailHTML;

  document
    .getElementById("close-detail-modal")
    .addEventListener("click", () => {
      overlay.classList.remove("show");
      overlayContent.hidden = true;
      overlayContent.innerHTML = "";
    });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("show");
      overlayContent.hidden = true;
      overlayContent.innerHTML = "";
    }
  });
}

function handleConfirmGRN(grnId) {
  if (
    !confirm(
      "Bạn có chắc chắn muốn xác nhận phiếu nhập này? Sau khi xác nhận sẽ không thể chỉnh sửa."
    )
  ) {
    return;
  }

  const result = confirmImportInvoice(grnId);
  if (result.successful) {
    let message = result.message;
    if (result.priceChanges && result.priceChanges.length > 0) {
      message += "\n\nCác sản phẩm có thay đổi giá nhập:";
      result.priceChanges.forEach((change) => {
        message += `\n- ${change.productName}: ${formatNumber(
          change.oldPrice
        )}đ → ${formatNumber(change.newPrice)}đ`;
      });
    }
    if (result.stockUpdates && result.stockUpdates.length > 0) {
      message += "\n\nĐã cập nhật tồn kho cho các SKU:";
      result.stockUpdates.forEach((update) => {
        message += `\n- ${update.productName} (${update.skuId}): +${update.quantityAdded} = ${update.newStock}`;
      });
    }
    alert(message);
    loadGoodsReceivedNoteList();
  } else {
    alert(result.message);
  }
}

function handleCancelGRN(grnId) {
  if (!confirm("Bạn có chắc chắn muốn hủy phiếu nhập này?")) {
    return;
  }

  const result = cancelImportInvoice(grnId);
  if (result.successful) {
    alert(result.message);
    loadGoodsReceivedNoteList();
  } else {
    alert(result.message);
  }
}

function handleDeleteGRN(grnId) {
  if (
    !confirm(
      "Bạn có chắc chắn muốn xóa phiếu nhập này? Hành động này không thể hoàn tác."
    )
  ) {
    return;
  }

  const result = deleteImportInvoice(grnId);
  if (result.successful) {
    alert(result.message);
    loadGoodsReceivedNoteList();
  } else {
    alert(result.message);
  }
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

function loadEditGoodsReceivedNote(grnId) {
  const grn = getImportInvoiceById(grnId);
  if (!grn) {
    alert("Không tìm thấy phiếu nhập!");
    loadGoodsReceivedNoteList();
    return;
  }

  if (grn.status === IMPORT_INVOICE_STATUS.COMPLETED) {
    alert("Không thể chỉnh sửa phiếu nhập đã hoàn thành!");
    loadGoodsReceivedNoteList();
    return;
  }

  currentStagingItems = grn.items.map((item) => ({
    skuId: item.skuId,
    productId: item.productId,
    productName: item.productName,
    skuName: item.skuName,
    costPrice: item.costPrice || item.importPrice,
    quantity: item.quantity,
  }));

  selectedProductId = null;

  rootElement.innerHTML = `
    <div class="admin">
      ${AdminNav()} 
      <div class="admin__main">
        ${renderEditGRNPageContent(grn)}
      </div>
    </div>
  `;
  setUpEditGRNPage();
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
            <thead>
              <tr>
                <th>Mã SKU</th>
                <th>Tên sản phẩm</th>
                <th>Giá nhập</th>
                <th>Số lượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
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

function renderEditGRNPageContent(grn) {
  return `
    <div class="add-grn-container">
      <div class="admin__main--top">
        <div class="admin__main--title">Chỉnh Sửa Phiếu Nhập: ${grn.id}</div>
        <div class="date-flexbox">
          <label for="grn-date">Ngày nhập</label>
          <input type="date" id="grn-date" value="${
            new Date(grn.createdAt).toISOString().split("T")[0]
          }" readonly />
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
        <button class="black-yellow__button" id="save-grn-btn">Cập Nhật Phiếu Nhập</button>
      </div>
    </div>
  `;
}

function setUpAddGRNPage() {
  setUpAdminNav();
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

  renderStagingTable();
}

function setUpEditGRNPage() {
  setUpAdminNav();
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
  saveGRNBtn.addEventListener("click", handleUpdateGRN);
  cancelGRNBtn.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn hủy chỉnh sửa phiếu nhập này?")) {
      loadGoodsReceivedNoteList();
    }
  });

  renderStagingTable();
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
        <img src="../assets/products/${
          product.thumbnail || "sample-image.jpg"
        }" alt="${product.name}" />
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
    const existingItem = currentStagingItems.find(
      (item) => item.skuId === skuId
    );

    if (!existingItem) {
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
      alert(`SKU ${existingItem.skuName} đã được thêm vào phiếu.`);
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
          <td>${item.skuId}</td>
          <td>${item.productName} (${item.skuName})</td>
          <td>${formatNumber(
            item.costPrice
          )}<span class="currency">đ</span></td>
          <td>${item.quantity}</td>
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

  const invoiceData = {
    items: currentStagingItems.map((item) => ({
      skuId: item.skuId,
      productId: item.productId,
      productName: item.productName,
      skuName: item.skuName,
      importPrice: item.costPrice,
      quantity: item.quantity,
    })),
  };

  const result = createImportInvoice(invoiceData);

  if (result.successful) {
    alert("Đã tạo phiếu nhập hàng thành công!");
    loadGoodsReceivedNoteList();
  } else {
    alert(result.message);
  }
}

function handleUpdateGRN() {
  if (currentStagingItems.length === 0) {
    alert("Bạn chưa thêm sản phẩm nào vào phiếu nhập.");
    return;
  }

  if (!editingInvoiceId) {
    alert("Không tìm thấy phiếu nhập cần cập nhật.");
    return;
  }

  const updatedData = {
    items: currentStagingItems.map((item) => ({
      skuId: item.skuId,
      productId: item.productId,
      productName: item.productName,
      skuName: item.skuName,
      importPrice: item.costPrice,
      quantity: item.quantity,
    })),
  };

  const result = updateImportInvoice(editingInvoiceId, updatedData);

  if (result.successful) {
    alert("Đã cập nhật phiếu nhập thành công!");
    loadGoodsReceivedNoteList();
  } else {
    alert(result.message);
  }
}
