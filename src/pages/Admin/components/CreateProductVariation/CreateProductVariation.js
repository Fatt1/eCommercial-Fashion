import {
  getAllColors,
  getColorByCode,
} from "../../../../services/colorService.js";
import { getAllSizes, getSizeById } from "../../../../services/sizeService.js";
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
const allColors = getAllColors();
const allSizes = getAllSizes();
export function setUpEventListenerCreateProductVariation() {
  document
    .querySelector(".product-variation-color-items")
    .appendChild(createVariationOptionItemElem(allColors, "color"));

  document
    .querySelector(".product-variation-size-items")
    .appendChild(createVariationOptionItemElem(allSizes, "size"));
  initializeVariationTable();
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
                              return `  <li class="dropdown-item" data-id="${item.id}">${item.name}</li>`;
                            })
                            .join(" ")}
                        </ul>
                    </div>
  `;
}
// Tracking item nào đang được chọn bởi variation nào
const selectedVariationOptions = { colors: [], sizes: [] };

function createVariationOptionItemElem(items, name) {
  const variationOptionElem = document.createElement("div");

  variationOptionElem.classList.add(
    `product-variation-${name}-item`,
    "product-variation-item",
    "no-value"
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

  // Khi mà click vào dropdown item
  // gắn sự kiện xử lí cho mỗi dropdown item
  //Hàm sự kiện sẽ thêm value của variation color hoặc size vào biến selectedVariationOptions
  // Chặn không cho chọn dropdown-item đã chọn
  // Có thể thay đổi dropdown-item đã chọn
  // Đồng bộ các dropdown-item đã chọn
  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedValue = item.textContent;
      const id = item.dataset.id;
      const selectedValuesSpan = dropdownBtn.querySelector(".selected-values");
      selectedValuesSpan.textContent = selectedValue;
      item.classList.add("disable");
      const keyVariation = name + "s";
      // Lấy vị trí index của variation option
      const variationOptionIndex = getDomVariationIndexDropdownItem(item, name);
      // Trường hợp khi mà lần đầu tiên chọn dropdown-item, thì sẽ thêm mới vào selectedVariation
      if (
        variationOptionIndex >
        selectedVariationOptions[keyVariation].length - 1
      ) {
        selectedVariationOptions[keyVariation].push(id);
        // Khi mà chọn 1 variation mới thì sẽ tự động tạo 1 cái variation kế bên
        if (name === "color") {
          document
            .querySelector(".product-variation-color-items")
            .appendChild(createVariationOptionItemElem(allColors, "color"));
          addNewRowsForNewColor(id);
        } else {
          document
            .querySelector(".product-variation-size-items")
            .appendChild(createVariationOptionItemElem(allSizes, "size"));
          addNewRowsForNewSize(id);
        }
      }
      // Trường hợp đã chọn dropdown-item rồi, mà muốn thay đổi cái khác
      else {
        const prevSelectedId =
          selectedVariationOptions[keyVariation][variationOptionIndex];
        document
          .querySelectorAll(`.dropdown-item[data-id='${prevSelectedId}']`)
          .forEach((val) => val.classList.remove("disable"));
        selectedVariationOptions[keyVariation][variationOptionIndex] = id;
      }
      // Cập nhật disable state khi tạo mới

      updateDisabledItems(keyVariation);

      // Khi thêm hoặc thay đổi dropdown item mới thì tự động tắt đi cái menu
      item.closest(".dropdown-menu").classList.remove("show");
      variationOptionElem.classList.remove("no-value");
    });
  });

  // Hàm xử lí sự kiện khi muốn xóa 1 cái variation value đã chọn
  deleteBtn.addEventListener("click", () => {
    const variationOptionIndex = getDomVariationIndex(
      deleteBtn.parentElement,
      name
    );
    // Nếu là index đầu tiên thì không cho xóa
    if (deleteBtn.parentElement.classList.contains("no-value")) {
      return;
    }
    const keyVariation = name + "s";

    const selectedValue =
      selectedVariationOptions[keyVariation][variationOptionIndex];

    document
      .querySelectorAll(`.dropdown-item[data-id='${selectedValue}']`)
      .forEach((item) => item.classList.remove("disable"));
    selectedVariationOptions[keyVariation].splice(variationOptionIndex, 1);
    deleteBtn.parentElement.remove();
    removeVariationValueSizeOrColor(selectedValue, name);
  });

  return variationOptionElem;
}

function updateDisabledItems(keyVariation) {
  selectedVariationOptions[keyVariation].forEach((value) => {
    document
      .querySelectorAll(`.dropdown-item[data-id='${value}']`)
      .forEach((item) => item.classList.add("disable"));
  });
}

function getDomVariationIndex(elem, name) {
  const array = Array.from(
    document.querySelectorAll(`.product-variation-${name}-item`)
  );
  const index = array.indexOf(elem);
  return index;
}

function getDomVariationIndexDropdownItem(dropdownItem, name) {
  const array = Array.from(
    document.querySelectorAll(`.product-variation-${name}-item`)
  );
  const parentVariation =
    dropdownItem.parentElement.parentElement.parentElement;
  const index = array.indexOf(parentVariation);
  return index;
}

function initializeVariationTable() {
  const tableBody = document.querySelector("#product-variation-table tbody");

  if (!tableBody) return;

  tableBody.innerHTML = `
    <tr data-group="true" data-color-id="default" data-size-id="default">
      <td class="color-data" rowspan="1">
        <p class="color-name">-</p>
        <img class="color-variation-value__img" src="../assets/Add Image.svg">
      </td>
      <td class="size-data">-</td>
      <td>
        <span class="price">đ</span>
        <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
      </td>
      <td>
        <input class="input-variation input-variation-value" type="text" placeholder="Kho">
      </td>
    </tr>
  `;
}

function addNewRowsForNewColor(colorId) {
  const tableBody = document.querySelector("#product-variation-table tbody");
  const color = getColorByCode(colorId);
  if (!color) return;
  // Xử lí cho trường hợp đầu tiên khi mới thêm 1 màu sắc đầu tiên
  const defaultRows = tableBody.querySelectorAll(`tr[data-color-id="default"]`);
  if (defaultRows.length !== 0) {
    defaultRows.forEach((defaultRow) => {
      defaultRow.setAttribute("data-color-id", colorId);
      if (defaultRow.dataset.group) {
        defaultRow.querySelector(".color-name").textContent = color.name;
      }
    });

    return;
  }
  // Xử lí cho trường hợp thêm màu sắc thứ 2, 3, 4, ....
  // Lấy ra các màu size đang được chọn, nếu mà chưa có size nào đc chọn thì trả về mảng {id: "default", name: "-"}
  const sizes =
    selectedVariationOptions.sizes.length > 0
      ? selectedVariationOptions.sizes.map((id) => getSizeById(id))
      : [{ id: "default", name: "-" }];
  const fragment = document.createDocumentFragment();
  // Tạo rowSpan bằng với số lượng Size đc chọn
  const rowSpan = sizes.length;
  sizes.forEach((size, index) => {
    // Với mỗi size thì sẽ tạo ra 1 tr ở dưới cái tr đầu tiên
    const row = document.createElement("tr");
    row.setAttribute("data-color-id", colorId);
    row.setAttribute("data-size-id", size.id);

    if (index === 0) {
      row.setAttribute("data-group", "true");
      row.innerHTML = `
      <td rowspan="${rowSpan}" class="color-data"">
          <p class="color-name">${color.name}</p>
          <img class="color-variation-value__img" src="../assets/Add Image.svg">
        </td>
        <td class="size-data">${size.name}</td>
        <td>
          <span class="price">đ</span>
          <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
        </td>
        <td>
          <input class="input-variation input-variation-value" type="text" placeholder="Kho">
        </td>
      `;
    } else {
      row.innerHTML = `
       <td class="size-data"> ${size.name} </td>
                       <td >
                        <span class="price">đ</span>
                      <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
                     </td>
                      <td >
                      <input class="input-variation input-variation-value" type="text" placeholder="Kho">
                     </td>`;
    }
    fragment.appendChild(row);
  });
  tableBody.appendChild(fragment);
}
function addNewRowsForNewSize(sizeId) {
  const tableBody = document.querySelector("#product-variation-table tbody");
  const size = allSizes.find((s) => s.id === sizeId);
  if (!size) return;

  const defaultRow = tableBody.querySelector(
    `tr[data-size-id="default"][data-group='true']`
  );
  if (
    defaultRow &&
    tableBody.querySelector(`tr[data-color-id="default"][data-group='true']`)
  ) {
    defaultRow.setAttribute("data-size-id", sizeId);
    defaultRow.querySelector(".size-data").textContent = size.name;
    return;
  }

  // Lấy danh sách colors đã chọn, nếu chưa có thì dùng default
  const colors =
    selectedVariationOptions.colors.length > 0
      ? selectedVariationOptions.colors.map((id) => getColorByCode(id))
      : [{ id: "default", name: "-" }];

  colors.forEach((color) => {
    const existingRows = tableBody.querySelector(
      `tr[data-color-id="${color.id}"][data-group='true']`
    );
    if (existingRows.dataset.sizeId === "default") {
      existingRows.querySelector(".size-data").textContent = size.name;
      existingRows.dataset.sizeId = size.id;
    } else {
      const row = document.createElement("tr");
      row.setAttribute("data-color-id", color.id);
      row.setAttribute("data-size-id", sizeId);
      row.innerHTML = `
       <td class="size-data"> ${size.name} </td>
                       <td >
                        <span class="price">đ</span>
                      <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
                     </td>
                      <td >
                      <input class="input-variation input-variation-value" type="text" placeholder="Kho">
                     </td>`;
      const colorCol = existingRows.querySelector(".color-data");
      const rowSpan = parseInt(colorCol.getAttribute("rowspan"));
      colorCol.setAttribute("rowspan", rowSpan + 1);
      const allRows = tableBody.querySelectorAll(
        `tr[data-color-id="${color.id}"]`
      );

      allRows[allRows.length - 1].after(row);
    }
  });
}

function removeVariationValueSizeOrColor(valueId, name) {
  const tableBody = document.querySelector("#product-variation-table tbody");
  const allRows = tableBody.querySelectorAll(
    `tr[data-${name}-id='${valueId}']`
  );

  if (name === "size") {
    allRows.forEach((row) => {
      let groupRow = row;
      while (groupRow && !groupRow.matches('tr[data-group="true"]')) {
        groupRow = groupRow.previousElementSibling;
      }

      const col = groupRow.querySelector(".color-data");
      const rowSpan = parseInt(col.getAttribute("rowspan"));
      if (rowSpan === 1) {
        row.setAttribute(`data-${name}-id`, "default");
        row.querySelector(".size-data").textContent = "-";
        return;
      }
      col.setAttribute("rowspan", rowSpan - 1);

      if (row.dataset.group) {
        const nextRow = row.nextElementSibling;
        const nextRowId = nextRow.getAttribute("data-size-id");
        const textSize = nextRow.querySelector(".size-data").textContent;
        row.setAttribute("data-size-id", nextRowId);
        row.querySelector(".size-data").textContent = textSize;

        nextRow.remove();
      } else {
        row.remove();
      }
    });
  }
  // Xóa màu sắc
  else {
    if (selectedVariationOptions.colors.length === 0) {
      const rows = tableBody.querySelectorAll(
        `tr[data-${name}-id='${valueId}']`
      );
      rows.forEach((row) => {
        row.setAttribute("data-color-id", "default");
      });

      rows[0].querySelector(".color-name").textContent = "-";
    } else allRows.forEach((row) => row.remove());
  }
}
