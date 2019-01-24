<template>
  <div class="container">
    <div class="row justify-content-center align-items-center" style="height:100vh">
      <div class="col-8">
        <div class="card">
          <div class="card-body">
            <div class="alert alert-warning">email: test@test.it
              <br>Password: test
            </div>
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <br>
            <div>
              <h2>Login</h2>
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
                  <button class="btn btn-primary" :disabled="loading">Login</button>
                </div>
              </form>
              <br>
              <p class="text-center">
                <router-link to="/signup">New Here? Create a new account</router-link>
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
import { EventBus } from '../main.js';

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
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    console.log(to, from);
    next();
  },
  methods: {
    login() {
      if (!(this.email && this.password)) {
        return;
      }
      this.loading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log('User in login: ', user);
          // EventBus.$emit('logged-user', user);
          this.$router.replace('/list');
        })
        .catch(err => {
          // alert(err.message);
          this.error = err.message;
        });
    }
  }
};
</script>

<style scoped>
.login {
  /* margin-top: 40px; */
}
</style>
