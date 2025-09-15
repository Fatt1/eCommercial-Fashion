export default class Category {
  constructor(id, name, image, parentId) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.parentId = parentId;
    this.createdAt = new Date();
    this.colorIds = [];
    this.sizeIds = [];
  }
}
