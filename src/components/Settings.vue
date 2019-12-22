<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Settings</h1>
    <p>bla bla</p>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user,index) in users" :key="index">
          <td>{{user}}</td>
        </tr>
      </tbody>
     </table> 
  </div>
</template>

<script>
import oktaApi from '../services/oktaApi.js'

export default {
  data(){
    return {
      users : []
    }
  },
  async created () {
    await oktaApi.testOktaCall()
  },
  methods : {
    async refreshOktaUsers(){
      this.users = await oktaApi.getAllOktaUsers()
    }
  }
}
</script>