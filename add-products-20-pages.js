// =======================================================================================
// SCRIPT THÊM SẢN PHẨM ĐỂ ĐỦ 20 TRANG (120 SẢN PHẨM)
// =======================================================================================
//
// CÁCH SỬ DỤNG:
// 1. Mở trang home.html trong trình duyệt
// 2. Click vào "SẢN PHẨM" -> Chọn "Thời Trang Nam"
// 3. Mở Developer Console (F12 -> Console)
// 4. Copy toàn bộ code trong file này
// 5. Paste vào Console và nhấn Enter
// 6. Script sẽ tự động thêm 112 sản phẩm vào localStorage
// 7. Refresh lại trang để xem kết quả
//
// =======================================================================================

(function () {
  console.log("🚀 Bắt đầu thêm sản phẩm để đủ 20 trang...");

  // Lấy data từ localStorage
  let dbContext = JSON.parse(localStorage.getItem("dbContext"));

  if (!dbContext || !dbContext.products) {
    console.error("❌ Không tìm thấy dbContext trong localStorage!");
    console.log("💡 Hãy đảm bảo bạn đã mở trang web và data đã được load");
    return;
  }

  // Categories nam
  const categories = [
    "mhm3q5i1-x3fB2w", // Áo khoác
    "mhm3r3s8-YU81SR", // Áo vest và Blazer
    "mhm3ruyw-9VX1fm", // Áo hoodie
    "mhm3s7er-3Iop7i", // Áo len
  ];

  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#33FFF5",
    "#F5FF33",
  ];
  const sizes = ["s", "m", "l", "xl"];

  const productNames = [
    "Áo Khoác Dạ Cao Cấp",
    "Áo Vest Công Sở",
    "Áo Hoodie Basic",
    "Áo Len Cổ Tròn",
    "Áo Khoác Jean",
    "Áo Blazer Sang Trọng",
    "Áo Hoodie Nỉ Bông",
    "Áo Len Cổ Lọ",
    "Áo Khoác Bomber",
    "Áo Vest Slim Fit",
    "Áo Hoodie Zip",
    "Áo Len Cardigan",
    "Áo Khoác Gió",
    "Áo Blazer Oversize",
    "Áo Hoodie Premium",
    "Áo Len Dệt Kim",
    "Áo Khoác Parka",
    "Áo Vest 3 Lớp",
    "Áo Hoodie Form Rộng",
    "Áo Len Len Sợi",
  ];

  const descriptions = [
    "Chất liệu cao cấp, form dáng chuẩn, phù hợp mọi dịp",
    "Thiết kế hiện đại, thoải mái, bền đẹp",
    "Sản phẩm chất lượng, giá cả hợp lý",
    "Phong cách trẻ trung, năng động",
    "Thời trang nam cao cấp, sang trọng",
    "Form dáng Hàn Quốc, phong cách hiện đại",
    "Chất vải mềm mại, thoáng mát",
    "Thiết kế độc đáo, nổi bật",
    "Phù hợp đi làm, đi chơi",
    "Chất liệu cotton 100%, thấm hút tốt",
  ];

  const images = [
    "goods_485325_sub14_3x4.avif",
    "goods_485325_sub15_3x4.avif",
    "vngoods_05_480411_3x4.avif",
    "1.avif",
    "2.avif",
    "3.avif",
    "4.avif",
    "5.avif",
  ];

  // Đếm số sản phẩm hiện tại trong các category Thời Trang Nam
  const currentProducts = dbContext.products.filter(
    (p) => categories.includes(p.categoryId) && !p.isDeleted
  );
  console.log(
    `📊 Số sản phẩm hiện tại trong Thời Trang Nam: ${currentProducts.length}`
  );

  // Cần 120 sản phẩm cho 20 trang (6 sản phẩm/trang)
  const targetProducts = 120;
  const productsToAdd = targetProducts - currentProducts.length;

  if (productsToAdd <= 0) {
    console.log(`✅ Đã đủ ${targetProducts} sản phẩm rồi!`);
    return;
  }

  console.log(`📦 Cần thêm ${productsToAdd} sản phẩm nữa để đủ 20 trang`);

  const newProducts = [];
  let skuCount = 0;

  for (let i = 0; i < productsToAdd; i++) {
    const categoryId = categories[i % categories.length];
    const productName = productNames[i % productNames.length];
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const id = `prod-${timestamp}-${randomStr}-${i}`;

    const product = {
      id: id,
      name: `${productName} ${currentProducts.length + i + 1}`,
      desc: descriptions[i % descriptions.length],
      thumbnail: images[i % images.length],
      images: [
        images[i % images.length],
        images[(i + 1) % images.length],
        images[(i + 2) % images.length],
      ],
      attributes: [
        {
          attributeId: "A004",
          attributeValues: ["Polyester"],
        },
        {
          attributeId: "A014",
          attributeValues: ["Slim fit"],
        },
        {
          attributeId: "A016",
          attributeValues: ["Trung bình"],
        },
      ],
      variations: [
        {
          name: "Màu sắc",
          variationOptions: colors.slice(0, 3).map((c) => ({
            id: c,
            image: images[i % images.length],
          })),
        },
        {
          name: "Kích thước",
          variationOptions: sizes.map((s) => ({
            id: s,
            image: "",
          })),
        },
      ],
      categoryId: categoryId,
      priceInfo: {
        currentlyPrice: 200000 + i * 10000,
        importPrice: 150000 + i * 7000,
        originalPrice: 300000 + i * 15000,
      },
      isDeleted: false,
      brandId: "21",
      weight: 1,
      status: "public",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      skus: [],
    };

    // Tạo SKUs (3 màu × 4 size = 12 SKUs)
    for (let c = 0; c < 3; c++) {
      for (let s = 0; s < 4; s++) {
        const skuId = `sku-${timestamp}-${randomStr}-${i}-${c}-${s}`;
        const sku = {
          id: skuId,
          productId: id,
          stock: 50 + Math.floor(Math.random() * 100),
          tierIndexes: [c, s],
          updatedAt: new Date().toISOString(),
        };

        product.skus.push(sku);

        // Thêm vào dbContext.skus nếu có
        if (dbContext.skus) {
          dbContext.skus.push(sku);
          skuCount++;
        }
      }
    }

    newProducts.push(product);
  }

  // Thêm sản phẩm mới vào dbContext
  dbContext.products = dbContext.products.concat(newProducts);

  // Lưu lại vào localStorage
  localStorage.setItem("dbContext", JSON.stringify(dbContext));

  console.log("✅ Hoàn thành!");
  console.log(`📦 Đã thêm: ${newProducts.length} sản phẩm`);
  console.log(`🏷️ Đã thêm: ${skuCount} SKUs`);
  console.log(
    `📊 Tổng sản phẩm Thời Trang Nam: ${
      currentProducts.length + newProducts.length
    }`
  );
  console.log(
    `📄 Tổng số trang: ${Math.ceil(
      (currentProducts.length + newProducts.length) / 6
    )} trang`
  );
  console.log("\n🔄 Đang refresh trang sau 2 giây...");

  // Tự động refresh sau 2 giây
  setTimeout(() => {
    location.reload();
  }, 2000);
})();
