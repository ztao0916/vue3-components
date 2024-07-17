<script setup>
  import { ref, onMounted } from 'vue';
  import { AgGridVue } from 'ag-grid-vue3'; // Vue Grid Logic

  import 'ag-grid-enterprise';

  import { LicenseManager } from 'ag-grid-enterprise';

  LicenseManager.setLicenseKey(
    'IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f'
  );
  //定义数据
  const rowData = ref([]);
  onMounted(async () => {
    let fetchData = await fetch(
      'https://www.ag-grid.com/example-assets/olympic-winners.json'
    );
    let newData = await fetchData.json();
    rowData.value = newData;
  });

  //自定义列属性

  const columnDefs = [
    {
      field: 'athlete',
      filter: 'agMultiColumnFilter',
      headerName: '运动员',
      enableRowGroup: true
    },
    { field: 'age', filter: true, headerName: '年龄', enableRowGroup: true },
    { field: 'date', filter: true, headerName: '生日' },
    { field: 'country', filter: 'agSetColumnFilter', headerName: '国家' },
    { field: 'sport', filter: 'agMultiColumnFilter', headerName: '运动项目' },
    { field: 'gold', filter: 'agNumberColumnFilter', headerName: '金牌' },
    { field: 'silver', filter: 'agNumberColumnFilter', headerName: '银牌' },
    { field: 'bronze', filter: 'agNumberColumnFilter', headerName: '铜牌' },
    { field: 'total', filter: false, headerName: '总分', aggFunc: 'sum' }
  ];

  const defaultColDef = {
    flex: 1
  };

  const statusBar = {
    statusPanels: [
      {
        statusPanel: 'agTotalAndFilteredRowCountComponent',
        align: 'left'
      }
    ]
  };
</script>

<template>
  <div style="width: 1800px">
    <ag-grid-vue
      :localeText="$localeText"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :sideBar="true"
      :enableRangeSelection="true"
      :enableCharts="true"
      :defaultColDef="defaultColDef"
      :statusBar="statusBar"
      style="height: 500px"
      class="ag-theme-quartz"
    >
    </ag-grid-vue>
  </div>
</template>
<style>
  @import 'ag-grid-community/styles/ag-grid.css';
  @import 'ag-grid-community/styles/ag-theme-quartz.css';
</style>
