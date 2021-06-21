<template>
<div class="container py-3 justify-content-center align-items-center">
           <div class="row text-center mb-5">
            <div class="col-lg-8 mx-auto justify-content-center
      align-items-center">
            <h1 class="display-4 text-white">Register User</h1>
            <h6 class="font-weight-bold my-2"> {{ message }} </h6>
      <ul class="list-group justify-content-center shadow-sm p-3 mb-5 bg-white rounded">
       <li class="list-group-item justify-content-center">
          <!-- Custom content-->
          <div class="media justify-content center flex-lg-row p-3">
          <div class="media-body order-2 order-lg-1">
          <h3 class="mt-0 font-weight-bold mb-2">Please log in</h3>
              <form v-on:submit.prevent="done()">
                  <h3>Username</h3>
      <input class="form-control" type="text" v-model="username" required autofocus />
      <h3>Email Address</h3>
      <input class="form-control" type="text" v-model="email" required autofocus />
      <h3>Password</h3>
      <input class="form-control" type="text" v-model="password" required autofocus />
      <h3>Confirm Password</h3>
      <input class="form-control" type="text" v-model="passwordcheck" required autofocus />
      <input class="btn btn-light" type="submit" value="Sign Up" />
                  </form>
                  <h6 class="font-weight-bold my-2"></h6>
            </div>
          </div>
        </li> <!-- End -->
    </ul>
 </div>
 </div>
 </div>
</template>

<script>
export default {
  name: 'Signup',
  components: {},
  data: () => ({
    username: '',
    email: '',
    password: '',
    passwordcheck: '',
    message: '',
  }),
  methods: {
    done() {
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          email: this.email,
          password: this.password,
          password2: this.passwordcheck,
        }),
      })
        .then((resp) => {
          if (resp.ok) return resp;
          this.$store.commit('setIsAuthenticated', false);
          this.message = 'wrong username/password';
          this.$router.push({
            path: 'signup',
          });
          throw new Error(resp.text);
        })
        .then(() => {
          this.message = 'Your account is now registered';
          this.$router.push({
            path: 'login',
          });
        })
        .catch((error) => {
          console.error('Authentication failed unexpectedly');
          this.message = 'wrong username/password';
          throw error;
        });
    },
  },
};
</script>
