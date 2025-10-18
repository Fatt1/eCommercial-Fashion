import {
  getAllParentCategory,
  isHasChildren,
} from "../../../../services/categoryService.js";
import { CreateProductHeader } from "../CreateProductHeader/CreateProductHeader.js";
import { getProductById } from "../../../../services/productService.js";
import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  savedSelectedCategories,
  setUpCreateProductForm,
} from "../CreateProductForm/CreateProductForm.js";
function renderUpdateProductHTML(product) {
  const categories = getAllParentCategory(product.categoryId);

  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content__admin">
              ${CreateProductHeader()}
         <!-- Create Product Form -->     
          <div id="create-product-form">
        <div class="create-product-image">
          <span class="create-product-image__header-text"
            >Hình ảnh sản phẩm</span
          >
          <span class="create-product__ratio">Hình ảnh tỷ lệ 3:4</span>
          <div>
            <div class="selected-images-list">
              <label for="input-images">
                <div class="label-image-input">
                  <img class="image-input-icon" src="../assets/Add Image.svg" />
                  <p class="add-image-text">
                    Thêm hình ảnh (<span class="current-total-image">1</span>/7)
                  </p>
                </div>
              </label>
              <div class="preview-container">
               ${product.images.map((imgUrl) => {
                 return `
                   <div
                  class="image-item"
                  data-id="${imgUrl}-263937-1757734223170"
                  draggable="true"
                >
                  <img
                    src="../assets/products/${imgUrl}"
                    alt="Xem trước ảnh ${imgUrl}"
                  /><button class="image-item__delete-btn">x</button>
                </div>
                `;
               })}
              </div>

              <input id="input-images" type="file" hidden="" accept="image/*" />
            </div>
          </div>
        </div>
        <div class="create-product-thumbnail">
          <span class="create-product-thumbnail__header-text">*Ảnh bìa</span>
          <div class="label-image-input">
            <img
              class="image-input-icon thumbnail-preview"
              src="../assets/products/${product.thumbnail}"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="name">*Tên sản phẩm</label>
          <input
            value="${product.name}"
            name="name"
            type="text"
            id="name"
            placeholder="Tên sản phẩm + Thương hiệu + kích cỡ + màu"
            required=""
          />
          <div class="error-message error-name"></div>
        </div>

        <div class="form-group category-input">
          <label>*Ngành hàng</label>
          <div class="wrapper-create-product-category-btn">
            <button class="create-product__category-btn">
              ${categories.parentCategories
                .map((cate) => cate.name)
                .join(" &gt ")}
             &gt ${categories.name}
            </button>
            <img src="../assets/Pencil.svg" alt="" />
          </div>
          <div class="error-message error-category"></div>
          <div class="category-selector-wrapper">
            <div class="category-list">
              <ul class="category-list-menu" data-level="0">
              </ul>
              <ul class="category-list-menu" data-level="1"></ul>
              <ul class="category-list-menu" data-level="2"></ul>
            </div>
            <div class="footer-category">
              <div class="footer-category-left">
                <span>Đã chọn: </span>
                <div class="category-selected-list">
                ${categories.parentCategories.map((cate) => {
                  return `<span class="category-selected">${cate.name} </span> &gt`;
                })}
                 <span class="category-selected">${categories.name} </span>
                </div>
              </div>
              <div class="footer-category-action">
                <button class="footer-category-action__cancel-btn">Hủy</button>
                <button class="footer-category-action__agree-btn btn-admin">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label style="display: block" for="category">*Mô tả sản phẩm</label>
          <textarea
            style="width: 80%; margin-left: 120px"
            class="description"
            rows="10"
          >
          ${product.desc}
          </textarea>
          <div class="error-message error-category"></div>
        </div>
      </div>
          </div>
      </div>
    </div>
  `;
}
function setUpUpdateProduct(product) {
  setUpAdminNav();
  setUpCreateProductForm();
  const categories = getAllParentCategory(product.categoryId);
  categories.parentCategories.forEach((cate, index) => {
    const hasChildren = isHasChildren(cate.id);
    savedSelectedCategories.push({
      cateId: cate.id,
      level: index,
      hasChildren: hasChildren,
    });
  });
  savedSelectedCategories.push({
    cateId: product.categoryId,
    level: categories.parentCategories.length,
    hasChildren: isHasChildren(product.categoryId),
  });
}
export function loadUpdateProductPage(productId) {
  const product = getProductById(productId);
  renderUpdateProductHTML(product);
  setUpUpdateProduct(product);
}
