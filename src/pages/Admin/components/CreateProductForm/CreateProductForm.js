import { getAttributeByCategoryId } from "../../../../services/attributeService.js";
import { getAllCategoriesByLevel } from "../../../../services/categoryService.js";
import { renderCreateProductDetailAttribute } from "../CreateProductDetail/CreateProductDetail.js";

export function CreateProductForm() {
  return `
      <div id="create-product-form">
              <div class="create-product-image">
                <span class="create-product-image__header-text">Hình ảnh sản phẩm</span>
                <span class="create-product__ratio">Hình ảnh tỷ lệ 3:4</span>
              <div >
                <div class="selected-images-list">
                    
                    <label for="input-images">
                    <div class="label-image-input">
                      <img class="image-input-icon" src="../assets/Add Image.svg"/>
                      <p class="add-image-text">Thêm hình ảnh (<span class="current-total-image">0</span>/7)</p>
                    </div>
                  </label>
                  <div class="preview-container">
                  
                  </div>
                 
                  <input id="input-images" type="file"  hidden accept="image/*">
                </div>
                  
              </div>
              </div>
              <div class="create-product-thumbnail">
                 <span class="create-product-thumbnail__header-text">*Ảnh bìa</span>
                    <div class="label-image-input">
                      <img class="image-input-icon thumbnail-preview" src="../assets/Add Image.svg"/>
                     
                    </div>       
              </div>

              <div class="form-group">
                <label for="name">*Tên sản phẩm</label>
                <input name="name" type="text" id="name" placeholder="Tên sản phẩm + Thương hiệu + kích cỡ + màu" required>
                <div class="error-message error-name"></div>
              </div>

               <div class="form-group category-input ">
                
                <label>*Ngành hàng</label>
                <div class="wrapper-create-product-category-btn">
                   <button class="create-product__category-btn">Chọn ngành hàng</button>
                   <img src="../assets/Pencil.svg" alt="">
                </div>
                <div class="error-message error-category"></div>
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
             
                <div class="form-group">
                <label style="display: block;" for="category">*Mô tả sản phẩm</label>
                <textarea style="width: 80%; margin-left: 120px;" class="description" rows="10"></textarea>
                <div class="error-message error-category"></div>
                
              </div>
            </div>
  
  `;
}
export let uploadedFiles = [];
export let thumbnailFile = {};
let draggedItem = null;
export let savedSelectedCategories = [];

const DOM = {
  categoryBtn: null,
  categorySelectorWrapper: null,
  categorySelectedList: null,
  cancelBtn: null,
  agreeBtn: null,
  init() {
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
  getAllMenus() {
    return document.querySelectorAll(".category-list-menu[data-level]");
  },
  getSelectedCategories() {
    return document.querySelectorAll(".category-item.selected");
  },
};

export function setUpCreateProductForm() {
  uploadedFiles = [];
  thumbnailFile = {};
  savedSelectedCategories = [];
  handleUploadImg();
  DOM.init();
  renderCategoriesByLevel(0);
  setupEventListeners();
}
// Setup tất cả event listeners
function setupEventListeners() {
  // Mở category selector
  DOM.categoryBtn.addEventListener("click", handleOpenSelector);

  // Hủy selection
  DOM.cancelBtn.addEventListener("click", handleCancelSelection);

  // Xác nhận selection
  DOM.agreeBtn.addEventListener("click", handleConfirmSelection);

  const previewContainer = document.querySelector(".preview-container");
  const allImg = previewContainer.querySelectorAll(".image-item");
  if (allImg.length > 0) {
    allImg.forEach((itemDiv) => {
      itemDiv.addEventListener("dragstart", handleDragStart);
      itemDiv.addEventListener("dragover", handleDragOver);
      itemDiv.addEventListener("dragleave", handleDragLeave);
      itemDiv.addEventListener("drop", handleDrop);
      itemDiv.addEventListener("dragend", handleDragEnd);
      const fileId = itemDiv.dataset.id;
      itemDiv.lastElementChild.addEventListener("click", function () {
        deleteUploadImg(itemDiv, fileId);
      });
    });
  }
}

// Handlers
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
  const finalCategory =
    savedSelectedCategories[savedSelectedCategories.length - 1];
  const attributes = getAttributeByCategoryId(finalCategory.cateId);
  renderCreateProductDetailAttribute(attributes, finalCategory.cateId);

  DOM.categorySelectorWrapper.classList.remove("show");
}

function renderCategoriesByLevel(level, parentId = null) {
  const menu = DOM.getMenuByLevel(level);
  if (!menu) return;
  const categories = parentId
    ? getAllCategoriesByLevel(level).filter(
        (cate) => cate.parentId === parentId
      )
    : getAllCategoriesByLevel(level);
  // Reset menu trước
  menu.innerHTML = "";
  // Cái này mới, nó sẽ tạo ra 1 Node nhẹ hơn và giúp tối ưu hiệu suất
  const documentFragment = document.createDocumentFragment();
  categories.forEach((cate) => {
    const liElem = createCategoryItem(cate);
    documentFragment.appendChild(liElem);
  });
  menu.appendChild(documentFragment);
}

// Hàm tạo category item element (tái sử dụng)
function createCategoryItem(cate) {
  const liElem = document.createElement("li");
  liElem.classList.add("category-item");
  liElem.setAttribute("data-has-children", cate.hasChildren);
  liElem.setAttribute("data-cate-id", cate.id);
  liElem.onclick = handleCategoryClick;
  liElem.textContent = cate.name;

  if (cate.hasChildren) {
    const imgElem = document.createElement("img");
    imgElem.src = "../assets/Forward.svg";
    imgElem.classList.add("category-item-right");
    liElem.appendChild(imgElem);
  }

  return liElem;
}
function toggleCategorySelection(menu, selectedCategory) {
  const previousSelected = menu.querySelector(".category-item.selected");
  if (previousSelected) previousSelected.classList.remove("selected");
  selectedCategory.classList.add("selected");
}
function handleCategoryClick(event) {
  const category = event.target.closest(".category-item");
  if (!category) return;

  const hasChildren = category.dataset.hasChildren === "true";
  const cateId = category.dataset.cateId;
  const currentMenu = category.closest(".category-list-menu");
  const level = Number(currentMenu.dataset.level);

  // Xóa class selected của category trước đó ở cùng level
  toggleCategorySelection(currentMenu, category);

  // Render children hoặc clear menus
  if (hasChildren) {
    renderCategoriesByLevel(level + 1, cateId);
    clearHigherLevelMenus(level + 1);
  } else {
    clearHigherLevelMenus(level);
  }

  updateFooterCategory();
}

// Khôi phục lại các category đã được lưu
function restoreSavedCategories() {
  if (savedSelectedCategories.length === 0) {
    DOM.categorySelectedList.innerHTML = "";
    return;
  }

  // Xóa tất cả selected hiện tại
  DOM.getSelectedCategories().forEach((cate) =>
    cate.classList.remove("selected")
  );

  // Khôi phục lại từng category theo thứ tự level
  savedSelectedCategories.forEach((savedCate, index) => {
    const menu = DOM.getMenuByLevel(index);
    const categoryItem = menu?.querySelector(
      `.category-item[data-cate-id='${savedCate.cateId}']`
    );

    if (categoryItem) {
      categoryItem.classList.add("selected");

      // Nếu category có children và không phải là category cuối cùng
      // thì load các con của nó cho level tiếp theo
      // Load children cho level tiếp theo nếu cần
      const isNotLastCategory = index < savedSelectedCategories.length - 1;
      if (savedCate.hasChildren && isNotLastCategory) {
        const nextLevel = savedCate.level + 1;
        renderCategoriesByLevel(nextLevel, savedCate.cateId);
      }
    }
  });

  updateFooterCategory();
}

// Update các category đã đc chọn
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
//Xóa hết mấy menu mà có mức cao hơn
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
// Xóa tất cả các menu con (level > 0)
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
function updateCategoryButtonText() {
  const selectedCategories = DOM.getSelectedCategories();
  if (selectedCategories.length === 0) {
    DOM.categoryBtn.textContent = "Chọn danh mục";
    return;
  }
  const text = Array.from(selectedCategories)
    .map((cate) => cate.textContent)
    .join(" > ");

  DOM.categoryBtn.textContent = text;
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
function uploadThumbnail(file) {
  thumbnailFile = file;
  document.querySelector(".thumbnail-preview").src =
    "../assets/products/" + file.fileName;
}

function handleUploadImg() {
  document
    .getElementById("input-images")
    .addEventListener("change", (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = createFileId(file);
        // kiểm tra nếu mà file đã up rồi thì báo lỗi
        if (isDuplicateImg(fileId)) {
          console.log("Trùng file rồi ĐM");
          return;
        }

        const fileName = file.name;
        uploadedFiles.push({
          id: fileId,
          fileName,
        });

        createPreviewElement(fileId, fileName);
      }
      if (uploadedFiles.length === 1) {
        updateThumbnailOnReorder();
      }
    });
}
function deleteUploadImg(elementToRemove, fileId) {
  const arrayIndex = uploadedFiles.findIndex((item) => item.id === fileId);
  if (arrayIndex !== -1) {
    uploadedFiles.splice(arrayIndex, 1);
  }
  elementToRemove.remove();
  updateThumbnailOnReorder();
  updateTotalUploadedFile();
}
function createPreviewElement(fileId, fileName) {
  const previewContainer = document.querySelector(".preview-container");
  const allImg = previewContainer.querySelectorAll(".image-item");
  if (allImg.length > 0) {
    allImg.forEach((itemDiv) => {
      itemDiv.addEventListener("dragstart", handleDragStart);
      itemDiv.addEventListener("dragover", handleDragOver);
      itemDiv.addEventListener("dragleave", handleDragLeave);
      itemDiv.addEventListener("drop", handleDrop);
      itemDiv.addEventListener("dragend", handleDragEnd);
    });
  }
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("image-item");
  itemDiv.setAttribute("data-id", fileId);
  itemDiv.setAttribute("draggable", "true");
  itemDiv.addEventListener("dragstart", handleDragStart);
  itemDiv.addEventListener("dragover", handleDragOver);
  itemDiv.addEventListener("dragleave", handleDragLeave);
  itemDiv.addEventListener("drop", handleDrop);
  itemDiv.addEventListener("dragend", handleDragEnd);
  // 2. Tạo thẻ <img>
  const img = document.createElement("img");
  img.src = `../assets/products/${fileName}`; // Gán Blob URL vào src
  img.alt = `Xem trước ảnh ${fileId}`;

  // 3. Tạo nút xóa
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("image-item__delete-btn");
  deleteBtn.innerHTML = "x";

  deleteBtn.addEventListener("click", function () {
    deleteUploadImg(itemDiv, fileId);
  });

  itemDiv.appendChild(img);
  itemDiv.appendChild(deleteBtn);
  previewContainer.appendChild(itemDiv);
  // Cập nhật số lượng hình đã thêm
  updateTotalUploadedFile();
}
function updateTotalUploadedFile() {
  document.querySelector(".current-total-image").innerHTML =
    uploadedFiles.length;
}
//Tạo id cho file để có thể check xem user có dùng trùng ảnh để upload không
function createFileId(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
function isDuplicateImg(fileId) {
  return uploadedFiles.some((item) => item && item.id === fileId);
}
// --- A. Sự kiện Kéo Bắt đầu (Drag Start) ---
function handleDragStart(e) {
  draggedItem = this; // 'this' là phần tử .image-item đang được kéo
  e.dataTransfer.effectAllowed = "move";
}

// --- B. Sửa handleDragOver: Sắp xếp DOM theo vị trí hiện tại ---
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

// --- C. Sự kiện Kéo rời khỏi (Drag Leave) ---
function handleDragLeave(e) {
  // Không cần xử lý gì phức tạp ở đây trong trường hợp này
}

// --- D. Sự kiện Thả (Drop) ---
function handleDrop(e) {
  e.preventDefault();

  const droppingElement = this; // Phần tử mà chuột đang thả lên

  if (draggedItem && draggedItem !== droppingElement) {
    const container = document.querySelector(".preview-container");

    // 1. Logic sắp xếp DOM (sử dụng vị trí index hiện tại trong DOM)
    const draggingCurrentIndex = getDOMIndex(draggedItem);
    const droppingCurrentIndex = getDOMIndex(droppingElement);

    if (draggingCurrentIndex > droppingCurrentIndex) {
      // Kéo từ sau lên trước -> Chèn vào TRƯỚC phần tử đích
      container.insertBefore(draggedItem, droppingElement);
    } else {
      // Kéo từ trước ra sau -> Chèn vào SAU phần tử đích
      container.insertBefore(draggedItem, droppingElement.nextSibling);
    }
    // 2. Đồng bộ mảng và thumbnail
    updateThumbnailOnReorder();
  }
}
// --- E. Sự kiện Kéo Kết thúc (Drag End) ---
function handleDragEnd(e) {
  draggedItem = null;
}

/**
 * Cập nhật thumbnail dựa trên ảnh đầu tiên của mảng (sau khi kéo thả)
 */
function updateThumbnailOnReorder() {
  //Lấy file đầu tiên ra
  const firstFile = document
    .querySelector(".preview-container")
    .querySelector(".image-item");
  // Nếu mà còn ít nhất 1 hình
  if (firstFile) {
    const fileId = firstFile.dataset.id;
    const file = uploadedFiles.find((file) => file.id === fileId);
    uploadThumbnail(file);
  }
  // Trường hợp nếu mà xóa hết tất cả hình đã chọn
  else {
    thumbnailFile = null;
    document.querySelector(".thumbnail-preview").src =
      "../assets/Add Image.svg";
  }
}
function getDOMIndex(element) {
  return Array.prototype.indexOf.call(element.parentNode.children, element);
}
