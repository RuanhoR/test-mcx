class Module {
  modules;
  constructor() {
    this.init()
  }
  init() {
    () => {
      reg();
      this.import("main:path");
    }();
  }
  #pathJoin(...paths) {
    return paths
      .map(p => p.replace(/[\\/]+$/, ''))
      .filter(p => p.length > 0)
      .join('/')
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');
  }
  import(ModuleDir, dirname) {
    let key = "";
    if (ModuleDir.startsWith(".")) {
      key = this.#pathJoin(dirname, ModuleDir)
    }
    const foundModule = this.modules[key];
    if (foundModule) {
      if (foundModule.isLoad) return foundModule.data;
      foundModule.Load();
      return foundModule.data;
    }
    throw new Error(`Cannot find module '${ModuleDir}'`);
  }
  HandlerModule(name, fn) {
    if (typeof fn !== "function" || typeof name !== "") throw new Error("Cannot create Module");
    this.modules[name] = {
      fn: fn,
      isLoad: false,
      Load() {
        if (isLoad) return;
        const exp = {};
        fn(exp);
        this.data = exp;
        this.isLoad = true;
      }
    };
  }
}