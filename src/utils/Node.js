let nodeIdSeed = 0; //种子变量，后续用于生成唯一的节点ID

//定义一个Node类
export default class Node {
  constructor(options) {
    this.id = nodeIdSeed++; //唯一的节点ID,通过种子变量生成
    this.cascaderData = null;
    this.parent = null;
    this.isLeaf = true;
    this.checked = false;
    //使用options对象来扩展类的属性
    for (let option in options) {
      // eslint-disable-next-line no-prototype-builtins
      //保证对象的属性是自己的，不是原型链上的,防止修改原型链上的属性
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }
    //存储级联选择器相关配置和状态的对象
    let store = this.store;

    //valueKey:节点的值的属性名，默认为'value'
    this[store.valueKey] = options[store.valueKey] || null;
    this.level = 0; //设置节点的级别为0
    this.childNodes = []; //初始化childNodes为空数组，用于存储子节点
    //初始化节点的数据,如果有父节点，级别为父节点的级别+1
    if (this.parent) {
      this.level = this.parent.level + 1;
      store.maxLevel = Math.max(store.maxLevel, this.level);
      this.totalLabel = this.parent.totalLabel
        ? `${this.parent.totalLabel}${this.store.separator}${
            this[store.labelKey]
          }`
        : this[store.labelKey];
      this.showLabel = this.store.showLeafLabel ? this.label : this.totalLabel;
    }
    this._idArr =
      this.parent && this.parent[store.valueKey]
        ? [...this.parent._idArr, this[store.valueKey]]
        : [this[store.valueKey]];
    this.setData(this.cascaderData);
  }

  //设置节点的数据
  setData(data) {
    let store = this.store; //存储级联选择器相关配置和状态的对象
    this.cascaderData = data; //设置节点的数据
    this.childNodes = []; //初始化childNodes为空数组，用于存储子节点
    let children;
    if (this.level === 0 && this.cascaderData instanceof Array) {
      children = this.cascaderData;
    } else {
      // eslint-disable-next-line no-prototype-builtins
      children = this.hasOwnProperty(store.childrenKey)
        ? this[store.childrenKey]
        : [];
      this.isLeaf = children.length === 0;
      //更新store.nodesMap和store.nodeList,用于快速地获取节点实例和管理节点列表
      this.store.nodesMap[this.id] = this;
      this.store.nodeList.push(this);
      // eslint-disable-next-line no-self-assign
      this[store.valueKey] = this[store.valueKey];
    }
    children.forEach((child) => {
      this.insertChild(child);
    });
  }

  //将child对象与当前节点的一些属性合并,并创建一个新的Node实例.将新实例添加到childNodes数组中
  insertChild(child) {
    child = Object.assign(child, {
      parent: this,
      store: this.store
    });
    child = new Node(child);
    //childNodes是所有子节点集合数组
    this.childNodes.push(child);
  }

  //根据传入的checked状态，更新当前节点及其子节点的checked状态
  check(checked) {
    if (this.disabled) {
      return false;
    }
    this.checked = checked;
    this.updateSelectIds(checked, this.id);
    //有子节点,递归更新子节点的checked状态
    if (this.childNodes) {
      this.childNodes.forEach((child) => {
        child.check(checked);
      });
    }
    //有父节点,父节点递归更新checked状态
    if (this.parent) {
      this.parent.checkedAll();
    }
  }

  //检查所有子节点的checked状态,并更新当前节点的状态
  checkedAll() {
    if (this.childNodes) {
      this.checked = this.childNodes.every((child) => child.checked);
      this.updateSelectIds(this.checked, this.id);
    }
    if (this.parent) {
      this.parent.checkedAll();
    }
  }

  //用于更新存储在store中的selectedIds数组,该数组跟踪哪些节点的复选框被选中
  updateSelectIds(checked, id) {
    let store = this.store;
    if (checked) {
      if (this.isLeaf) {
        let tempList = [...store.selectedIds];
        tempList.push(id);
        tempList = Array.from(new Set(tempList));
        store.selectedIds = tempList;
      }
    } else {
      let tempList = [...store.selectedIds];
      let index = tempList.findIndex((o) => o === id);
      if (index >= 0) {
        tempList.splice(index, 1);
      }
      tempList = Array.from(new Set(tempList));
      store.selectedIds = tempList;
    }
  }
}
