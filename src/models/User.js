export default class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.addresses = [];
    this.phoneNumber = null;
    this.status = "active";
  }
}
