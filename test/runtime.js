const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Runtime", () => {
  describe("Environment", () => {
    it("creates new environments", () => {
      expect(runtime.newEnv()).not.to.equal(runtime.newEnv());
    });
    it("new environments are clean", () => {
      let env_a = runtime.newEnv();
      env_a["abc"] = 5;
      expect(runtime.newEnv()).not.to.have.property("abc");
    });
    it("contains false", () => {
      expect(runtime.newEnv()["false"]).to.be.false;
    });
    it("contains true", () => {
      expect(runtime.newEnv()["true"]).to.be.true;
    });
  });

  describe("Operators", () => {
    describe("+", () => {
      it("works with positive integers", () => {
        expect(runtime.newEnv()["+"](10, 5)).to.deep.equal(15);
      });
      it("works with negative integers", () => {
        expect(runtime.newEnv()["+"](-10, 5)).to.deep.equal(-5);
      });
    });
    describe("-", () => {
      it("works with positive integers", () => {
        expect(runtime.newEnv()["-"](10, 5)).to.deep.equal(5);
      });
      it("works with negative integers", () => {
        expect(runtime.newEnv()["-"](-10, 5)).to.deep.equal(-15);
      });
    });
    describe("*", () => {
      it("works with positive integers", () => {
        expect(runtime.newEnv()["*"](10, 5)).to.deep.equal(50);
      });
      it("works with negative integers", () => {
        expect(runtime.newEnv()["*"](-10, 5)).to.deep.equal(-50);
      });
    });
    describe("/", () => {
      it("works with positive integers", () => {
        expect(runtime.newEnv()["/"](10, 5)).to.deep.equal(2);
      });
      it("works with negative integers", () => {
        expect(runtime.newEnv()["/"](-10, 5)).to.deep.equal(-2);
      });
    });
    describe("==", () => {
      it("works with equal integers", () => {
        expect(runtime.newEnv()["=="](10, 10)).to.be.true;
      });
      it("works with different integers", () => {
        expect(runtime.newEnv()["=="](-10, 10)).to.be.false;
      });
      it("works with equal strings", () => {
        expect(runtime.newEnv()["=="]("abc", "abc")).to.be.true;
      });
      it("works with different strings", () => {
        expect(runtime.newEnv()["=="]("abc", "def")).to.be.false;
      });
      it("works with equal booleans", () => {
        expect(runtime.newEnv()["=="](true, true)).to.be.true;
      });
      it("works with different booleans", () => {
        expect(runtime.newEnv()["=="](true, false)).to.be.false;
      });
    });
    describe("!=", () => {
      it("works with equal integers", () => {
        expect(runtime.newEnv()["!="](10, 10)).to.be.false;
      });
      it("works with different integers", () => {
        expect(runtime.newEnv()["!="](-10, 10)).to.be.true;
      });
      it("works with equal strings", () => {
        expect(runtime.newEnv()["!="]("abc", "abc")).to.be.false;
      });
      it("works with different strings", () => {
        expect(runtime.newEnv()["!="]("abc", "def")).to.be.true;
      });
      it("works with equal booleans", () => {
        expect(runtime.newEnv()["!="](true, true)).to.be.false;
      });
      it("works with different booleans", () => {
        expect(runtime.newEnv()["!="](true, false)).to.be.true;
      });
    });
    describe("<", () => {
      it("works with positive integers", () => {
        expect(runtime.newEnv()["<"](10, 5)).to.be.false;
      });
      it("works with negative integers", () => {
        expect(runtime.newEnv()["<"](-10, 5)).to.be.true;
      });
    });
    describe("<=", () => {
      it("works with equal positive integers", () => {
        expect(runtime.newEnv()["<="](10, 10)).to.be.true;
      });
      it("works with different positive integers", () => {
        expect(runtime.newEnv()["<="](10, 5)).to.be.false;
      });
      it("works with equal negative integers", () => {
        expect(runtime.newEnv()["<="](-10, -10)).to.be.true;
      });
      it("works with different negative integers", () => {
        expect(runtime.newEnv()["<="](10, -5)).to.be.false;
      });
    });
    describe(">", () => {
      it("works with positive integers", () => {
        expect(runtime.newEnv()[">"](10, 5)).to.be.true;
      });
      it("works with negative integers", () => {
        expect(runtime.newEnv()[">"](-10, 5)).to.be.false;
      });

    });
    describe(">=", () => {
      it("works with equal positive integers", () => {
        expect(runtime.newEnv()[">="](10, 10)).to.be.true;
      });
      it("works with different positive integers", () => {
        expect(runtime.newEnv()[">="](5, 10)).to.be.false;
      });
      it("works with equal negative integers", () => {
        expect(runtime.newEnv()[">="](-10, -10)).to.be.true;
      });
      it("works with different negative integers", () => {
        expect(runtime.newEnv()[">="](-10, 5)).to.be.false;
      });
    });
  });

  describe("Special funcions", () => {
    describe("Array", () => {
      describe("Constructor", () => {
        it("creates empty arrays", () => {
          expect(runtime.newEnv()["array"]()).to.deep.equal([]);
        });
        it("creates arrays with different kinds of elements", () => {
          expect(runtime.newEnv()["array"](5, -10, "abc", false)).to.deep.equal([5, -10, "abc", false]);
        });
        it("creates nested arrays", () => {
          let arr = runtime.newEnv()["array"];
          expect(arr(arr(1, 2, 3), arr("abc", "def", "efg"), arr(true, false, true))).to.deep.equal([[1, 2, 3], ["abc", "def", "efg"], [true, false, true]]);
        });
      });
      describe("Length", () => {
        it("calculates the length of empty arrays", () => {
          let env = runtime.newEnv();
          expect(env["length"](env["array"]())).to.deep.equal(0);
        });
        it("calculates the length of arrays with different kinds of elements", () => {
          let env = runtime.newEnv();
          expect(env["length"](env["array"](5, -10, "abc", false))).to.deep.equal(4);
        });
        it("calculates the length of nested arrays", () => {
          let env = runtime.newEnv();
          expect(env["length"](env["array"](env["array"](1, 2), env["array"]("abc", "def"), env["array"](true, false)))).to.deep.equal(3);
        });
      });
      describe("Get", () => {
        it("requires the index to be valid", () => {
          let env = runtime.newEnv();
          expect(() => env["get"](env["array"](1, 2, 3), 5)).to.throw(ReferenceError);
        });
        it("returns the element at the index", () => {
          let env = runtime.newEnv();
          expect(env["get"](env["array"](1, 2, 3), 1)).to.deep.equal(2);
        });
        it("returns the element at the index on nested arrays", () => {
          let env = runtime.newEnv();
          expect(env["get"](env["get"](env["array"](env["array"](1, 2), env["array"]("abc", "def"), env["array"](true, false)), 1), 0)).to.deep.equal("abc");
        });
      });
    });
  });
});
