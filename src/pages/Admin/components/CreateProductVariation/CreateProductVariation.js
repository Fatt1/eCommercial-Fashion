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
// export function setUpEventListenerCreateProductVariation() {
//   document
//     .querySelector(".product-variation-color-items")
//     .appendChild(createVariationOptionItemElem(allColors, "color"));

//   document
//     .querySelector(".product-variation-size-items")
//     .appendChild(createVariationOptionItemElem(allSizes, "size"));
//   initializeVariationTable();
// }

const selectedVariationOptions = { colors: [], sizes: [] };
// Tracking item nào đang được chọn bởi variation nào
const VARIATION_TYPES = {
  COLOR: "color",
  SIZE: "size",
};
const SELECTORS = {
  colorItems: ".product-variation-color-items",
  sizeItems: ".product-variation-size-items",
  tableBody: "#product-variation-table tbody",
  dropdownBtn: ".dropdown-btn",
  dropdownItem: ".dropdown-item",
  deleteBtn: ".delete-variation-btn",
};
const DEFAULT_VALUES = {
  id: "default",
  name: "-",
};

// ==================== STATE MANAGEMENT ====================
/**
 * Quản lý trạng thái của các variation options đã được chọn
 */
class VariationState {
  constructor() {
    this.selectedOptions = {
      colors: [],
      sizes: [],
    };
  }
  /**
   * Thêm variation option mới
   */
  add(type, id, index) {
    const key = `${type}s`;
    if (index > this.selectedOptions[key].length - 1) {
      this.selectedOptions[key].push(id);
      return true;
    }
    return false;
  }

  /**
   * Cập nhật variation option đã tồn tại
   */
  update(type, id, index) {
    const key = `${type}s`;
    const prevId = this.selectedOptions[key][index];
    this.selectedOptions[key][index] = id;
    return prevId;
  }

  /**
   * Xóa variation option
   */
  remove(type, index) {
    const key = `${type}s`;
    const removedId = this.selectedOptions[key][index];
    this.selectedOptions[key].splice(index, 1);
    return removedId;
  }
  /**
   * Lấy tất cả options của một type
   */
  getAll(type) {
    return this.selectedOptions[`${type}s`];
  }
  /**
   * Kiểm tra có option nào được chọn không
   */
  hasOptions(type) {
    return this.selectedOptions[`${type}s`].length > 0;
  }
}

const variationState = new VariationState();
// ==================== MAIN SETUP ====================
/**
 * Khởi tạo event listeners và UI cho product variation
 */
export function setUpEventListenerCreateProductVariation() {
  const allColors = getAllColors();
  const allSizes = getAllSizes();

  // Tạo initial dropdown cho color và size
  appendVariationOption(SELECTORS.colorItems, allColors, VARIATION_TYPES.COLOR);
  appendVariationOption(SELECTORS.sizeItems, allSizes, VARIATION_TYPES.SIZE);

  initializeVariationTable();
}
/**
 * Thêm variation option vào container
 */
function appendVariationOption(selector, items, type) {
  const container = document.querySelector(selector);
  if (container) {
    container.appendChild(createVariationOptionElement(items, type));
  }
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
/**
 * Tạo element cho variation option với đầy đủ event handlers
 */
function createVariationOptionElement(items, type) {
  const elem = document.createElement("div");
  elem.classList.add(
    `product-variation-${type}-item`,
    "product-variation-item",
    "no-value"
  );

  elem.innerHTML = `
    ${createDropdown(items, type)}
    <button class="delete-variation-btn">
      <img src="../assets/Garbage can.svg" alt="delete">
    </button>
  `;

  attachDropdownEvents(elem, type, items);
  attachDeleteEvent(elem, type);

  return elem;
}
function attachDropdownEvents(elem, type, items) {
  const dropdownBtn = elem.querySelector(SELECTORS.dropdownBtn);
  const dropdownItems = elem.querySelectorAll(SELECTORS.dropdownItem);

  // Toggle dropdown menu
  dropdownBtn.addEventListener("click", function () {
    this.nextElementSibling.classList.toggle("show");
  });

  // Handle dropdown item selection
  dropdownItems.forEach((item) => {
    item.addEventListener("click", () =>
      handleDropdownItemClick(item, elem, type, items)
    );
  });
}

/**
 * Xử lý khi click vào dropdown item
 */
function handleDropdownItemClick(item, parentElem, type, allItems) {
  const { id, textContent: selectedValue } = item.dataset.id
    ? { id: item.dataset.id, textContent: item.textContent }
    : item;

  const dropdownBtn = parentElem.querySelector(SELECTORS.dropdownBtn);
  const variationIndex = getVariationIndex(parentElem, type);

  // Update UI
  updateDropdownDisplay(dropdownBtn, selectedValue);
  item.classList.add("disable");
  parentElem.classList.remove("no-value");

  // Update state and table
  const isNewOption = variationState.add(type, id, variationIndex);

  if (isNewOption) {
    createNewVariationOption(type, allItems);
    addTableRowsForNewVariation(type, id);
  } else {
    const prevId = variationState.update(type, id, variationIndex);
    enableDropdownItem(prevId);
  }

  updateAllDisabledItems(type);
  item.closest(".dropdown-menu").classList.remove("show");
}
function updateDropdownDisplay(btn, value) {
  const span = btn.querySelector(".selected-values");
  if (span) {
    span.textContent = value;
  }
}
/**
 * Tạo variation option mới khi chọn item
 */
function createNewVariationOption(type, items) {
  const selector =
    type === VARIATION_TYPES.COLOR ? SELECTORS.colorItems : SELECTORS.sizeItems;

  appendVariationOption(selector, items, type);
}
/**
 * Gắn event handler cho nút xóa
 */
function attachDeleteEvent(elem, type) {
  const deleteBtn = elem.querySelector(SELECTORS.deleteBtn);

  deleteBtn.addEventListener("click", () => {
    if (elem.classList.contains("no-value")) return;

    const index = getVariationIndex(elem, type);
    const removedId = variationState.remove(type, index);

    enableDropdownItem(removedId);
    removeTableRows(removedId, type);
    elem.remove();
  });
}
function getVariationIndex(elem, type) {
  const selector = `.product-variation-${type}-item`;
  const allElements = Array.from(document.querySelectorAll(selector));
  return allElements.indexOf(elem);
}

function enableDropdownItem(id) {
  document
    .querySelectorAll(`.dropdown-item[data-id='${id}']`)
    .forEach((item) => item.classList.remove("disable"));
}

/**
 * Cập nhật trạng thái disable cho tất cả dropdown items
 */
function updateAllDisabledItems(type) {
  const selectedIds = variationState.getAll(type);
  selectedIds.forEach((id) => {
    document
      .querySelectorAll(`.dropdown-item[data-id='${id}']`)
      .forEach((item) => item.classList.add("disable"));
  });
}

// ==================== TABLE MANAGEMENT ====================
/**
 * Khởi tạo bảng variation với row mặc định
 */

function initializeVariationTable() {
  const tableBody = document.querySelector(SELECTORS.tableBody);
  if (!tableBody) return;

  tableBody.innerHTML = createDefaultTableRow();
}
function createDefaultTableRow() {
  return `
    <tr data-group="true" data-color-id="default" data-size-id="default">
      <td class="color-data" rowspan="1">
        <p class="color-name">-</p>
        <img class="color-variation-value__img" src="../assets/Add Image.svg" alt="add image">
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

/**
 * Thêm rows vào table khi thêm variation mới
 */
function addTableRowsForNewVariation(type, id) {
  if (type === VARIATION_TYPES.COLOR) {
    addRowsForColor(id);
  } else {
    addRowsForSize(id);
  }
}

/**
 * Thêm rows cho màu sắc mới
 */
function addRowsForColor(colorId) {
  const tableBody = document.querySelector(SELECTORS.tableBody);
  const color = getColorByCode(colorId);
  if (!color) return;

  // Xử lý trường hợp đầu tiên (default rows)
  const defaultRows = tableBody.querySelectorAll('tr[data-color-id="default"]');
  if (defaultRows.length > 0) {
    updateDefaultRowsToColor(defaultRows, colorId, color.name);
    return;
  }

  // Thêm rows mới cho color
  const sizes = getSelectedSizesOrDefault();
  const fragment = createColorRowsFragment(colorId, color.name, sizes);
  tableBody.appendChild(fragment);
}

/**
 * Cập nhật default rows thành color cụ thể
 */
function updateDefaultRowsToColor(rows, colorId, colorName) {
  rows.forEach((row) => {
    row.setAttribute("data-color-id", colorId);
    if (row.dataset.group) {
      const colorNameElem = row.querySelector(".color-name");
      if (colorNameElem) {
        colorNameElem.textContent = colorName;
      }
    }
  });
}

/**
 * Lấy danh sách sizes đã chọn hoặc default
 */
function getSelectedSizesOrDefault() {
  return variationState.hasOptions(VARIATION_TYPES.SIZE)
    ? variationState.getAll(VARIATION_TYPES.SIZE).map((id) => getSizeById(id))
    : [DEFAULT_VALUES];
}

/**
 * Tạo fragment chứa các rows cho một màu
 */
function createColorRowsFragment(colorId, colorName, sizes) {
  const fragment = document.createDocumentFragment();
  const rowSpan = sizes.length;

  sizes.forEach((size, index) => {
    const row = createColorRow(colorId, size, colorName, rowSpan, index === 0);
    fragment.appendChild(row);
  });

  return fragment;
}

/**
 * Tạo một row cho color variation
 */
function createColorRow(colorId, size, colorName, rowSpan, isFirstRow) {
  const row = document.createElement("tr");
  row.setAttribute("data-color-id", colorId);
  row.setAttribute("data-size-id", size.id);

  if (isFirstRow) {
    row.setAttribute("data-group", "true");
    row.innerHTML = `
      <td rowspan="${rowSpan}" class="color-data">
        <p class="color-name">${colorName}</p>
        <img class="color-variation-value__img" src="../assets/Add Image.svg" alt="add image">
      </td>
      ${createCommonRowCells(size.name)}
    `;
  } else {
    row.innerHTML = createCommonRowCells(size.name);
  }

  return row;
}
/**
 * Thêm rows cho size mới
 */
function addRowsForSize(sizeId) {
  const tableBody = document.querySelector(SELECTORS.tableBody);
  const size = getSizeById(sizeId);
  if (!size) return;

  // Xử lý trường hợp default row
  const defaultRow = tableBody.querySelector(
    'tr[data-size-id="default"][data-group="true"]'
  );

  if (
    defaultRow &&
    tableBody.querySelector('tr[data-color-id="default"][data-group="true"]')
  ) {
    updateDefaultRowToSize(defaultRow, sizeId, size.name);
    return;
  }

  // Thêm size cho tất cả colors đã có
  const colors = getSelectedColorsOrDefault();
  colors.forEach((color) =>
    addSizeToColor(tableBody, color, sizeId, size.name)
  );
}

/**
 * Cập nhật default row thành size cụ thể
 */
function updateDefaultRowToSize(row, sizeId, sizeName) {
  row.setAttribute("data-size-id", sizeId);
  const sizeData = row.querySelector(".size-data");
  if (sizeData) {
    sizeData.textContent = sizeName;
  }
}

/**
 * Lấy danh sách colors đã chọn hoặc default
 */
function getSelectedColorsOrDefault() {
  return variationState.hasOptions(VARIATION_TYPES.COLOR)
    ? variationState
        .getAll(VARIATION_TYPES.COLOR)
        .map((id) => getColorByCode(id))
    : [DEFAULT_VALUES];
}

/**
 * Thêm size vào một color cụ thể
 */
function addSizeToColor(tableBody, color, sizeId, sizeName) {
  const groupRow = tableBody.querySelector(
    `tr[data-color-id="${color.id}"][data-group="true"]`
  );

  if (!groupRow) return;

  if (groupRow.dataset.sizeId === DEFAULT_VALUES.id) {
    updateDefaultSizeInGroupRow(groupRow, sizeId, sizeName);
  } else {
    insertNewSizeRow(tableBody, color.id, sizeId, sizeName, groupRow);
  }
}

/**
 * Cập nhật size mặc định trong group row
 */
function updateDefaultSizeInGroupRow(row, sizeId, sizeName) {
  const sizeData = row.querySelector(".size-data");
  if (sizeData) {
    sizeData.textContent = sizeName;
  }
  row.dataset.sizeId = sizeId;
}

/**
 * Chèn row mới cho size
 */
function insertNewSizeRow(tableBody, colorId, sizeId, sizeName, groupRow) {
  const row = document.createElement("tr");
  row.setAttribute("data-color-id", colorId);
  row.setAttribute("data-size-id", sizeId);
  row.innerHTML = createCommonRowCells(sizeName);

  // Cập nhật rowspan
  const colorCol = groupRow.querySelector(".color-data");
  const currentRowSpan = parseInt(colorCol.getAttribute("rowspan")) || 1;
  colorCol.setAttribute("rowspan", currentRowSpan + 1);

  // Chèn vào vị trí cuối cùng của color group
  const allColorRows = tableBody.querySelectorAll(
    `tr[data-color-id="${colorId}"]`
  );
  const lastRow = allColorRows[allColorRows.length - 1];
  lastRow.after(row);
}

/**
 * Tạo HTML cho các cells chung (size, price, stock)
 */
function createCommonRowCells(sizeName) {
  return `
    <td class="size-data">${sizeName}</td>
    <td>
      <span class="price">đ</span>
      <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
    </td>
    <td>
      <input class="input-variation input-variation-value" type="text" placeholder="Kho">
    </td>
  `;
}

/**
 * Xóa rows khỏi bảng khi xóa variation
 */
function removeTableRows(valueId, type) {
  const tableBody = document.querySelector(SELECTORS.tableBody);
  const rows = tableBody.querySelectorAll(`tr[data-${type}-id='${valueId}']`);

  if (type === VARIATION_TYPES.SIZE) {
    removeSizeRows(rows);
  } else {
    removeColorRows(rows, valueId);
  }
}

/**
 * Xóa rows của size
 */
function removeSizeRows(rows) {
  rows.forEach((row) => {
    const groupRow = findGroupRow(row);
    const colorCol = groupRow?.querySelector(".color-data");

    if (!colorCol) return;

    const rowSpan = parseInt(colorCol.getAttribute("rowspan")) || 1;

    // Nếu chỉ còn 1 row, reset về default
    if (rowSpan === 1) {
      resetRowToDefault(row, VARIATION_TYPES.SIZE);
      return;
    }

    // Giảm rowspan và xóa row
    colorCol.setAttribute("rowspan", rowSpan - 1);

    if (row.dataset.group) {
      moveDataFromNextRow(row);
    } else {
      row.remove();
    }
  });
}

/**
 * Tìm group row của một row
 */
function findGroupRow(row) {
  let current = row;
  while (current && !current.matches('tr[data-group="true"]')) {
    current = current.previousElementSibling;
  }
  return current;
}

/**
 * Reset row về trạng thái default
 */
function resetRowToDefault(row, type) {
  row.setAttribute(`data-${type}-id`, DEFAULT_VALUES.id);
  const dataCell = row.querySelector(`.${type}-data`);
  if (dataCell) {
    dataCell.textContent = DEFAULT_VALUES.name;
  }
}

/**
 * Di chuyển dữ liệu từ row tiếp theo khi xóa group row
 */
function moveDataFromNextRow(row) {
  const nextRow = row.nextElementSibling;
  if (!nextRow) return;

  const nextSizeId = nextRow.getAttribute("data-size-id");
  const nextSizeText = nextRow.querySelector(".size-data")?.textContent;

  row.setAttribute("data-size-id", nextSizeId);
  const sizeData = row.querySelector(".size-data");
  if (sizeData) {
    sizeData.textContent = nextSizeText;
  }

  nextRow.remove();
}

/**
 * Xóa rows của color
 */
function removeColorRows(rows, colorId) {
  // Nếu không còn color nào, reset về default
  if (!variationState.hasOptions(VARIATION_TYPES.COLOR)) {
    resetColorRowsToDefault(rows);
  } else {
    rows.forEach((row) => row.remove());
  }
}

/**
 * Reset color rows về default
 */
function resetColorRowsToDefault(rows) {
  rows.forEach((row, index) => {
    row.setAttribute("data-color-id", DEFAULT_VALUES.id);
    if (index === 0) {
      const colorName = row.querySelector(".color-name");
      if (colorName) {
        colorName.textContent = DEFAULT_VALUES.name;
      }
    }
  });
}
// ======================================================
// function createVariationOptionItemElem(items, name) {
//   const variationOptionElem = document.createElement("div");

//   variationOptionElem.classList.add(
//     `product-variation-${name}-item`,
//     "product-variation-item",
//     "no-value"
//   );
//   variationOptionElem.innerHTML = `
//     ${createDropdown(items, name)}
//     <button class="delete-variation-btn">
//       <img src="../assets/Garbage can.svg" alt="">
//     </button>
//   `;
//   const dropdownBtn = variationOptionElem.querySelector(".dropdown-btn");
//   const dropdownItems = variationOptionElem.querySelectorAll(".dropdown-item");
//   const deleteBtn = variationOptionElem.querySelector(".delete-variation-btn");
//   dropdownBtn.addEventListener("click", function () {
//     this.nextElementSibling.classList.toggle("show");
//   });

//   // Khi mà click vào dropdown item
//   // gắn sự kiện xử lí cho mỗi dropdown item
//   //Hàm sự kiện sẽ thêm value của variation color hoặc size vào biến selectedVariationOptions
//   // Chặn không cho chọn dropdown-item đã chọn
//   // Có thể thay đổi dropdown-item đã chọn
//   // Đồng bộ các dropdown-item đã chọn
//   dropdownItems.forEach((item) => {
//     item.addEventListener("click", () => {
//       const selectedValue = item.textContent;
//       const id = item.dataset.id;
//       const selectedValuesSpan = dropdownBtn.querySelector(".selected-values");
//       selectedValuesSpan.textContent = selectedValue;
//       item.classList.add("disable");
//       const keyVariation = name + "s";
//       // Lấy vị trí index của variation option
//       const variationOptionIndex = getDomVariationIndexDropdownItem(item, name);
//       // Trường hợp khi mà lần đầu tiên chọn dropdown-item, thì sẽ thêm mới vào selectedVariation
//       if (
//         variationOptionIndex >
//         selectedVariationOptions[keyVariation].length - 1
//       ) {
//         selectedVariationOptions[keyVariation].push(id);
//         // Khi mà chọn 1 variation mới thì sẽ tự động tạo 1 cái variation kế bên
//         if (name === "color") {
//           document
//             .querySelector(".product-variation-color-items")
//             .appendChild(createVariationOptionItemElem(allColors, "color"));
//           addNewRowsForNewColor(id);
//         } else {
//           document
//             .querySelector(".product-variation-size-items")
//             .appendChild(createVariationOptionItemElem(allSizes, "size"));
//           addNewRowsForNewSize(id);
//         }
//       }
//       // Trường hợp đã chọn dropdown-item rồi, mà muốn thay đổi cái khác
//       else {
//         const prevSelectedId =
//           selectedVariationOptions[keyVariation][variationOptionIndex];
//         document
//           .querySelectorAll(`.dropdown-item[data-id='${prevSelectedId}']`)
//           .forEach((val) => val.classList.remove("disable"));
//         selectedVariationOptions[keyVariation][variationOptionIndex] = id;
//       }
//       // Cập nhật disable state khi tạo mới

//       updateDisabledItems(keyVariation);

//       // Khi thêm hoặc thay đổi dropdown item mới thì tự động tắt đi cái menu
//       item.closest(".dropdown-menu").classList.remove("show");
//       variationOptionElem.classList.remove("no-value");
//     });
//   });

//   // Hàm xử lí sự kiện khi muốn xóa 1 cái variation value đã chọn
//   deleteBtn.addEventListener("click", () => {
//     const variationOptionIndex = getDomVariationIndex(
//       deleteBtn.parentElement,
//       name
//     );
//     // Nếu là index đầu tiên thì không cho xóa
//     if (deleteBtn.parentElement.classList.contains("no-value")) {
//       return;
//     }
//     const keyVariation = name + "s";

//     const selectedValue =
//       selectedVariationOptions[keyVariation][variationOptionIndex];

//     document
//       .querySelectorAll(`.dropdown-item[data-id='${selectedValue}']`)
//       .forEach((item) => item.classList.remove("disable"));
//     selectedVariationOptions[keyVariation].splice(variationOptionIndex, 1);
//     deleteBtn.parentElement.remove();
//     removeVariationValueSizeOrColor(selectedValue, name);
//   });

//   return variationOptionElem;
// }

// function updateDisabledItems(keyVariation) {
//   selectedVariationOptions[keyVariation].forEach((value) => {
//     document
//       .querySelectorAll(`.dropdown-item[data-id='${value}']`)
//       .forEach((item) => item.classList.add("disable"));
//   });
// }

// function getDomVariationIndex(elem, name) {
//   const array = Array.from(
//     document.querySelectorAll(`.product-variation-${name}-item`)
//   );
//   const index = array.indexOf(elem);
//   return index;
// }

// function getDomVariationIndexDropdownItem(dropdownItem, name) {
//   const array = Array.from(
//     document.querySelectorAll(`.product-variation-${name}-item`)
//   );
//   const parentVariation =
//     dropdownItem.parentElement.parentElement.parentElement;
//   const index = array.indexOf(parentVariation);
//   return index;
// }

// function initializeVariationTable() {
//   const tableBody = document.querySelector("#product-variation-table tbody");

//   if (!tableBody) return;

//   tableBody.innerHTML = `
//     <tr data-group="true" data-color-id="default" data-size-id="default">
//       <td class="color-data" rowspan="1">
//         <p class="color-name">-</p>
//         <img class="color-variation-value__img" src="../assets/Add Image.svg">
//       </td>
//       <td class="size-data">-</td>
//       <td>
//         <span class="price">đ</span>
//         <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
//       </td>
//       <td>
//         <input class="input-variation input-variation-value" type="text" placeholder="Kho">
//       </td>
//     </tr>
//   `;
// }

// function addNewRowsForNewColor(colorId) {
//   const tableBody = document.querySelector("#product-variation-table tbody");
//   const color = getColorByCode(colorId);
//   if (!color) return;
//   // Xử lí cho trường hợp đầu tiên khi mới thêm 1 màu sắc đầu tiên
//   const defaultRows = tableBody.querySelectorAll(`tr[data-color-id="default"]`);
//   if (defaultRows.length !== 0) {
//     defaultRows.forEach((defaultRow) => {
//       defaultRow.setAttribute("data-color-id", colorId);
//       if (defaultRow.dataset.group) {
//         defaultRow.querySelector(".color-name").textContent = color.name;
//       }
//     });

//     return;
//   }
//   // Xử lí cho trường hợp thêm màu sắc thứ 2, 3, 4, ....
//   // Lấy ra các màu size đang được chọn, nếu mà chưa có size nào đc chọn thì trả về mảng {id: "default", name: "-"}
//   const sizes =
//     selectedVariationOptions.sizes.length > 0
//       ? selectedVariationOptions.sizes.map((id) => getSizeById(id))
//       : [{ id: "default", name: "-" }];
//   const fragment = document.createDocumentFragment();
//   // Tạo rowSpan bằng với số lượng Size đc chọn
//   const rowSpan = sizes.length;
//   sizes.forEach((size, index) => {
//     // Với mỗi size thì sẽ tạo ra 1 tr ở dưới cái tr đầu tiên
//     const row = document.createElement("tr");
//     row.setAttribute("data-color-id", colorId);
//     row.setAttribute("data-size-id", size.id);

//     if (index === 0) {
//       row.setAttribute("data-group", "true");
//       row.innerHTML = `
//       <td rowspan="${rowSpan}" class="color-data"">
//           <p class="color-name">${color.name}</p>
//           <img class="color-variation-value__img" src="../assets/Add Image.svg">
//         </td>
//         <td class="size-data">${size.name}</td>
//         <td>
//           <span class="price">đ</span>
//           <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
//         </td>
//         <td>
//           <input class="input-variation input-variation-value" type="text" placeholder="Kho">
//         </td>
//       `;
//     } else {
//       row.innerHTML = `
//        <td class="size-data"> ${size.name} </td>
//                        <td >
//                         <span class="price">đ</span>
//                       <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
//                      </td>
//                       <td >
//                       <input class="input-variation input-variation-value" type="text" placeholder="Kho">
//                      </td>`;
//     }
//     fragment.appendChild(row);
//   });
//   tableBody.appendChild(fragment);
// }
// function addNewRowsForNewSize(sizeId) {
//   const tableBody = document.querySelector("#product-variation-table tbody");
//   const size = allSizes.find((s) => s.id === sizeId);
//   if (!size) return;

//   const defaultRow = tableBody.querySelector(
//     `tr[data-size-id="default"][data-group='true']`
//   );
//   if (
//     defaultRow &&
//     tableBody.querySelector(`tr[data-color-id="default"][data-group='true']`)
//   ) {
//     defaultRow.setAttribute("data-size-id", sizeId);
//     defaultRow.querySelector(".size-data").textContent = size.name;
//     return;
//   }

//   // Lấy danh sách colors đã chọn, nếu chưa có thì dùng default
//   const colors =
//     selectedVariationOptions.colors.length > 0
//       ? selectedVariationOptions.colors.map((id) => getColorByCode(id))
//       : [{ id: "default", name: "-" }];

//   colors.forEach((color) => {
//     const existingRows = tableBody.querySelector(
//       `tr[data-color-id="${color.id}"][data-group='true']`
//     );
//     if (existingRows.dataset.sizeId === "default") {
//       existingRows.querySelector(".size-data").textContent = size.name;
//       existingRows.dataset.sizeId = size.id;
//     } else {
//       const row = document.createElement("tr");
//       row.setAttribute("data-color-id", color.id);
//       row.setAttribute("data-size-id", sizeId);
//       row.innerHTML = `
//        <td class="size-data"> ${size.name} </td>
//                        <td >
//                         <span class="price">đ</span>
//                       <input class="input-variation input-variation-value input-variation-value__price" type="text" placeholder="Giá">
//                      </td>
//                       <td >
//                       <input class="input-variation input-variation-value" type="text" placeholder="Kho">
//                      </td>`;
//       const colorCol = existingRows.querySelector(".color-data");
//       const rowSpan = parseInt(colorCol.getAttribute("rowspan"));
//       colorCol.setAttribute("rowspan", rowSpan + 1);
//       const allRows = tableBody.querySelectorAll(
//         `tr[data-color-id="${color.id}"]`
//       );

//       allRows[allRows.length - 1].after(row);
//     }
//   });
// }

// function removeVariationValueSizeOrColor(valueId, name) {
//   const tableBody = document.querySelector("#product-variation-table tbody");
//   const allRows = tableBody.querySelectorAll(
//     `tr[data-${name}-id='${valueId}']`
//   );

//   if (name === "size") {
//     allRows.forEach((row) => {
//       let groupRow = row;
//       while (groupRow && !groupRow.matches('tr[data-group="true"]')) {
//         groupRow = groupRow.previousElementSibling;
//       }

//       const col = groupRow.querySelector(".color-data");
//       const rowSpan = parseInt(col.getAttribute("rowspan"));
//       if (rowSpan === 1) {
//         row.setAttribute(`data-${name}-id`, "default");
//         row.querySelector(".size-data").textContent = "-";
//         return;
//       }
//       col.setAttribute("rowspan", rowSpan - 1);

//       if (row.dataset.group) {
//         const nextRow = row.nextElementSibling;
//         const nextRowId = nextRow.getAttribute("data-size-id");
//         const textSize = nextRow.querySelector(".size-data").textContent;
//         row.setAttribute("data-size-id", nextRowId);
//         row.querySelector(".size-data").textContent = textSize;

//         nextRow.remove();
//       } else {
//         row.remove();
//       }
//     });
//   }
//   // Xóa màu sắc
//   else {
//     if (selectedVariationOptions.colors.length === 0) {
//       const rows = tableBody.querySelectorAll(
//         `tr[data-${name}-id='${valueId}']`
//       );
//       rows.forEach((row) => {
//         row.setAttribute("data-color-id", "default");
//       });

//       rows[0].querySelector(".color-name").textContent = "-";
//     } else allRows.forEach((row) => row.remove());
//   }
// }
