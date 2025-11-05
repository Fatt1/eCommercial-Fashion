export default class User {
  constructor(id, email, password, fullName = "", phoneNumber = "", gender = "", dateOfBirth = null) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.gender = gender; // "male", "female", "other"
    this.dateOfBirth = dateOfBirth; // { day: 1, month: 1, year: 2000 }
    this.addresses = [];
    this.status = "active";
    this.createdAt = new Date();
  }
}
