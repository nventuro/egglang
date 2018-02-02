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
        expect(evaluator.evaluate({type: "value", value: true})).to.be.true;
      });
      it("evaluates false as false", () => {
        expect(evaluator.evaluate({type: "value", value: false})).to.be.false;
      });
      it("doesn't evaluate 0 as false", () => {
        expect(evaluator.evaluate({type: "value", value: 0})).not.to.be.false;
      });
      it("doesn't evaluate the empty string as false", () => {
        expect(evaluator.evaluate({type: "value", value: ""})).not.to.be.false;
      });
    });
  });

  describe("Functions", () => {
    it("doesn't evaluate non-existent functions", () => {
      let scope = {};
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "abc"}, args: []}, scope)).to.throw(ReferenceError);
    });
    it("doesn't evaluate non-functions", () => {
      let scope = {"abc": 5};
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "abc"}, args: []}, scope)).to.throw(TypeError);
    });
    it("returns a value", () => {
      let scope = {"foo": () => 5};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "foo"}, args: []}, scope)).to.deep.equal(5);
    });
    it("evaluates nested functions", () => {
      let scope = {"foo": () => 5, "bar": (a) => 3 + a};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "bar"}, args: [{type: "apply", operator: {type: "word", name: "foo"}, args: []}]}, scope)).to.deep.equal(8);
    });
  });

  describe("Variables", () => {
    it("doesn't evaluate non-existent variables", () => {
      let scope = {};
      expect(() => evaluator.evaluate({type: "word", name: "abc"}, scope)).to.throw(ReferenceError);
    });
    it("evaluates numeric variables", () => {
      let scope = {"abc": 5};
      expect(evaluator.evaluate({type: "word", name: "abc"}, scope)).to.deep.equal(5);
    });
    it("evaluates string variables", () => {
      let scope = {"abc": "def"};
      expect(evaluator.evaluate({type: "word", name: "abc"}, scope)).to.deep.equal("def");
    });
    it("evaluates boolean variables", () => {
      let scope = {"abc": true};
      expect(evaluator.evaluate({type: "word", name: "abc"}, scope)).to.be.true;
    });
  });

  describe("Define", () => {
    it("takes only one variable", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "word", name: "def"}, {type: "value", value: 5}]})).to.throw(SyntaxError);
    });
    it("takes only one value", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}, {type: "value", value: 3}]})).to.throw(SyntaxError);
    });
    it("takes variables as values", () => {
      let scope = {"abc": 5};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "def"}, {type: "word", name: "abc"}]}, scope);
      expect(scope["def"]).to.deep.equal(5);
    });
    it("cannot be used on variables already existing in the local scope", () => {
      let scope = {"abc": 3};
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, scope)).to.throw(ReferenceError);
    });
    it("creates new variales on outer scope name collisions", () => {
      let outerScope = {"abc": 3};
      let scope = Object.create(outerScope);
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, scope);
      expect(outerScope["abc"]).to.deep.equal(3);
      expect(scope["abc"]).to.deep.equal(5);
    });
    describe("Numeric", () => {
      it("stores numeric variables", () => {
        let scope = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, scope);
        expect(scope["abc"]).to.deep.equal(5);
      });
    });
    describe("String", () => {
      it("stores numeric variables", () => {
        let scope = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: "def"}]}, scope);
        expect(scope["abc"]).to.deep.equal("def");
      });
    });
    describe("Boolean", () => {
      it("stores boolean variables", () => {
        let scope = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: true}]}, scope);
        expect(scope["abc"]).to.be.true;
      });
    });
  });

  describe("Set", () => {
    it("takes only one variable", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "word", name: "def"}, {type: "value", value: 5}]})).to.throw(SyntaxError);
    });
    it("takes only one value", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}, {type: "value", value: 3}]})).to.throw(SyntaxError);
    });
    it("requires the variable to exist", () => {
      let scope = {};
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, scope)).to.throw(ReferenceError);
    });
    it("takes variables as values", () => {
      let scope = {"abc": 5, "def": 3};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "def"}, {type: "word", name: "abc"}]}, scope);
      expect(scope["def"]).to.deep.equal(5);
    });
    it("modifies outer scope variables", () => {
      let scope = {"abc": 3};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [
        {type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, scope)();
      expect(scope["abc"]).to.deep.equal(5);
    });
    describe("Numeric", () => {
      it("modifies numeric variables", () => {
        let scope = {abc: 3};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, scope);
        expect(scope["abc"]).to.deep.equal(5);
      });
    });
    describe("String", () => {
      it("modifies numeric variables", () => {
        let scope = {abc: "def"};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: "ghi"}]}, scope);
        expect(scope["abc"]).to.deep.equal("ghi");
      });
    });
    describe("Boolean", () => {
      it("modifies boolean variables", () => {
        let scope = {abc: false};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: true}]}, scope);
        expect(scope["abc"]).to.be.true;
      });
    });
  });

  describe("Do", () => {
    it("requires at least one expression", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: []})).to.throw(SyntaxError);
    });
    it("creates a local scope", () => {
      let scope = {};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: [
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, scope);
      expect(scope).not.to.have.property("abc");
    });
    it("doesn't modify the outer scope on name collisions", () => {
      let scope = {"abc": 3};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: [
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, scope);
      expect(scope["abc"]).to.deep.equal(3);
    });
    it("evaluates all expressions", () => {
      let scope = {"abc": 1, "def": 2};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: [
        {type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]},
        {type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "def"}, {type: "value", value: 3}]}
      ]}, scope);
      expect(scope["abc"]).to.deep.equal(5);
      expect(scope["def"]).to.deep.equal(3);
    });
    it("evaluates to the last expression", () => {
      let scope = {};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: [
        {type: "value", value: 5},
        {type: "value", value: 3},
      ]}, scope)).to.deep.equal(3);
    });
  });

  describe("If", () => {
    it("requires two expressions", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "if"}, args: [{type: "value", value: false}, {type: "value", value: 5}]})).to.throw(SyntaxError);
    });
    it("evaluates the first expression when true", () => {
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "if"}, args: [{type: "value", value: true}, {type: "value", value: 5}, {type: "value", value: -5}]})).to.deep.equal(5);
    });
    it("evaluates the second expression when false", () => {
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "if"}, args: [{type: "value", value: false}, {type: "value", value: 5}, {type: "value", value: -5}]})).to.deep.equal(-5);
    });
  });

  describe("While", () => {
    it("requires a body", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "while"}, args: [{type: "value", value: false}]})).to.throw(SyntaxError);
    });
    it("doesn't take multiple bodies", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "while"}, args: [{type: "value", value: false},
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]},
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "def"}, {type: "value", value: -5}]}]}))
        .to.throw(SyntaxError);
    });
    it("doesn't evaluate the body when false", () => {
      let scope = {};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "while"}, args: [{type: "value", value: false},
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}]}, scope);
      expect(scope).not.to.have.property("abc");
    });
    it("evaluates the body until true", () => {
      let scope = {"count": 5, "sum": 0};
      ["+", "-", ">"].forEach(function(op) {
        scope[op] = new Function("a, b", "return a " + op + " b;");
      });

      // while (count > 0) {sum += count, count -= 1}
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "while"}, args: [{type: "apply", operator: {type: "word", name: ">"}, args: [{type: "word", name: "count"}, {type: "value", value: 0}]},
        {type: "apply", operator: {type: "word", name: "do"}, args: [
          {type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "sum"}, {type: "apply", operator: {type: "word", name: "+"}, args: [
            {type: "word", name: "sum"},
            {type: "word", name: "count"}
          ]}]},
          {type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "count"}, {type: "apply", operator: {type: "word", name: "-"}, args: [
            {type: "word", name: "count"},
            {type: "value", value: 1}
          ]}]}
        ]}]}, scope);

      expect(scope["count"]).to.deep.equal(0);
      expect(scope["sum"]).to.deep.equal(15);
    });
  });

  describe("Fun", () => {
    it("creates simple functions", () => {
      let scope = {};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "value", value: 5}]}, scope)()).to.deep.equal(5);
    });
    it("functions can access the outer scope", () => {
      let scope = {"abc": 5};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "word", name: "abc"}]}, scope)()).to.deep.equal(5);
    });
    it("creates closures", () => {
      let scope = {};
      // (x) => (() => x)
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "word", name: "x"},
        {type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "word", name: "x"}]}
      ]}, scope)(5)()).to.deep.equal(5);
    });
    it("creates a local scope", () => {
      let scope = {};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, scope)();
      expect(scope).not.to.have.property("abc");
    });
    it("doesn't modify the outer scope on name collisions", () => {
      let scope = {"abc": 3};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, scope)();
      expect(scope["abc"]).to.deep.equal(3);
    });
  });
});
