<template>
  <div class="container sign-up">
    <div class="row justify-content-center align-items-center" style="height:100vh">
      <div class="col-8">
        <div class="card">
          <div class="card-body">
            <br>
            <br>
            <div class="text-center">
              <font-awesome-icon icon="guitar" class="p-2" size="4x"/>
              <h3>Guitar Studies</h3>
              <br>
              <h3>Crea un nuovo account</h3>
            </div>
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <div>
              <br>
              <b></b>
              <form @submit.prevent="register">
                <b-form-group id="formEmailGroup" label="Email" label-for="formEmail">
                  <b-form-input
                    id="formEmail"
                    type="email"
                    name="email"
                    v-model="email"
                    v-validate="'required|email'"
                    :class="{'is-invalid': submitted && errors.has('email') }"
                  ></b-form-input>
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
                  <b-form-invalid-feedback>Il campo, richiesto deve essere di almeno 6 caratteri.</b-form-invalid-feedback>
                </b-form-group>
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
    register() {
      this.loading = true;
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then(user => {
              this.$router.replace('/login');
              this.loading = false;
              this.submitted = false;
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
.sign-up {
  /* margin-top: 40px; */
}
</style>
