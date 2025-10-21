import { getAllCategoriesByLevel } from "../../../../services/categoryService.js";

// =================================================================
// CÁC HÀM TÁI SỬ DỤNG TỪ CREATEPRODUCTFORM.JS
// =================================================================

// Biến cục bộ để lưu các category đã chọn
let savedSelectedCategories = [];

// 1. DOM object
// (Giữ nguyên vì HTML của bạn dùng lại y hệt các class)
const DOM = {
  categoryBtn: null,
  categorySelectorWrapper: null,
  categorySelectedList: null,
  cancelBtn: null,
  agreeBtn: null,
  init() {
    // Các selector này sẽ tìm thấy element bên trong popup
    // vì hàm init() được gọi sau khi renderAddCategoryHtml()
    this.categoryBtn = document.querySelector(".create-product__category-btn");
    this.categorySelectorWrapper = document.querySelector(
      ".category-selector-wrapper"
    );
    this.categorySelectedList = document.querySelector(
      ".category-selected-list"
    );
    this.cancelBtn = document.querySelector(
      ".footer-category-action__cancel-btn"
    );
    this.agreeBtn = document.querySelector(
      ".footer-category-action__agree-btn"
    );
  },
  getMenuByLevel(level) {
    return document.querySelector(`.category-list-menu[data-level='${level}']`);
  },
  getSelectedCategories() {
    return document.querySelectorAll(".category-item.selected");
  },
};

// 2. Hàm render (Copy y hệt)
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

// 3. Hàm tạo <li> (Copy y hệt)
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

// 4. Hàm xử lý click (Copy y hệt)
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

// 5. Các hàm helpers (Copy y hệt)
function toggleCategorySelection(menu, selectedCategory) {
  const previousSelected = menu.querySelector(".category-item.selected");
  if (previousSelected) previousSelected.classList.remove("selected");
  selectedCategory.classList.add("selected");
}

function clearHigherLevelMenus(currentLevel) {
  document
    .querySelectorAll(`.category-list-menu[data-level]`)
    .forEach((menu) => {
      const menuLevel = Number(menu.dataset.level);
      if (menuLevel > currentLevel) {
        menu.innerHTML = "";
      }
    });
}

function clearAllMenus() {
  document
    .querySelectorAll(`.category-list-menu[data-level]`)
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
  document.querySelectorAll(".category-item.selected").forEach((cate) => {
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

function renderAddCategoryHtml() {
  document.querySelector(".overlay-content").hidden = false;
  document.querySelector(".overlay-content").innerHTML = `
    <div class="add-category-popup">
      <h2>Thêm danh mục mới</h2>
      <div class="add-category-form">
          <div class="form-group category-input ">
              
              <label>Ngành hàng cha</label>
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
            <input type="text" id="category-name" name="category-name" />
          </div class="form-group">
          <div class="preview-img">
            <label for="category-image">Ảnh danh mục:</label>
            <input type="file" id="category-image" name="category-image" accept="image/*" />
            <div class="preview-image-container"></div>
          </div>
      </div> 
    </div>
  `; // <- Bạn bị thiếu 2 thẻ </div> ở đây, tôi đã thêm vào
}

/**
 * Hàm setup chính cho popup
 */
function setUpRenderAddCategory() {
  // 1. Khởi tạo lại biến state
  savedSelectedCategories = [];

  // 2. Khởi tạo DOM (sau khi HTML đã được render)
  DOM.init();

  // 3. Render category level 0
  renderCategoriesByLevel(0);

  // 4. Gán các sự kiện click cho button "Chọn ngành hàng", "Hủy", "Xác nhận"
  setupEventListeners();
}

export function loadAddCategoryPopup() {
  document.querySelector(".overlay").classList.add("show");
  renderAddCategoryHtml();
  setUpRenderAddCategory();
}
