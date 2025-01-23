<template>
  <el-button v-bind="$attrs" v-on="$listeners" :size="size">{{ text }}</el-button>
</template>

<script>
export default {
  name: 'tableButton',
  props: {
    text: {
      type: String,
      default: '',
      required: true
    },
    size: {
      type: String,
      default: 'mini'
    }
  }
}
</script>

<style>

</style>
