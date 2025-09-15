import BreadCrumb from "../../components/BreadCrumb/BreadCrumb.js";
import Footer from "../../components/Footer/Footer.js";
import Header from "../../components/Header/Header.js";
import ProductList from "../../components/ProductList/ProductList.js";
import { getAllProducts } from "../../services/productService.js";
const relatedProducts = getAllProducts();
export default function ProductDetails(productId) {
  return `
  ${Header()}
   <div class="product-page">
      <div class="main-content">
          ${BreadCrumb()}
        <div class="detail-product">
          <div class="image-section">
            <img
              class="image-section__large-img"
              src="../assets/large-img-detail.png"
            />
            <div class="small-images-section">
              <img
                class="small-images-section__small"
                src="../assets/large-img-detail.png"
              />
              <img
                class="small-images-section__small"
                src="../assets/large-img-detail.png"
              />
              <img
                class="small-images-section__small"
                src="../assets/large-img-detail.png"
              />
              <img
                class="small-images-section__small"
                src="../assets/large-img-detail.png"
              />
            </div>
          </div>

          <div class="content-section">
            <h3 class="detail-product-name">ÁO SƠ MI Z02313</h3>
            <div class="rating">
              <img class="rating-star" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <span class="average-rating">5.0</span>
            </div>
            <div class="detail-product-price">
              <span class="detail-product-price__sale">447.000đ</span>
              <span class="detail-product-price__origin">500.000đ</span>
              <span class="detail-product-percentage">-30%</span>
            </div>
            <div class="product-delivery">
               <p class="delivery-name">
                 Vận chuyển
                </p>
                <div class="delivery-content">
                  <img class="shipping-icon" src="../assets/In Transit.svg">
                  <div class="delivery-content__desc">
                    <p>Nhận hàng 14 Th09 - 17 Th09 ></p>
                    <p>Phí ship 0₫ cho tất cả đơn hàng trên 120.000đ</p>
                  </div>
                </div>
            </div>
            <div class="return-policy">
               <p class="return-policy__name">
                 Đổi trả
                </p>
                <div class="return-policy__content">
                  <img class="return-package-icon" src="../assets/Return Package.svg">
                   <p class="return-policy__desc"> 30-day free returns</p>
                </div>
            </div>
            <div class="variation-prouct">
              <div class="color-variation variation-group">
                <p class="name-variation">
                  Màu sắc: <span class="selected-color">Đỏ</span>
                </p>
                <div class="variation-values">
                  <button class="variation-value">
                    <img
                      class="variation-value__img"
                      src="../assets/large-img-detail.png"
                    />
                    <span class="variation-value__value-name">Đen</span>
                  </button>

                  <button class="variation-value">
                    <img
                      class="variation-value__img"
                      src="../assets/large-img-detail.png"
                    />
                    <span class="variation-value__value-name">Hồng</span>
                  </button>

                  <button class="variation-value">
                    <img
                      class="variation-value__img"
                      src="../assets/large-img-detail.png"
                    />
                    <span class="variation-value__value-name">Xanh lam</span>
                  </button>
                  <button class="variation-value">
                    <img
                      class="variation-value__img"
                      src="../assets/large-img-detail.png"
                    />
                    <span class="variation-value__value-name">Xanh lam</span>
                  </button>
                  <button class="variation-value">
                    <img
                      class="variation-value__img"
                      src="../assets/large-img-detail.png"
                    />
                    <span class="variation-value__value-name">Xanh lam</span>
                  </button>
                  <button class="variation-value">
                    <img
                      class="variation-value__img"
                      src="../assets/large-img-detail.png"
                    />
                    <span class="variation-value__value-name">Xanh lam</span>
                  </button>
                  <button class="variation-value">
                    <img
                      class="variation-value__img"
                      src="../assets/large-img-detail.png"
                    />
                    <span class="variation-value__value-name">Xanh lam</span>
                  </button>
                </div>
              </div>

                <div class="size-variation variation-group">
                <p class="name-variation">
                  Kích cỡ: <span class="selected-size">S</span></span>
                </p>
                <div class="variation-values">
                  <button class="variation-value">
                   
                    <span class="variation-value__value-name">S</span>
                  </button>

                  <button class="variation-value">
                   
                    <span class="variation-value__value-name">SL</span>
                  </button>

                  <button class="variation-value">
                   
                    <span class="variation-value__value-name">XL</span>
                  </button>
                  <button class="variation-value">
                   
                    <span class="variation-value__value-name">XX</span>
                  </button>
                  <button class="variation-value">
                   
                    <span class="variation-value__value-name">XXL</span>
                  </button>
                  
                </div>
              </div>

              <div class="quantity">
                 <p class="quantity-name">
                  Số lượng
                </p>
              <div class="action-quantity">
                  <button class="decrease-quantity"><span class="line"></span></button>
                  <input value="1" class="quantity-input" type="text" >
                  <button class="increase-quantiy">+</button>
              </div>
              <span class="available-quantity">499 sản phẩm có sẵn</span>
              </div>
              <div class="product-actions">
               <button class="add-to-cart-btn"> <img class="cart" src="../assets/shopping-cart.png"> Thêm vào giỏ hàng</button>
                <button class="buy-now-btn">Mua ngay</button>
              </div>
            </div>
            <div class="share-section">
              <p class="share-section__name">Chia sẻ</p>
              <div class="share-icons">
                <button class="share-icon share-on-facebook"><i class="fa-brands fa-facebook fa-2xl" style="color: #25467e"></i></button>
                 <button class="share-icon share-on-messenger"><i class="fa-brands fa-facebook-messenger fa-2xl" style="color: #1371b9;"></i></button>
                  <button class="share-icon share-on-x"><i class="fa-brands fa-x-twitter fa-2xl"></i></button>
                   <button class="share-icon share-on-youtube"><i class="fa-brands fa-youtube fa-2xl" style="color: #ce1c1c;"></i></button>
              </div>
            </div>
          </div>
        </div>
            <div class="bottom-section">
                  <ul class="extra-information__tabs">
                      <li class="extra-information__tab active" data-target="desc-content">
                        Mô tả
                      </li>
                      <li class="extra-information__tab" data-target="details-content">
                        Thông tin chi tiết
                      </li>
                      <li class="extra-information__tab" data-target="review-content">
                       Đánh giá
                      </li>
                    </ul>
                  <p id="desc-content" class="extra-information__desc" >
                    ÁO THUN POLO

Áo thun Cotton 100% co dãn 4 chiều



✔️Size sz M L XL XXL



Size M 35-45kg

Size L 45-55kg

Size XL 55-65kg

Size XXL 65-75kg

Tuỳ chiều cao nhích size cho phù hợp giúp em nha. Bảng cân nặng chỉ là tương đối ạ



=========================================

CAM KẾT - ĐẢM BẢO:

- Đảm bảo vải chuẩn cotton chất lượng cao.

- Hàng có sẵn, giao hàng ngay khi nhận được đơn đặt hàng .

- Hoàn tiền 100% nếu sản phẩm lỗi, nhầm hoặc không giống với mô tả.

- Chấp nhận đổi hàng khi size không vừa (vui lòng nhắn tin riêng cho shop).

- Giao hàng toàn quốc, thanh toán khi nhận hàng.

- Hỗ trợ đổi trả theo quy định của Shopee.



ĐIỀU KIỆN ĐỔI TRẢ:

- Hỗ trợ trong vòng 03 ngày từ khi nhận hàng.

- Hàng hoá vẫn còn mới nguyên tem mác, chưa qua sử dụng.

- Hàng hoá bị lỗi hoặc hư hỏng do vận chuyển hoặc do nhà sản xuất.



📌 LƯU Ý:  Khi bạn gặp bất kì vấn đề gì về sản phẩm đừng vội đánh giá  mà hãy chat liên hệ Shop để đc hỗ trợ 1 cách tốt nhất  nhé.

#aothun #aopolonam #polo #polonam #aocotron #aothunnam #aothuncotron #aocotton #aothundep #aophong #aophongnam #aophongcotron #aophongtayngan #aothuntayngan #aothunbody 
                  </p>
                  <div id="details-content" class="extra-information__detail-content" hidden>
                   <div class="extra-information-attribute-container">
                      <h3 class="extra-information-attribute-container__attribute-name">Phong cách</h3>
                      <div class="extra-information-attribute-container__attribute-value">Cơ bản, Thể thao, Hàn Quốc</div>
                   </div>
                    <div class="extra-information-attribute-container">
                      <h3 class="extra-information-attribute-container__attribute-name">Phong cách</h3>
                      <div class="extra-information-attribute-container__attribute-value">Cơ bản, Thể thao, Hàn Quốc</div>
                   </div>

                    <div class="extra-information-attribute-container">
                      <h3 class="extra-information-attribute-container__attribute-name">Phong cách</h3>
                      <div class="extra-information-attribute-container__attribute-value">Cơ bản, Thể thao, Hàn Quốc</div>
                   </div>

                    <div class="extra-information-attribute-container">
                      <h3 class="extra-information-attribute-container__attribute-name">Phong cách</h3>
                      <div class="extra-information-attribute-container__attribute-value">Cơ bản, Thể thao, Hàn Quốc</div>
                   </div>
                  </div>

                  <div id="review-content"></div>
            </div>
          <div class="related-products">
            
            <h2 class="related-products__header">Các sản phẩm liên quan</h2>
            ${ProductList({
              products: relatedProducts,
              className: "related-products-list",
            })};
          </div>  
      </div>
    </div>
    ${Footer()}
  `;
}
