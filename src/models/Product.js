export default class Product {
  constructor(
    id,
    name,
    desc,
    brandId,
    thumbnail,
    weight,
    images,
    attributes,
    priceInfo,
    variations,
    categoryId,
    status
  ) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.thumbnail = thumbnail;
    this.images = images;
    this.attributes = attributes;
    this.variations = variations;
    this.categoryId = categoryId;
    this.priceInfo = priceInfo;
    this.brandId = brandId;
    this.weight = weight;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

/*
  {
  id: "123",
  name: "abc",
  desc: "abc",
  thumbnail: "abc.jpg",
  images: [abc1.jpg, abc2.jpg],
  attributes: [
      {
        attributeId: "123",
        attributeValuesIds: ["123", "234", "123"]
      }
    ],
  categoryId: "213",
  brandId: "123",
  weight: "0.5" (tính theo kg),
  priceInfo: {
    originalPrice: 799.000,
    currentlyPrice: 120.000 // nếu mà không có khuyến mãi thì currentlyPrice với originalPrice sẽ bằng nhau
  }
  variations: [
      {
        name: "Màu sắc",
        variationOptions: [
         {
         image: "abc.png",
          colorId: "123"
          },
          {
         image: "abc.png",
          colorId: "143"
          },
        ]
      },
      {
        name: "Kích thước",
        variationOptions: ["123", "235", "234"] (đây là id của kích thước)
      }
    ],
  status: "public" (lưu ý: ta sẽ có 3 trạng thái của sản phẩm ["public", "draft", "deleted"]),  
  createAt: "20:20:12 12/12/2025",
  updateAt: "20:20:12 12/12/2025",
  }
*/
