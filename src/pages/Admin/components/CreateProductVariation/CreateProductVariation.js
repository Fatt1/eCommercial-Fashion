import { getAllColors } from "../../../../services/colorService.js";
import { getAllSizes } from "../../../../services/sizeService.js";
export function CreateProductVariation() {
  return `
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
                      <div class="product-variation-size-item product-variation-item">
                       <input class="input-variation" placeholder="Vui lòng chọn" type="text">
                        <button class="delete-variation-btn"><img src="../assets/Garbage can.svg" alt=""></button>
                      </div>
                      <div class="product-variation-size-item product-variation-item">  
                       <input class="input-variation" placeholder="Vui lòng chọn" type="text">
                        <button class="delete-variation-btn"><img src="../assets/Garbage can.svg" alt=""></button>
                      </div>
                     <div class="product-variation-size-item product-variation-item">
                       <input class="input-variation" placeholder="Vui lòng chọn" type="text">
                        <button class="delete-variation-btn"><img src="../assets/Garbage can.svg" alt=""></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
               <!-- product-variation-value -->
              <div class="product-variation-value">
               <h3 class="product-variation-value-left">Danh sách phân loại hàng</h3>
              <div class="product-variation-value-right">
                 <div class="product-variation-value-right__top">
                    <div class="form-group">
                      <input type="text" placeholder="Giá tiền">
                    </div>
                     <div class="form-group">
                      <input type="text" placeholder="Giá giảm">
                    </div>
                    <div class="form-group">
                      <input type="text" placeholder="Phần trăm giảm giá">
                    </div>
                     <div class="form-group">
                      <input type="text" placeholder="Kho">
                    </div>
                    <button class="apply-all-btn btn-admin">Áp dụng cho tất cả</button>
                 </div>
                 <table id="product-variation-table">
                  <thead>
                      <tr>
                        <th style="width: 150px;">Màu</th>
                        <th style="width: 170px;">Kích thước</th>
                        <th>Giá</th>
                        <th>Kho hàng</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr>
                     <td rowspan="2" class="color-data">
                        <p class="color-name">Be</p>
                        <img class="color-variation-value__img" src="../assets/Add Image.svg">
                     </td>
                     <td class="size-data">
                      S
                     </td>
                     <td  >
                      <span class="price">đ</span>
                      <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
                     </td>
                      <td  >
                      <input class="input-variation input-variation-value" type="text" placeholder="Kho">
                     </td>
                    </tr>
                   <tr>
                      <td class="size-data"> M </td>
                       <td >
                        <span class="price">đ</span>
                      <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
                     </td>
                      <td >
                      <input class="input-variation input-variation-value" type="text" placeholder="Kho">
                     </td>
                  </tr>
                    <tr>
                    <td rowspan="2" class="color-data">
                        <p class="color-name">Be</p>
                        <img class="color-variation-value__img" src="../assets/Add Image.svg">
                    </td>
                    <td class="size-data"> S </td>
                    <td  >
                      <span class="price">đ</span>
                        <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
                    </td>
                    <td  >
                        <input class="input-variation input-variation-value" type="text" placeholder="Kho">
                    </td>
                </tr>
                <tr>
                    <td class="size-data"> M </td>
                </tr>
                  </tbody>
                 </table>
              </div>
            </div>
            </div>
  `;
}
export function setUpEventListenerCreateProductVariation() {
  const allColors = getAllColors();
  document
    .querySelector(".product-variation-color-items")
    .appendChild(createVariationOptionItemElem(allColors, "color"));
}
function createDropdown(items, name) {
  return `
     <div class="dropdown brand-dropdown">
                      <button style="width: 434px; background-color: white; margin-top: 0px"  class="brand-dropdown-btn dropdown-btn" data-name="${name}">
                      <span class="selected-values placeholder">Vui lòng chọn</span> 
                      <img src="../assets/dropdown-icon.svg">
                      </button>
                      <ul style="top: 56px" class="dropdown-menu">
                          ${items
                            .map((item) => {
                              return `  <li class="dropdown-item" id="${item.id}">${item.name}</li>`;
                            })
                            .join(" ")}
                        </ul>
                    </div>
  `;
}
const variationOptions = { colors: [], sizes: [] };
// Map để tracking item nào đang được chọn bởi variation nào
function createVariationOptionItemElem(items, name) {
  const variationOptionElem = document.createElement("div");

  variationOptionElem.classList.add(
    `product-variation-${name}-item`,
    "product-variation-item"
  );
  variationOptionElem.innerHTML = `
    ${createDropdown(items, name)}
    <button class="delete-variation-btn">
      <img src="../assets/Garbage can.svg" alt="">
    </button>
  `;
  const dropdownBtn = variationOptionElem.querySelector(".dropdown-btn");
  const dropdownItems = variationOptionElem.querySelectorAll(".dropdown-item");
  const deleteBtn = variationOptionElem.querySelector(".delete-variation-btn");
  dropdownBtn.addEventListener("click", function () {
    this.nextElementSibling.classList.toggle("show");
  });

  // Cập nhật disable state khi tạo mới
  updateDisabledItems(variationOptionElem, name);

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedValue = item.textContent;
      const id = item.id;
      const selectedValuesSpan = dropdownBtn.querySelector(".selected-values");
      selectedValuesSpan.textContent = selectedValue;
      item.classList.add("disable");
      getDomVariationIndexDropdownItem(item, name);
    });
  });
  return variationOptionElem;
}

function updateDisabledItems(variationOptionElem, name) {}

function getDomVariationIndexDropdownItem(dropdownItem, name) {
  const array = Array.from(
    document.querySelectorAll(`.product-variation-${name}-item`)
  );
  const parentVariation =
    dropdownItem.parentElement.parentElement.parentElement;
  const index = array.indexOf(parentVariation);
  return index;
}
