/*
 * @Author: ztao
 * @Date: 2023-11-27 17:35:19
 * @LastEditTime: 2023-12-05 16:52:06
 * @Description:
 */
export const clickOutside = {
  mounted(el, bindings) {
    document.addEventListener('click', (e) => {
      if (e.target === el || el.contains(e.target)) {
        return;
      }
      bindings.value(); // 点击非自己、或者不是自己的儿子就关闭元素
    });
  }
};

export const toolTip = {
  mounted(el) {
    el.title = el.scrollWidth > el.offsetWidth ? el.innerText : '';
  }
};
