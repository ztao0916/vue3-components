<script setup>
  import {
    debounceFilter,
    throttleFilter,
    useLocalStorage,
    useMouse
  } from '@vueuse/core';

  // changes will write to localStorage with a throttled 1s
  const storage = useLocalStorage(
    'my-key',
    { foo: 'bar' },
    { eventFilter: throttleFilter(1000) }
  );

  // mouse position will be updated after mouse idle for 100ms
  const { x, y } = useMouse({ eventFilter: debounceFilter(3000) });
  // console.log(x, y);
</script>

<template>
  <div>我是工具组件哦</div>
</template>

<style lang="scss" scoped></style>
