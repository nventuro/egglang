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

  describe("Functions", () => {
    it("doesn't evaluate non-existent functions", () => {
      let env = {};
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "abc"}, args: []}, env)).to.throw(ReferenceError);
    });
    it("doesn't evaluate non-functions", () => {
      let env = {"abc": 5};
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "abc"}, args: []}, env)).to.throw(TypeError);
    });
    it("returns a value", () => {
      let env = {"foo": () => 5};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "foo"}, args: []}, env)).to.deep.equal(5);
    });
    it("evaluates nested functions", () => {
      let env = {"foo": () => 5, "bar": (a) => 3 + a};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "bar"}, args: [{type: "apply", operator: {type: "word", name: "foo"}, args: []}]}, env)).to.deep.equal(8);
    });
  });

  describe("Variables", () => {
    it("doesn't evaluate non-existent variables", () => {
      let env = {};
      expect(() => evaluator.evaluate({type: "word", name: "abc"}, env)).to.throw(ReferenceError);
    });
    it("evaluates numeric variables", () => {
      let env = {"abc": 5};
      expect(evaluator.evaluate({type: "word", name: "abc"}, env)).to.deep.equal(5);
    });
    it("evaluates string variables", () => {
      let env = {"abc": "def"};
      expect(evaluator.evaluate({type: "word", name: "abc"}, env)).to.deep.equal("def");
    });
    it("evaluates boolean variables", () => {
      let env = {"abc": true};
      expect(evaluator.evaluate({type: "word", name: "abc"}, env)).to.deep.equal(true);
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
      let env = {"abc": 5};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "def"}, {type: "word", name: "abc"}]}, env);
      expect(env["def"]).to.deep.equal(5);
    });
    describe("Numeric", () => {
      it("stores numeric variables", () => {
        let env = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, env);
        expect(env["abc"]).to.deep.equal(5);
      });
      it("modifies numeric variables", () => {
        let env = {abc: 3};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, env);
        expect(env["abc"]).to.deep.equal(5);
      });
    });
    describe("String", () => {
      it("stores numeric variables", () => {
        let env = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: "def"}]}, env);
        expect(env["abc"]).to.deep.equal("def");
      });
      it("modifies numeric variables", () => {
        let env = {abc: "def"};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: "ghi"}]}, env);
        expect(env["abc"]).to.deep.equal("ghi");
      });
    });
    describe("Boolean", () => {
      it("stores boolean variables", () => {
        let env = {};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: true}]}, env);
        expect(env["abc"]).to.deep.equal(true);
      });
      it("modifies boolean variables", () => {
        let env = {abc: false};
        evaluator.evaluate({type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: true}]}, env);
        expect(env["abc"]).to.deep.equal(true);
      });
    });
  });

  describe("Do", () => {
    it("requires at least one expression", () => {
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: []})).to.throw(SyntaxError);
    });
    it("evaluates all expressions", () => {
      let env = {};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: [
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]},
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "def"}, {type: "value", value: 3}]}
      ]}, env);
      expect(env["abc"]).to.deep.equal(5);
      expect(env["def"]).to.deep.equal(3);
    });
    it("evaluates to the last expression", () => {
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "do"}, args: [
        {type: "value", value: 5},
        {type: "value", value: 3},
      ]})).to.deep.equal(3);
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
      let env = {};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "while"}, args: [{type: "value", value: false},
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}]}, env);
      expect(env).not.to.have.property("abc");
    });
    it("evaluates the body until true", () => {
      let env = {"count": 5, "sum": 0};
      ["+", "-", ">"].forEach(function(op) {
        env[op] = new Function("a, b", "return a " + op + " b;");
      });

      // while (count > 0) {sum += count, count -= 1}
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "while"}, args: [{type: "apply", operator: {type: "word", name: ">"}, args: [{type: "word", name: "count"}, {type: "value", value: 0}]},
        {type: "apply", operator: {type: "word", name: "do"}, args: [
          {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "sum"}, {type: "apply", operator: {type: "word", name: "+"}, args: [
            {type: "word", name: "sum"},
            {type: "word", name: "count"}
          ]}]},
          {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "count"}, {type: "apply", operator: {type: "word", name: "-"}, args: [
            {type: "word", name: "count"},
            {type: "value", value: 1}
          ]}]}
        ]}]}, env);

      expect(env["count"]).to.deep.equal(0);
      expect(env["sum"]).to.deep.equal(15);
    });
  });

  describe("Fun", () => {
    it("creates simple functions", () => {
      let env = {};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "value", value: 5}]}, env)()).to.deep.equal(5);
    });
    it("functions can access the environment", () => {
      let env = {"abc": 5};
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "word", name: "abc"}]}, env)()).to.deep.equal(5);
    });
    it("creates closures", () => {
      let env = {};
      // (x) => (() => x)
      expect(evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "word", name: "x"},
        {type: "apply", operator: {type: "word", name: "fun"}, args: [{type: "word", name: "x"}]}
      ]}, env)(5)()).to.deep.equal(5);
    });
    it("creates a local environment", () => {
      let env = {};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, env)();
      expect(env).not.to.have.property("abc");
    });
    it("doesn't modify outer variables on name collisions", () => {
      let env = {"abc": 3};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [
        {type: "apply", operator: {type: "word", name: "define"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, env)();
      expect(env["abc"]).to.deep.equal(3);
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
      let env = {};
      expect(() => evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}, env)).to.throw(ReferenceError);
    });
    it("takes variables as values", () => {
      let env = {"abc": 5, "def": 3};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "def"}, {type: "word", name: "abc"}]}, env);
      expect(env["def"]).to.deep.equal(5);
    });
    it("modifies outer environment variables", () => {
      let env = {"abc": 3};
      evaluator.evaluate({type: "apply", operator: {type: "word", name: "fun"}, args: [
        {type: "apply", operator: {type: "word", name: "set"}, args: [{type: "word", name: "abc"}, {type: "value", value: 5}]}
      ]}, env)();
      expect(env["abc"]).to.deep.equal(5);
    });
  });
});
