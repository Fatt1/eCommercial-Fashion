export default class Category {
  constructor(id, name, image, parentId) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.createdAt = new Date();
    this.colorIds = [];
    this.sizeIds = [];
  }
}

/*
{
  categories: [
    {
      id: "123",
      name: "Thoi trang nam",
      parentId: "111",
      createdAt : 23:23:23 23/23/2023,
      colorIds: ["33", "22", "12"],
      sizeIds: [],
    }
  ]
}
*/
