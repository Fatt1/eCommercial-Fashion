import { getBrandsByCategoryId } from "../../../services/brandService.js";
import {
  getAllCategory,
  getCategoryById,
  getSubCategory,
  getSubCategoryIds,
} from "../../../services/categoryService.js";
import { convertStringToKebabCase } from "../../../helper/helper.js";
import { getColorByCode } from "../../../services/colorService.js";
import { getContrastTextColor } from "../../../helper/helper.js";
export default function Filter({ categoryId }) {
  return `
   
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
        ${generateColorFilterHtml(categoryId)}

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
        ${generateBrandFilterHtml(categoryId)}

     
  `;
}
function generateCategoryFilterHtml(categoryId) {
  const categories = getAllCategory();
  let parentIdToShow = null;
  // tìm parentId nếu mà categoryId truyền vào nếu có parentId
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
        const showCaret =
          cate.id === parentIdToShow ||
          (cate.parentId === null && cate.id === categoryId)
            ? "show"
            : "";
        contentChildCategory += `<ul class='nested ${showCaret}'>${childrenCategory
          .map((child) => {
            return `<li class="category-filter-value ${
              child.id === categoryId ? "active" : ""
            }" data-category-id='${child.id}'>${child.name}</li>`;
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
function generateBrandFilterHtml(categoryId) {
  const childCategoryIds = getSubCategoryIds(categoryId);
  const allRelatedCategoryIds = [categoryId, ...childCategoryIds];
  let brandsByCategoryId = [];
  allRelatedCategoryIds.forEach((categoryId) => {
    const brands = getBrandsByCategoryId(categoryId);

    if (brands.length != 0) {
      brandsByCategoryId.push(...brands);
    }
  });

  return `
           <fieldset class="filter-group brand-filter">
          <legend class="filter-group__header">Thương hiệu</legend>
          ${brandsByCategoryId
            .map(
              (brand) => `<div class="checkbox-filter">
            <label data-brand-id="${
              brand.id
            }"  class="checkbox" for="${convertStringToKebabCase(
                brand.name.toLowerCase()
              )}">
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
              <input id="${convertStringToKebabCase(
                brand.name.toLowerCase()
              )}" name="${convertStringToKebabCase(
                brand.name.toLowerCase()
              )}" type="checkbox" hidden />
              <span class="checkbox-label">${brand.name}</span>
            </label>
          </div>`
            )
            .join(" ")}
          
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>
  `;
}
function generateColorFilterHtml(categoryId) {
  const parentCategory = getCategoryById(categoryId);
  const allRelatedCategory = [
    parentCategory.category,
    ...parentCategory.childrenCategory,
  ];
  console.log(allRelatedCategory);
  let colors = [];
  allRelatedCategory.forEach((cate) => {
    if (cate.colorIds) colors.push(...cate.colorIds);
  });
  const uniqueColorIds = new Set(colors);

  let contentColors = "";
  uniqueColorIds.forEach((colorId) => {
    const color = getColorByCode(colorId);

    contentColors += ` <div  class="checkbox-filter">
            <label data-color-id="${
              color.id
            }" class="checkbox" for="${convertStringToKebabCase(
      color.name.toLowerCase()
    )}">
              <div style="background-color: ${
                color.id
              }" class="stick-checkbox stick-check-box__color">
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
                    fill="${getContrastTextColor(color.id)}"
                  />
                </svg>
              </div>
              <input id="${color.id}"
              )}" name="${convertStringToKebabCase(
                color.name.toLowerCase()
              )}" type="checkbox" hidden />
              <span class="checkbox-label">${color.name}</span>
            </label>
          </div>`;
  });
  let content = ` <fieldset class="filter-group color-filter">
          <legend class="filter-group__header">Màu sắc</legend>
          ${contentColors}
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>`;
  return content;
}
