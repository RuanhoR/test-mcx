import type {
  Node,
  ImportDeclaration
} from "@babel/types"
interface callList {
  source: string[]
  arguments: Node[]
  remove: Function
}
interface ImportListImport {
  isAll : boolean
  import ?: string
  as: string
}
interface ImportList {
  source: string
  imported: ImportListImport[]
  raw ?: ImportDeclaration
}
interface ExportList {
  // key : export as  --  value : export var name
  [key: string]: Node | ImportList
}
interface BuildCache {
  call ? : callList[]
  import ? : ImportList[]
  export ? : ExportList
}
type MCX_INFO = {
  author: "github@RuanhoR"
  buildSystem: string
  buildSystemVersion: string
  // 时间戳
  buildTime: number
}
export type {
  BuildCache,
  MCX_INFO,
  ImportList,
  ImportListImport,
  ExportList
}