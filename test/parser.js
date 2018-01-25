const parser = require("../src/parser");
const expect = require("chai").expect;

describe("Ignored characters remover", () => {
  describe("Whitespace remover", () => {
    it("removes whitespapce", () => {
      expect(parser._removeIgnored("   ")).to.deep.equal(""); // Remove empty lines
      expect(parser._removeIgnored("   abc")).to.deep.equal("abc"); // Remove leading
      expect(parser._removeIgnored("abc   ")).to.deep.equal("abc"); // Remove trailing
      expect(parser._removeIgnored("ab    c")).to.deep.equal("abc"); // Remove in the middle

      expect(parser._removeIgnored("ab\nc")).to.deep.equal("abc"); // Remove newlines

      expect(parser._removeIgnored("\n   ab \n  c   \n")).to.deep.equal("abc"); // Remove all combined
    });
  });

  describe("Comments remover", () => {
    it("removes comments", () => {
      expect(parser._removeIgnored("abc#comment")).to.deep.equal("abc"); // Remove at end
      expect(parser._removeIgnored("abc#comment#abc")).to.deep.equal("abc"); // Remove nested comments

      expect(parser._removeIgnored("#comment")).to.deep.equal(""); // Remove comment lines
      expect(parser._removeIgnored("#comment1\n#comment2")).to.deep.equal(""); // Remove multiline comments
    });
  });
});
