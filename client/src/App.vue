<template>
  <div id="app">
    <div class="container py-5 align-items-center">
           <div class="row text-center mb-5">
            <div class="col-lg-8 mx-auto justify-content-center
      align-items-center">
     <ul class="list-group mb-5 bg-white rounded">
        <nav class="navbar navbar-expand-md navbar-light navbar-static-top justify-content-center"
         role="navigation">
               <ul class="nav navbar-nav">
                  <li class = "nav-item" v-on:click="redirect('/index')">
                      <a class="nav-link active" style="cursor: pointer;">Adverts</a>
                    </li>
                    <li class = "nav-item" v-on:click="redirect('/login')">
                      <a class="nav-link active" style="cursor: pointer;">Login</a>
                    </li>
                    <li class = "nav-item" v-on:click="redirect('/profile')">
                      <a class="nav-link active" style="cursor: pointer;">Profile</a>
                    </li>
                  </ul>
               </nav>
         </ul>
      </div>
  </div>
  </div>
  <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>

<style>
.html,
body {
    background: linear-gradient(to right, #4880c0, #480048);
    min-height: 100vh
}

.text-gray {
    color: rgb(255, 255, 255)
}

img {
    height: 170px;
    width: 140px
}

button:focus {
  outline: 0;
}

.navbar .container {
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  width: 100%;
  justify-content: center;
}

.navbar-brand-centered {
  position: absolute;
  left: 50%;
  display: block;
  width: 160px;
  text-align: center;
  background-color: transparent;
  font-family: Arial, Helvetica, sans-serif;
}

.navbar > .container .navbar-brand-centered,
.navbar > .container-fluid .navbar-brand-centered {
  margin-left: -80px;
}

.navbar {
  border-bottom: 0;
}
</style>
