<script setup>
  import { ref, onBeforeMount } from 'vue';
  import { AgGridVue } from 'ag-grid-vue3'; // Vue Grid Logic

  import 'ag-grid-enterprise';

  import { LicenseManager } from 'ag-grid-enterprise';

  import DemoCellRenderer from './cell-renderers/demo.vue';

  LicenseManager.setLicenseKey(
    'IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f'
  );
  console.log('AgGridVue :>>>', AgGridVue);

  //定义数据
  const getRowId = ref(null);
  const rowData = ref([]);
  const lengthObj = ref({});
  onBeforeMount(async () => {
    let fetchData = await fetch(
      'https://www.ag-grid.com/example-assets/olympic-winners.json'
    );
    let newData = await fetchData.json();
    rowData.value = newData.splice(0, 600);
    // getRowId.value = (params) => String(params.data.id); //写死的
    //:get-row-id="getRowId"
    lengthObj.value = countAthletes(rowData.value);
  });
  /**
   * 1.获取rowData.value中所有的athlete,去重,得到athletes数组
   */
  let countAthletes = (data) => {
    // 使用 reduce 函数来统计每个 athlete 的出现次数
    const athleteCounts = data.reduce((acc, curr) => {
      if (curr.athlete) {
        acc[curr.athlete] = (acc[curr.athlete] || 0) + 1;
      }
      return acc;
    }, {});
    // console.log(athleteCounts);
    return athleteCounts;
  };

  //自定义列属性
  const columnDefs = [
    {
      field: 'athlete',
      filter: 'agMultiColumnFilter',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: '运动员'
    },
    {
      field: 'age',
      filter: true,
      headerName: '年龄',
      enableRowGroup: true,
      cellRenderer: DemoCellRenderer,
      autoHeight: true
    },
    {
      field: 'date',
      filter: true,
      headerName: '生日'
    },
    { field: 'country', filter: 'agSetColumnFilter', headerName: '国家' },
    { field: 'sport', filter: 'agMultiColumnFilter', headerName: '运动项目' },
    { field: 'gold', filter: 'agNumberColumnFilter', headerName: '金牌' },
    { field: 'silver', filter: 'agNumberColumnFilter', headerName: '银牌' },
    { field: 'bronze', filter: 'agNumberColumnFilter', headerName: '铜牌' },
    { field: 'total', filter: false, headerName: '总分', aggFunc: 'sum' }
  ];

  const defaultColDef = {
    filter: 'agMultiColumnFilter', // 开启多列过滤
    sortable: true, // 开启排序
    enableRowGroup: true, // 开启列分组
    resizable: true, // 开启列宽拖拽
    wrapHeaderText: true, // 列头文本换行
    autoHeaderHeight: true, // 列头文本自动换行
    flex: 1
  };
  //定义侧边栏
  const sidebar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        hiddenByDefault: true,
        minWidth: 225,
        maxWidth: 225,
        width: 225
      }
    ]
  };

  const paginationPageSize = ref(null);
  const paginationPageSizeSelector = ref(null);
  paginationPageSize.value = 500;
  paginationPageSizeSelector.value = [200, 500, 1000];

  //定义gridReady事件
  const gridApi = ref(null);
  const onGridReady = (params) => {
    gridApi.value = params.api;
  };

  const getSelectItem = () => {
    let selectItem = gridApi.value.getSelectedRows();
    console.log(selectItem);
  };
</script>

<template>
  <div style="width: 1800px">
    <el-button @click="getSelectItem" type="primary">获取选中项</el-button>
    <ag-grid-vue
      :locale-text="$localeText"
      :row-data="rowData"
      :column-defs="columnDefs"
      :side-bar="sidebar"
      :pagination="true"
      :suppressRowTransform="true"
      :pagination-page-size="paginationPageSize"
      :pagination-page-size-selector="paginationPageSizeSelector"
      :default-colDef="defaultColDef"
      row-group-panel-show="always"
      row-selection="multiple"
      style="height: 500px"
      class="ag-theme-quartz"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>
  </div>
</template>
<style>
  @import 'ag-grid-community/styles/ag-grid.css';
  @import 'ag-grid-community/styles/ag-theme-quartz.css';
  .cell-span {
    background-color: #fff;
  }
</style>
