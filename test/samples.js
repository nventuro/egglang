const egg = require("../src/egg");
const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Samples", () => {
  let envNoPrint;
  beforeEach(() => {
    envNoPrint = runtime.newEnv();
    envNoPrint["print"] = (val) => val;
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

  describe("Closure sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/closure.egg", envNoPrint)).to.deep.equal(8);
    });
  });

  describe("Array sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/array.egg", envNoPrint)).to.deep.equal(55);
    });
  });

  describe("Dict sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/dict.egg", envNoPrint)).to.deep.equal({"even": [0, 2, 4, 6, 8], "odd": [1, 3, 5, 7, 9]});
    });
  });

  describe("Modules sample", () => {
    it("should return the correct result", () => {
      expect(egg._runFile("samples/modules.egg", envNoPrint)).to.deep.equal(40);
    });
  });
});
