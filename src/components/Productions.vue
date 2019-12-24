<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Productions</h1>

    <!-- Add new production -->

    <b-button variant="primary" v-on:click="addProduction()">Add new production</b-button>

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
      <template v-slot:cell(edit)="{ value }">
        <b-button variant="warning" v-on:click="editProduction(index)">Edit</b-button>
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(archive)="{ value }">
        <b-button variant="info" v-on:click="archiveProduction(index)">Archive</b-button>
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
      productions : [],
      fields: [
      'name', 
      'start_date', 
      'end_date',
      'edit',
      'archive'],
      items: [
          { name:'Way out West 2019',start_date:"2019-01-01",end_date:"2019-02-01"}
        ],
      filter: null      
      }
  },
  async created () {
    this.refreshProductions()
  },
  methods : {
    async refreshProductions(){
      this.productions = await api.getProductions()
    },
    addProduction() {
        window.alert('adding production')
    },
    editProduction(index) {
        window.alert('editing production'+index)
    },
    archiveProduction(index) {
        window.alert('archiiving production'+index)
    }
  }
}
</script>