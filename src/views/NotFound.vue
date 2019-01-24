<template>
  <div class="container not-found">
    <div class="row justify-content-center align-items-center" style="height:100vh">
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <h1 class="mt-5">
              <font-awesome-icon icon="times-circle"/>Wuh!?
            </h1>
            <p>Looks like you are lost...</p>
            <b-button size="m" :variant="'outline-primary'" @click="notFound" class="px-5">
              <font-awesome-icon icon="plus"/>Go Back
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notfound',
  data: function() {
    return {};
  },
  methods: {
    notFound() {
      this.$router.replace('/list');
    }
  }
};
</script>

<style scoped>
.not-found {
  /* margin-top: 40px; */
}
</style>