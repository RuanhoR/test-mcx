import * as Parser from "@babel/parser"
export default class Compile {
  constructor(public code: string) {
    const ast = Parser.parse(code, {
      sourceType: "module"
    })
  }
}