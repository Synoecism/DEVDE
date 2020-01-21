<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Hold {{ date_range }}</h1>
    <!-- Modal
     @ hide-footer: removes default ok/cancel buttons of modal
     @ no-close-on-backdrop: disables ability to hiding the modal upon clicking the backdorp
    --->
    <b-modal
      ref="add"
      hide-footer
      no-close-on-backdrop
      title="Add new reservation"
    >
      <!--- Form in modal --->
      <ValidationObserver v-slot="{ invalid }">
        <b-form @submit.prevent="onSubmit('add')">
          <!-- Name of hotel -->
          <b-form-group
            id="input-group-1"
            label="Reservation name:"
            label-for="input-1"
          >
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="name_input"
                v-model="formResult.hotel_name"
                placeholder="Enter name of hotel"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <!-- Email of hotel -->
          <b-form-group
            id="input-group-2"
            label="Email-address:"
            label-for="input-2"
          >
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-2"
                name="email_input"
                v-model="formResult.email"
                placeholder="Enter email-address of hotel"
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
      v-bind:title="`Change reservation: ${selected.hotel_name}`"
    >
      <!--- Form in modal 
       @ <ValidationObserver v-slot="{ pristine }"> : used to be able to guarantee input in the form (ie. submit button inactived if there are no values in the form)
      --->
      <ValidationObserver v-slot="{ pristine }">
        <b-form @submit.prevent="onSubmit('edit')">
          <b-form-group
            id="input-group-1"
            label="Change name of hotel:"
            label-for="input-1"
          >
            <ValidationProvider v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="hotel_name_input"
                v-model="formResult.hotel_name"
                placeholder="Change name of hotel"
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
      >Add new reservation</b-button
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
      <template v-slot:cell(edit)="row">
        <b-button
          variant="warning"
          v-on:click="selectGroup(row.index), showModal('edit')"
          >Edit</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(archive)="row">
        <b-button
          variant="danger"
          v-on:click="selectGroup(row.index), showConfirmModal()"
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
      items: [],
      currentProduction: {},
      fields: [
        {
          key: "hotel_name",
          label: "Hotel",
          sortable: true
        },
        {
          key: "room_name",
          label: "Room",
          sortable: true
        },
        {
          key: "edit"
        },
        {
          key: "archive"
        }
      ],
      filter: null,
      selected: {},
      formResult: {}
    };
  },
  async created() {
    this.currentProduction = await this.$store.state.production;
    this.refreshReservations();
    this.createDateColumns();
  },
  computed: {
    date_range: function() {
      var start_date = this.$moment(this.currentProduction.start_date);
      var end_date = this.$moment(this.currentProduction.end_date);

      //Difference in number of days
      return this.$moment.duration(end_date.diff(start_date)).asDays();
    }
  },
  methods: {
    async refreshReservations() {
      //gets current production from store and then gets all groups of the production
      /*eslint-disable*/
      console.log(this.currentProduction);
      this.items = await api.getReservations(this.currentProduction._id);
    },
    async createDateColumns() {
      //get start date of production
      var start_date = this.currentProduction.start_date;

      //loop over each date in production to create columns for the hold view
      for(var i = 0; i < this.date_range; i++){
        //begin after the second existing column
        var j = 2;

        //add days from start date
        var next_date = this.$moment(start_date).add(1,'days');
        /*eslint-disable*/
        console.log(next_date)

        //create field object
        var field = {
          key: "hello",
          label: "hotel",
          sortable: true
        }

        //add field to fields (remove no existing fields)
        this.fields.splice(j,0,field)
        j++;
      }

    },
    async selectGroup(index) {
      this.selected = this.items[index];
    },
    async addReservation() {
      //api call to create group
      var response = await api.addReservation(
        this.currentProduction._id,
        this.formResult
      );

      //notifying user whether or not production was created
      if (response.status === false) {
        this.makeToast("danger", "Error", "There was an error!");
      } else {
        this.makeToast("success", "Success!", "Succesfully added group");

        //update list of groups to match db
        this.refreshReservations();
      }

      //Reset & clean form result and selected production before next event
      this.resetForm();
    },
    async editReservation() {
      window.alert("NOT IMPLEMENTED");
    },
    async removeReservation() {
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
        this.addReservation();
      }
      if (modal === "edit") {
        this.editReservation();
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
          "Are you sure you would like to remove the reservation: " +
            this.selected.hotel_name,
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
