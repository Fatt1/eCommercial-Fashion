export function CreateProductHeader(selectedTab) {
  return `
    <div class="create-product__header">
              <ul class="create-product-tabs">
                <li class="create-product-tab active">Thông tin cơ bản</li>
                <li class="create-product-tab">Thông tin chi tiết</li>
                <li class="create-product-tab">Thông tin bán hàng</li>
              </ul>
            </div>
  `;
}
