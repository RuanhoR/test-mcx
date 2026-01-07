import Parser from "@babel/parser";
import fs from "node:fs/promises"
import path from "node:path"
export default class TempLateLoad {
  templateDir: string;
  constructor() {
    this.templateDir = path.join(import.meta.url, "../../", "template");
  }
  
}