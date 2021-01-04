const { findByteSequence } = require("../utils/fileUtils");
const { testFile } = require("./testHelper");

describe("findByteSequence", () => {
  const byteSequenceToFind = Buffer.from([0x00, 0x04]);
  test("returns index of first byte found that matches the sequence", () => {
    const index = findByteSequence(testFile, byteSequenceToFind);
    expect(index).toEqual(12);
  });
  test("returns -1 if not found", () => {
    const nonExistingByteSequence = Buffer.from([0x1c, 0x42]);
    const index = findByteSequence(testFile, nonExistingByteSequence);
    expect(index).toEqual(-1);
  });
  test("return -1 if not found in the limited range", () => {
    const index = findByteSequence(testFile, byteSequenceToFind, 10);
    expect(index).toEqual(-1);
  });
});
