import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { getAllCategoriesByLevel } from "../../../../services/categoryService.js";
import { loadAddCategoryPopup } from "./AddCategory.js";
function renderCategoryManageHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content__admin">
          <div class="category-manage">
              <div class="product-manage__head category-manage__head">
                <div class="product-manage__head-left category-manage__head-left">
                  <h1 class="category-manage-header">Quản lí danh mục</h1>
                </div>
              </div>

              <div class="category-manage-bottom">
                <div class="category-manage-bottom__content">
                  <div class="category-manage__category-list">
                  <ul class="category-list-menu-manage" data-level="0">
                  </ul>
                  <ul class="category-list-menu-manage" data-level="1">
                   
                  </ul>
                  <ul class="category-list-menu-manage" data-level="2">
                   
                  </ul>
                </div>
              </div>
              <div class="category-manage-action">
                <button class="btn-add-category">Thêm danh mục</button>
                 <button class="btn-edit-category">Chỉnh sửa danh mục</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getMenuByLevel(level) {
  return document.querySelector(
    `.category-list-menu-manage[data-level='${level}']`
  );
}

/**
 * Xóa nội dung của các menu level cao hơn
 */
function clearHigherLevelMenus(currentLevel) {
  document
    .querySelectorAll(".category-list-menu-manage[data-level]")
    .forEach((menu) => {
      const menuLevel = Number(menu.dataset.level);
      if (menuLevel > currentLevel) {
        menu.innerHTML = "";
      }
    });
}

/**
 * Tạo một <li> item cho category
 * (Không gán onclick, chúng ta sẽ dùng Event Delegation)
 */
function createCategoryItem(cate) {
  const liElem = document.createElement("li");
  liElem.classList.add("category-item");
  liElem.setAttribute("data-has-children", cate.hasChildren);
  liElem.setAttribute("data-cate-id", cate.id);
  liElem.textContent = cate.name;

  if (cate.hasChildren) {
    const imgElem = document.createElement("img");
    imgElem.src = "../assets/Forward.svg"; // Đảm bảo đường dẫn này chính xác
    imgElem.classList.add("category-item-right");
    liElem.appendChild(imgElem);
  }
  return liElem;
}

/**
 * Hàm render danh sách category cho một level (phiên bản đơn giản)
 */
function renderCategories(level, parentId = null) {
  const menu = getMenuByLevel(level);
  if (!menu) return;

  // Logic lấy categories giống hệt code cũ của bạn
  const categories = parentId
    ? getAllCategoriesByLevel(level).filter(
        (cate) => cate.parentId === parentId
      )
    : getAllCategoriesByLevel(level);

  menu.innerHTML = ""; // Xóa nội dung cũ
  const fragment = document.createDocumentFragment();
  categories.forEach((cate) => {
    const li = createCategoryItem(cate);
    fragment.appendChild(li);
  });
  menu.appendChild(fragment);
}

/**
 * Xử lý TẤT CẢ các cú click vào danh sách category
 * (Sử dụng Event Delegation)
 */
function handleCategoryClick(event) {
  // Chỉ xử lý nếu click trúng một .category-item
  const categoryItem = event.target.closest(".category-item");
  if (!categoryItem) return;

  const hasChildren = categoryItem.dataset.hasChildren === "true";
  const cateId = categoryItem.dataset.cateId;
  const currentMenu = categoryItem.closest(".category-list-menu-manage");
  const level = Number(currentMenu.dataset.level);

  // 1. Highlight item được chọn
  const previousSelected = currentMenu.querySelector(".category-item.selected");
  if (previousSelected) previousSelected.classList.remove("selected");
  categoryItem.classList.add("selected");

  // 2. Xóa các menu con (level cao hơn)
  clearHigherLevelMenus(level);

  // 3. Nếu có con, render menu tiếp theo
  if (hasChildren) {
    renderCategories(level + 1, cateId);
  }

  // KHÔNG CẦN: saveSelectedCategories, updateFooterCategory...
}

/**
 * Hàm setup chính, đã được viết lại
 */
function setUpRenderCategoryManage() {
  setUpAdminNav();

  // Lấy container cha của cả 3 list
  const categoryListContainer = document.querySelector(
    ".category-manage__category-list"
  );

  if (categoryListContainer) {
    // Chỉ cần gán 1 event listener duy nhất cho container cha
    categoryListContainer.addEventListener("click", handleCategoryClick);
  }

  // Bắt đầu bằng cách render categories gốc (level 0)
  renderCategories(0);

  document.querySelector(".btn-add-category").addEventListener("click", () => {
    loadAddCategoryPopup();
  });
}

export function loadCategoryManagePage() {
  renderCategoryManageHtml();
  setUpRenderCategoryManage();
}
