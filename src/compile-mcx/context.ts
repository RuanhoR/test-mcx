import os from "node:os"
type MCX_INFO = {
  author: "github@RuanhoR"
  buildSystem: string
  buildSystemVersion: string
  // 时间戳
  buildTime: number
}
const versions = os.userInfo();
const buildSystem: string = os.type();
const buildSystemVersion: string = os.version();
export default class Context {
  export: Object = {}
  __MCX__: MCX_INFO = {
    author: "github@RuanhoR",
    buildSystem,
    buildSystemVersion
    buildTime: Date.now()
  }
}