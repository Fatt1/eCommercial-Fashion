import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  getAllProductForAdmin,
  updatePriceProductById,
} from "../../../../services/productService.js";
import {
  formatNumber,
  unFormatNumber,
} from "../../../../helper/formatNumber.js";
import { preventInputTextForNumberInput } from "../../../../helper/helper.js";
import {
  getAllCategoriesByLevel,
  getAllParentCategory,
} from "../../../../services/categoryService.js";
import { filterProductsForPriceManage } from "../../../../services/priceService.js";

const PAGE_SIZE = 10;
let productList = [];
let filter = {
  categoryId: null,
  priceType: "gia-ban",
  priceValue: 0,
  pageNumber: 1,
  pageSize: PAGE_SIZE,
};

function renderPriceManageHtml() {
  const pageResult = filterProductsForPriceManage(filter);
  console.log(pageResult);
  productList = pageResult.items;
  const categoriesLevel = getAllCategoriesByLevel();

  document.getElementById("root").innerHTML = `<div class="admin">
        ${AdminNav()}
<div class="admin__main">
  <div class="main-content __admin">
    <div class="priceManage_container">
      <div class="priceManage_header">
        <a>Quản lý giá bán</a>
        <div class="header-buttons">
          <button class="bulk-update-btn">Cập nhật hàng loạt</button>
          <button class="add_product_btn">Nhập sản phẩm</button>
        </div>
      </div>
      <div class="priceMange_main_container">
        <div class="priceMange_main_content_header">
          <select class="price-filter">
            <option value="gia-ban">Giá bán</option>
            <option value="gia-von">Giá vốn</option>
            <option value="loi-nhuan">% Lợi nhuận</option>
          </select>
          <select class="catergory-filter">
            <option selected value="all">--Chọn danh mục--</option>
          ${categoriesLevel.map((cate) => {
            return `<option value="${cate.id}">${cate.name}</option>`;
          })}
          </select>
          <div class="right_object">
            <button class="apply-filter-btn">Áp dụng</button>
            <button class="reset-price-filter-btn">Nhập lại</button>
          </div>
        </div>
        <div class="price-find-container"><input class="price-find-input number-input" type="text" placeholder="Nhập giá để tìm kiếm..." /></div>
        <div class="main_content_header">
          <table>
            <thead class = "table_header">
              <tr>
                <th><input type="checkbox" class="select-all-checkbox" /></th>
                <th>Sản phẩm</th>
                <th>Giá Vốn</th>
                <th>% lợi nhuận</th>
                <th>Giá Bán</th>
                <th>% giảm giá</th>
                <th>Giá giảm</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            ${TableBody(productList)}
          </table>
        </div>
        
        <!-- Pagination Section -->
        <div class="product-manage-main-result__end">
          <div class="noti-message">Tổng ${
            pageResult.totalItems
          } sản phẩm | Mỗi trang tối đa ${PAGE_SIZE} sản phẩm</div>
          <div class="pagination"></div>
          <div class="page-index-track">Trang ${filter.pageNumber}/${
    pageResult.totalPages
  }</div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Bulk Update Modal -->
<div class="bulk-update-modal" style="display: none;">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h3>Cập nhật % Lợi nhuận hàng loạt</h3>
      <span class="close-modal">&times;</span>
    </div>
    <div class="modal-body">
      <p>Số sản phẩm đã chọn: <span class="selected-count">0</span></p>
      <div class="input-group">
        <label>% Lợi nhuận mới:</label>
        <input type="text" class="bulk-profit-input number-input" placeholder="Nhập % lợi nhuận" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="cancel-bulk-update">Hủy</button>
      <button class="confirm-bulk-update">Xác nhận</button>
    </div>
  </div>
</div>
`;

  renderPagination(pageResult.totalPages, filter.pageNumber);
}

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
      // Current page
      html += `<a href="#" class="pagination-btn active" data-page="${i}">${i}</a>`;
    } else if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      // First page, last page, or pages adjacent to current
      html += `<a href="#" class="pagination-btn" data-page="${i}">${i}</a>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      // Show ellipsis
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

  // Setup pagination click events
  setupPaginationEvents(totalPages);
}

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
        const pageResult = filterProductsForPriceManage(filter);
        productList = pageResult.items;

        // Update table body
        document.querySelector("table tbody").remove();
        document.querySelector("table").innerHTML += TableBody(productList);

        // Reset select all checkbox
        const selectAllCheckbox = document.querySelector(
          ".select-all-checkbox"
        );
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = false;
        }

        // Update notification message
        const notiMessage = document.querySelector(".noti-message");
        if (notiMessage) {
          notiMessage.textContent = `Tổng ${pageResult.totalItems} sản phẩm | Mỗi trang tối đa ${PAGE_SIZE} sản phẩm`;
        }

        // Re-setup event listeners
        setUpHandleClickTableRow();
        handleSelectAllCheckbox();

        // Re-render pagination
        renderPagination(pageResult.totalPages, page);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

function TableBody(productList) {
  return `
  <tbody class = "table_body">
            ${productList.map((product) => TableRow(product)).join("")}
              </tbody>
  `;
}

function TableRow(product) {
  return `
    <tr data-product-id="${product.id}" data-category-id="${
    product.categoryId
  }">
      <td><input type="checkbox" class="product-checkbox" /></td>
      <td>${product.name}</td> 
      <td><span class="import-price">${formatNumber(
        product.priceInfo.importPrice
      )}</span>đ</td> 
      <td><input class="number-input percentage-profit-input" type="text" value="${calculateProfitPercentage(
        product.priceInfo.importPrice,
        product.priceInfo.originalPrice
      )}" /></td> 
      <td><span class="original-price">${
        product.priceInfo.originalPrice === 0
          ? formatNumber(product.priceInfo.importPrice)
          : formatNumber(product.priceInfo.originalPrice)
      }</span>đ</td> 
      <td><input class="number-input percentage-sale-input" type="text" value="${calculateSalePercentage(
        product.priceInfo.originalPrice,
        product.priceInfo.currentlyPrice
      )}" /></td> 
      <td><span class="currently-price">${
        product.priceInfo.currentlyPrice == 0
          ? formatNumber(product.priceInfo.importPrice)
          : formatNumber(product.priceInfo.currentlyPrice)
      }</span>đ</td> 
      <td class="update-price-btn">Cập nhật</td> 
    </tr>
  `;
}

function calculateSalePercentage(originalPrice, currentlyPrice) {
  if (originalPrice === 0) return 0;
  return Math.floor(((originalPrice - currentlyPrice) / originalPrice) * 100);
}

function calculateProfitPercentage(importPrice, originalPrice) {
  if (importPrice === 0) return 0;
  if (originalPrice === 0) return 0;
  return Math.floor(((originalPrice - importPrice) / importPrice) * 100);
}

function setUpRenderPriceManage() {
  setUpAdminNav();
  setUpHandleClickTableRow();
  handleClickFilterApplyButton();
  handleSelectAllCheckbox();
  handleBulkUpdateButton();
  handleResetFilterButton();
}

function setUpHandleClickTableRow() {
  preventInputTextForNumberInput();
  handleOnKeyPressPercentageInput();
  handleOnKeySaleInput();
  handleClickUpdatePriceButton();
}

export function loadPriceManagePage() {
  filter = {
    categoryId: null,
    priceType: "gia-ban",
    priceValue: 0,
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  };
  renderPriceManageHtml();
  setUpRenderPriceManage();
}

function handleClickFilterApplyButton() {
  document.querySelector(".apply-filter-btn").addEventListener("click", () => {
    const categorySelect = document.querySelector(".catergory-filter");
    const priceTypeSelect = document.querySelector(".price-filter");
    const categoryId =
      categorySelect.value === "all" ? null : categorySelect.value;
    const priceType = priceTypeSelect.value;
    const priceValueInput = document.querySelector(".price-find-input");
    const priceValue = Number(priceValueInput.value) || 0;

    filter.categoryId = categoryId;
    filter.priceType = priceType;
    filter.priceValue = priceValue;
    filter.pageNumber = 1; // Reset về trang 1

    const pageResult = filterProductsForPriceManage(filter);
    productList = pageResult.items;

    document.querySelector("table tbody").remove();
    document.querySelector("table").innerHTML += TableBody(productList);

    // Reset select all checkbox
    const selectAllCheckbox = document.querySelector(".select-all-checkbox");
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    }

    // Update notification message
    const notiMessage = document.querySelector(".noti-message");
    if (notiMessage) {
      notiMessage.textContent = `Tổng ${pageResult.totalItems} sản phẩm | Mỗi trang tối đa ${PAGE_SIZE} sản phẩm`;
    }

    renderPagination(pageResult.totalPages, filter.pageNumber);
    setUpHandleClickTableRow();
    handleSelectAllCheckbox();
  });
}

function handleResetFilterButton() {
  document
    .querySelector(".reset-price-filter-btn")
    .addEventListener("click", () => {
      // Reset filter values
      filter = {
        categoryId: null,
        priceType: "gia-ban",
        priceValue: 0,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
      };

      // Reset UI
      document.querySelector(".catergory-filter").value = "all";
      document.querySelector(".price-filter").value = "gia-ban";
      document.querySelector(".price-find-input").value = "";

      // Reload data
      const pageResult = filterProductsForPriceManage(filter);
      productList = pageResult.items;

      document.querySelector("table tbody").remove();
      document.querySelector("table").innerHTML += TableBody(productList);

      // Reset select all checkbox
      const selectAllCheckbox = document.querySelector(".select-all-checkbox");
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
      }

      // Update notification message
      const notiMessage = document.querySelector(".noti-message");
      if (notiMessage) {
        notiMessage.textContent = `Tổng ${pageResult.totalItems} sản phẩm | Mỗi trang tối đa ${PAGE_SIZE} sản phẩm`;
      }

      renderPagination(pageResult.totalPages, filter.pageNumber);
      setUpHandleClickTableRow();
      handleSelectAllCheckbox();
    });
}

function handleClickUpdatePriceButton() {
  document.querySelectorAll(".update-price-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tr = button.parentElement;
      const productId = tr.dataset.productId;
      const importPriceSpan = tr.querySelector(".import-price");

      const originalPriceSpan = tr.querySelector(".original-price");
      const currentlyPriceSpan = tr.querySelector(".currently-price");

      const importPrice = unFormatNumber(importPriceSpan.innerText);
      const originalPrice = unFormatNumber(originalPriceSpan.innerText);
      const currentlyPrice = unFormatNumber(currentlyPriceSpan.innerText);

      if (importPrice === 0) {
        alert("Giá vốn không thể bằng 0!");
        return;
      }

      const priceInfo = {
        currentlyPrice: currentlyPrice,
        importPrice: importPrice,
        originalPrice: originalPrice,
      };
      updatePriceProductById(productId, priceInfo);
      alert("Cập nhật giá thành công!");
    });
  });
}

function handleOnKeyPressPercentageInput() {
  document.querySelectorAll(".percentage-profit-input").forEach((input) => {
    input.addEventListener("keyup", () => {
      const tr = input.parentElement.parentElement;
      const importPriceSpan = tr.querySelector(".import-price");
      const importPriceValue = unFormatNumber(importPriceSpan.innerText);
      if (importPriceValue === 0) {
        return;
      }

      const spanOriginalPrice = tr.querySelector(".original-price");
      const valueInput = Number(input.value);
      const price = calculateOriginalPriceFromProfitPercentage(
        importPriceValue,
        valueInput
      );
      spanOriginalPrice.innerText = formatNumber(price);

      // Nếu có phần trăm giảm giá thì ta cũng cần cập nhật lại giá hiện tại
      const saleInput = tr.querySelector(".percentage-sale-input");
      var saleValue = Number(saleInput.value);
      if (saleValue > 0) {
        const spanCurrentlyPrice = tr.querySelector(".currently-price");
        const currentlyPrice = calculateCurrentlyPriceFromSalePercentage(
          price,
          saleValue
        );
        spanCurrentlyPrice.innerText = formatNumber(currentlyPrice);
      }
    });
  });
}

function handleOnKeySaleInput() {
  document.querySelectorAll(".percentage-sale-input").forEach((input) => {
    input.addEventListener("keyup", (e) => {
      const tr = input.parentElement.parentElement;
      const spanOriginalPrice = tr.querySelector(".original-price");
      const originalPriceValue = unFormatNumber(spanOriginalPrice.innerText);
      if (originalPriceValue === 0) {
        return;
      }
      const spanCurrentlyPrice = tr.querySelector(".currently-price");
      const valueInput = Number(input.value);
      const price = calculateCurrentlyPriceFromSalePercentage(
        originalPriceValue,
        valueInput
      );
      spanCurrentlyPrice.innerText = formatNumber(price);
    });
  });
}

function calculateOriginalPriceFromProfitPercentage(
  importPrice,
  profitPercentage
) {
  return importPrice + (profitPercentage / 100) * importPrice;
}

function calculateCurrentlyPriceFromSalePercentage(
  originalPrice,
  salePercentage
) {
  return originalPrice - (salePercentage / 100) * originalPrice;
}

function handleSelectAllCheckbox() {
  const selectAllCheckbox = document.querySelector(".select-all-checkbox");
  const productCheckboxes = document.querySelectorAll(".product-checkbox");

  // Handle "Select All" checkbox click
  selectAllCheckbox.addEventListener("change", (e) => {
    productCheckboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  });

  // Handle individual checkbox clicks to update "Select All" checkbox state
  productCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(productCheckboxes).every(
        (cb) => cb.checked
      );
      const someChecked = Array.from(productCheckboxes).some(
        (cb) => cb.checked
      );

      if (allChecked) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
      } else if (someChecked) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
      } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
      }
    });
  });
}

function handleBulkUpdateButton() {
  const bulkUpdateBtn = document.querySelector(".bulk-update-btn");
  const modal = document.querySelector(".bulk-update-modal");
  const closeModal = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-bulk-update");
  const confirmBtn = document.querySelector(".confirm-bulk-update");
  const modalOverlay = document.querySelector(".modal-overlay");

  bulkUpdateBtn.addEventListener("click", () => {
    const selectedCheckboxes = Array.from(
      document.querySelectorAll(".product-checkbox:checked")
    );

    if (selectedCheckboxes.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }

    if (filter.categoryId === null) {
      const rootCategoryIds = selectedCheckboxes.map((checkbox) => {
        const productCategoryId = checkbox.closest("tr").dataset.categoryId;
        const { parentCategories } = getAllParentCategory(productCategoryId);
        return parentCategories.length > 0
          ? parentCategories[parentCategories.length - 1].id
          : productCategoryId;
      });

      const uniqueRootCategories = [...new Set(rootCategoryIds)];
      if (uniqueRootCategories.length > 1) {
        alert(
          "Vui lòng chọn các sản phẩm cùng một nhánh danh mục! Hiện tại bạn đã chọn sản phẩm từ " +
            uniqueRootCategories.length +
            " nhánh danh mục khác nhau."
        );
        return;
      }
    } else {
      const isAllInFilteredCategory = selectedCheckboxes.every((checkbox) => {
        const productCategoryId = checkbox.closest("tr").dataset.categoryId;
        if (productCategoryId === filter.categoryId) return true;

        const { parentCategories } = getAllParentCategory(productCategoryId);
        return parentCategories.some(
          (parent) => parent.id === filter.categoryId
        );
      });

      if (!isAllInFilteredCategory) {
        alert("Có lỗi: Một số sản phẩm không thuộc danh mục đã lọc!");
        return;
      }
    }

    document.querySelector(".selected-count").textContent =
      selectedCheckboxes.length;
    modal.style.display = "block";
  });

  const hideModal = () => {
    modal.style.display = "none";
    document.querySelector(".bulk-profit-input").value = "";
  };

  closeModal.addEventListener("click", hideModal);
  cancelBtn.addEventListener("click", hideModal);
  modalOverlay.addEventListener("click", hideModal);

  confirmBtn.addEventListener("click", () => {
    const profitPercentage = Number(
      document.querySelector(".bulk-profit-input").value
    );

    if (isNaN(profitPercentage) || profitPercentage < 0) {
      alert("Vui lòng nhập % lợi nhuận hợp lệ!");
      return;
    }

    const selectedCheckboxes = Array.from(
      document.querySelectorAll(".product-checkbox:checked")
    );

    selectedCheckboxes.forEach((checkbox) => {
      const tr = checkbox.closest("tr");
      const productId = tr.dataset.productId;
      const importPriceSpan = tr.querySelector(".import-price");
      const importPriceValue = unFormatNumber(importPriceSpan.innerText);

      if (importPriceValue === 0) {
        return;
      }

      const profitInput = tr.querySelector(".percentage-profit-input");
      profitInput.value = profitPercentage;

      const spanOriginalPrice = tr.querySelector(".original-price");
      const newOriginalPrice = calculateOriginalPriceFromProfitPercentage(
        importPriceValue,
        profitPercentage
      );
      spanOriginalPrice.innerText = formatNumber(newOriginalPrice);

      const saleInput = tr.querySelector(".percentage-sale-input");
      const saleValue = Number(saleInput.value);
      if (saleValue > 0) {
        const spanCurrentlyPrice = tr.querySelector(".currently-price");
        const currentlyPrice = calculateCurrentlyPriceFromSalePercentage(
          newOriginalPrice,
          saleValue
        );
        spanCurrentlyPrice.innerText = formatNumber(currentlyPrice);
      } else {
        const spanCurrentlyPrice = tr.querySelector(".currently-price");
        spanCurrentlyPrice.innerText = formatNumber(newOriginalPrice);
      }

      const originalPrice = unFormatNumber(spanOriginalPrice.innerText);
      const currentlyPrice = unFormatNumber(
        tr.querySelector(".currently-price").innerText
      );

      const priceInfo = {
        currentlyPrice: currentlyPrice,
        importPrice: importPriceValue,
        originalPrice: originalPrice,
      };
      updatePriceProductById(productId, priceInfo);
    });

    alert(
      "Cập nhật % lợi nhuận cho " +
        selectedCheckboxes.length +
        " sản phẩm thành công!"
    );
    hideModal();

    document.querySelectorAll(".product-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
    });
    document.querySelector(".select-all-checkbox").checked = false;
  });
}
