// import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
function ProductManageHead() {
  return `
    <div class="product-manage__head">
                    <div class="product-manage__head-left">
                      <a class="selected">Danh sách sản phẩm</a>
                      <a class="">Thông tin cơ bản</a>
                      <a class="">Thông tin chi tiết</a>
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

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(
    ".product-manage-main-search__text"
  );
  const searchBtn = document.querySelector(
    ".product-manage-main-search__button1"
  );
  const resultContainer = document.querySelector(".product-result-item");

  // render test
  function renderSearchResults(products) {
    if (!products || products.length === 0) {
      resultContainer.innerHTML = `<p style="padding: 16px;">Không tìm thấy sản phẩm nào.</p>`;
      return;
    }

    const html = products
      .map(
        (p) => `
      <div class="cart-item product-result-item__product">
        <div class="product-main">
          <img class="product-main__img" src="../assets/large-img-detail.png" />
          <span>${p.name}</span>
        </div>
        <div class="product-price">
          <span class="product-price__current-price">
            ${
              formatNumber
                ? formatNumber(p.priceInfo.currentlyPrice)
                : p.priceInfo.currentlyPrice
            }đ
          </span>
        </div>
        <div class="product-quantity">
          <span class="product-quantity__input">Kho: ${p.stock || 1000}</span>
        </div>
      </div>
    `
      )
      .join("");

    resultContainer.innerHTML = html;
  }

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
});
