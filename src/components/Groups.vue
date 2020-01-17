<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Groups</h1>
    <!-- Modal
     @ hide-footer: removes default ok/cancel buttons of modal
     @ no-close-on-backdrop: disables ability to hiding the modal upon clicking the backdorp
    --->
    <b-modal ref="add" hide-footer no-close-on-backdrop title="Add new group">
      <!--- Form in modal --->
      <ValidationObserver v-slot="{ invalid }">
        <b-form @submit.prevent="onSubmit('add')">
          <b-form-group
            id="input-group-1"
            label="Group name:"
            label-for="input-1"
          >
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="name_input"
                v-model="formResult.group_name"
                placeholder="Enter name of group"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-button type="submit" :disabled="invalid" variant="primary"
            >Submit</b-button
          >
        </b-form>
      </ValidationObserver>
      <!--- End of form in modal --->
    </b-modal>
    <!--- End of modal --->

    <!-- Modal
     @ hide-footer: removes default ok/cancel buttons of modal
     @ no-close-on-backdrop: disables ability to hiding the modal upon clicking the backdorp
    --->
    <b-modal
      ref="edit"
      hide-footer
      no-close-on-backdrop
      v-bind:title="`Change group: ${selected.name}`"
    >
      <!--- Form in modal 
       @ <ValidationObserver v-slot="{ pristine }"> : used to be able to guarantee input in the form (ie. submit button inactived if there are no values in the form)
      --->
      <ValidationObserver v-slot="{ pristine }">
        <b-form @submit.prevent="onSubmit('edit')">
          <b-form-group
            id="input-group-1"
            label="Change name of group:"
            label-for="input-1"
          >
            <ValidationProvider v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="title_input"
                v-model="formResult.name"
                placeholder="Change name of group"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-form-group
            id="input-group-4"
            label="Reason for change:"
            label-for="input-4"
          >
            <ValidationProvider v-slot="{ errors }">
              <b-form-input
                id="input-4"
                name="reason_input"
                v-model="formResult.reason"
                placeholder="What's the reason for the changes?"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-button type="submit" :disabled="pristine" variant="primary"
            >Change</b-button
          >
        </b-form>
      </ValidationObserver>
      <!--- End of form in modal --->
    </b-modal>
    <!--- End of modal --->

    <!-- Button to add new production -->
    <b-button variant="primary" v-on:click="showModal('add')"
      >Add new group</b-button
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

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(bookings)="row">
        <b-button
          variant="primary"
          v-on:click="selectGroup(row.index), goToBooking()"
          >Change</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(artist_document)="row">
        <b-button
          variant="success"
          v-on:click="selectGroup(row.index), createDocument('artist')"
          >Download</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(hotel_document)="row">
        <b-button
          variant="success"
          v-on:click="selectGroup(row.index), createDocument('hotel')"
          >Download</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(accounting_document)="row">
        <b-button
          variant="success"
          v-on:click="selectGroup(row.index), createDocument('accounting')"
          >Download</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(edit)="row">
        <b-button
          variant="warning"
          v-on:click="selectGroup(row.index), showModal('edit')"
          >Edit</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(remove)="row">
        <b-button
          variant="danger"
          v-on:click="selectGroup(row.index), showConfirmModal()"
          >Remove</b-button
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
      items: [],
      currentProduction : {},
      fields: [
        {
          key: "group_name",
          label: "Artists",
          sortable: true
        },
        {
          key: "bookings"
        },
        {
          key: "artist_document",
          label: "Artist confirmations",
          sortable: true
        },
        {
          key: "hotel_document",
          label: "Hotel requests",
          sortable: true
        },
        {
          key: "accounting_document",
          label: "Accounting",
          sortable: true
        },
        {
          key: "edit"
        },
        {
          key: "remove"
        }
      ],
      filter: null,
      selected: {},
      formResult: {}
    };
  },
  async created() {
    this.refreshGroups();
  },
  methods: {
    async refreshGroups() {
      //gets current production from store and then gets all groups of the production
      this.currentProduction = await this.$store.state.production;
      this.items = await api.getGroups(this.currentProduction._id);
    },
    async selectGroup(index) {
      this.selected = this.items[index];
    },
    async addGroup() {
      //api call to create group
      var response = await api.addGroup(this.currentProduction._id,this.formResult);

      //notifying user whether or not production was created
      if (response.status === false) {
        this.makeToast("danger", "Error", "There was an error!");
      } else {
        this.makeToast("success", "Success!", "Succesfully added group");

        //update list of groups to match db
        this.refreshGroups();
      }

      //Reset & clean form result and selected production before next event
      this.resetForm();
    },
    async editGroup() {
      window.alert("NOT IMPLEMENTED");
    },
    async removeGroup() {
      window.alert("NOT IMPLEMENTED");
    },
    async goToBooking() {
      window.alert("NOT IMPLEMENTED");
    },
    showModal(modal) {
      this.$refs[modal].show();
    },
    hideModal(modal) {
      this.$refs[modal].hide();
    },
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    createDocument(value) {
      window.alert("NOT IMPLEMENTED" + value);
    },
    onSubmit(modal) {
      if (modal === "add") {
        this.addGroup();
      }
      if (modal === "edit") {
        this.editGroup();
      }

      //Hide modal
      this.hideModal(modal);
    },
    resetForm() {
      this.formResult = {};
      this.selected = {};
    },
    showConfirmModal() {
      //reset box
      this.box = "";
      this.$bvModal
        .msgBoxConfirm(
          "Are you sure you would like to remove the group: " +
            this.selected.name,
          {
            title: "Please confirm",
            size: "lg",
            okVariant: "danger",
            okTitle: "YES",
            cancelTitle: "NO",
            centered: true
          }
        )
        .then(value => {
          if (value) {
            this.removeGroup();
          }
        });
    }
  }
};
</script>
