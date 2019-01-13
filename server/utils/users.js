class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.users.filter(value => value.id === id);
    const index = this.users.findIndex(value => id === value.id);
    if (index >= 0) {
      this.users.splice(index, 1)
    }

    return user[0];
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
    const users = this.users.filter(user => user.room === room);
    const names = users.map(user => user.name);

    return names;
  }
}

module.exports = { Users };
