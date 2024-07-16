<script setup>
  import { AgGridVue } from 'ag-grid-vue3'; // Vue Grid Logic

  import 'ag-grid-enterprise';

  import { LicenseManager } from 'ag-grid-enterprise';
  LicenseManager.setLicenseKey(
    'IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f'
  );

  const columnDefs = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ];

  const rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
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
  <div style="width: 700px">
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="columnDefs"
      style="height: 500px"
      :defaultColDef="defaultColDef"
      :statusBar="statusBar"
      class="ag-theme-quartz"
    >
    </ag-grid-vue>
  </div>
</template>
<style>
  @import 'ag-grid-community/styles/ag-grid.css';
  @import 'ag-grid-community/styles/ag-theme-quartz.css';
</style>
