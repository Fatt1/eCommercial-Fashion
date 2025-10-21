import {
  getAllColors,
  getColorByCode,
  getColorByName,
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
                   
                 </div>
                 <table id="product-variation-table">
                  <thead>
                      <tr>
                        <th style="width: 150px;">Màu</th>
                        <th style="width: 170px;">Kích thước</th>
                      </tr>
                  </thead>
                  <tbody>
                  
                  </tbody>
                 </table>
              </div>
            </div>
            </div>
  `;
}

// Tracking item nào đang được chọn bởi variation nào
const VARIATION_TYPES = {
  COLOR: "color",
  SIZE: "size",
};
export const colorImages = [];
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
    const colorImgIndex = colorImages.indexOf(
      (img) => img.colorId === removedId
    );
    if (colorImgIndex !== -1) {
      colorImages.splice(colorImgIndex, 1);
    }
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

export const variationState = new VariationState();
// ==================== MAIN SETUP ====================
/**
 * Khởi tạo event listeners và UI cho product variation
 */
export function setUpEventListenerCreateProductVariation(
  isInitialTable = true
) {
  colorImages.length = 0;
  const allColors = getAllColors();
  const allSizes = getAllSizes();
  variationState.selectedOptions.colors = [];
  variationState.selectedOptions.sizes = [];
  // Tạo initial dropdown cho color và size
  appendVariationOption(SELECTORS.colorItems, allColors, VARIATION_TYPES.COLOR);
  appendVariationOption(SELECTORS.sizeItems, allSizes, VARIATION_TYPES.SIZE);
  if (isInitialTable) initializeVariationTable();
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
export function attachDropdownEvents(elem, type, items) {
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
    updateTableRowsForVariationChange(type, prevId, item);
  }

  updateAllDisabledItems(type);

  item.closest(".dropdown-menu").classList.remove("show");
}
function updateTableRowsForVariationChange(type, prevId, item) {
  if (type === VARIATION_TYPES.COLOR) {
    // Cập nhật lại tên màu trong bảng
    const trElem = document.querySelector(
      `tr[data-color-id='${prevId}'][data-group='true']`
    );
    trElem.setAttribute("data-color-id", item.dataset.id);

    if (trElem) {
      const colorNameElem = trElem.querySelector(".color-name");
      trElem
        .querySelector("label")
        .setAttribute("for", `load-image-input-${item.dataset.id}`);
      trElem
        .querySelector("input")
        .setAttribute("id", `load-image-input-${item.dataset.id}`);
      const colorImg = colorImages.find((img) => img.colorId === prevId);
      if (colorImg) {
        colorImg.colorId = item.dataset.id;
      }

      if (colorNameElem) {
        colorNameElem.textContent = item.textContent;
      }
    }
  } else {
    // Cập nhật lại size trong bảng
    document.querySelectorAll(`tr[data-size-id='${prevId}']`).forEach((tr) => {
      tr.setAttribute("data-size-id", item.dataset.id);
      const sizeData = tr.querySelector(".size-data");
      sizeData.textContent = item.textContent;
    });
  }
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
export function attachDeleteEvent(elem, type) {
  const deleteBtn = elem.querySelector(SELECTORS.deleteBtn);

  deleteBtn.addEventListener("click", () => {
    if (elem.classList.contains("no-value")) return;

    const index = getVariationIndex(elem, type);
    const removedId = variationState.remove(type, index);
    const nameColor =
      deleteBtn.previousElementSibling.querySelector("span").textContent;
    if (type === VARIATION_TYPES.COLOR) {
      const color = getColorByName(nameColor);
      if (color) {
        const colorImgIndex = colorImages.findIndex(
          (img) => img.colorId === color.id
        );
        if (colorImgIndex !== -1) {
          colorImages.splice(colorImgIndex, 1);
        }
      }
    }
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
export function updateAllDisabledItems(type) {
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

function initializeVariationTable(isInitial = true) {
  const tableBody = document.querySelector(SELECTORS.tableBody);
  if (!tableBody) return;

  if (isInitial) tableBody.innerHTML = createDefaultTableRow();
}
function createDefaultTableRow() {
  return `
    <tr data-group="true" data-color-id="default" data-size-id="default">
      <td class="color-data" rowspan="1">
        <p class="color-name">-</p>
        <label for="load-image-input-default" class="load-image-input-label">
          <div class="preview-img-variation">
          <img class="color-variation-value__img" src="../assets/Add Image.svg" alt="add image">
          </div>
        </label>
        <input style="display: none" id="load-image-input-default" type="file" accept="image/*" />
      </td>
      <td class="size-data">-</td>
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
      const labelDefault = row.querySelector("label");
      labelDefault.setAttribute("for", `load-image-input-${colorId}`);
      const inputDefault = row.querySelector("input");
      inputDefault.setAttribute("id", `load-image-input-${colorId}`);
      inputDefault.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          uploadImageForColor(colorId, file, inputDefault);
        }
      });
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
export function uploadImageForColor(colorId, file, uploadInputImg) {
  colorImages.push({ colorId, fileName: file.name });
  uploadInputImg.disabled = true;
  const previewImg = document.querySelector(
    `label[for='load-image-input-${colorId}'] img`
  );
  previewImg.src = "../assets/products/" + file.name;
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-image-btn");
  removeBtn.innerHTML = `x`;
  removeBtn.addEventListener("click", (e) => {
    uploadInputImg.value = "";
    uploadInputImg.disabled = false;
    previewImg.src = "../assets/Add Image.svg";
    const index = colorImages.findIndex((img) => img.colorId === colorId);
    if (index !== -1) {
      colorImages.splice(index, 1);
    }
    removeBtn.remove();
  });
  document;
  previewImg.parentElement.appendChild(removeBtn);
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
        <label for="load-image-input-${colorId}" class="load-image-input-label">
           <div class="preview-img-variation">
            <img class="color-variation-value__img" src="../assets/Add Image.svg" alt="add image">
          </div>
        </label>
        <input style="display: none" id="load-image-input-${colorId}" type="file" accept="image/*" />
      </td>
      ${createCommonRowCells(size.name)}
    `;
    const labelDefault = row.querySelector("label");
    labelDefault.setAttribute("for", `load-image-input-${colorId}`);
    const inputDefault = row.querySelector("input");
    inputDefault.setAttribute("id", `load-image-input-${colorId}`);
    inputDefault.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadImageForColor(colorId, file, inputDefault);
      }
    });
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
