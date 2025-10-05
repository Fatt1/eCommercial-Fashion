import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { CreateProductDetail } from "../CreateProductDetail/CreateProductDetail.js";
import {
  CreateProductForm,
  setUpCreateProductForm,
} from "../CreateProductForm/CreateProductForm.js";
import { CreateProductHeader } from "../CreateProductHeader/CreateProductHeader.js";
import { CreateProductVariation } from "../CreateProductVariation/CreateProductVariation.js";

function renderAddProductHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class=""main-content__admin">
          ${CreateProductHeader()}
          ${CreateProductForm()}
          ${CreateProductDetail()}
          ${CreateProductVariation()}
            <div class="create-product-action">
              <button class="create-product-action-btn create-product-action-btn__cancel">Hủy</button>
              <button class="create-product-action-btn create-product-action-btn__hide">Lưu và ẩn</button>
              <button class="btn-admin create-product-action-btn__save">Lưu và hiển thị</button>
            </div>
          </div>
      </div>
    </div>
  `;
}
function setUpAddProduct() {
  setUpAdminNav();
  setUpCreateProductForm();
}
export function loadAddProduct() {
  renderAddProductHtml();
  setUpAddProduct();
}
