const expect = require('expect');

const { isRealString } = require('./validator');

describe('isRealString', () => {
  it('should return false for non-string values', () => {
    const result = isRealString(666);

    expect(result).toBe(false);
  });

  it('should return false for strings that contains only spaces', () => {
    const result = isRealString('        ');

    expect(result).toBe(false);
  });

  it('should return true for valid strings', () => {
    const result = isRealString('Hoooowyaah!');

    expect(result).toBe(true);
  });
});
