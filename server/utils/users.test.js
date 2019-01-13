const expect = require('expect');

const { Users } = require('./users');

const users = new Users();

beforeEach(() => {
  users.users = [{
    id: '1',
    name: 'Rodrigo',
    room: 'A',
  }, {
    id: '2',
    name: 'Jesus',
    room: 'B',
  }, {
    id: '3',
    name: 'Maria',
    room: 'A',
  }];
});

describe('Users', () => {
  it('should add new user', () => {
    const response = users.addUser('123', 'Rodrigo', 'Test Room');

    expect(users.users.length).toBe(4);
    expect(users.users[3]).toEqual({
      id: '123',
      name: 'Rodrigo',
      room: 'Test Room',
    });
  });

  it('should remove a user', () => {
    const response = users.removeUser('1');

    expect(response[0].name).toBe('Rodrigo');
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    const response = users.removeUser('4');
  
    expect(response).toEqual([]);
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const response = users.getUser('2');

    expect(response[0].name).toBe('Jesus');
  });

  it('should not find a user', () => {
    const response = users.getUser('120');

    expect(response).toEqual([]);
  });

  it('should return an array with students of room B', () => {
    const response = users.getUserList('A');

    expect(response).toEqual(['Rodrigo', 'Maria']);
  });
});
