export default function Filter() {
  return `
   <div class="filter">
        <div class="category-list">
          <div class="category-list__header">
            <img src="../assets/category-3-soc.svg" />
            <h3 class="category-header-filter">DANH MỤC</h3>
          </div>
          <ul class="category-list-body">
            <li>
              <span class="caret active">Thời trang nam</span>
              <ul class="nested">
                <li>Áo</li>
                <li>Quàn</li>
              </ul>
            </li>

            <li>
              <span class="caret">Thời trang nữ</span>
              <ul class="nested">
                <li>Áo crop top</li>
                <li>Quần dài</li>
              </ul>
            </li>
           
          </ul>
        </div>

        <div class="filter-header">
          <img src="../assets/Filter.svg" />
          <h2>BỘ LỌC TÌM KIẾM</h2>
        </div>
        <fieldset class="filter-group color-filter">
          <legend class="filter-group__header">Màu sắc</legend>
          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" hidden />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" hidden />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="blue" Bl>
              <div class="stick-checkbox stick-check-box__color">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="blue" name="blue" type="checkbox" hidden />
              <span class="checkbox-label">Blue</span>
            </label>
          </div>
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>

        <fieldset class="filter-group size-filter">
          <legend class="filter-group__header">Kích thước</legend>
          <div class="checkbox-filter">
            <label class="checkbox" for="S" Bl>
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="S" name="S" type="checkbox" />
              <span class="checkbox-label">S</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="M" Bl>
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="M" name="M" type="checkbox" hidden />
              <span class="checkbox-label">M</span>
            </label>
          </div>
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>

        <fieldset class="filter-group price-range-filter">
            <legend class="filter-group__header">Khoảng giá</legend>
            <div class="price-range-filter__edit">
              <div class="price-range-filter__inputs">
                  <input class="price-range-filter__input" type="text" maxlength="13" placeholder="đ TỪ">
                  <div class="price-range-filter__range-line"></div>
                   <input class="price-range-filter__input" type="text" maxlength="13" placeholder="đ ĐẾN">
                </div>
                <button class="btn apply-btn">Áp dụng</button>
              </div>
        </fieldset>

         <fieldset class="filter-group material-filter">
          <legend class="filter-group__header">Chất liệu</legend>
          <div class="checkbox-filter">
            <label class="checkbox" for="cotton">
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="cotton" name="cotton" type="checkbox" />
              <span class="checkbox-label">Cotton</span>
            </label>
          </div>

          <div class="checkbox-filter">
            <label class="checkbox" for="denim">
              <div class="stick-checkbox">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3872 2.3408L4.82409 10.154L1.23486 6.56476L1.7652 6.03444L4.77597 9.04521L10.8129 1.8584L11.3872 2.3408Z"
                    fill="black"
                  />
                </svg>
              </div>
              <input id="denim" name="denim" type="checkbox" hidden />
              <span class="checkbox-label">Denim</span>
            </label>
          </div>
          <button class="filter-group__toggle-btn">
            Xem thêm
            <img src="../assets/dropdown-icon.svg" style="margin-left: 3px" />
          </button>
        </fieldset>
      </div>
  `;
}
