<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Reservations</h1>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Reservation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reservation,index) in reservations" :key="index">
          <td>{{reservation.artistName}}</td>
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
      reservations : []
    }
  },
  async created () {
    this.refreshReservations()
  },
  methods : {
    async refreshReservations(){
      this.reservations = await api.getReservations()
    }
  }
}
</script>