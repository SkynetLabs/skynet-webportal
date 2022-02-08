describe("ipRegex", () => {
  const { ipRegex } = require("./utils");

  test("should test true for valid ip", () => {
    expect(ipRegex.test("8.8.8.8")).toEqual(true);
    expect(ipRegex.test("127.0.0.1")).toEqual(true);
    expect(ipRegex.test("192.168.0.1")).toEqual(true);
    expect(ipRegex.test("10.10.10.10")).toEqual(true);
    expect(ipRegex.test("135.124.12.47")).toEqual(true);
  });

  test("should test false for invalid ip", () => {
    expect(ipRegex.test("888.8.8.8")).toEqual(false);
    expect(ipRegex.test("....")).toEqual(false);
    expect(ipRegex.test(null)).toEqual(false);
    expect(ipRegex.test("foo")).toEqual(false);
    expect(ipRegex.test("")).toEqual(false);
  });
});
