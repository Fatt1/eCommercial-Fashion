document.addEventListener("DOMContentLoaded", function () {
  // =================================================================
  // PHẦN 1: XỬ LÝ MODAL (GIỮ NGUYÊN TỪ TRƯỚC)
  // =================================================================
  const modalOverlay = document.getElementById("modal-overlay");
  const detailsModal = document.getElementById("details-modal");
  const updateModal = document.getElementById("update-modal");

  const openDetailsLinks = document.querySelectorAll(".order-details-link");
  const openUpdateLinks = document.querySelectorAll(".update-status-link");
  const closeBtns = document.querySelectorAll(".modal .close-btn");

  const openModal = (modal) => {
    modalOverlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  };

  const closeModal = () => {
    modalOverlay.classList.add("hidden");
    detailsModal.classList.add("hidden");
    updateModal.classList.add("hidden");
  };

  openDetailsLinks.forEach((link) => {
    link.addEventListener("click", () => openModal(detailsModal));
  });

  openUpdateLinks.forEach((link) => {
    link.addEventListener("click", () => openModal(updateModal));
  });

  closeBtns.forEach((btn) => btn.addEventListener("click", closeModal));
  modalOverlay.addEventListener("click", closeModal);
  detailsModal.addEventListener("click", (e) => e.stopPropagation());
  updateModal.addEventListener("click", (e) => e.stopPropagation());

  // =================================================================
  // PHẦN 2: XỬ LÝ PHÂN TRANG (CODE MỚI)
  // =================================================================

  // --- 1. Lấy các phần tử cần thiết ---
  const tableBody = document.querySelector("#order-list-table tbody");
  const allRows = Array.from(tableBody.querySelectorAll("tr")); // Lấy tất cả các hàng
  const paginationContainer = document.querySelector(".pagination");
  const pageItems = paginationContainer.querySelectorAll(".page-item");
  const prevBtn = paginationContainer.querySelector("span:first-child");
  const nextBtn = paginationContainer.querySelector("span:last-child");

  // --- 2. Thiết lập trạng thái ban đầu ---
  let currentPage = 1;
  const rowsPerPage = 3; // << BẠN CÓ THỂ THAY ĐỔI SỐ DÒNG MỖI TRANG Ở ĐÂY
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  // --- 3. Hàm hiển thị dữ liệu cho một trang cụ thể ---
  function displayPage(page) {
    // Ẩn tất cả các dòng trước
    allRows.forEach((row) => (row.style.display = "none"));

    // Tính toán chỉ số dòng bắt đầu và kết thúc
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Lấy ra các dòng cần hiển thị và cho chúng hiện ra
    const rowsToShow = allRows.slice(startIndex, endIndex);
    rowsToShow.forEach((row) => (row.style.display = "")); // display = '' sẽ reset về mặc định của thẻ (table-row)

    // Cập nhật lại lớp 'active' cho nút số trang
    pageItems.forEach((item) => {
      item.classList.remove("active");
      if (parseInt(item.textContent) === page) {
        item.classList.add("active");
      }
    });

    // Vô hiệu hóa nút Trước/Sau nếu ở trang đầu/cuối
    prevBtn.style.pointerEvents = page === 1 ? "none" : "auto";
    prevBtn.style.opacity = page === 1 ? "0.5" : "1";
    nextBtn.style.pointerEvents = page === totalPages ? "none" : "auto";
    nextBtn.style.opacity = page === totalPages ? "0.5" : "1";
  }

  // --- 4. Gắn sự kiện click cho các nút ---
  // Các nút số trang
  pageItems.forEach((item) => {
    item.addEventListener("click", () => {
      currentPage = parseInt(item.textContent);
      displayPage(currentPage);
    });
  });

  // Nút "Trước" (Previous)
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayPage(currentPage);
    }
  });

  // Nút "Sau" (Next)
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayPage(currentPage);
    }
  });

  // --- 5. Hiển thị trang đầu tiên khi tải trang ---
  displayPage(1);
});