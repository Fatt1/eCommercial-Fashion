// import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";

function ProductManageHead() {
  return `
    <div class="product-manage__head">
                    <div class="product-manage__head-left">
                      <a class="selected">Danh sách sản phẩm</a>
                      <a class="">Đang hoạt động</a>
                      <a class="">Đang ẩn</a>
                    </div>
                    <div class="product-manage__head-right">
                      <button class="add-product-btn">Thêm sản phẩm</button>
                    </div>
                  </div>
  `;
}
function ProductSearch() {
  return `
     <div class="product-manage-main-search">
                      <input
                        type="text"
                        size="50"
                        placeholder="Tìm kiếm sản phẩm..."
                      />
                      <input
                        type="text"
                        size="50"
                        placeholder="Chọn ngành hàng"
                      />
                      <button
                        class="product-manage-main-search__button product-manage-main-search__button1"
                      >
                        Áp Dụng
                      </button>
                      <button
                        class="product-manage-main-search__button product-manage-main-search__button2"
                      >
                        Nhập Lại
                      </button>
                    </div>
  `;
}
function ProductItem() {
  return `
                          <div class="cart-item-container product-result-item">
                            <div class="cart-item product-result-item__product">
                              <div class="product-main">
                                <img
                                  class="product-main__img"
                                  src="../assets/large-img-detail.png"
                                  alt=""
                                />
                                <span>Áo sơ mi z</span>
                              </div>
  
                              <div class="product-price">
                                <span class="product-price__current-price"
                                  >300.000đ</span
                                >
                              </div>
                              <div class="product-quantity">
                                <span
                                  class="product-quantity__input "
                                  >1000</span
                                >
                              </div>
                            </div>
                            <div class="skus product-result-item__skus">
                              <div class="sku">
                                <div class="cart-item">
                                  <div class="product-main product-main-sku">
                                    <input
                                      type="checkbox checkbox-sku"
                                      class="product-main__checkbox checkbox-sku"
                                      name=""
                                      id=""
                                    />
                                    <img
                                      class="product-main__img product-main__img-sku"
                                      src="../assets/large-img-detail.png"
                                      alt=""
                                    />
                                    <div class="name-sku">
                                      <span>Áo sơ mi z</span>
                                      <div>XL, Nâu</div>
                                    </div>
                                  </div>
  
                                  <div class="product-price">
                                    <span class="product-price__current-price"
                                      >300.000đ</span
                                    >
                                  </div>
                                  <div class="product-quantity">
                                    <span
                                      class="product-quantity__input product-quantity-input-"
                                      >1000</span
                                    >
                                  </div>
                                </div>
                              </div>
                              <div class="sku">
                                <div class="cart-item">
                                  <div class="product-main product-main-sku">
                                    <input
                                      type="checkbox checkbox-sku"
                                      class="product-main__checkbox checkbox-sku"
                                      name=""
                                      id=""
                                    />
                                    <img
                                      class="product-main__img product-main__img-sku"
                                      src="../assets/large-img-detail.png"
                                      alt=""
                                    />
                                    <div class="name-sku">
                                      <span>Áo sơ mi z</span>
                                      <div>XL, Nâu</div>
                                    </div>
                                  </div>
  
                                  <div class="product-price">
                                    <span class="product-price__current-price"
                                      >300.000đ</span
                                    >
                                  </div>
                                  <div class="product-quantity">
                                    <span
                                      class="product-quantity__input product-quantity-input-"
                                      >1000</span
                                    >
                                  </div>
                                </div>
                              </div>
                              <div class="sku">
                                <div class="cart-item">
                                  <div class="product-main product-main-sku">
                                    <input
                                      type="checkbox checkbox-sku"
                                      class="product-main__checkbox checkbox-sku"
                                      name=""
                                      id=""
                                    />
                                    <img
                                      class="product-main__img product-main__img-sku"
                                      src="../assets/large-img-detail.png"
                                      alt=""
                                    />
                                    <div class="name-sku">
                                      <span>Áo sơ mi z</span>
                                      <div>XL, Nâu</div>
                                    </div>
                                  </div>
  
                                  <div class="product-price">
                                    <span class="product-price__current-price"
                                      >300.000đ</span
                                    >
                                  </div>
                                  <div class="product-quantity">
                                    <span
                                      class="product-quantity__input product-quantity-input-"
                                      >1000</span
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="link-see-more">
                              <a href="#!">Xem Thêm (Còn 3 sản phầm)</a>
                            </div>
                          </div>
  `;
}
function ProductList() {
  return `
                        <div class="cart product-result">
                          <div class="cart-info product-result-info">
                            <div class="product-main product-result-info__main">
                              Tất Cả Sản Phẩm
                            </div>
                            <div class="product-price product-result-info__price">Giá</div>
                            <div class="product-quantity product-result-info__stock">Kho hàng</div>
                          </div>
                            ${ProductItem()}
                        </div>
  `;
}

export function renderProductAdminHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
          <div class="main-content__admin">
               <div class="product-manage">
                  ${ProductManageHead()}
                  <div class="product-manage-main">
                    ${ProductSearch()}
                    <div class="product-manage-main-result">
                      <div class="product-manage-main-result__top">
                        <span class="product-manage-main-result__top--quantity"
                          >1 Sản Phẩm</span
                        >
                      </div>
                      <div class="product-manage-main-result__bot">
                       ${ProductList()}
                      </div>
                      <div class="product-manage-main-result__end">
                        <div class="noti-message">
                          Mỗi trang tối đa 5 sản phẩm
                        </div>
                        <div class="pagination">
                          <a
                            href="#"
                            class="prev-btn pagination-btn disable-pagination-link"
                            data-index="0"
                            ><img src="../assets/prev-btn.svg"
                          /></a>
  
                          <a href="#" class="pagination-btn active" data-index="1"
                            >1</a
                          >
                          <a
                            href="#"
                            class="pagination-btn next-btn disable-pagination-link"
                            data-index="2"
                            ><img src="../assets/prev-btn.svg"
                          /></a>
                        </div>
                        <div class="page-index-track">Trang 1/12</div>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
        </div>
    </div> 
  `;
}

// function setUpProductAdmin() {
//   setUpAdminNav();
//   document
//     .querySelector(".add-product-btn")
//     .addEventListener("click", () => {});
// }
// export function loadProductAdmin() {
//   renderProductAdminHtml();
//   setUpProductAdmin();
// }

//tét
import { searchProducts } from "../../../../services/productService.js";
import { formatNumber } from "../../../../helper/formatNumber.js";
import { getSkusByProductId } from "../../../../services/productService.js";
import { getSkuBySkuId } from "../../../../models/Sku.js";
import { getDetailOneSku } from "../../../../services/productService.js";
import { getProductById } from "../../../../services/productService.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(
    ".product-manage-main-search__text"
  );
  const searchBtn = document.querySelector(
    ".product-manage-main-search__button1"
  );
  const clearBtn = document.querySelector(
    ".product-manage-main-search__button2"
  );

  const resultContainer = document.querySelector(".product-result-item");

  // render test
  function renderSearchResults(products) {
    if (!products || products.length === 0) {
      resultContainer.innerHTML = `<p style="padding: 16px;">Không tìm thấy sản phẩm nào.</p>`;
      return;
    }
    console.log(products.length);
    document.querySelector(
      ".product-manage-main-result__top--quantity"
    ).textContent = products.length + " Sản Phẩm";
    const html = products
      .map(
        (p) => `
        <div class="product-block" data-product-id="${p.id}">
          <div class="cart-item product-result-item__product">
            
            <div class="product-main">
            ${
              p.status === "public"
                ? `<span class="status-public">${p.status}</span>`
                : `<span class="status-private">${p.status}</span>`
            }
              <img class="product-main__img" src="../assets/large-img-detail.png" />
              <span>${p.name}</span>
            </div>
            <div class="product-price">
              <span class="product-price__current-price">${formatNumber(
                p.priceInfo.currentlyPrice
              )}đ</span>
            </div>
            <div class="product-quantity">
              <span class="product-quantity__input">Kho: ${
                p.stock || 1000
              }</span>
            </div>
          </div>
          <button class="show-sku-btn" data-product-id="${
            p.id
          }">Xem tất cả SKU</button>
          <div class="sku-container" id="sku-container-${p.id}"></div>
        </div>
    `
      )
      .join("");

    //render skuList
    function renderSkuList(skus) {
      let htmlSku = "";
      console.log(skus);
      if (!skus || skus.length === 0) {
        htmlSku += `<div class="sku-empty">Không có SKU nào</div>`;
      } else {
        skus.map((sku) => {
          // console.log(getSkuBySkuId(sku.id, sku.productId));
          const detail = getDetailOneSku(sku, sku.productId);
          const p = getProductById(sku.productId);

          console.log("detail" + detail);
          console.log(detail);
          //check xem sku co đủ vơi hợp lệ k ( đủ name và tierIndex[] 2 phần tử)
          if (detail) {
            htmlSku += `
          <div class="sku">
            <div class="cart-item">
              <div class="product-main product-main-sku">
                <img class="product-main__img product-main__img-sku" src="../assets/large-img-detail.png" />
                <div class="name-sku">

                  <span>${
                    p.name ||
                    sku.name ||
                    getSkuBySkuId(sku.id, sku.productId).name ||
                    "noname"
                  }</span> 
                  <div>${detail.selectedDetails[0].name},${
              detail.selectedDetails[1].name
            }</div>
                </div>
              </div>
              <div class="product-price">
                <span class="product-price__current-price">${formatNumber(
                  p.priceInfo.currentlyPrice || 0
                )}đ</span>
              </div>
              <div class="product-quantity">
                <span class="product-quantity__input">${
                  sku.stock || 0
                } trong kho</span>
              </div>
            </div>
          </div>
        `;
          }
        });
      }

      let html = `
      <div class="skus product-result-item__skus">
        ${htmlSku}
      </div>
      `;

      return html;
    }

    resultContainer.innerHTML = html;

    //tét event

    document.querySelectorAll(".show-sku-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.dataset.productId;
        const container = document.getElementById(`sku-container-${productId}`);

        if (container.classList.contains("opened")) {
          container.classList.remove("opened");
          container.innerHTML = "";
          e.target.textContent = "Xem tất cả SKU";
          return;
        }

        const skus = getSkusByProductId(productId);
        console.log("product sku", productId, skus);
        container.innerHTML = renderSkuList(skus);
        container.classList.add("opened");
        e.target.textContent = "Thu gọn SKU";
      });
    });
  }

  clearBtn.addEventListener("click", () => {
    document.querySelector(".product-manage-main-search__text").value = "";
    document.querySelector(".product-manage-main-search__category").value = "";
    searchBtn.click();
  });

  searchBtn.addEventListener("click", async () => {
    const keyword = searchInput.value.trim();

    console.log("tìm:", keyword);

    const { items, totalPages } = searchProducts({
      searchKey: keyword,
      pageSize: 5,
      pageNumber: 1,
    });

    console.log("result:", items);
    renderSearchResults(items);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});
