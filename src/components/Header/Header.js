export default function Header() {
  return `  <header>
      <div class="container">
        <div class="main-content">
        
          <div class="header-top">
            <nav class="navbar">
              <ul class="navbar-list">
                <li class="nav-item active">
                  <a href="./home.html">TRANG CHỦ</a>
                </li>
                <li class="nav-item"><a href="./product.html">SẢN PHẨM</a><div class="category-box">
      <div class="category-box__column1">
        <h3 class="category-headings">NAM</h3>
        <ul class="">
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
        </ul>
      </div>
      <div class="category-box__column1">
        <h3 class="category-headings">NỮ</h3>
        <ul>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
        </ul>
      </div>
      <div class="category-box__column1">
        <h3 class="category-headings">TRẺ EM</h3>
        <ul>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
        </ul>
      </div>
      <div class="category-box__column1">
        <h3 class="category-headings">PHỤ KIỆN</h3>
        <ul>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
          <li>Áo khoác nam</li>
        </ul>
      </div>
    </div></li>
                <li class="nav-item"><a href="#">GIỚI THIỆU</a></li>
                <li class="nav-item"><a href="#">LIÊN HỆ</a></li>
              </ul>
            </nav>
            <img class="logo" src="../assets/logo.svg" alt="logo" />
            <div class="action">
              <div class="search-bar">
                <input type="text" class="search" placeholder="Tìm kiếm" />
                <button class="search-icon">
                  <img src="../assets/search-icon.png" />
                </button>
              </div>
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
