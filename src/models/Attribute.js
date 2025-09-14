export default class Attribute {
  constructor(
    id,
    name,
    categoryId,
    attributeValues,
    inputType,
    isRequired,
    createdAt
  ) {
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
    this.attributeValues = attributeValues;
    this.isRequired = isRequired;
    this.inputType = inputType;
    this.createdAt = createdAt;
  }
}
//input_type
// SINGLE_DROP_DOWN = 1
// SINGLE_COMBO_BOX = 2
// FREE_TEXT_FILED        = 3
// MULTI_DROP_DOWN   = 4
// MULTI_COMBO_BOX   = 5

/*
{
  
  id: "123",
  inputType: 1
  name: "Phong cách",
  attributeValues: [
    {
      valuesId: "123",
      name: "Đường phố",
    },
    {
      valuesId: "124",
      name: "Hàn Quốc",
    }
  ],
  categoryId: "213",
  isRequired: true,
  createdAt: 23:23:23 12/12/2025
}
*/
