export function CreateProductDetail(attributes) {
  return `
      
  
  `;
}

export function renderCreateProductDetailAttribute(attributes) {
  document.querySelector(".attribute-list").innerHTML = `
  ${attributes
    .map((att) => {
      return `
                <div class="attribute-container">
                    <span class="attribute-name">${att.isRequired ? "*" : ""}${
        att.name
      }</span>
                    <div class="dropdown brand-dropdown">
                      <button class="brand-dropdown-btn dropdown-btn">Vui lòng chọn <img src="../assets/dropdown-icon.svg"></button>
                      <ul style="top: 56px" class="dropdown-menu">
                          ${att.attributeValues
                            .map((value) => {
                              return `  <li class="dropdown-item">${value}</li>`;
                            })
                            .join(" ")}
                        </ul>
                    </div>
                 </div>
              `;
    })
    .join(" ")}`;
}
