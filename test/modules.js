const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Modules", () => {
  describe("Func", () => {
    let scope;
    beforeEach(() => {
      scope = runtime.newScope();
      runtime.run(":=(func, import(\"modules/func.egg\"))", scope);
    });

    describe("map", () => {
      beforeEach(() => {
        runtime.run(":=(doubler, fun(x, *(x, 2)))", scope);
        runtime.run(":=(a, array(1, 2, 3, 4, 5))", scope);
      });
      it("is a function", () => {
        expect(runtime.run("get(func, \"map\")", scope)).to.be.a("function");
      });
      it("requires an array and a function", () => {
        expect(() => runtime.run("get(func, \"map\")(5, doubler)", scope)).to.throw(TypeError);
      });
      it("returns an array", () => {
        expect(runtime.run("get(func, \"map\")(a, doubler)", scope)).to.deep.equal([2, 4, 6, 8, 10]);
      });
      it("doesn't modify the original array", () => {
        runtime.run("get(func, \"map\")(a, doubler)", scope);
        expect(runtime.run("a", scope)).to.deep.equal([1, 2, 3, 4, 5]);
      });
    });

    describe("filter", () => {
      beforeEach(() => {
        runtime.run(":=(is_even, get(import(\"modules/util.egg\"), \"is_even\"))", scope);
        runtime.run(":=(a, array(1, 2, 3, 4, 5))", scope);
      });
      it("is a function", () => {
        expect(runtime.run("get(func, \"filter\")", scope)).to.be.a("function");
      });
      it("requires an array and a function", () => {
        expect(() => runtime.run("get(func, \"filter\")(5, is_even)", scope)).to.throw(TypeError);
      });
      it("returns an array", () => {
        expect(runtime.run("get(func, \"filter\")(a, is_even)", scope)).to.deep.equal([2, 4]);
      });
      it("doesn't modify the original array", () => {
        runtime.run("get(func, \"filter\")(a, is_even)", scope);
        expect(runtime.run("a", scope)).to.deep.equal([1, 2, 3, 4, 5]);
      });
    });

    describe("reduce", () => {
      beforeEach(() => {
        runtime.run(":=(a, array(1, 2, 3, 4, 5))", scope);
      });
      it("is a function", () => {
        expect(runtime.run("get(func, \"reduce\")", scope)).to.be.a("function");
      });
      it("requires an array, a function and a starting value", () => {
        expect(() => runtime.run("get(func, \"reduce\")(a, +)", scope)).to.throw(TypeError);
      });
      it("returns a value", () => {
        expect(runtime.run("get(func, \"reduce\")(a, +, 0)", scope)).to.deep.equal(15);
      });
      it("uses the starting value", () => {
        expect(runtime.run("get(func, \"reduce\")(a, +, 10)", scope)).to.deep.equal(25);
      });
      it("doesn't modify the original array", () => {
        runtime.run("get(func, \"reduce\")(a, +, 0  )", scope);
        expect(runtime.run("a", scope)).to.deep.equal([1, 2, 3, 4, 5]);
      });
    });
  });

  describe("Util", () => {
    let scope;
    beforeEach(() => {
      scope = runtime.newScope();
      runtime.run(":=(util, import(\"modules/util.egg\"))", scope);
    });

    describe("sum", () => {
      it("is a function", () => {
        expect(runtime.run("get(util, \"sum\")", scope)).to.be.a("function");
      });
      it("requires an array", () => {
        expect(() => runtime.run("get(util, \"sum\")(5)", scope)).to.throw(TypeError);
      });
      it("works with integers", () => {
        expect(runtime.run("get(util, \"sum\")(array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))", scope)).to.deep.equal(55);
      });
    });

    describe("avg", () => {
      it("is a function", () => {
        expect(runtime.run("get(util, \"avg\")", scope)).to.be.a("function");
      });
      it("requires an array", () => {
        expect(() => runtime.run("get(util, \"avg\")(5)", scope)).to.throw(TypeError);
      });
      it("works with integers", () => {
        expect(runtime.run("get(util, \"avg\")(array(-5, 0, 20))", scope)).to.deep.equal(5);
      });
    });

    describe("is_even", () => {
      it("is a function", () => {
        expect(runtime.run("get(util, \"is_even\")", scope)).to.be.a("function");
      });
      it("works with even integers", () => {
        expect(runtime.run("get(util, \"is_even\")(2)", scope)).to.deep.equal(true);
      });
      it("works with odd integers", () => {
        expect(runtime.run("get(util, \"is_even\")(3)", scope)).to.deep.equal(false);
      });
    });
    describe("odd", () => {
      it("is a function", () => {
        expect(runtime.run("get(util, \"is_odd\")", scope)).to.be.a("function");
      });
      it("works with even integers", () => {
        expect(runtime.run("get(util, \"is_odd\")(4)", scope)).to.deep.equal(false);
      });
      it("works with odd integers", () => {
        expect(runtime.run("get(util, \"is_odd\")(5)", scope)).to.deep.equal(true);
      });
    });
  });
});
