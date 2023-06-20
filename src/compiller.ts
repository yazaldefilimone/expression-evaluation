const REGEX_VALIDATE_NUMBER: RegExp = /^-?\d+(\.\d+)?$/;
const REGEX_VALIDATE_SPACE: RegExp = /^\s*$/;
const REGEX_VALIDATE_MATH: RegExp = /[+\-*/]/;
type MathExpression = [
  string | MathExpression,
  number | MathExpression,
  number
];

// type Data = [MathExpression][][];
class Compiler {
  private input: string;
  private tokens: MathExpression[];
  private stack: number[];
  lexer_idx: number;
  current_exp?: string;
  constructor(input: string) {
    this.input = input;
    this.tokens = [];
    this.lexer_idx = 0;
    this.stack = [];
    this.current_exp = undefined;
  }

  lexer(): MathExpression {
    if (this.lexer_idx >= this.input.length) {
      return this.tokens[0];
    }
    let current = this.input[this.lexer_idx];
    this.nextLine();
    if (this.isSpace(current)) {
      return this.lexer();
    }
    if (this.isNumber(current)) {
      let number = Number(current);
      if (this.current_exp) {
        const exp = this.stack.length > 0 ? this.stack[0] : this.tokens.pop();
        let token: MathExpression;

        if (!exp) throw Error("Not Found Expression");

        if (typeof exp !== "number") {
          token = [this.current_exp, exp, number];
        } else {
          token = [this.current_exp, exp, number];
        }
        this.tokens.push(token);
        this.current_exp = undefined;
        this.stack = [];
      } else {
        this.stack.push(number);
      }
      return this.lexer();
    }

    if (this.isMathExp(current)) {
      if (this.current_exp) {
        throw Error(`Syntax Error prev: ${this.current_exp} next ${current}`);
      }
      this.current_exp = current;
      return this.lexer();
    }
    return this.lexer();
  }

  private nextLine() {
    this.lexer_idx += 1;
  }
  private isNumber(str: string): boolean {
    if (str.length <= 0) return false;
    return REGEX_VALIDATE_NUMBER.test(str);
  }

  private isSpace(str: string) {
    return REGEX_VALIDATE_SPACE.test(str);
  }
  private isMathExp(str: string) {
    return REGEX_VALIDATE_MATH.test(str);
  }
}

const compiler = new Compiler("1 + 2 * 3 / 3*2");
const tokens = compiler.lexer();
console.log(JSON.stringify(tokens, null, 0));

function iterateFromInsideOut(array: any): any {
  if (typeof array !== "object") return array;
  if (array.length <= 1) return array;
  if (array[0] === "*") {
    let [_, exp, num] = array;
    return iterateFromInsideOut(exp) * num;
  }
  if (array[0] === "*") {
    let [_, exp, num] = array;
    return iterateFromInsideOut(exp) * num;
  }
  if (array[0] === "/") {
    let [_, exp, num] = array;
    return iterateFromInsideOut(exp) / num;
  }
  if (array[0] === "+") {
    let [_, exp, num] = array;
    return iterateFromInsideOut(exp) + num;
  }
  return array;
}

// const arr = ["*", ["/", ["*", ["+", 1, 2], 3], 3], 2];
// iterateFromInsideOut(arr);
console.log(iterateFromInsideOut(tokens));
