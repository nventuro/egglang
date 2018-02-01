const runtime = require("../src/runtime");
const expect = require("chai").expect;

describe("Runtime", () => {
  describe("Environment", () => {
    it("creates new scopes", () => {
      expect(runtime.newScope()).not.to.equal(runtime.newScope());
    });
    it("new scopes are clean", () => {
      let scope = runtime.newScope();
      scope["abc"] = 5;
      expect(runtime.newScope()).not.to.have.property("abc");
    });
    it("contains false", () => {
      expect(runtime.newScope()["false"]).to.be.false;
    });
    it("contains true", () => {
      expect(runtime.newScope()["true"]).to.be.true;
    });
  });

  describe("Operators", () => {
    describe("+", () => {
      it("works with positive integers", () => {
        expect(runtime.newScope()["+"](10, 5)).to.deep.equal(15);
      });
      it("works with negative integers", () => {
        expect(runtime.newScope()["+"](-10, 5)).to.deep.equal(-5);
      });
    });
    describe("-", () => {
      it("works with positive integers", () => {
        expect(runtime.newScope()["-"](10, 5)).to.deep.equal(5);
      });
      it("works with negative integers", () => {
        expect(runtime.newScope()["-"](-10, 5)).to.deep.equal(-15);
      });
    });
    describe("*", () => {
      it("works with positive integers", () => {
        expect(runtime.newScope()["*"](10, 5)).to.deep.equal(50);
      });
      it("works with negative integers", () => {
        expect(runtime.newScope()["*"](-10, 5)).to.deep.equal(-50);
      });
    });
    describe("/", () => {
      it("works with positive integers", () => {
        expect(runtime.newScope()["/"](10, 5)).to.deep.equal(2);
      });
      it("works with negative integers", () => {
        expect(runtime.newScope()["/"](-10, 5)).to.deep.equal(-2);
      });
    });
    describe("%", () => {
      it("works with positive integers", () => {
        expect(runtime.newScope()["%"](13, 5)).to.deep.equal(3);
      });
      it("works with negative integers", () => {
        expect(runtime.newScope()["%"](-9, 5)).to.deep.equal(-4);
      });
    });
    describe("==", () => {
      it("works with equal integers", () => {
        expect(runtime.newScope()["=="](10, 10)).to.be.true;
      });
      it("works with different integers", () => {
        expect(runtime.newScope()["=="](-10, 10)).to.be.false;
      });
      it("works with equal strings", () => {
        expect(runtime.newScope()["=="]("abc", "abc")).to.be.true;
      });
      it("works with different strings", () => {
        expect(runtime.newScope()["=="]("abc", "def")).to.be.false;
      });
      it("works with equal booleans", () => {
        expect(runtime.newScope()["=="](true, true)).to.be.true;
      });
      it("works with different booleans", () => {
        expect(runtime.newScope()["=="](true, false)).to.be.false;
      });
    });
    describe("!=", () => {
      it("works with equal integers", () => {
        expect(runtime.newScope()["!="](10, 10)).to.be.false;
      });
      it("works with different integers", () => {
        expect(runtime.newScope()["!="](-10, 10)).to.be.true;
      });
      it("works with equal strings", () => {
        expect(runtime.newScope()["!="]("abc", "abc")).to.be.false;
      });
      it("works with different strings", () => {
        expect(runtime.newScope()["!="]("abc", "def")).to.be.true;
      });
      it("works with equal booleans", () => {
        expect(runtime.newScope()["!="](true, true)).to.be.false;
      });
      it("works with different booleans", () => {
        expect(runtime.newScope()["!="](true, false)).to.be.true;
      });
    });
    describe("<", () => {
      it("works with positive integers", () => {
        expect(runtime.newScope()["<"](10, 5)).to.be.false;
      });
      it("works with negative integers", () => {
        expect(runtime.newScope()["<"](-10, 5)).to.be.true;
      });
    });
    describe("<=", () => {
      it("works with equal positive integers", () => {
        expect(runtime.newScope()["<="](10, 10)).to.be.true;
      });
      it("works with different positive integers", () => {
        expect(runtime.newScope()["<="](10, 5)).to.be.false;
      });
      it("works with equal negative integers", () => {
        expect(runtime.newScope()["<="](-10, -10)).to.be.true;
      });
      it("works with different negative integers", () => {
        expect(runtime.newScope()["<="](10, -5)).to.be.false;
      });
    });
    describe(">", () => {
      it("works with positive integers", () => {
        expect(runtime.newScope()[">"](10, 5)).to.be.true;
      });
      it("works with negative integers", () => {
        expect(runtime.newScope()[">"](-10, 5)).to.be.false;
      });

    });
    describe(">=", () => {
      it("works with equal positive integers", () => {
        expect(runtime.newScope()[">="](10, 10)).to.be.true;
      });
      it("works with different positive integers", () => {
        expect(runtime.newScope()[">="](5, 10)).to.be.false;
      });
      it("works with equal negative integers", () => {
        expect(runtime.newScope()[">="](-10, -10)).to.be.true;
      });
      it("works with different negative integers", () => {
        expect(runtime.newScope()[">="](-10, 5)).to.be.false;
      });
    });
  });

  describe("Special funcions", () => {
    describe("array", () => {
      describe("Constructor", () => {
        it("creates empty arrays", () => {
          expect(runtime.newScope()["array"]()).to.deep.equal([]);
        });
        it("creates arrays with different kinds of elements", () => {
          expect(runtime.newScope()["array"](5, -10, "abc", false)).to.deep.equal([5, -10, "abc", false]);
        });
        it("creates nested arrays", () => {
          let arr = runtime.newScope()["array"];
          expect(arr(arr(1, 2, 3), arr("abc", "def", "ghi"), arr(true, false, true))).to.deep.equal([[1, 2, 3], ["abc", "def", "ghi"], [true, false, true]]);
        });
      });
      describe("length", () => {
        it("calculates the length of empty arrays", () => {
          let scope = runtime.newScope();
          expect(scope["length"](scope["array"]())).to.deep.equal(0);
        });
        it("calculates the length of arrays with different kinds of elements", () => {
          let scope = runtime.newScope();
          expect(scope["length"](scope["array"](5, -10, "abc", false))).to.deep.equal(4);
        });
        it("calculates the length of nested arrays", () => {
          let scope = runtime.newScope();
          let arr = scope["array"];
          expect(scope["length"](arr(arr(1, 2), arr("abc", "def"), arr(true, false)))).to.deep.equal(3);
        });
      });
      describe("get", () => {
        it("requires the index to be valid", () => {
          let scope = runtime.newScope();
          expect(() => scope["get"](scope["array"](1, 2, 3), 5)).to.throw(ReferenceError);
        });
        it("returns the element at the index", () => {
          let scope = runtime.newScope();
          expect(scope["get"](scope["array"](1, 2, 3), 1)).to.deep.equal(2);
        });
        it("returns the element at the index on nested arrays", () => {
          let scope = runtime.newScope();
          expect(scope["get"](scope["get"](scope["array"](scope["array"](1, 2), scope["array"]("abc", "def"), scope["array"](true, false)), 1), 0)).to.deep.equal("abc");
        });
      });
      describe("push", () => {
        it("requires the element to be provided", () => {
          let scope = runtime.newScope();
          expect(() => scope["push"](scope["array"](1, 2, 3))).to.throw(SyntaxError);
        });
        it("doesn't take more than one element", () => {
          let scope = runtime.newScope();
          expect(() => scope["push"](scope["array"](1, 2, 3), 4, 5)).to.throw(SyntaxError);
        });
        it("returns a modified array", () => {
          let scope = runtime.newScope();
          expect(scope["push"](scope["array"](1, 2, 3), 4)).to.deep.equal([1, 2, 3, 4]);
        });
        it("modifies the original array", () => {
          let scope = runtime.newScope();
          scope["arr"] = scope["array"](1, 2, 3);
          scope["push"](scope["arr"], 4);
          expect(scope["arr"]).to.deep.equal([1, 2, 3, 4]);
        });
        it("can create nested arrays", () => {
          let scope = runtime.newScope();
          expect(scope["push"](scope["array"](1, 2, 3), scope["array"](4, 5, 6))).to.deep.equal([1, 2, 3, [4, 5, 6]]);
        });
      });
    });

    describe("dict", () => {
      describe("Constructor", () => {
        it("creates empty dicts", () => {
          expect(runtime.newScope()["dict"]()).to.deep.equal({});
        });
        it("requires keys and values", () => {
          expect(() => runtime.newScope()["dict"]("key")).to.throw(SyntaxError);
        });
        it("creates dicts with different kinds of keys and values", () => {
          expect(runtime.newScope()["dict"](5, "abc", "def", false)).to.deep.equal({5: "abc", "def": false});
        });
        it("creates nested dicts", () => {
          let dict = runtime.newScope()["dict"];
          expect(dict(1, dict(1, 2, 3, 4), "abc", dict("def", "ghi"), true, dict(true, false))).to.deep.equal({1: {1: 2, 3: 4}, "abc": {"def": "ghi"}, true: {true: false}});
        });
      });
      describe("length", () => {
        it("calculates the length of empty dicts", () => {
          let scope = runtime.newScope();
          expect(scope["length"](scope["dict"]())).to.deep.equal(0);
        });
        it("calculates the length of arrays with different kinds of elements", () => {
          let scope = runtime.newScope();
          expect(scope["length"](scope["dict"](5, "abc", "def", false))).to.deep.equal(2);
        });
        it("calculates the length of nested arrays", () => {
          let scope = runtime.newScope();
          let dict = scope["dict"];
          expect(scope["length"](dict(1, dict(1, 2, 3, 4), "abc", dict("def", "ghi"), true, dict(true, false)))).to.deep.equal(3);
        });
      });
      describe("get", () => {
        it("requires the key to exist", () => {
          let scope = runtime.newScope();
          expect(() => scope["get"](scope["dict"](1, 5, 2, 8), 5)).to.throw(ReferenceError);
        });
        it("returns the associated value", () => {
          let scope = runtime.newScope();
          expect(scope["get"](scope["dict"]("abc", 1, 2, "def"), 2)).to.deep.equal("def");
        });
        it("returns the associated value on nested dicts", () => {
          let scope = runtime.newScope();
          let dict = scope["dict"];
          expect(scope["get"](scope["get"](dict("abc", dict(2, 1, 8, 5), "def", dict("abc", "def"), 8, dict(true, false)), "abc"), 8)).to.deep.equal(5);
        });
      });
      describe("push", () => {
        it("requires the key value pair to be provided", () => {
          let scope = runtime.newScope();
          expect(() => scope["push"](scope["dict"](1, 2))).to.throw(SyntaxError);
        });
        it("returns a modified dict", () => {
          let scope = runtime.newScope();
          expect(scope["push"](scope["dict"](1, 2), 3, 4)).to.deep.equal({1: 2, 3: 4});
        });
        it("modifies the original dict", () => {
          let scope = runtime.newScope();
          scope["di"] = scope["dict"](1, 2);
          scope["push"](scope["di"], 3, 4);
          expect(scope["di"]).to.deep.equal({1: 2, 3: 4});
        });
        it("can create nested dicts", () => {
          let scope = runtime.newScope();
          expect(scope["push"](scope["dict"](1, 2), 3, scope["dict"](4, 5))).to.deep.equal({1: 2, 3: {4: 5}});
        });
      });
    });
  });
});
