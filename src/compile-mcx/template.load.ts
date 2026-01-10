import fs from "node:fs"
import path from "node:path"
import Parser from "@babel/parser"
import type {
  Node
} from "@babel/types"
export default class TempLateLoad {
  templateDir: string;
  constructor() {
    // 使用 dirname 来进入template目录
    this.templateDir = path.join(import.meta.dirname, "template");
    if (!fs.existsSync(this.templateDir)) throw new Error("is Not Template file")
  }
  async GetFromName(name: string): Promise<Node> {
    const Code = await fs.promises.readFile(path.join(this.templateDir, name), "utf-8");
    return Parser.parse(Code);
  }
}