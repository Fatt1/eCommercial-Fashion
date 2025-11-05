import { AdminHeader } from "../AdminHeader/AdminHeader.js";
import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { getLoggedUser } from "../../../../services/userService.js";
export function loadAdminHome() {
  const user = getLoggedUser();
  // Kiểm tra quyền admin
  if (!user || user.role !== "admin") {
    renderUnauthorizedPage();
    return;
  }
  renderAdminHomeHtml();
  setUpHome();
}
function setUpHome() {
  setUpAdminNav();
}
function renderAdminHomeHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
     ${AdminNav()}
      <div class="admin__main">
        
            ${AdminHeader()}
              <div class="logo"><img src="../assets/logo2.svg" /></div>
          <div class="admin__main--operate">
            <button class="admin__option">
              <img src="../assets/admin__customer.png" class="option__logo" />
              <p class="two-first-line">KHÁCH HÀNG</p>
              <p class="two-first-line">100</p>
              <p class="third-line">Bạn mặc, bạn đẹp, bạn là chính mình</p>
            </button>
            <button class="admin__option">
              <img src="../assets/admin__product.png" class="option__logo" />
              <p class="two-first-line">SẢN PHẨM</p>
              <p class="two-first-line">100</p>
              <p class="third-line">Tự tin tỏa sáng cùng phong cách riêng</p>
            </button>
            <button class="admin__option">
              <img src="../assets/admin__revenue.png" class="option__logo" />
              <p class="two-first-line">DOANH THU</p>
              <p class="two-first-line">100</p>
              <p class="second-line">
                Order là cá tính riêng, Delivery là phong cách riêng
              </p>
            </button>
          </div>
        </div>
          </div>
      
    </div>
  `;
}
loadAdminHome();

function renderUnauthorizedPage() {
  document.getElementById("root").innerHTML = `
    <style>
      .unauthorized-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }
      
      .unauthorized-content {
        background: white;
        border-radius: 20px;
        padding: 60px 40px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
        max-width: 600px;
        animation: fadeInUp 0.6s ease-out;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .icon-container {
        width: 120px;
        height: 120px;
        margin: 0 auto 30px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .icon-container svg {
        width: 70px;
        height: 70px;
        color: white;
        stroke-width: 3;
      }
      
      .unauthorized-content h1 {
        font-size: 32px;
        color: #2d3748;
        margin-bottom: 20px;
        font-weight: 700;
      }
      
      .unauthorized-content .message {
        font-size: 18px;
        color: #4a5568;
        margin-bottom: 15px;
        font-weight: 500;
      }
      
      .unauthorized-content .sub-message {
        font-size: 15px;
        color: #718096;
        line-height: 1.6;
        margin-bottom: 40px;
      }
      
      .btn-home {
        padding: 14px 32px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        display: inline-block;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }
      
      .btn-home:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }
      
      @media (max-width: 768px) {
        .unauthorized-content {
          padding: 40px 30px;
        }
        
        .unauthorized-content h1 {
          font-size: 26px;
        }
        
        .unauthorized-content .message {
          font-size: 16px;
        }
        
        .unauthorized-content .sub-message {
          font-size: 14px;
        }
      }
    </style>
    
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <h1>Không Có Quyền Truy Cập</h1>
        <p class="message">Xin lỗi, bạn không có quyền truy cập vào trang này.</p>
        <p class="sub-message">
          Trang này chỉ dành cho quản trị viên. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là một lỗi.
        </p>
        <button class="btn-home" onclick="window.location.href='./home.html'">
          Về Trang Chủ
        </button>
      </div>
    </div>
  `;
}
