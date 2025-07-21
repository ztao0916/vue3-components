<template>
  <div class="schema-page">
    <h1>Schema Form</h1>
    <div>schemajson处理</div>
  </div>
</template>

<script setup lang="ts">
  import { compileSchema, JsonSchema, JsonError } from 'json-schema-library';
  import jsonData from '@/utils/demo.json';
  const myJsonSchema: JsonSchema = {
    type: 'object',
    additionalProperties: false
  };
  const schemaNode = new compileSchema(myJsonSchema);
  const errors: JsonError[] = schemaNode.validate(jsonData);
  expect(errors).to.deep.equal([
    {
      type: 'error',
      name: 'NoAdditionalPropertiesError',
      code: 'no-additional-properties-error',
      message: 'additional properties name in # is not allowed',
      data: {
        property: 'name',
        properties: [],
        pointer: '#'
      }
    }
  ]);
</script>

<style scoped></style>
