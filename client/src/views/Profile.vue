<template>
  <div class="container py-3 justify-content-center align-items-center">
    <div class="row text-center mb-5">
      <div class="col-lg-8 mx-auto justify-content-center
  align-items-center">
        <h1 class="display-4 text-white">Welcome, {{ name }}!</h1>
        <div id="logout-button mb-5">
          <button class="btn btn-light" v-on:click="redirectToLogin()">Log out</button>
        </div>
        <h1 class="display-4 text-white"></h1>
        <ul class="list-group justify-content-center p-3 mb-5 bg-white rounded">
          <li class="list-group-item justify-content-center">
            <h2 class="display-4">Your active Ads</h2>
          </li>
          <li class="list-group-item justify-content-center">
            <!-- Custom content-->
            <div class="media shadow-sm justify-content center flex-lg-row p-3"
            v-for="advert in adverts" :key="advert.advertID">
              <div class="media-body order-2 order-lg-1">
                <!-- Contents-->
                <h3 class="mt-0 font-weight-bold mb-2">{{ advert.item }}</h3>
                <p class="font-italic text-muted mb-0 small">{{ advert.description }}</p>
                <div class="justify-content center
                  align-items-center justify-content-between mt-1">
                  <h6 class="font-weight-bold my-2">Seller: {{ advert.username }}</h6>
                  <h6 class="font-weight-bold my-2">{{ advert.price }}</h6>
                  <button class="btn btn-light"
                  v-on:click="removeTheAdvert(advert.advertID)">Remove Ad</button>
                </div>
              </div>
            </div>
          </li> <!-- End -->
          <!-- List Item-->
        <li class="list-group-item justify-content-center">
          <div class="media justify-content-center align-items-center
          flex-column flex-lg-row p-3">
            <div class="media-body order-2 order-lg-1">
              <h2 class="display-4">Sell something</h2>
              <form v-on:submit.prevent="addAdvert()">
                <div class="media-body order-2 order-lg-1">
            <h3>Item</h3>
            <input class="form-control" type="text" v-model="item" required autofocus />
            <h3>Description</h3>
            <input class="form-control" type="text" v-model="description" required autofocus />
            <h3>Location</h3>
            <input class="form-control" type="text" v-model="location" required autofocus />
            <h3>Image</h3>
            <input class="form-control-file" type="file" @change="uploadImage" autofocus />
            <h3>Price</h3>
            <input class="form-control" type="text" v-model="price" required autofocus />
            <h3>Email</h3>
            <input class="form-control" type="text" v-model="email" required autofocus />
            <h3>Category</h3>
            <div id="filter-button">
          <button type="button" class="btn btn-light"
          v-on:click="assignCategory('Cars')">Cars</button>
          <button type="button" class="btn btn-light"
            v-on:click="assignCategory('Electronics')">Electronics</button>
          <button type="button" class="btn btn-light"
            v-on:click="assignCategory('Clothing')">Clothing</button>
          <button type="button" class="btn btn-light"
          v-on:click="assignCategory('Other')">Other</button>
            </div>
          </div>
          <input class="btn btn-light" type="submit" ref="submitbutton" value="Add Advert" />
              </form>
              </div>
            </div>
          </li> <!-- End -->
        </ul> <!-- End -->
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase';
import 'firebase/storage';

export default {
  name: 'Profile',
  components: {},
  data: () => ({
    adverts: [],
    addTime: '',
    removeTime: '',
    name: '',
    item: '',
    description: '',
    location: '',
    image: '',
    tempImage: '',
    randomNumber: '',
    price: '',
    email: '',
    category: '',
  }),
  methods: {
    uploadImage(event) {
      this.tempImage = event.target.files[0];
      console.log(this.tempImage);
    },
    onFileSelected(event) {
      console.log(event.target.files[0]);
      this.image = event.target.files[0];
      console.log('this.image');
      console.log(this.image);
    },
    redirect(advertName) {
      this.$router.push(`/advert/${advertName}`);
    },
    redirectToLogin() {
      fetch('/api/logOutUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin: this.name,
        }),
      });
      this.$store.commit('setIsAuthenticated', false);
      this.$router.push({ path: 'login' });
    },
    assignCategory(chosenCategory) {
      this.category = chosenCategory;
    },
    getAdverts() {
      fetch('/api/advertListUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: this.name,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          this.name = data.username;
          this.adverts = data.list;
        })
        .catch(console.error);
    },
    addAdvert() {
      const min = Math.ceil(0);
      const max = Math.floor(10000);
      this.randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const storageRef = firebase.storage().ref(`images/${this.randomNumber}`);
      const uploadTask = storageRef.put(this.tempImage);
      console.log(this.randomNumber);

      uploadTask.on('state_changed', (snapshot) => {
        console.log(snapshot);
      }, (error) => {
        console.log(error);
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.image = downloadURL;
          console.log('file available at', this.image);

          fetch('/api/addAdvert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            contentType: false,
            processData: false,
            body: JSON.stringify({
              user: this.name,
              item: this.item,
              description: this.description,
              location: this.location,
              image: this.image,
              price: this.price,
              email: this.email,
              category: this.category,
              randomNumber: this.randomNumber,
            }),
          }).then(() => {
            this.socket.emit('update-adverts', {});
            this.item = '';
            this.description = '';
            this.location = '';
            this.image = '';
            this.price = '';
            this.email = '';
            this.category = '';
            this.randomNumber = '';
          });
          // setTimeout(this.socket.emit('room-update-adverts', {}), 500);
          this.socket.emit('update-adverts', {});
        });
      });
    },

    removeTheAdvert(theAd) {
      fetch('/api/removeAdvert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        contentType: false,
        processData: false,
        body: JSON.stringify({
          removeAdvert: theAd,
          user: this.name,
        }),
      }).then(() => {
        this.socket.emit('update-adverts', {});
      });
      // setTimeout(this.socket.emit('update-adverts', {}), 500);
      this.socket.emit('update-adverts', {});
    },
  },
  created() {
    // this.name = this.$store.state.adminName;
    this.getAdverts();
    this.socket = this.$root.socket;
    this.socket.on('update-adverts', () => {
      this.getAdverts();
    });
  },
};
</script>
