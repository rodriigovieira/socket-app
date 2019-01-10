const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const data = generateMessage('Admin', 'Hello, World');

    expect(data.from).toBe('Admin');
    expect(data.text).toBe('Hello, World');
    expect(typeof data.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should return url with coords', () => {
    const { lat, lng } = { lat: 3000, lng: 2000 };
    const response = generateLocationMessage('God', lat, lng);

    expect(response.from).toBe('God');
    expect(response.url).toBe(`https://www.google.com/maps?q=${lat},${lng}`);
    expect(typeof response.createdAt).toBe('number');
  });
});
