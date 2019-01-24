<template>
  <div class="container sign-up">
    <div class="row justify-content-center align-items-center" style="height:100vh">
      <div class="col-8">
        <div class="card">
          <div class="card-body">
            <br>
            <br>
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <br>
            <div>
              <h3>Create a new account</h3>
              <br>
              <form @submit.prevent="login">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    v-model="email"
                    name="email"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !email }"
                  >
                  <div v-show="submitted && !email" class="invalid-feedback">email is required</div>
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    v-model="password"
                    name="password"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !password }"
                  >
                  <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
                </div>
                <div class="form-group">
                  <button class="btn btn-primary" :disabled="loading">Sign Up!</button>
                </div>
              </form>
              <br>
              <p class="text-center">
                <router-link to="/login">Back</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'login',
  data: function() {
    return {
      email: '',
      password: '',
      submitted: false,
      loading: false,
      error: ''
    };
  },
  methods: {
    login() {
      if (!(this.email && this.password)) {
        return;
      }
      this.loading = true;
      this.submitted = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.$router.replace('/login');
          this.loading = false;
        })
        .catch(err => {
          // alert(err.message);
          this.loading = false;
          this.error = err.message;
        });
    }
  }
};
</script>

<style scoped>
.sign-up {
  /* margin-top: 40px; */
}
</style>
