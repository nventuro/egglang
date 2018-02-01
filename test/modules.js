const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Modules", () => {
  describe("Util", () => {
    let scope;
    beforeEach(() => {
      scope = runtime.newScope();
      runtime.run("define(util, import(\"modules/util.egg\"))", scope);
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
