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
});
