export default function Header() {
  return `  <header>
        <div class="container">
          <div class="main-content">
            <div class="header-top">
              <nav class="navbar">
                <ul class="navbar-list">
                  <li class="nav-item active"><a href="./home.html">TRANG CHỦ</a></li>
                  <li class="nav-item" data-tab="san-pham"><a href="#">SẢN PHẨM</a></li>
                  <li class="nav-item"><a href="#">GIỚI THIỆU</a></li>
                  <li class="nav-item"><a href="#">LIÊN HỆ</a></li>
                </ul>
              </nav>
              <img class="logo" src="../assets/logo.svg" alt="logo" />
              <div class="action">
                <input type="text" class="search" placeholder="Tìm kiếm..." />
                <img
                  src="../assets/defaut-avatar.png"
                  alt="avatar-user"
                  class="avatar-user"
                />
                <a class="login-link">Đăng Nhập</a>
                <span style="color: white">|</span>
                <a class="register-link">Đăng Kí</a>
                <div class="header-cart">
                  <img
                    src="../assets/shopping-cart.png"
                    alt="cart-icon"
                    class="cart-icon"
                  />
                  <span class="cart-quantity">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>`;
}
