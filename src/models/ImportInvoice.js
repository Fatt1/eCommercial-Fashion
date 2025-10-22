export default class ImportInvoice {
  constructor(id, importDate, totalPrice, quantity, items, status) {
    this.id = id;
    this.importDate = importDate;
    this.totalPrice = totalPrice;
    this.quantity = quantity;
    this.status = status; // status la trang thai cua phieu nhap hang (da hoan thanh, dang cho, huy)
    this.items = items; // items la mot mang chua cac doi tuong ImportInvoiceItem
  }
}

/*
{
  importInvoices: [
    {
      id: 'PN001',
      importDate: '2023-10-01',
      totalPrice: 1000000,
      quantity: 50,
      items: [
        {
          skuId: "Sku001",
          productName: "Áo thun nam",
          size: "M",
          color: "Đen",
          importPrice: 200000,
          quantity: 10
        },
        status: "PENDING"
      ]
    },

    {
      id: 'PN001',
      importDate: '2023-10-01',
      totalPrice: 1000000,
      quantity: 50,
      items: [
        {
          skuId: "Sku001",
          productName: "Áo thun nam",
          size: "M",
          color: "Đen",
          importPrice: 200000,
          quantity: 10
        },
        status: "COMPLETED"
      ]
    },
  ]
}
*/
