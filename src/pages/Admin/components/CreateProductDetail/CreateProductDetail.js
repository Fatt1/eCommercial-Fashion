import { INPUT_TYPE } from "../../../../constant/Constant.js";
import { getBrandsByCategoryId } from "../../../../services/brandService.js";

export function renderCreateProductDetailAttribute(attributes, categoryId) {
  document.querySelector(".attribute-list").innerHTML = `
  ${!categoryId ? "" : InputDropdownBrand(categoryId)}
  ${attributes
    .map((att) => {
      let inputHtml = ``;
      if (att.inputType === INPUT_TYPE.SINGLE_DROP_DOWN)
        inputHtml = InputSingleDropDown(att);
      else if (att.inputType === INPUT_TYPE.FREE_TEXT_FIELD)
        inputHtml = InputText(att);
      else inputHtml = InputMultiDropDown(att);
      return `
                <div class="attribute-container">
                    <span class="attribute-name">${att.isRequired ? "*" : ""}${
        att.name
      }</span>
                    ${inputHtml}
                 </div>
              `;
    })
    .join(" ")}`;

  setUpEventListener(attributes);
}
function InputText(att) {
  const attributeKey = att.id;
  return `
  <input class="input-free-text" data-attribute-name="${attributeKey}"
   type="text" placeholder="Vui lòng nhập">
  `;
}

function InputSingleDropDown(att) {
  const attributeKey = att.id;
  return `
  <div class="dropdown brand-dropdown">
                      <button class="brand-dropdown-btn dropdown-btn" data-attribute-name="${attributeKey}">
                      <span class="selected-values placeholder">Vui lòng chọn</span> 
                      <img src="../assets/dropdown-icon.svg">
                      </button>
                      <ul style="top: 56px" class="dropdown-menu">
                          ${att.attributeValues
                            .map((value) => {
                              return `  <li class="dropdown-item">${value}</li>`;
                            })
                            .join(" ")}
                        </ul>
                    </div>
  `;
}
function InputDropdownBrand(categoryId) {
  const brands = getBrandsByCategoryId(categoryId);
  return `
   <div class="attribute-container required-attribute">
      <span class="attribute-name">Thương hiệu</span>
     <div class="dropdown brand-dropdown">
                        <button class="brand-dropdown-btn dropdown-btn" data-attribute-name="brand">
                        <span class="selected-values placeholder">Vui lòng chọn</span> 
                        <img src="../assets/dropdown-icon.svg">
                        </button>
                        <ul style="top: 56px" class="dropdown-menu">
                            ${brands
                              .map((value) => {
                                return `  <li class="dropdown-item">${value.name}</li>`;
                              })
                              .join(" ")}
                          </ul>
                      </div>
     <div class="error-message-required"></div>                 
   </div>
  `;
}
function InputMultiDropDown(att) {
  const attributeKey = att.id;
  return `
   <div class="dropdown brand-dropdown">
      <button class="brand-dropdown-btn dropdown-btn"  data-attribute-name="${attributeKey}">
        <span class="selected-values placeholder">Vui lòng chọn</span>
         <img src="../assets/dropdown-icon.svg">
      </button>
      <ul style="top: 56px" class="dropdown-menu ">
        ${att.attributeValues
          .map((value) => {
            return `
           <li class="dropdown-item multi-dropdown" data-value="${attributeKey}">
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
// lưu lại để mốt khi mà nhấn lưu sản phẩm thì sẽ lấy từ trong biến này ra
export let selectedAttributeValues = {};
function setUpEventListener(attributes) {
  selectedAttributeValues = {};
  // khởi tạo các attribute
  attributes.forEach((att) => {
    const attributeKey = att.id;
    if (att.inputType === INPUT_TYPE.MULTI_DROP_DOWN) {
      selectedAttributeValues[attributeKey] = []; // Array cho multi
    } else if (att.inputType === INPUT_TYPE.SINGLE_DROP_DOWN) {
      selectedAttributeValues[attributeKey] = null; // Single value
    } else {
      selectedAttributeValues[attributeKey] = ""; // String cho free text
    }
  });

  // Handle when clicking dropdown btn both of singleDropdown and multiDropdown
  // Dùng để hiện thị dropdown menu đang đc chọn
  document.querySelectorAll(".attribute-list .dropdown-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      btn.nextElementSibling.classList.toggle("show");
    })
  );

  //Handle when clicking dropdown-item
  document
    .querySelectorAll(".attribute-list .dropdown-item")
    .forEach((item) => {
      item.addEventListener("click", (e) => {
        const dropdownBtn = item
          .closest(".dropdown")
          .querySelector(".dropdown-btn");
        const attributeName = dropdownBtn.dataset.attributeName;
        const value = item.textContent.trim();

        const isMultiDropdown = item.classList.contains("multi-dropdown");
        if (isMultiDropdown) {
          handleMultiDropdown(item, dropdownBtn, attributeName, value);
        } else {
          handleSingleDropdown(item, dropdownBtn, attributeName, value);
          item.closest(".dropdown-menu").classList.remove("show");
        }
      });
    });

  // Handle khi nhập free text input
  document.querySelectorAll(".input-free-text").forEach((input) => {
    input.addEventListener("input", () => {
      const attributeName = input.dataset.attributeName;
      selectedAttributeValues[attributeName] = input.value;
    });
  });
}

// Xử lí cho single dropdown
// Lưu lại và render lại khi thay đổi value
function handleSingleDropdown(item, dropdownBtn, attributeName, value) {
  const selectedValuesSpan = dropdownBtn.querySelector(".selected-values");
  const selectedValueItem = dropdownBtn.nextElementSibling.querySelector(
    ".dropdown-item.selected"
  );
  if (selectedValueItem) selectedValueItem.classList.remove("selected");
  item.classList.add("selected");
  selectedValuesSpan.textContent = value;
  selectedAttributeValues[attributeName] = value;
}

// Xử lí cho multi dropdown
// Thêm hoặc xóa attribute và sẽ render lại khi thay đổi value
function handleMultiDropdown(item, dropdownBtn, attributeName, value) {
  const selectedValuesSpan = dropdownBtn.querySelector(".selected-values");
  // Nếu click vào item đang đc chọn thì đồng nghĩa với việc là bỏ cái value đó
  if (item.classList.contains("selected")) {
    item.classList.remove("selected");
    const indexOfValue = selectedAttributeValues[attributeName].indexOf(value);
    selectedAttributeValues[attributeName].splice(indexOfValue, 1);
  }
  // Ngược lại
  else {
    item.classList.add("selected");
    selectedAttributeValues[attributeName].push(value);
  }
  // Render lại các attribute đã đc chọn
  selectedValuesSpan.innerHTML =
    selectedAttributeValues[attributeName].join(", ");
}
