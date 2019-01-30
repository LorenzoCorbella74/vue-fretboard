<template>
  <div class="container">
    <div class="row justify-content-center align-items-center" style="height:100vh">
      <div class="col-8">
        <div class="alert alert-warning">
          <h4 class="alert-heading">Demo:</h4>
          <br>Email:
          <span class="alert-link">test@test.it</span>
          <br>Password:
          <span class="alert-link">guitarboy</span>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="text-center">
              <font-awesome-icon icon="guitar" class="p-2" size="4x"/>
              <h3>{{$t("Login.title")}}</h3>
              <br>
              <h2>{{$t("Login.subTitle")}}</h2>
            </div>
            <!-- <b-alert
              variant="danger"
              dismissible
              :show="showDismissibleAlert"
              @dismissed="showDismissibleAlert=false"
            >{{error}}</b-alert>-->
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <div>
              <br>
              <form @submit.prevent="login">
                <b-form-group id="formEmailGroup" label="Email" label-for="formEmail">
                  <b-form-input
                    id="formEmail"
                    type="email"
                    name="email"
                    v-model="email"
                    v-validate="'required|email'"
                    :class="{'is-invalid': submitted && errors.has('email') }"
                  ></b-form-input>
                  <small id="emailHelp" class="form-text text-muted">{{$t("Login.email_msg")}}</small>
                  <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group id="formPassGroup" label="Password" label-for="formPass">
                  <b-form-input
                    id="formPass"
                    type="password"
                    name="password"
                    v-model="password"
                    v-validate="{ required: true, min: 6 }"
                    :class="{'is-invalid': submitted && errors.has('password') }"
                  ></b-form-input>
                  <b-form-invalid-feedback>{{$t("Login.pass_msg")}}</b-form-invalid-feedback>
                </b-form-group>
                <div class="form-group">
                  <button
                    class="btn btn-primary btn-block"
                    :disabled="loading"
                  >{{$t("Login.btn_send")}}</button>
                </div>
              </form>
              <br>
              <p class="text-center">
                <router-link to="/signup">{{$t("Login.register_msg")}}</router-link>
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
// import { EventBus } from '../main.js';
import { isloading } from '../App.vue';

export default {
  name: 'login',
  data: function() {
    return {
      email: '',
      password: '',
      submitted: false,
      loading: isloading,
      error: '',
      ref: firebase
    };
  },
  created() {
    this.ref.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.replace('/list');
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    console.log(to, from);
    next();
  },
  methods: {
    login() {
      this.loading = true;
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(user => {
              this.loading = false;
              this.submitted = false;
              console.log('User in login page: ', user);
              // EventBus.$emit('logged-user', user);
              this.$router.replace('/list');
            })
            .catch(err => {
              // alert(err.message);
              this.loading = false;
              this.submitted = false;
              this.error = err.message;
            });
        }
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
