<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Reservations</h1>

    <!-- Add new reservation  -->
    <b-button variant="primary" v-on:click="addReservation()">Add new reservation</b-button>

      <!--- Filtering for the table --->
        <b-col lg="6" class="my-1">
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
      </b-col>
      <!--- End of the filtering --->

    <!-- Table start -->
    <b-table
      :striped="true"
      :fields="fields"
      :filter="filter"
      :items="items"
    >

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(select)="row">
        <b-button v-on:click="selectReservation(row.index)">Select</b-button>
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(edit)="row">
        <b-button variant="info" v-on:click="editReservation(row.index)">Edit</b-button>
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(archive)="row">
        <b-button variant="error" v-on:click="deleteReservation(row.index)">Delete</b-button>
      </template>
    
    </b-table>
    <!-- Table ending -->
    
  </div>
</template>
<script>
import api from '../services/api.js'

export default {
  data(){
    return {
      items: [],
      fields: [
      'select',
      'name', 
      'edit',
      'delete'],
      filter: null      
      }
  },
  async created () {
    this.refreshReservations()
  },
  methods : {
    async refreshReservations(){
      this.items = await api.getReservations()
    },
    async selectReservation(index) {
      window.alert('selecting reservation'+index)
    },
    async addReservation() {
      window.alert('adding reservation')
    },
    async editReservation(index) {
        window.alert('editing reservation'+index)
    },
    async deleteReservation(index) {
        window.alert('deleting reservation'+index)
    }
  }
}
</script>