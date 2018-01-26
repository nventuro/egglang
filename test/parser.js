const parser = require("../src/parser");
const expect = require("chai").expect;

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
