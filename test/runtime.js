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
    describe("%", () => {
      it("works with positive integers", () => {
        expect(runtime.newEnv()["%"](13, 5)).to.deep.equal(3);
      });
      it("works with negative integers", () => {
        expect(runtime.newEnv()["%"](-9, 5)).to.deep.equal(-4);
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
    describe("array", () => {
      describe("Constructor", () => {
        it("creates empty arrays", () => {
          expect(runtime.newEnv()["array"]()).to.deep.equal([]);
        });
        it("creates arrays with different kinds of elements", () => {
          expect(runtime.newEnv()["array"](5, -10, "abc", false)).to.deep.equal([5, -10, "abc", false]);
        });
        it("creates nested arrays", () => {
          let arr = runtime.newEnv()["array"];
          expect(arr(arr(1, 2, 3), arr("abc", "def", "ghi"), arr(true, false, true))).to.deep.equal([[1, 2, 3], ["abc", "def", "ghi"], [true, false, true]]);
        });
      });
      describe("length", () => {
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
          let arr = env["array"];
          expect(env["length"](arr(arr(1, 2), arr("abc", "def"), arr(true, false)))).to.deep.equal(3);
        });
      });
      describe("get", () => {
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
      describe("push", () => {
        it("requires the element to be provided", () => {
          let env = runtime.newEnv();
          expect(() => env["push"](env["array"](1, 2, 3))).to.throw(SyntaxError);
        });
        it("doesn't take more than one element", () => {
          let env = runtime.newEnv();
          expect(() => env["push"](env["array"](1, 2, 3), 4, 5)).to.throw(SyntaxError);
        });
        it("returns a modified array", () => {
          let env = runtime.newEnv();
          expect(env["push"](env["array"](1, 2, 3), 4)).to.deep.equal([1, 2, 3, 4]);
        });
        it("modifies the original array", () => {
          let env = runtime.newEnv();
          env["arr"] = env["array"](1, 2, 3);
          env["push"](env["arr"], 4);
          expect(env["arr"]).to.deep.equal([1, 2, 3, 4]);
        });
        it("can create nested arrays", () => {
          let env = runtime.newEnv();
          expect(env["push"](env["array"](1, 2, 3), env["array"](4, 5, 6))).to.deep.equal([1, 2, 3, [4, 5, 6]]);
        });
      });
    });

    describe("dict", () => {
      describe("Constructor", () => {
        it("creates empty dicts", () => {
          expect(runtime.newEnv()["dict"]()).to.deep.equal({});
        });
        it("requires keys and values", () => {
          expect(() => runtime.newEnv()["dict"]("key")).to.throw(SyntaxError);
        });
        it("creates dicts with different kinds of keys and values", () => {
          expect(runtime.newEnv()["dict"](5, "abc", "def", false)).to.deep.equal({5: "abc", "def": false});
        });
        it("creates nested dicts", () => {
          let dict = runtime.newEnv()["dict"];
          expect(dict(1, dict(1, 2, 3, 4), "abc", dict("def", "ghi"), true, dict(true, false))).to.deep.equal({1: {1: 2, 3: 4}, "abc": {"def": "ghi"}, true: {true: false}});
        });
      });
      describe("length", () => {
        it("calculates the length of empty dicts", () => {
          let env = runtime.newEnv();
          expect(env["length"](env["dict"]())).to.deep.equal(0);
        });
        it("calculates the length of arrays with different kinds of elements", () => {
          let env = runtime.newEnv();
          expect(env["length"](env["dict"](5, "abc", "def", false))).to.deep.equal(2);
        });
        it("calculates the length of nested arrays", () => {
          let env = runtime.newEnv();
          let dict = env["dict"];
          expect(env["length"](dict(1, dict(1, 2, 3, 4), "abc", dict("def", "ghi"), true, dict(true, false)))).to.deep.equal(3);
        });
      });
      describe("get", () => {
        it("requires the key to exist", () => {
          let env = runtime.newEnv();
          expect(() => env["get"](env["dict"](1, 5, 2, 8), 5)).to.throw(ReferenceError);
        });
        it("returns the associated value", () => {
          let env = runtime.newEnv();
          expect(env["get"](env["dict"]("abc", 1, 2, "def"), 2)).to.deep.equal("def");
        });
        it("returns the associated value on nested dicts", () => {
          let env = runtime.newEnv();
          let dict = env["dict"];
          expect(env["get"](env["get"](dict("abc", dict(2, 1, 8, 5), "def", dict("abc", "def"), 8, dict(true, false)), "abc"), 8)).to.deep.equal(5);
        });
      });
      describe("push", () => {
        it("requires the key value pair to be provided", () => {
          let env = runtime.newEnv();
          expect(() => env["push"](env["dict"](1, 2))).to.throw(SyntaxError);
        });
        it("returns a modified dict", () => {
          let env = runtime.newEnv();
          expect(env["push"](env["dict"](1, 2), 3, 4)).to.deep.equal({1: 2, 3: 4});
        });
        it("modifies the original dict", () => {
          let env = runtime.newEnv();
          env["di"] = env["dict"](1, 2);
          env["push"](env["di"], 3, 4);
          expect(env["di"]).to.deep.equal({1: 2, 3: 4});
        });
        it("can create nested dicts", () => {
          let env = runtime.newEnv();
          expect(env["push"](env["dict"](1, 2), 3, env["dict"](4, 5))).to.deep.equal({1: 2, 3: {4: 5}});
        });
      });
    });
  });
});
