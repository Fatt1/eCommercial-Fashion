import {
  getAllCategory,
  getSubCategory,
} from "../../../services/categoryService.js";

export default function Filter({ categoryId }) {
  return `
   <div class="filter">
        <div class="category-list-product-page">
          <div class="category-list__header">
            <img src="../assets/category-3-soc.svg" />
            <h3 class="category-header-filter">DANH MỤC</h3>
          </div>
          <ul class="category-list-body">
           ${generateCategoryFilterHtml(categoryId)}
           
          </ul>
        </div>

        <div class="filter-header">
          <img src="../assets/Filter.svg" />
          <h2>BỘ LỌC TÌM KIẾM</h2>
        </div>
        <fieldset class="filter-group color-filter">
          <legend class="filter-group__header">Màu sắc</legend>
          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" hidden />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" hidden />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" hidden />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>

        <fieldset class="filter-group size-filter">
          <legend class="filter-group__header">Kích thước</legend>
          <div class="checkbox-filter">
            <label class="checkbox" for="S" Bl>
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="S" name="S" type="checkbox" />
              <span class="checkbox-label">S</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="M" Bl>
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="M" name="M" type="checkbox" hidden />
              <span class="checkbox-label">M</span>
            </label>
          </div>
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>

        <fieldset class="filter-group price-range-filter">
            <legend class="filter-group__header">Khoảng giá</legend>
            <div class="price-range-filter__edit">
              <div class="price-range-filter__inputs">
                  <input class="price-range-filter__input" type="text" maxlength="13" placeholder="đ TỪ">
                  <div class="price-range-filter__range-line"></div>
                   <input class="price-range-filter__input" type="text" maxlength="13" placeholder="đ ĐẾN">
                </div>
                <button class="btn apply-btn">Áp dụng</button>
              </div>
        </fieldset>

         <fieldset class="filter-group brand-filter">
          <legend class="filter-group__header">Thương hiệu</legend>
          <div class="checkbox-filter">
            <label class="checkbox" for="sneaker">
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="sneaker" name="sneaker" type="checkbox" />
              <span class="checkbox-label">Sneaker</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="louis-vuitton">
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="louis-vuitton" name="louis-vuitton" type="checkbox" hidden />
              <span class="checkbox-label">Louis Vuitton</span>
            </label>
          </div>
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>
      </div>
  `;
}
function generateCategoryFilterHtml(categoryId) {
  const categories = getAllCategory();
  let parentIdToShow = null;
  categories.forEach((cate) => {
    if (cate.id === categoryId && cate.parentId) {
      parentIdToShow = cate.parentId;
    }
  });

  let categoryListHtml = "";
  categories.forEach((cate) => {
    // nếu mà cateParentId ko có tìm mới tìm các con của nó
    if (!cate.parentId) {
      const childrenCategory = getSubCategory(cate.id);
      let contentChildCategory = "";
      if (childrenCategory) {
        const showCaret = cate.id === parentIdToShow ? "show" : "";
        contentChildCategory += `<ul class='nested ${showCaret}'>${childrenCategory
          .map((child) => {
            return `<li class="category-filter-value" data-category-id='${child.id}'>${child.name}</li>`;
          })
          .join(" ")}</ul>`;
      }
      categoryListHtml += ` <li>
           <div class="container-caret">
                <span data-category-id="${
                  cate.id
                }" class="caret category-filter-value ${
        categoryId === cate.id ? "active" : ""
      }" >
                ${cate.name}
         </span>
          <span class="caret-toggle "></span>
           </div>
       ${contentChildCategory}
      
            </li>`;
    }
  });
  return categoryListHtml;
}
