import {
  getAllParentCategory,
  isHasChildren,
} from "../../../../services/categoryService.js";
import { CreateProductHeader } from "../CreateProductHeader/CreateProductHeader.js";
import {
  getProductById,
  getSkuById,
  getSkusByProductId,
  updateProductById,
} from "../../../../services/productService.js";
import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  savedSelectedCategories,
  setUpCreateProductForm,
  uploadedFiles,
  thumbnailFile,
} from "../CreateProductForm/CreateProductForm.js";
import { INPUT_TYPE } from "../../../../constant/Constant.js";
import {
  getBrandById,
  getBrandsByCategoryId,
  getBrandByName,
} from "../../../../services/brandService.js";
import { getAttributeByCategoryId } from "../../../../services/attributeService.js";
import {
  selectedAttributeValues,
  setUpEventListener,
} from "../CreateProductDetail/CreateProductDetail.js";
import {
  setUpEventListenerCreateProductVariation,
  attachDeleteEvent,
  attachDropdownEvents,
  variationState,
  updateAllDisabledItems,
  colorImages,
  uploadImageForColor,
} from "../CreateProductVariation/CreateProductVariation.js";
import {
  getAllColors,
  getColorByCode,
} from "../../../../services/colorService.js";
import { getAllSizes, getSizeById } from "../../../../services/sizeService.js";
import Product from "../../../../models/Product.js";
import { validationProduct } from "./addProduct.js";
import { generateUniqueId } from "../../../../helper/helper.js";
import { loadProductAdmin } from "./productManage.js";
let categoryAttributes = [];
let variationColor = undefined;
let variationSize = undefined;

function renderUpdateProductHTML(product) {
  const categories = getAllParentCategory(product.categoryId);
  categoryAttributes = getAttributeByCategoryId(product.categoryId);
  variationColor = product.variations.find((v) => v.name === "Màu sắc");
  variationSize = product.variations.find((v) => v.name === "Kích thước");
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
                    Thêm hình ảnh (<span class="current-total-image">${
                      product.images.length
                    }</span>/7)
                  </p>
                </div>
              </label>
              <div class="preview-container">
               ${product.images.map((imgUrl) => {
                 return `
                   <div
                  class="image-item"
                  data-id="${imgUrl}-existing"
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

        <!-- Create Detail -->
          <div class="create-detail-product">
        <h3 class="create-detail-product__header">Thông tin chi tiết</h3>
        <div class="attribute-list">
              ${InputDropdownBrand(categories.id, product.brandId)}
             ${categoryAttributes
               .map((att) => {
                 const attributeValues =
                   product.attributes.find((a) => a.attributeId == att.id)
                     ?.attributeValues || [];
                 let inputHtml = ``;
                 if (att.inputType === INPUT_TYPE.SINGLE_DROP_DOWN) {
                   inputHtml = InputSingleDropDown(att, attributeValues);
                 } else if (att.inputType === INPUT_TYPE.FREE_TEXT_FIELD)
                   inputHtml = InputText(att, attributeValues);
                 else inputHtml = InputMultiDropDown(att, attributeValues);
                 return `
                            <div class="attribute-container">
                                <span class="attribute-name">${
                                  att.isRequired ? "*" : ""
                                }${att.name}</span>
                                ${inputHtml}
                             </div>
                          `;
               })
               .join(" ")}
        </div>
               <!-- Variation -->
                <div class="create-product-variation">
            <h3 class="create-product-variation__header">Thông tin bán hàng</h3>
            <!-- product-variation-options -->
            <div class="product-variation">
              <h3 class="product-variation__left">*Phân loại hàng</h3>
              <div class="product-variation-container">
                <div class="product-variation-color product-variation-option">
                  <p class="product-variation__header">Màu</p>
                  <div class="product-variation-color-items product-variation-items">
                  
                  </div>
                </div>

                  <div class="product-variation-size product-variation-option">
                    <p class="product-variation__header">Kích thước</p>
                    <div class="product-variation-size-items product-variation-items">
                      
                  </div>
                </div>
              </div>
            </div>
               <!-- product-variation-value -->
              <div class="product-variation-value">
               <h3 class="product-variation-value-left">Danh sách phân loại hàng</h3>
              <div class="product-variation-value-right">
                 <div class="product-variation-value-right__top">
                   
                 </div>
                 <table id="product-variation-table">
                  <thead>
                      <tr>
                        <th style="width: 150px;">Màu</th>
                        <th style="width: 170px;">Kích thước</th>
                      </tr>
                      ${renderTableVariation(product)}
                  </thead>
                  <tbody>
                  
                  </tbody>
                 </table> 
              </div>

            </div>
            </div>
             <div class="create-product-action">
              <button class="create-product-action-btn create-product-action-btn__cancel">Hủy</button>
               <button class="create-product-action-btn create-product-action-btn__active">Lưu và hiện</button>
              <button class="create-product-action-btn create-product-action-btn__hide">Lưu và ẩn</button>
            </div>
        </div>
      </div>
    </div>
  `;
}

function createDropdown(items, name, selectedValue) {
  return `
     <div class="dropdown brand-dropdown">
                      <button style="width: 434px; background-color: white; margin-top: 0px"  class="brand-dropdown-btn dropdown-btn" data-name="${name}">
                      <span class="selected-values placeholder">${
                        selectedValue.name
                      }</span> 
                      <img src="../assets/dropdown-icon.svg">
                      </button>
                      <ul style="top: 56px" class="dropdown-menu">
                          ${items
                            .map((item) => {
                              return `  <li class="dropdown-item ${
                                selectedValue.id === item.id ? "disable" : ""
                              }" data-id="${item.id}">${item.name}</li>`;
                            })
                            .join(" ")}
                        </ul>
                    </div>
  `;
}

function setUpUpdateProduct(product) {
  setUpAdminNav();
  setUpCreateProductForm();
  product.images.forEach((img) => {
    uploadedFiles.push({
      id: `${img}-existing`,
      fileName: img,
    });
  });
  Object.assign(thumbnailFile, {
    id: "thumbnail-existing",
    fileName: product.thumbnail,
  });
  // Load variation Options
  let fragment = document.createDocumentFragment();
  variationColor.variationOptions.forEach((option) => {
    const color = getColorByCode(option.id);
    const allColors = getAllColors();
    const optionElem = createVariationOptionElement(allColors, "color", color);
    fragment.appendChild(optionElem);
  });
  document
    .querySelector(".product-variation-color-items ")
    .appendChild(fragment);
  fragment = document.createDocumentFragment();
  variationSize.variationOptions.forEach((option) => {
    const size = getSizeById(option.id);
    const allSizes = getAllSizes();
    const optionElem = createVariationOptionElement(allSizes, "size", size);
    fragment.appendChild(optionElem);
  });
  document
    .querySelector(".product-variation-size-items ")
    .appendChild(fragment);

  setUpEventListenerCreateProductVariation(false);

  variationState.selectedOptions.colors = variationColor.variationOptions.map(
    (option) => option.id
  );
  variationState.selectedOptions.sizes = variationSize.variationOptions.map(
    (option) => option.id
  );

  updateAllDisabledItems("color");
  updateAllDisabledItems("size");
  // Load saved selected categories
  const categories = getAllParentCategory(product.categoryId);
  categories.parentCategories.forEach((cate, index) => {
    const hasChildren = isHasChildren(cate.id);
    savedSelectedCategories.push({
      cateId: cate.id,
      level: index,
      hasChildren: hasChildren,
    });
  });
  // Thêm category hiện tại
  savedSelectedCategories.push({
    cateId: product.categoryId,
    level: categories.parentCategories.length,
    hasChildren: isHasChildren(product.categoryId),
  });
  setUpEventListener(categoryAttributes);
  // Load saved attribute values
  categoryAttributes.forEach((att) => {
    const attribute = product.attributes.find((a) => a.attributeId == att.id);
    if (attribute) {
      selectedAttributeValues[att.id] = attribute.attributeValues;
    }
  });

  // Load brand
  const brand = getBrandById(product.brandId);
  selectedAttributeValues["brand"] = [brand.name];

  variationColor.variationOptions.forEach((option) => {
    colorImages.push({
      colorId: option.id,
      fileName: option.image,
    });
  });

  document.querySelectorAll(".remove-image-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const uploadInputImg = btn.parentElement.parentElement.nextElementSibling;
      const previewImg = btn.previousElementSibling;
      const colorId =
        btn.parentElement.parentElement.parentElement.parentElement.dataset
          .colorId;
      uploadInputImg.value = "";
      uploadInputImg.disabled = false;
      previewImg.src = "../assets/Add Image.svg";
      const index = colorImages.findIndex((img) => img.colorId === colorId);
      if (index !== -1) {
        colorImages.splice(index, 1);
      }
      btn.remove();
    });
  });

  document
    .querySelectorAll("#product-variation-table input[type='file']")
    .forEach((input) => {
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const colorId = input.parentElement.parentElement.dataset.colorId;
        uploadImageForColor(colorId, file, input);
      });
    });
}

function createVariationOptionElement(items, type, selectedValue) {
  const elem = document.createElement("div");
  elem.classList.add(
    `product-variation-${type}-item`,
    "product-variation-item"
  );

  elem.innerHTML = `
    ${createDropdown(items, type, selectedValue)}
    <button class="delete-variation-btn">
      <img src="../assets/Garbage can.svg" alt="delete">
    </button>
  `;

  attachDropdownEvents(elem, type, items);
  attachDeleteEvent(elem, type);

  return elem;
}

export function loadUpdateProductPage(productId) {
  const product = getProductById(productId);
  renderUpdateProductHTML(product);
  setUpUpdateProduct(product);
  document
    .querySelector(".create-product-action-btn__hide")
    .addEventListener("click", () => {
      updateProduct("hidden", productId);
    });
  document
    .querySelector(".create-product-action-btn__active")
    .addEventListener("click", () => {
      updateProduct("public", productId);
    });
  document
    .querySelector(".create-product-action-btn__cancel")
    .addEventListener("click", () => {
      loadProductAdmin();
    });
}

function InputText(att, attributeValues) {
  const attributeKey = att.id;
  let content =
    attributeValues.length === 1 ? attributeValues[0] : "Vui lòng nhập";
  return `
  <input class="input-free-text" data-attribute-name="${attributeKey}"
   type="text" placeholder="Vui long nhập" value="${content}">
  `;
}

function InputSingleDropDown(att, attributeValues) {
  const attributeKey = att.id;
  let content =
    attributeValues.length === 1 ? attributeValues[0] : "Vui lòng chọn";
  return `
  <div class="dropdown brand-dropdown">
                      <button class="brand-dropdown-btn dropdown-btn" data-attribute-name="${attributeKey}">
                      <span class="selected-values placeholder">${content}</span> 
                      <img src="../assets/dropdown-icon.svg">
                      </button>
                      <ul style="top: 56px" class="dropdown-menu">
                          ${att.attributeValues
                            .map((value) => {
                              return `  <li class="dropdown-item ${
                                content === value ? "selected" : ""
                              }">${value}</li>`;
                            })
                            .join(" ")}
                        </ul>
                    </div>
  `;
}
function InputDropdownBrand(categoryId, brandId) {
  const brands = getBrandsByCategoryId(categoryId);
  const selectedBrand = getBrandById(brandId);
  return `
   <div class="attribute-container required-attribute">
      <span class="attribute-name">Thương hiệu</span>
     <div class="dropdown brand-dropdown">
                        <button class="brand-dropdown-btn dropdown-btn" data-attribute-name="brand">
                        <span class="selected-values placeholder">${
                          selectedBrand.name
                        }</span> 
                        <img src="../assets/dropdown-icon.svg">
                        </button>
                        <ul style="top: 56px" class="dropdown-menu">
                            ${brands
                              .map((value) => {
                                return `  <li class="dropdown-item ${
                                  selectedBrand.name === value.name
                                    ? "selected"
                                    : ""
                                }">${value.name}</li>`;
                              })
                              .join(" ")}
                          </ul>
                      </div>
     <div class="error-message-required"></div>                 
   </div>
  `;
}
function InputMultiDropDown(att, attributeValues) {
  const attributeKey = att.id;
  let content =
    attributeValues.length > 0 ? attributeValues.join(", ") : "Vui lòng chọn";
  return `
   <div class="dropdown brand-dropdown">
      <button class="brand-dropdown-btn dropdown-btn"  data-attribute-name="${attributeKey}">
        <span class="selected-values placeholder">${content}</span>
         <img src="../assets/dropdown-icon.svg">
      </button>
      <ul style="top: 56px" class="dropdown-menu ">
        ${att.attributeValues
          .map((value) => {
            return `
           <li class="dropdown-item multi-dropdown ${
             attributeValues.includes(value) ? "selected" : ""
           }" data-value="${attributeKey}">
          <div class="checkbox"></div>
          <span>${value}</span>
        </li>
          `;
          })
          .join(" ")} 
      </ul>
    </div>
  `;
}

function renderTableVariation(product) {
  const getAllVariation = getSkusByProductId(product.id);
  return `
       <tbody>
       ${variationColor.variationOptions.map((colorOption, colorIndex) => {
         let row = ``;
         const color = getColorByCode(colorOption.id);
         variationSize.variationOptions.forEach((sizeOption, sizeIndex) => {
           const size = getSizeById(sizeOption.id);
           const sku = getAllVariation.find(
             (sku) =>
               sku.tierIndexes[0] === colorIndex &&
               sku.tierIndexes[1] === sizeIndex
           );
           if (sizeIndex === 0) {
             row += `
               <tr data-group="true" data-color-id="${color.id}" data-size-id="${size.id}" data-sku-id="${sku.id}">
                <td class="color-data" rowspan="${variationSize.variationOptions.length}">
                  <p class="color-name">${color.name}</p>
                  <label for="load-image-input-#FF5733" class="load-image-input-label">
                    <div class="preview-img-variation">
                      <img
                        class="color-variation-value__img"
                        src="../assets/products/${colorOption.image}"
                        alt="add image"
                      />
                      <button class="remove-image-btn">x</button>
                    </div>
                  </label>
                  <input
                    style="display: none"
                    id="load-image-input-${color.id}"
                    type="file"
                    accept="image/*"
                    disabled=""
                  />
                </td>
                <td class="size-data">${size.name}</td>
              </tr>
                `;
           } else {
             row += ` <tr data-color-id="${color.id}" data-size-id="${size.id}" data-sku-id="${sku.id}">
                  <td class="size-data">${size.name}</td>`;
           }
         });
         return row;
       })} 
              </tbody>
  `;
}

const errors = [];
function updateProduct(status, productId) {
  const productName = document.getElementById("name").value;
  const productDescription = document.querySelector(".description").value;
  const colorIds = variationState.selectedOptions.colors;
  const sizeIds = variationState.selectedOptions.sizes;
  const isValid = validationProduct(
    { productName, productDescription },
    errors
  );
  if (!isValid) {
    alert(errors.map((err) => err.message).join("\n"));
    errors.length = 0;
    return;
  }

  let base64Images = [];
  let base64Thumbnail = thumbnailFile.fileName;
  if (uploadedFiles && uploadedFiles.length > 0) {
    uploadedFiles.forEach((imgFile) => {
      base64Images.push(imgFile.fileName);
    });
  }
  const categoryId =
    savedSelectedCategories[savedSelectedCategories.length - 1].cateId;

  const variations = [];
  if (colorIds.length > 0) {
    const variationOptions = colorIds.map((colorId) => {
      let colorImage = colorImages.find((ci) => ci.colorId === colorId);
      const image = colorImage.fileName;
      return {
        id: colorId,
        image: image ? image : "",
      };
    });
    variations.push({
      name: "Màu sắc",
      variationOptions: variationOptions,
    });
  }
  if (sizeIds.length > 0) {
    variations.push({
      name: "Kích thước",
      variationOptions: sizeIds.map((sizeId) => ({ id: sizeId, image: "" })),
    });
  }
  const attributes = Object.keys(selectedAttributeValues)
    .map((key) => {
      if (key === "brand") return;
      let attribute = { attributeId: "", attributeValues: [] };
      attribute["attributeId"] = key;
      attribute["attributeValues"] = selectedAttributeValues[key];
      return attribute;
    })
    .filter((attr) => attr !== undefined && attr.attributeValues.length > 0);

  console.log(selectedAttributeValues["brand"][0]);
  const brandId = getBrandByName(selectedAttributeValues["brand"][0]).id;

  const updateProduct = {
    id: productId,
    name: productName,
    desc: productDescription,
    brandId: brandId,
    thumbnail: base64Thumbnail,
    weight: 1,
    images: base64Images,
    attributes: attributes,
    variations: variations,
    categoryId: categoryId,
    status: status,
    skus: [],
  };

  // 3. Đọc dữ liệu từ Bảng (Source of Truth)
  const tableRows = document.querySelectorAll(
    "#product-variation-table tbody tr"
  );

  tableRows.forEach((row) => {
    const skuId = row.dataset.skuId;
    const colorId = row.dataset.colorId;
    const sizeId = row.dataset.sizeId;

    // Lấy newTierIndexes
    const colorIndex = variationState.selectedOptions.colors.indexOf(colorId);
    const sizeIndex = variationState.selectedOptions.sizes.indexOf(sizeId);

    // 4. Phân loại SKU

    if (skuId && skuId !== "undefined" && skuId !== "") {
      const sku = getSkuById(skuId);
      // SKU cũ
      updateProduct.skus.push({
        id: skuId,
        productId: productId,
        stock: sku.stock,
        tierIndexes: [colorIndex, sizeIndex],
        updatedAt: new Date(),
      });
    } else {
      // SKU mới
      const newSkuId = generateUniqueId();
      updateProduct.skus.push({
        id: newSkuId,
        productId: productId,
        stock: 0,
        tierIndexes: [colorIndex, sizeIndex],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });
  updateProductById(updateProduct);
  alert("Cập nhật sản phẩm thành công");
  loadProductAdmin();
}
