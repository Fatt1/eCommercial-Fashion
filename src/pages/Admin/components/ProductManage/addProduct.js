import {
  savedSelectedCategories,
  uploadedFiles,
  thumbnailFile,
} from "../CreateProductForm/CreateProductForm.js";
import { selectedAttributeValues } from "../CreateProductDetail/CreateProductDetail.js";
import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { renderCreateProductDetailAttribute } from "../CreateProductDetail/CreateProductDetail.js";
import {
  CreateProductForm,
  setUpCreateProductForm,
} from "../CreateProductForm/CreateProductForm.js";
import { CreateProductHeader } from "../CreateProductHeader/CreateProductHeader.js";
import {
  colorImages,
  CreateProductVariation,
  setUpEventListenerCreateProductVariation,
  variationState,
} from "../CreateProductVariation/CreateProductVariation.js";
import { generateUniqueId } from "../../../../helper/helper.js";
import Product from "../../../../models/Product.js";
import { getBrandByName } from "../../../../services/brandService.js";
import { addProduct } from "../../../../services/productService.js";
function renderAddProductHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content__admin">
          ${CreateProductHeader()}
          ${CreateProductForm()}
          <div class="create-detail-product">
                <h3 class="create-detail-product__header">Thông tin chi tiết</h3>
           <div class="attribute-list">
          
           </div>
            </div>
          ${CreateProductVariation()}
            <div class="create-product-action">
              <button class="create-product-action-btn create-product-action-btn__cancel">Hủy</button>
              <button class="create-product-action-btn create-product-action-btn__hide">Lưu và ẩn</button>
      
            </div>
          </div>
      </div>
    </div>
  `;
}
function setUpAddProduct() {
  setUpAdminNav();
  setUpCreateProductForm();
  setUpEventListenerCreateProductVariation();
  renderCreateProductDetailAttribute([]);

  document
    .querySelector(".create-product-action-btn__hide")
    .addEventListener("click", () => {
      // Test truoc boi vi chua co quan li gia tien va kho nen chua mua hang dc
      handleClickCreateProduct("public");
    });
}
export function loadAddOrUpdateProduct() {
  renderAddProductHtml();
  setUpAddProduct();
}

const errors = [];
function handleClickCreateProduct(productStatus) {
  const productName = document.getElementById("name").value;
  const productDescription = document.querySelector(".description").value;
  const colorIds = variationState.selectedOptions.colors;
  const sizeIds = variationState.selectedOptions.sizes;
  const isValid = validationProduct({ productName, productDescription });
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
  console.log("selectedAttributeValues", selectedAttributeValues);

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
      if (
        selectedAttributeValues[key] instanceof Array &&
        selectedAttributeValues[key].length > 0
      ) {
        attribute["attributeId"] = key;
        attribute["attributeValues"] = selectedAttributeValues[key];
      } else if (selectedAttributeValues[key] instanceof Array === false) {
        if (selectedAttributeValues[key]) {
          attribute["attributeId"] = key;
          attribute.attributeValues.push(selectedAttributeValues[key]);
        }
      }
      return attribute;
    })
    .filter((attr) => attr !== undefined && attr.attributeId !== "");
  const productId = generateUniqueId();
  const brandId = getBrandByName(selectedAttributeValues["brand"]).id;

  const newProduct = new Product(
    productId,
    productName,
    productDescription,
    brandId,
    base64Thumbnail,
    1,
    base64Images,
    attributes,
    variations,
    categoryId,
    productStatus
  );
  colorIds.forEach((colorId, colorIndex) => {
    sizeIds.forEach((sizeId, sizeIndex) => {
      const skuId = generateUniqueId();
      newProduct.addSku({
        id: skuId,
        productId: productId,
        stock: 0,
        tierIndexes: [colorIndex, sizeIndex],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });
  addProduct(newProduct);
  alert("Thêm sản phẩm thành công");
}
function validationProduct({ productName, productDescription }) {
  let isValid = true;
  if (!productName || productName.trim() === "") {
    isValid = false;
    errors.push({ field: "name", message: "Tên sản phẩm không được để trống" });
  }
  if (!productDescription || productDescription.trim() === "") {
    isValid = false;
    errors.push({
      field: "description",
      message: "Mô tả sản phẩm không được để trống",
    });
  }

  if (savedSelectedCategories.length === 0) {
    isValid = false;
    errors.push({
      field: "category",
      message: "Vui lòng chọn danh mục sản phẩm",
    });
  }
  if (!selectedAttributeValues["brand"]) {
    isValid = false;
    errors.push({ field: "brand", message: "Vui lòng chọn thương hiệu" });
  }
  if (uploadedFiles.length === 0) {
    isValid = false;
    errors.push({ field: "images", message: "Vui lòng tải ảnh sản phẩm" });
  }
  if (variationState.selectedOptions.colors.length === 0) {
    isValid = false;
    errors.push({ field: "colors", message: "Vui lòng chọn màu sắc" });
  }
  if (variationState.selectedOptions.sizes.length === 0) {
    isValid = false;
    errors.push({ field: "sizes", message: "Vui lòng chọn kích thước" });
  }
  if (variationState.selectedOptions.colors.length !== colorImages.length) {
    isValid = false;
    errors.push({
      field: "imgColors",
      message: "Vui lòng tải ảnh cho tất cả màu sắc đã chọn",
    });
  }
  return isValid;
}
