const expect = require('expect');

const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const data = generateMessage('Admin', 'Hello, World');

    expect(data.from).toBe('Admin');
    expect(data.text).toBe('Hello, World');
    expect(typeof data.createdAt).toBe('number');
  });
});
