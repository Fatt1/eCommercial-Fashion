import { getAllCategoriesByLevel } from "../../../../services/categoryService.js";

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
                 
                  <input id="input-images" type="file" hidden>
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
                
                <label for="category">*Ngành hàng</label>
                <div class="wrapper-create-product-category-btn">
                   <button class="create-product__category-btn">Chọn ngành hàng</button>
                   <img src="../assets/Pencil.svg" alt="">
                </div>
                <div class="error-message error-category"></div>
                 <div class="category-selector-wrapper show">
                ${generateCategoryListHtml()}
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
let uploadedFiles = [];
let thumbnailFile = null;
let draggedItem = null;

export function setUpCreateProductForm() {
  handleUploadImg();
  const categoriesLevel0 = getAllCategoriesByLevel();

  const cateMenu = document.querySelector(
    ".category-list-menu[data-level='0']"
  );
  categoriesLevel0.forEach((cate) => {
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
    cateMenu.appendChild(liElem);
  });
}

function uploadThumbnail(file) {
  thumbnailFile = file;
  document.querySelector(".thumbnail-preview").src = file.blobUrl;
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

        // tạo BLOB URL
        const blobUrl = URL.createObjectURL(file);
        uploadedFiles.push({
          id: fileId,
          file: file,
          blobUrl: blobUrl,
        });

        createPreviewElement(blobUrl, fileId);
      }
      if (uploadedFiles.length === 1) {
        updateThumbnailOnReorder();
      }
    });
}
function deleteUploadImg(elementToRemove, fileId) {
  const arrayIndex = uploadedFiles.findIndex((item) => item.id === fileId);
  if (arrayIndex !== -1) {
    const fileObject = uploadedFiles[arrayIndex];
    // Giải phóng Blob URL để tránh rỏ rỉ bộ nhớ
    URL.revokeObjectURL(fileObject.blobUrl);
    uploadedFiles.splice(arrayIndex, 1);
  }
  elementToRemove.remove();
  updateThumbnailOnReorder();
  updateTotalUploadedFile();
}
function createPreviewElement(dataUrl, fileId) {
  const previewContainer = document.querySelector(".preview-container");
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
  img.src = dataUrl; // Gán Blob URL vào src
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

function generateCategoryListHtml() {
  return `
     <div class="category-list">
                  <ul class="category-list-menu" data-level="0">
                  </ul>
                  <ul class="category-list-menu" data-level="1">
                   
                  </ul>
                  <ul class="category-list-menu" data-level="2">
                   
                  </ul>
              </div>
  `;
}
function handleCategoryClick(event) {
  const category = event.target;
  const hasChildren = category.dataset.hasChildren === "true";
  const cateId = category.dataset.cateId;
  const currentMenu = category.closest(".category-list-menu");
  const level = Number(currentMenu.dataset.level);

  // Xóa class selected của category trước đó ở cùng level
  const selectedCategoryBefore = currentMenu.querySelector(
    ".category-item.selected"
  );
  if (selectedCategoryBefore) {
    selectedCategoryBefore.classList.remove("selected");
  }

  // Thêm class selected cho category hiện tại
  category.classList.add("selected");

  // Nếu category được chọn mà có children thì sẽ hiện thị các con của nó
  if (hasChildren) {
    const categoryByLevel = getAllCategoriesByLevel(level + 1).filter(
      (cate) => cate.parentId === cateId
    );
    document.querySelector(
      `.category-list-menu[data-level='${level + 1}']`
    ).innerHTML = "";
    categoryByLevel.forEach((cate) => {
      const liElem = document.createElement("li");
      liElem.classList.add("category-item");
      liElem.setAttribute("data-has-children", cate.hasChildren);
      liElem.setAttribute("data-cate-id", cate.id);
      liElem.onclick = handleCategoryClick;
      liElem.textContent = cate.name;
      // Nếu mà category mà có children thì hiện thêm cái mũi tên sang phải
      if (cate.hasChildren) {
        const imgElem = document.createElement("img");
        imgElem.src = "../assets/Forward.svg";
        imgElem.classList.add("category-item-right");
        liElem.appendChild(imgElem);
      }
      document
        .querySelector(`.category-list-menu[data-level='${level + 1}']`)
        .appendChild(liElem);
      clearHigherLevelMenus(level + 1);
    });
  } else {
    clearHigherLevelMenus(level);
  }

  updateFooterCategory();
}

// Update các category đã đc chọn
function updateFooterCategory() {
  const footerSelectedCategoryList = document.querySelector(
    ".category-selected-list"
  );
  let content = ``;
  document.querySelectorAll(".category-item.selected").forEach((cate) => {
    content += `<span class="category-selected">${cate.textContent} > </span>`;
  });
  footerSelectedCategoryList.innerHTML = content;
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
