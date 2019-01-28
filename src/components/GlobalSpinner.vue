<template>
  <!-- OVERLAY -->
  <div class="d-flex justify-content-center align-items-center overlay" v-if="isLoading">
    <div class="p-2 text-center text-light">
      <font-awesome-icon icon="spinner" spin size="5x"/>
      <div>{{loadingMsg}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'global-spinner',
  props: {
    isLoading: Boolean,
    loadingMsg: String
  }
};
</script>

<style lang="sass" scoped>

</style>
