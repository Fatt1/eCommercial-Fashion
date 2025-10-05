export default class Attribute {
  constructor(id, name, attributeValues, inputType, isRequired, createdAt) {
    this.id = id;
    this.name = name;
    this.attributeValues = attributeValues;
    this.isRequired = isRequired;
    this.inputType = inputType;
    this.createdAt = createdAt;
  }
}
//input_type
// SINGLE_DROP_DOWN = 1
// FREE_TEXT_FILED   = 2
// MULTI_DROP_DOWN   = 3

/*
{
  
  id: "123",
  inputType: 1
  name: "Phong cách",
  attributeValues: [
    "Đường phố", "Hàn Quốc"
  ],
  isRequired: true,
  createdAt: 23:23:23 12/12/2025
}
*/
