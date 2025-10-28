import {
  updateCategoryById,
  addCategory,
  getAllCategoriesByLevel,
  deleteCategoryById,
  getSubCategory,
} from "../../../../services/categoryService.js";
import { getProductsByCategoryId } from "../../../../services/productService.js";
import { loadCategoryManagePage } from "./categoryManage.js";

// Biến cục bộ để lưu các category đã chọn
let savedSelectedCategories = [];
let category = {};
// 1. Đối tượng DOM
const DOM = {
  categoryBtn: null,
  categorySelectorWrapper: null,
  categorySelectedList: null,
  cancelBtn: null,
  agreeBtn: null,
  init() {
    // Các selector này sẽ tìm thấy element bên trong popup
    // vì hàm init() được gọi sau khi renderAddCategoryHtml()
    this.categoryBtn = document.querySelector(
      ".add-category-popup .create-product__category-btn"
    );
    this.categorySelectorWrapper = document.querySelector(
      ".add-category-popup .category-selector-wrapper"
    );
    this.categorySelectedList = document.querySelector(
      ".add-category-popup .category-selected-list"
    );
    this.cancelBtn = document.querySelector(
      ".add-category-popup .footer-category-action__cancel-btn"
    );
    this.agreeBtn = document.querySelector(
      ".add-category-popup .footer-category-action__agree-btn"
    );
  },
  getMenuByLevel(level) {
    return document.querySelector(
      `.add-category-popup .category-list-menu[data-level='${level}']`
    );
  },
  getSelectedCategories() {
    return document.querySelectorAll(
      ".add-category-popup .category-item.selected"
    );
  },
};

export function renderCategoriesByLevel(level, parentId = null) {
  const menu = DOM.getMenuByLevel(level);
  if (!menu) return;
  const categories = parentId
    ? getAllCategoriesByLevel(level).filter(
        (cate) => cate.parentId === parentId
      )
    : getAllCategoriesByLevel(level);

  menu.innerHTML = "";
  const documentFragment = document.createDocumentFragment();
  categories.forEach((cate) => {
    const liElem = createCategoryItem(cate);
    documentFragment.appendChild(liElem);
  });
  menu.appendChild(documentFragment);
}

// 3. Hàm tạo <li>
function createCategoryItem(cate) {
  const liElem = document.createElement("li");
  liElem.classList.add("category-item");
  liElem.setAttribute("data-has-children", cate.hasChildren);
  liElem.setAttribute("data-cate-id", cate.id);
  liElem.onclick = handleCategoryClick; // Gán sự kiện click
  liElem.textContent = cate.name;

  if (cate.hasChildren) {
    const imgElem = document.createElement("img");
    imgElem.src = "../assets/Forward.svg";
    imgElem.classList.add("category-item-right");
    liElem.appendChild(imgElem);
  }

  return liElem;
}

// 4. Hàm xử lý click
function handleCategoryClick(event) {
  const category = event.target.closest(".category-item");
  if (!category) return;

  const hasChildren = category.dataset.hasChildren === "true";
  const cateId = category.dataset.cateId;
  const currentMenu = category.closest(".category-list-menu");
  const level = Number(currentMenu.dataset.level);

  toggleCategorySelection(currentMenu, category);

  if (hasChildren) {
    renderCategoriesByLevel(level + 1, cateId);
    clearHigherLevelMenus(level + 1);
  } else {
    clearHigherLevelMenus(level);
  }

  updateFooterCategory();
}

// 5. Các hàm helpers
function toggleCategorySelection(menu, selectedCategory) {
  const previousSelected = menu.querySelector(".category-item.selected");
  if (previousSelected) previousSelected.classList.remove("selected");
  selectedCategory.classList.add("selected");
}

function clearHigherLevelMenus(currentLevel) {
  document
    .querySelectorAll(`.add-category-popup .category-list-menu[data-level]`)
    .forEach((menu) => {
      const menuLevel = Number(menu.dataset.level);
      if (menuLevel > currentLevel) {
        menu.innerHTML = "";
      }
    });
}

function clearAllMenus() {
  document
    .querySelectorAll(`.add-category-popup .category-list-menu[data-level]`)
    .forEach((menu) => {
      const menuLevel = Number(menu.dataset.level);
      if (menuLevel > 0) {
        menu.innerHTML = "";
      }
    });
}

function updateFooterCategory() {
  const selectedCategories = DOM.getSelectedCategories();
  if (selectedCategories.length === 0) {
    DOM.categorySelectedList.innerHTML = "";
    return;
  }
  const content = Array.from(selectedCategories)
    .map(
      (cate) => `<span class="category-selected">${cate.textContent} </span>`
    )
    .join(" > ");

  DOM.categorySelectedList.innerHTML = content;
}

function restoreSavedCategories() {
  if (savedSelectedCategories.length === 0) {
    DOM.categorySelectedList.innerHTML = "";
    return;
  }

  DOM.getSelectedCategories().forEach((cate) =>
    cate.classList.remove("selected")
  );

  savedSelectedCategories.forEach((savedCate, index) => {
    const menu = DOM.getMenuByLevel(index);
    const categoryItem = menu?.querySelector(
      `.category-item[data-cate-id='${savedCate.cateId}']`
    );

    if (categoryItem) {
      categoryItem.classList.add("selected");
      const isNotLastCategory = index < savedSelectedCategories.length - 1;
      if (savedCate.hasChildren && isNotLastCategory) {
        const nextLevel = savedCate.level + 1;
        renderCategoriesByLevel(nextLevel, savedCate.cateId);
      }
    }
  });

  updateFooterCategory();
}

function saveSelectedCategories() {
  savedSelectedCategories = [];
  document
    .querySelectorAll(".add-category-popup .category-item.selected")
    .forEach((cate) => {
      savedSelectedCategories.push({
        cateId: cate.dataset.cateId,
        level: Number(cate.closest(".category-list-menu").dataset.level),
        hasChildren: cate.dataset.hasChildren === "true",
      });
    });
}

function updateCategoryButtonText() {
  const selectedCategories = DOM.getSelectedCategories();
  if (selectedCategories.length === 0) {
    DOM.categoryBtn.textContent = "Chọn ngành hàng";
    return;
  }
  const text = Array.from(selectedCategories)
    .map((cate) => cate.textContent)
    .join(" > ");

  DOM.categoryBtn.textContent = text;
}

// 6. Các hàm xử lý sự kiện (Copy và chỉnh sửa)
function handleOpenSelector() {
  restoreSavedCategories();
  DOM.categorySelectorWrapper.classList.add("show");
}

function handleCancelSelection() {
  clearAllMenus();
  DOM.categorySelectorWrapper.classList.remove("show");
}

function handleConfirmSelection() {
  saveSelectedCategories();
  updateCategoryButtonText();

  DOM.categorySelectorWrapper.classList.remove("show");
}

// 7. Hàm setup event listeners (Copy và chỉnh sửa)
function setupEventListeners() {
  // Mở category selector
  DOM.categoryBtn.addEventListener("click", handleOpenSelector);

  // Hủy selection
  DOM.cancelBtn.addEventListener("click", handleCancelSelection);

  // Xác nhận selection
  DOM.agreeBtn.addEventListener("click", handleConfirmSelection);
}

// Thay thế hàm renderAddCategoryHtml cũ bằng hàm này
function renderAddCategoryHtml(mode = "add", categoryData = {}) {
  const isUpdate = mode === "update";
  const title = isUpdate ? "Cập nhật danh mục" : "Thêm danh mục mới";
  const buttonText = isUpdate ? "Cập nhật" : "Thêm danh mục";
  const nameValue = categoryData.name || "";
  const imageSrc = categoryData.image
    ? `../assets/categories/${categoryData.image}`
    : "../assets/Add Image.svg";

  document.querySelector(".overlay-content").hidden = false;
  document.querySelector(".overlay-content").innerHTML = `
    <div class="add-category-popup">
      <h2>${title}</h2>
      <div class="add-category-form">
          <div class="form-group category-input ">
              
              <label>Ngành hàng cha (Nếu thay đổi)</label>
              <div class="wrapper-create-product-category-btn">
                  <button class="create-product__category-btn">Chọn ngành hàng</button>
                  <img src="../assets/Pencil.svg" alt="">
              </div>
              <div class"error-message error-category"></div>
              <div class="category-selector-wrapper">
              <div class="category-list">
                <ul class="category-list-menu" data-level="0">
                </ul>
                <ul class="category-list-menu" data-level="1">
                    
                </ul>
                <ul class="category-list-menu" data-level="2">
                    
                </ul>
              </div>
              <div class="footer-category">
                <div class="footer-category-left"><span>Đã chọn: </span> <div class="category-selected-list"></div></div>
                <div class="footer-category-action">
                  <button class="footer-category-action__cancel-btn ">Hủy</button>
                  <button class="footer-category-action__agree-btn btn-admin">Xác nhận</button>
                </div>
              </div>
              </div>
              </div>
      </div>
          <div class="form-group">
            <label for="category-name">Tên danh mục:</label>
            <input type="text" id="category-name" name="category-name" value="${nameValue}" />
          </div class="form-group">
          <div class="preview-img">
            <span>*Ảnh danh mục</span>
            <label for="category-image">
              <img class="category-preview-img" src="${imageSrc}" alt="Upload" />
            </label>
            <input type="file" id="category-image" name="category-image" accept="image/*" hidden />
          </div>
          <div class="add-category-action-buttons">
            <button class="btn-cancel-add-category">Hủy</button>
            ${
              !isUpdate
                ? ""
                : '<button class="btn-delete-category">Xóa</button>'
            }
            <button class="btn-confirm-add-category">${buttonText}</button>
          </div>
      </div> 
    </div>
  `;
}

/**
 * Hàm setup chính cho popup
 */
// Thay thế hàm setUpRenderAddCategory cũ bằng hàm này
function setUpRenderAddCategory(mode = "add", categoryData = {}) {
  // 1. Khởi tạo lại biến state
  savedSelectedCategories = [];

  // 2. Khởi tạo DOM (sau khi HTML đã được render)
  DOM.init();

  // 3. Render category level 0
  renderCategoriesByLevel(0);

  // 4. Gán các sự kiện click cho button "Chọn ngành hàng", "Hủy", "Xác nhận"
  setupEventListeners();

  // 5. Gán sự kiện cho input upload ảnh
  handleClickUploadCategoryImage();
  handleCancelAddCategory();

  // 6. Gán sự kiện Thêm hoặc Cập nhật
  if (mode === "add") {
    handleAddCategory();
  } else {
    handleUpdateCategory(categoryData); // Truyền category gốc vào
    handleDeleteCategory(categoryData); // Truyền category gốc vào
  }
}

// Thay thế hàm loadAddCategoryPopup cũ bằng hàm này
export function loadAddCategoryPopup() {
  document.querySelector(".overlay").classList.add("show");
  category = {}; // Reset global category
  renderAddCategoryHtml("add", {});
  setUpRenderAddCategory("add", {});
}

// Thêm hàm mới này
export function loadUpdateCategoryPopup(categoryToUpdate) {
  if (!categoryToUpdate) {
    console.error("Không có danh mục nào được cung cấp để cập nhật.");
    return;
  }
  document.querySelector(".overlay").classList.add("show");

  // Điền trước dữ liệu vào biến global 'category'
  // để trình xử lý upload ảnh có thể sử dụng
  category = { ...categoryToUpdate };

  renderAddCategoryHtml("update", categoryToUpdate);
  setUpRenderAddCategory("update", categoryToUpdate);
}

function handleClickUploadCategoryImage() {
  document
    .getElementById("category-image")
    .addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        document.querySelector(".category-preview-img").src =
          "../assets/categories/" + file.name;
        category.image = file.name;
      }
    });
}
// Xử lý thêm danh mục mới
function handleAddCategory() {
  document
    .querySelector(".btn-confirm-add-category")
    .addEventListener("click", () => {
      // Không cho phép quá 4 danh mục cấp con
      if (savedSelectedCategories.length >= 3) {
        alert("Chỉ được phép thêm danh mục con tối đa 3 cấp.");
        return;
      }
      const categoryNameInput = document.getElementById("category-name");
      const categoryName = categoryNameInput.value.trim();
      if (!categoryName) {
        alert("Vui lòng nhập tên danh mục.");
        return;
      }
      if (!category.image) {
        alert("Vui lòng chọn ảnh danh mục.");
        return;
      }
      category.name = categoryName;
      category.image = category.image || "default-category.png";
      if (savedSelectedCategories.length === 0) {
        category.parentId = null;
        category.attributeIds = ["A004", "A014", "A016", "A019"];
      } else {
        category.parentId =
          savedSelectedCategories[savedSelectedCategories.length - 1].cateId;
        category.attributeIds = [];
      }
      // thêm sản phẩm mới
      const cate = addCategory(category);

      alert("Thêm danh mục thành công!");
      restCategoryPopup();
    });
}

function handleCancelAddCategory() {
  document
    .querySelector(".btn-cancel-add-category")
    .addEventListener("click", () => {
      category = {};
      document.querySelector(".overlay").classList.remove("show");
      document.querySelector(".overlay-content").innerHTML = "";
      document.querySelector(".overlay-content").hidden = true;
    });
}

// Thêm hàm mới này (thường đặt sau hàm handleAddCategory)
function handleUpdateCategory(originalCategory) {
  document
    .querySelector(".btn-confirm-add-category") // Vẫn dùng chung class
    .addEventListener("click", () => {
      // Không cho phép quá 4 danh mục cấp con
      if (savedSelectedCategories.length >= 3) {
        alert("Chỉ được phép thêm danh mục con tối đa 3 cấp.");
        return;
      }

      const categoryNameInput = document.getElementById("category-name");
      const categoryName = categoryNameInput.value.trim();
      if (!categoryName) {
        alert("Vui lòng nhập tên danh mục.");
        return;
      }

      // Chuẩn bị dữ liệu để cập nhật
      const dataToUpdate = {
        id: originalCategory.id, // Giữ ID gốc
      };

      // Lấy tên mới
      dataToUpdate.name = categoryName;

      // Lấy ảnh (ảnh mới từ global 'category.image' nếu có,
      // hoặc ảnh gốc nếu không thay đổi)
      dataToUpdate.image = category.image || originalCategory.image;

      // Kiểm tra xem người dùng có CHỌN MỚI ngành hàng cha không
      if (savedSelectedCategories.length > 0) {
        if (originalCategory.parentId === null) {
          alert(
            "Danh mục gốc là danh mục cấp cao nhất, không thể thay đổi ngành hàng cha."
          );
          return;
        }
        if (
          originalCategory.id ===
          savedSelectedCategories[savedSelectedCategories.length - 1].cateId
        ) {
          alert("Không thể chọn chính danh mục này làm ngành hàng cha.");
          return;
        }
        dataToUpdate.parentId =
          savedSelectedCategories[savedSelectedCategories.length - 1].cateId;
      } else {
        // Nếu không chọn mới, giữ nguyên parentId cũ
        dataToUpdate.parentId = originalCategory.parentId;
      }

      // *** Gọi hàm service updateCategory (Giả định) ***
      const result = updateCategoryById(dataToUpdate);
      // Bạn cần đảm bảo hàm updateCategory(data) tồn tại trong service

      alert("Cập nhật danh mục thành công!");

      restCategoryPopup();
    });
}

function handleDeleteCategory(category) {
  document
    .querySelector(".btn-delete-category")
    .addEventListener("click", () => {
      const confirmDelete = confirm(
        `Bạn có chắc chắn muốn xóa danh mục ${category.name} này không?`
      );
      if (!confirmDelete) return;

      // Kiểm tra xem danh mục này có bất kì sản phẩm nào không
      const productInCategory = getProductsByCategoryId(category.id);
      if (productInCategory.length > 0) {
        const productNames = productInCategory
          .map((prod) => prod.name)
          .join(", ");
        alert(
          `Không thể xóa danh mục này vì có sản phẩm liên quan: ${productNames}`
        );
        return;
      }

      // Kiểm tra xem danh mục này có danh mục con không

      const childCategories = getSubCategory(category.id, 1);
      if (childCategories.length > 0) {
        const childCategoryNames = childCategories
          .map((cate) => cate.name)
          .join(", ");
        alert(
          `Không thể xóa danh mục này vì có danh mục con liên quan: ${childCategoryNames}`
        );
        return;
      }

      // Gọi hàm xóa danh mục từ service
      const result = deleteCategoryById(category.id);
      if (result) {
        alert("Xóa danh mục thành công!");
        // Đóng popup và reset
        restCategoryPopup();
      }
    });
}

function restCategoryPopup() {
  category = {};
  document.querySelector(".overlay").classList.remove("show");
  document.querySelector(".overlay-content").innerHTML = "";
  document.querySelector(".overlay-content").hidden = true;
  loadCategoryManagePage(); // Tải lại trang quản lý danh mục để thấy thay đổi
}
