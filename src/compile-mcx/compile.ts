import Parser from "@babel/parser"
import type {
  McxOpt,
} from "../types.js"
import type {
  BuildCache
} from "./types.js"
import Context from "./context.js"
import type {
  Program,
  Node
} from "@babel/types"
import Utils from "./../utils.js"
import _compile from "./_compile.js"
export default class Compile {
  public lastError: Error;
  public runCode: number;
  private buildCache: BuildCache = {};
  constructor(public BuildOpt: McxOpt) {
    // 类型验证
    if (!Utils.TypeVerify(this.BuildOpt, {
        output: "string",
        buildDir: "string",
        main: "string",
        BabelConfig: "object",
        cacheDir: "string"
      })) {
      this.lastError = new TypeError("Input McxOpt is not right")
    };
    this.runCode = 0;
    this.lastError = new Error("")
  }
  async start() {
    const main: string = Utils.AbsoluteJoin(this.BuildOpt.buildDir, this.BuildOpt.main);
    // 获取代码
    const code: string = (await Utils.readFile(main)).toString();
    const ast = Parser.parse(code).program;
    await _compile(ast);
  }
}