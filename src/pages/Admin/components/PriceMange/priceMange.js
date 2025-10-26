import { AdminNav } from "../AdminNav/AdminNav.js";
import {getAllProductForAdmin} from '../../../../services/productService.js';
function renderPriceManageHtml() {
  const productList = getAllProductForAdmin();
  document.getElementById("root").innerHTML = `<div class="admin">
        ${AdminNav()}
<div class="admin__main">
  <div class="main-content __admin">
    <div class="priceManage_container">
      <div class="priceManage_header">
        <a>Quản lý giá bán</a>
        <button class="add_product_btn">Nhập sản phẩm</button>
      </div>
      <div class="priceMange_main_container">
        <div class="priceMange_main_content_header">
          <select class="price-filter">
            <option value="gia-ban">Giá bán</option>
            <option value="gia-von">Giá vốn</option>
            <option value="loi-nhuan">% Lợi nhuận</option>
          </select>
          <select class="catergory-filter">
            <option value="men">Men</option>
            <option value="feminine">Feminine</option>
            <option value="kids">Kids</option>
            <option value="accessories">Accessories</option>
          </select>
          <div class="right_object">
            <button>Áp dụng</button>
            <button>Nhập lại</button>
          </div>
        </div>
        <div class="main_content_header">
          <table>
            <thead class = "table_header">
              <tr>
                <th>Sản phẩm</th>
                <th>Giá Vốn</th>
                <th>% lợi nhuận</th>
                <th>Giá Bán</th>
                <th>& giảm giá</th>
                <th>Giá giảm</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            
          </table>
        </div>
      </div>
    </div>
  </div>
</div>`;
}
function TableBody(productList){
  return`
  <tbody class = "table_body">
             
              </tbody>
  `;
}
function TableRow(product){
  return`
    <tr>
      <td>${product.brandId}</td> 
      <td>${product.catergoryId}</td> 
      <td>${product.name}</td> 
      <td>${product.name}</td> 
      <td>${product.name}</td> 
      <td>${product.name}</td> 
      <td>${product.name}</td> 
      <td>${product.name}</td> 
      <td>${product.name}</td> 
      <td>${product.name}</td> 

    </tr>
  `;
}
function setUpRenderPriceManage() {
  // Setup event listeners and other logic here
}

export function loadPriceManagePage() {
  renderPriceManageHtml();
  setUpRenderPriceManage();
  getAllProductForAdmin([]);
}
