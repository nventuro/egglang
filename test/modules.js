const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Modules", () => {
  describe("Util", () => {
    let env;
    beforeEach(() => {
      env = runtime.newEnv();
      runtime.run("define(util, import(\"modules/util.egg\"))", env);
    });

    describe("sum", () => {
      it("is a function", () => {
        expect(runtime.run("get(util, \"sum\")", env)).to.be.a("function");
      });
      it("requires an array", () => {
        expect(() => runtime.run("get(util, \"sum\")(5)", env)).to.throw(TypeError);
      });
      it("works with integers", () => {
        expect(runtime.run("get(util, \"sum\")(array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))", env)).to.deep.equal(55);
      });
    });

    describe("avg", () => {
      it("is a function", () => {
        expect(runtime.run("get(util, \"avg\")", env)).to.be.a("function");
      });
      it("requires an array", () => {
        expect(() => runtime.run("get(util, \"avg\")(5)", env)).to.throw(TypeError);
      });
      it("works with integers", () => {
        expect(runtime.run("get(util, \"avg\")(array(-5, 0, 20))", env)).to.deep.equal(5);
      });
    });
  });
});
