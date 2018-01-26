const parser = require("../src/parser");
const expect = require("chai").expect;

describe("Parser", () => {
  describe("String parser", () => {
    it("parses empty strings", () => {
      expect(parser.parse("\"\"")).to.deep.equal({type: "value", value: ""});
    });
    it("parses simple strings", () => {
      expect(parser.parse("\"abc\"")).to.deep.equal({type: "value", value: "abc"});
    });
    it("doesn't parse escape characters", () => {
      expect(parser.parse("\"abc\tabc\"")).not.to.deep.equal({type: "value", value: "abc\tabc"});
    });
    it("parses strings with single quotes", () => {
      expect(parser.parse("\"'abc'\"")).to.deep.equal({type: "value", value: "'abc'"});
    });
  });

  describe("Number parser", () => {
    it("parses zero", () => {
      expect(parser.parse("0")).to.deep.equal({type: "value", value: 0});
    });
    it("parses small positive integers", () => {
      expect(parser.parse("5")).to.deep.equal({type: "value", value: 5});
    });
    it("parses large positive integers", () => {
      expect(parser.parse("1152921504606846976")).to.deep.equal({type: "value", value: 1152921504606846976});
    });
    it("parses small negative integers", () => {
      expect(parser.parse("-5")).to.deep.equal({type: "value", value: -5});
    });
    it("parses large negative integers", () => {
      expect(parser.parse("-1152921504606846976")).to.deep.equal({type: "value", value: -1152921504606846976});
    });
    it("doesn't parse floating point numbers", () => {
      expect(() => parser.parse("5.5")).to.throw(SyntaxError);
    });
  });

  describe("Name parser", () => {
    it("doesn't parse empty names", () => {
      expect(() => parser.parse("")).to.throw(SyntaxError);
    });
    it("parses alphabetic names", () => {
      expect(parser.parse("abc")).to.deep.equal({type: "word", name: "abc"});
    });
    it("parses alphanumeric names", () => {
      expect(parser.parse("abc123")).to.deep.equal({type: "word", name: "abc123"});
    });
    it("parses names with special characters", () => {
      expect(parser.parse("abcABC123_-")).to.deep.equal({type: "word", name: "abcABC123_-"});
    });
    it("doesn't parse names beginning with a number", () => {
      expect(() => parser.parse("123abc")).to.throw();
    });
  });

  describe("Application parser", () => {
    it("doesn't parse anonymous appllications", () => {
      expect(() => parser.parse("()")).to.throw(SyntaxError);
    });
    it("parses applications with no parameters", () => {
      expect(parser.parse("abc()")).to.deep.equal({type: "apply", operator: {type: "word", "name": "abc"}, args: []});
    });
    it("parses applications with different types of parameters", () => {
      expect(parser.parse("abc(\"param\", 3, var)")).to.deep.equal({type: "apply", operator: {type: "word", "name": "abc"},
                                                                  args: [{type: "value", value: "param"}, {type: "value", value: 3}, {type: "word", "name": "var"}]});
    });
    it("parses nested applications", () => {
      expect(parser.parse("abc(def())")).to.deep.equal({type: "apply", operator: {type: "word", "name": "abc"},
                                                                  args: [{type: "apply", operator: {type: "word", "name": "def"}, args: []}]});
    });
    it("parses applied applications", () => {
      expect(parser.parse("abc()()")).to.deep.equal({type: "apply", operator: {type: "apply", operator: {type: "word", name: "abc"}, args: []}, args: []});
    });
  });
});

describe("Ignored characters remover", () => {
  describe("Whitespace remover", () => {
    it("removes empty lines", () => {
      expect(parser._removeIgnored("   ")).to.deep.equal("");
    });
    it("removes leading whitespace", () => {
      expect(parser._removeIgnored("   abc")).to.deep.equal("abc");
    });
    it("removes trailing whitespace", () => {
      expect(parser._removeIgnored("abc   ")).to.deep.equal("abc");
    });
    it("removes middle whitespace", () => {
      expect(parser._removeIgnored("ab    c")).to.deep.equal("abc");
    });
    it("removes newlines", () => {
      expect(parser._removeIgnored("ab\nc")).to.deep.equal("abc");
    });
    it("removes all whitespace characters", () => {
      expect(parser._removeIgnored("\n   ab \n  c   \n")).to.deep.equal("abc");
    });
  });

  describe("Comments remover", () => {
    it("removes trailing comments", () => {
      expect(parser._removeIgnored("abc#comment")).to.deep.equal("abc");
    });
    it("removes nested comments", () => {
      expect(parser._removeIgnored("abc#comment#abc")).to.deep.equal("abc");
    });
    it("removes comment lines", () => {
      expect(parser._removeIgnored("#comment")).to.deep.equal("");
    });
    it("removes multiline comments", () => {
      expect(parser._removeIgnored("#comment1\n#comment2")).to.deep.equal("");
    });
  });
});
