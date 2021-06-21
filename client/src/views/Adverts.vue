<template>
<div class="container py-3 justify-content-center align-items-center">
           <div class="row text-center mb-5">
            <div class="col-lg-8 mx-auto justify-content-center
      align-items-center">
            <h1 class="display-4 text-white"></h1>
      <ul class="list-group justify-content-center shadow-sm p-3 mb-5 bg-white rounded">
       <li class="list-group-item justify-content-center">
          <!-- Custom content-->
          <div class="media justify-content-center flex-lg-row p-3">
          <div class="media-body order-2 order-lg-1">
                <div class="media align-items-lg-center flex-column flex-lg-row p-3">
                <div class="media-body shadow-sm justify-content-center order-2 order-lg-1">
                <h1>{{ item }}</h1>
                <img :src=image width="300" height="300">
                <h6 class="font-weight-bold my-2"> {{ price }}</h6>
                <p class="font-italic text-muted mb-0 small"> {{ description }}</p>
                <h6 class="font-weight-bold my-2"> {{ name }} </h6>
                <h6 class="font-weight-bold my-2"> {{ email }} </h6>
                <h6 class="font-weight-bold my-2"> Location: {{ location }} </h6>
                <h6 class="font-weight-bold my-2"> Uploaded: {{ date }} </h6>
                </div>
                </div>
                <div class="media-body justify-content-center align-items-center
                order-2 order-lg-1">
                <form v-on:submit.prevent="cancel()">
                <input class="btn btn-light" type="submit" value="Back to all ads" />
                </form>
                  </div>
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
  name: 'Adverts',
  components: {},
  data() {
    return {
      advert: this.$route.params.advertName,
      socket: null,
      input: '',
      name: 'Username',
      item: 'Item Name',
      description: 'A description of the item',
      location: 'Location of item',
      image: 'Image of item',
      price: 'The price',
      email: 'Email',
      date: 'The date',
    };
  },
  methods: {
    cancel() {
      this.input = '';
      this.$router.push('/Index').catch(console.error);
    },
  },
  created() {
    fetch(`/api/adverts/${this.advert}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        advertID: this.advert,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        this.name = data.list[0].username;
        this.item = data.list[0].item;
        this.description = data.list[0].description;
        this.location = data.list[0].location;
        this.price = data.list[0].price;
        this.email = data.list[0].email;
        this.date = data.list[0].date;
        this.image = data.list[0].image;
      }).catch(console.error);
  },
};
</script>
