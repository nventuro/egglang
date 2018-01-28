const evaluator = require("../src/evaluator");
const expect = require("chai").expect;

describe("Evaluator", () => {
  describe("Constants", () => {
    describe("Numeric", () => {
      it("correctly evaluates zero", () => {
        expect(evaluator.evaluate({type: "value", value: 0})).to.deep.equal(0);
      });
      it("correctly evaluates small positive integers", () => {
        expect(evaluator.evaluate({type: "value", value: 5})).to.deep.equal(5);
      });
      it("correctly evaluates large positive integers", () => {
        expect(evaluator.evaluate({type: "value", value: 1152921504606846976})).to.deep.equal(1152921504606846976);
      });
      it("correctly evaluates small negative integers", () => {
        expect(evaluator.evaluate({type: "value", value: -5})).to.deep.equal(-5);
      });
      it("correctly evaluates large negative integers", () => {
        expect(evaluator.evaluate({type: "value", value: -1152921504606846976})).to.deep.equal(-1152921504606846976);
      });
    });
    describe("String", () => {
      it("correctly evaluates the empty string", () => {
        expect(evaluator.evaluate({type: "value", value: ""})).to.deep.equal("");
      });
      it("correctly evaluates simple strings", () => {
        expect(evaluator.evaluate({type: "value", value: "abc"})).to.deep.equal("abc");
      });
      it("correctly evaluates strings with single quotes", () => {
        expect(evaluator.evaluate({type: "value", value: "'abc'"})).to.deep.equal("'abc'");
      });
    });
    describe("Boolean", () => {
      it("evaluates true as true", () => {
        expect(evaluator.evaluate({type: "value", value: true})).to.deep.equal(true);
      });
      it("evaluates false as false", () => {
        expect(evaluator.evaluate({type: "value", value: false})).to.deep.equal(false);
      });
      it("doesn't evaluate 0 as false", () => {
        expect(evaluator.evaluate({type: "value", value: 0})).not.to.deep.equal(false);
      });
      it("doesn't evaluate the empty string as false", () => {
        expect(evaluator.evaluate({type: "value", value: ""})).not.to.deep.equal(false);
      });
    });
  });

  describe("Variables", () => {
    describe("Numeric", () => {
      it("stores numeric variables", () => {
        var env = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, env);
        expect(env["abc"]).to.deep.equal(5);
      });
      it("modifies numeric variables", () => {
        var env = {abc: 3};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, env);
        expect(env["abc"]).to.deep.equal(5);
      });
    });
    describe("String", () => {
      it("stores numeric variables", () => {
        var env = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: "def"}]}, env);
        expect(env["abc"]).to.deep.equal("def");
      });
      it("modifies numeric variables", () => {
        var env = {abc: "def"};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: "ghi"}]}, env);
        expect(env["abc"]).to.deep.equal("ghi");
      });
    });
    describe("Boolean", () => {
      it("stores boolean variables", () => {
        var env = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: true}]}, env);
        expect(env["abc"]).to.deep.equal(true);
      });
      it("modifies boolean variables", () => {
        var env = {abc: false};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: true}]}, env);
        expect(env["abc"]).to.deep.equal(true);
      });
    });

    it("doesn't access non-existent variables", () => {
      var env = {};
      expect(() => evaluator.evaluate({type: "word", name: "abc"}, env)).to.throw(ReferenceError);
    });
  });

  describe("Conditionals", () => {
    it("evaluates the first expression when true", () => {
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "if"}, args: [{type: "value", value: true}, {type: "value", value: 5}, {type: "value", value: -5}]})).to.deep.equal(5);
    });
    it("evaluates the second expression when false", () => {
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "if"}, args: [{type: "value", value: false}, {type: "value", value: 5}, {type: "value", value: -5}]})).to.deep.equal(-5);
    });
    it("requires two expressions", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "if"}, args: [{type: "value", value: false}, {type: "value", value: 5}]})).to.throw(SyntaxError);
    });
  });
});
