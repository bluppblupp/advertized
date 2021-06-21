<template>
<div class="container py-3 justify-content-center align-items-center">
           <div class="row text-center mb-5">
            <div class="col-lg-8 mx-auto justify-content-center
      align-items-center">
            <h1 class="display-4 text-white">Adverts</h1>
      <ul class="list-group justify-content-center shadow-sm p-3 mb-5 bg-white rounded">
       <li class="list-group-item justify-content-center">
          <!-- Custom content-->
          <div class="media justify-content center flex-lg-row p-3">
          <div class="media-body order-2 order-lg-1">
          <h3 class="mt-0 font-weight-bold mb-2">Search for items</h3>
          <form v-on:submit.prevent="getAdverts()">
              <input class="form-control" type="text" v-model="search" required autofocus />
              <input class="btn btn-light" type="submit" value="Search for Item" />
              <form v-on:submit.prevent="resetSearch()">
              <input class="btn btn-light" type="submit" value="Show all ads" />
              </form>
              </form>
          <h3 class="mt-0 font-weight-bold mb-2">Apply filter</h3>
          <div class="d-flex align-items-center justify-content-center">
          <div id="filter-button">
          <button type="button" class="btn btn-light" v-on:click="assignCategory('All')">
          All</button>
          <button type="button" class="btn btn-light" v-on:click="assignCategory('Cars')">
            Cars</button>
          <button type="button" class="btn btn-light" v-on:click="assignCategory('Electronics')">
            Electronics</button>
          <button type="button" class="btn btn-light" v-on:click="assignCategory('Clothing')">
            Clothing</button>
          <button type="button" class="btn btn-light" v-on:click="assignCategory('Other')">
            Other</button>
          </div>
        </div>
          </div>
          </div> <!-- End -->
        </li> <!-- End -->
        <li class="list-group-item justify-content-center">
            <!-- Custom content-->
            <div class="media shadow-sm rounded justify-content center flex-lg-row p-3"
            v-for="advert in adverts" @click="redirect(advert)" :key="advert.advertID">
              <div class="media-body order-2 order-lg-1">
            <!-- Contents-->
                  <h3 class="mt-0 font-weight-bold mb-2">{{ advert.item }}</h3>
                  <p class="font-italic text-muted mb-0 small">{{ advert.description }}</p>
                  <div class="justify-content center
                  align-items-center justify-content-between mt-1">
                   <h6 class="font-weight-bold my-2">Seller: {{ advert.username }}</h6>
                   <h6 class="font-weight-bold my-2">{{ advert.price }}</h6>
                </div>
               </div>
              </div>
       </li> <!-- End -->
    </ul> <!-- End -->
</div>
</div>
</div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  data: () => ({
    adverts: [],
    category: 'All',
    search: null,
  }),
  methods: {
    redirect(advert) {
      const advertName = advert.advertID;
      this.$router.push(`/adverts/${advertName}`);
    },
    resetSearch() {
      this.search = null;
      this.getAdverts();
    },
    getAdverts() {
      fetch('/api/advertListCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: this.category,
          search: this.search,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          this.adverts = data.list;
        })
        .catch(console.error);
    },

    assignCategory(chosenCategory) {
      this.category = chosenCategory;
      this.getAdverts();
    },
  },
  created() {
    this.getAdverts();
    this.socket = this.$root.socket;
    this.socket.on('update-adverts', () => {
      this.getAdverts();
    });
  },
};
</script>
