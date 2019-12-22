<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Productions</h1>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Productions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(production,index) in productions" :key="index">
          <td>{{production}}</td>
        </tr>
      </tbody>
     </table> 
  </div>
</template>
<script>
import api from '../services/api.js'
export default {
  data(){
    return {
      productions : []
    }
  },
  async created () {
    /* eslint-disable */
    console.log('in created')
    console.log(this.$auth.getUser())
    this.refreshProductions()
  },
  methods : {
    async refreshProductions(){
          /* eslint-disable */

      console.log('in refreshproductions')
      this.productions = await api.getProductions()
    }
  }
}
</script>