const egg = require("../src/egg");
const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Samples", () => {
  let scopeNoPrint;
  beforeEach(() => {
    scopeNoPrint = runtime.newScope();
    scopeNoPrint["print"] = (val) => val;
  });

  describe("Digit sum sample", () => {
    it("should return the correct result", () => {
      expect(egg.runFile("samples/digit_sum.egg", scopeNoPrint)).to.deep.equal(55);
    });
  });

  describe("Fibonacci sample", () => {
    it("should return the correct result", () => {
      expect(egg.runFile("samples/fibo.egg", scopeNoPrint)).to.deep.equal(55);
    });
  });

  describe("Power sample", () => {
    it("should return the correct result", () => {
      expect(egg.runFile("samples/pow.egg", scopeNoPrint)).to.deep.equal(1024);
    });
  });

  describe("Closure sample", () => {
    it("should return the correct result", () => {
      expect(egg.runFile("samples/closure.egg", scopeNoPrint)).to.deep.equal(8);
    });
  });

  describe("Array sample", () => {
    it("should return the correct result", () => {
      expect(egg.runFile("samples/array.egg", scopeNoPrint)).to.deep.equal(55);
    });
  });

  describe("Dict sample", () => {
    it("should return the correct result", () => {
      expect(egg.runFile("samples/dict.egg", scopeNoPrint)).to.deep.equal({"even": [0, 2, 4, 6, 8], "odd": [1, 3, 5, 7, 9]});
    });
  });

  describe("Modules sample", () => {
    it("should return the correct result", () => {
      expect(egg.runFile("samples/modules.egg", scopeNoPrint)).to.deep.equal(40);
    });
  });
});
