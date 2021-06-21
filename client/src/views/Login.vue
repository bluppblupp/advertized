<template>
<div class="container py-3 justify-content-center align-items-center">
           <div class="row text-center mb-5">
            <div class="col-lg-8 mx-auto justify-content-center
      align-items-center">
            <h1 class="display-4 text-white">User Login</h1>
      <ul class="list-group justify-content-center shadow-sm p-3 mb-5 bg-white rounded">
       <li class="list-group-item justify-content-center">
          <!-- Custom content-->
          <div class="media justify-content center flex-lg-row p-3">
          <div class="media-body order-2 order-lg-1">
          <h3 class="mt-0 font-weight-bold mb-2">Please log in or register</h3>
              <form v-on:submit.prevent="done()">
                  <h3>Username</h3>
                  <input class="form-control" type="text" v-model="username" required autofocus />
                  <h3>Password</h3>
                  <input class="form-control" type="text" v-model="password" required autofocus />
                  <input class="btn btn-light" type="submit" value="Sign in" />
                  </form>
                  <form v-on:submit.prevent="redirect('/signup')">
                  <input class="btn btn-light" type="submit" value="Register" />
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
  name: 'Login',
  components: {},
  data: () => ({
    username: '',
    password: '',
    message: '',
  }),
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
    done() {
      fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((resp) => {
          if (resp.ok) return resp;
          this.$store.commit('setIsAuthenticated', false);
          this.$router.push({
            path: 'login',
          });
          throw new Error(resp.text);
        })
        .then(() => {
          this.$store.commit('setIsAuthenticated', true);
          this.$store.commit('setName', this.username);

          this.$router.push({
            path: 'profile',
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
