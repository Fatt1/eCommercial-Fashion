import { getAllCategoriesByLevel } from "../../../services/categoryService.js";
import { loadProductPage } from "../../../pages/Product/Product.js";
export default function CategorySection() {
  const categories = getAllCategoriesByLevel(0);
  return `
     <div class="category-home">
        <div class="main-content">
          <h2 class="header-text">DANH MỤC</h2>
          <div class="category-list">
            <div class="category-list-carousel">
            ${categories
              .map((cate) => {
                return `
              <div class="category-list-item">
              <img
                class="category-image"
                src="../assets/categories/${cate.image}"
                alt=""
              />
              <div class="category-list-item__overlay"></div>
              <p data-cate-id="${cate.id}" class="category-item__title">${cate.name}</p>
            </div>
              `;
              })
              .join(" ")}
            </div>
          </div>
          <div class="category-home-dots">
            <button class="category-home-dots__item less-than">
              <img src="../assets/lessthan.svg" />
            </button>
            <button class="category-home-dots__item greater-than">
              <img src="../assets/lessthan.svg" />
            </button>
          </div>
        </div>
      </div>
  `;
}
export function setupCategorySection() {
  // Hover effect cho category items
  document.querySelectorAll(".category-list-item").forEach((elm) => {
    elm.addEventListener("mouseover", () => {
      const overlayElem = elm.querySelector(".category-list-item__overlay");
      overlayElem.style.opacity = 1;
      elm.querySelector(".category-image").style.transform = "scale(1.2)";
    });

    elm.addEventListener("mouseout", () => {
      elm.querySelector(".category-list-item__overlay").style.opacity = 0;
      elm.querySelector(".category-image").style.transform = "scale(1)";
    });
  });

  document.querySelectorAll(".category-item__title").forEach((titleElem) => {
    titleElem.addEventListener("click", () => {
      const categoryId = titleElem.dataset.cateId;
      loadProductPage(categoryId);
    });
  });

  const categories = getAllCategoriesByLevel(0);
  const itemsPerPage = 4; // Số category hiển thị mỗi lần
  const totalPages = Math.ceil(categories.length / itemsPerPage); // Tổng số trang
  let currentPage = 0; // Trang hiện tại (bắt đầu từ 0)

  const carousel = document.querySelector(".category-list-carousel");
  const prevBtn = document.querySelector(".category-home-dots__item.less-than");
  const nextBtn = document.querySelector(
    ".category-home-dots__item.greater-than"
  );

  // Hàm cập nhật trạng thái buttons
  function updateButtons() {
    // Disable nút Previous nếu đang ở trang đầu
    if (currentPage === 0) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = "0.3";
      prevBtn.style.cursor = "not-allowed";
    } else {
      prevBtn.disabled = false;
      prevBtn.style.opacity = "1";
      prevBtn.style.cursor = "pointer";
    }

    // Disable nút Next nếu đang ở trang cuối hoặc không đủ category để chuyển
    if (currentPage >= totalPages - 1 || categories.length <= itemsPerPage) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = "0.3";
      nextBtn.style.cursor = "not-allowed";
    } else {
      nextBtn.disabled = false;
      nextBtn.style.opacity = "1";
      nextBtn.style.cursor = "pointer";
    }
  }

  // Previous button
  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      const translateValue = currentPage * 100;
      carousel.style.transform = `translateX(-${translateValue}%)`;
      updateButtons();
    }
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      const translateValue = currentPage * 100;
      carousel.style.transform = `translateX(-${translateValue}%)`;
      updateButtons();
    }
  });

  // Khởi tạo trạng thái ban đầu
  updateButtons();
}
