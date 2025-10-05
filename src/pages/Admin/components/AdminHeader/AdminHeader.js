export function AdminHeader() {
  return `
      <div class="admin__header">
            <div class="admin__header--left">
              <h1 class="admin__homepage--text">Trang chủ</h1>
              <div class="vertical-line"></div>
              <div class="admin__search-bar">
                <input type="text" placeholder="Tìm kiếm" class="search-bar" />
                <button>SEARCH</button>
              </div>
            </div>
            <div class="admin__header--right">
              <img src="../assets/notification-icon.png" class="icon" /><img
                src="../assets/defaut-avatar.png"
                class="icon2"
              />ADMIN
            </div>
          </div>
  `;
}
