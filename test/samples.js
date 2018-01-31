const egg = require("../src/egg");
const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Samples", () => {
  let envNoPrint;
  beforeEach(() => {
    envNoPrint = runtime.newEnv();
    envNoPrint["print"] = (val) => val;
  });

  describe("Arrays sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/arrays.egg", envNoPrint)).to.deep.equal(55);
    });
  });

  describe("Closure sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/closure.egg", envNoPrint)).to.deep.equal(8);
    });
  });

  describe("Digit sum sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/digit_sum.egg", envNoPrint)).to.deep.equal(55);
    });
  });

  describe("Fibonacci sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/fibo.egg", envNoPrint)).to.deep.equal(55);
    });
  });

  describe("Power sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/pow.egg", envNoPrint)).to.deep.equal(1024);
    });
  });
});
