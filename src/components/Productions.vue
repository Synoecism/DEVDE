<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Productions</h1>

    <!-- Modal
     @ hide-footer: removes default ok/cancel buttons of modal
     @ no-close-on-backdrop: disables ability to hiding the modal upon clicking the backdorp
    --->
    <b-modal
      ref="my-modal"
      hide-footer
      no-close-on-backdrop
      title="Add new production"
    >
      <!--- Form in modal --->
      <ValidationObserver v-slot="{ invalid }">
        <b-form @submit.prevent="onSubmit">
          <b-form-group
            id="input-group-1"
            label="Title of production:"
            label-for="input-2"
          >
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="title_input"
                v-model="formResult.title"
                placeholder="Enter title of production"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Start date:"
            label-for="input-2"
          >
            <validation-provider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-2"
                name="start_date_input"
                v-model="formResult.start_date"
                type="date"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="End date:"
            label-for="input-3"
          >
            <validation-provider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-3"
                v-model="formResult.end_date"
                type="date"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>

          <b-button type="submit" :disabled="invalid" variant="primary"
            >Submit</b-button
          >
        </b-form>
      </ValidationObserver>
      <!--- End of form in modal --->
    </b-modal>

    <!-- Button to Add new production -->
    <b-button variant="primary" v-on:click="showModal()"
      >Add new production</b-button
    >

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
    <b-table :striped="true" :fields="fields" :filter="filter" :items="items">
      <template v-slot:cell(start_date)="row">
        {{ row.value | moment("YYYY MM DD") }}
        <br />
        {{ row.value | moment("dddd") }}
      </template>

      <template v-slot:cell(end_date)="row">
        {{ row.value | moment("YYYY MM DD") }}
        <br />
        {{ row.value | moment("dddd") }}
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(select)="row">
        <b-button v-on:click="selectProduction(row.index)">Select</b-button>
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(edit)="row">
        <b-button variant="warning" v-on:click="editProduction(row.index)"
          >Edit</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(archive)="row">
        <b-button variant="info" v-on:click="archiveProduction(row.index)"
          >Archive</b-button
        >
      </template>
    </b-table>
    <!-- Table ending -->
  </div>
</template>
<script>
import api from "../services/api.js";

export default {
  data() {
    return {
      formResult: {},
      items: [],
      fields: ["select", "title", "start_date", "end_date", "edit", "archive"],
      filter: null
    };
  },
  beforeMount() {
    this.refreshProductions();
  },
  methods: {
    async refreshProductions() {
      this.items = await api.getProductions();
    },
    async selectProduction(index) {
      await this.$store.commit("changeProduction", this.items[index]);
      await this.$router.push("/reservations");
    },
    async addProduction() {
      var response = await api.addProduction(this.formResult);

      if (response.status === false) {
        this.makeToast("danger", "Error", "Production already exists!");
      } else {
        this.makeToast("success", "Success!", "Succesfully created production");
        this.refreshProductions();
      }
      this.resetForm();
    },
    editProduction(index) {
      window.alert("editing production" + index);
    },
    archiveProduction(index) {
      window.alert("archiving production" + index);
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    resetForm() {
      this.formResult = {};
    },
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    onSubmit() {
      this.addProduction();
      this.hideModal();
    }
  }
};
</script>
