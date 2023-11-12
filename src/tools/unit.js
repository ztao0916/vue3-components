//获取数组中的唯一项
export function _uniq(arr) {
  let result = [];
  arr.forEach((item) => {
    if (!result.includes(item)) {
      result.push(item);
    }
  });
  return result;
}

//获取数组中和obj相等的项
export function _findByObj(arr, obj) {
  let keys = Object.keys(obj);
  //返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
  return arr.find((item) =>
    //循环判断每一项是否相等
    keys.every((key) => JSON.stringify(item[key]) === JSON.stringify(obj[key]))
  );
}
