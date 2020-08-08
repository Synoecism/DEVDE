<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Productions</h1>

    <!-- Modal
     @ hide-footer: removes default ok/cancel buttons of modal
     @ no-close-on-backdrop: disables ability to hiding the modal upon clicking the backdorp
    --->
    <b-modal
      ref="add"
      hide-footer
      no-close-on-backdrop
      title="Add new production"
    >
      <!--- Form in modal --->
      <ValidationObserver v-slot="{ invalid }">
        <b-form @submit.prevent="onSubmit('add')">
          <b-form-group
            id="input-group-1"
            label="Title of production:"
            label-for="input-1"
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
    <!--- End of modal --->

    <!-- Modal
     @ hide-footer: removes default ok/cancel buttons of modal
     @ no-close-on-backdrop: disables ability to hiding the modal upon clicking the backdorp
    --->
    <b-modal
      ref="edit"
      hide-footer
      no-close-on-backdrop
      v-bind:title="`Change production: ${selected.title}`"
    >
      <!--- Form in modal 
       @ <ValidationObserver v-slot="{ pristine }"> : used to be able to guarantee input in the form (ie. submit button inactived if there are no values in the form)
      --->
      <ValidationObserver v-slot="{ pristine }">
        <b-form @submit.prevent="onSubmit('edit')">
          <b-form-group
            id="input-group-1"
            label="Title of production:"
            label-for="input-1"
          >
            <ValidationProvider v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="title_input"
                v-model="formResult.title"
                placeholder="Change title of production"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Change start date:"
            label-for="input-2"
          >
            <validation-provider v-slot="{ errors }">
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
            label="Change end date:"
            label-for="input-3"
          >
            <validation-provider v-slot="{ errors }">
              <b-form-input
                id="input-3"
                v-model="formResult.end_date"
                type="date"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </validation-provider>
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
        <b-button v-on:click="routeToProduction(row.index)">Select</b-button>
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(edit)="row">
        <b-button
          variant="warning"
          v-on:click="selectProduction(row.index), showModal('edit')"
          >Edit</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(archive)="row">
        <b-button
          variant="info"
          v-on:click="selectProduction(row.index), showConfirmModal()"
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
      fields: [
        {
          key: 'select'
        },
        {
          key: 'title',
          sortable: true
        },
        {
          key: 'start_date',
          sortable: true
        },
        {
          key: 'end_date',
          sortable: true
        },
        {
          key: 'edit',
        },
        {
          key: 'archive'
        }
      ],
      filter: null,
      selected: {},
      box: ""
    };
  },
  created() {
    this.refreshProductions();
  },
  methods: {
    async refreshProductions() {
      this.items = await api.getProductions();
    },
    async routeToProduction(index) {
      //store selected production in global access
      await this.$store.commit("changeProduction", this.items[index]);

      //route to reservations of the selected production
      await this.$router.push("/groups");
    },
    async addProduction() {
      //api call to create production
      var response = await api.addProduction(this.formResult);

      //notifying user whether or not production was created
      if (response.status === false) {
        this.makeToast("danger", "Error", "Production already exists!");
      } else {
        this.makeToast("success", "Success!", "Succesfully created production");
        this.refreshProductions();
      }

      //Reset & clean form result and selected production before next event
      this.resetForm();
    },
    selectProduction(index) {
      this.selected = this.items[index];
    },
    async editProduction() {
      //api call to change production
      var response = await api.changeProduction(
        this.selected._id,
        this.formResult
      );

      //notifying user whether or not production was updated
      if (response.status === false) {
        this.makeToast("danger", "Error", "Production not updated!");
      } else {
        this.makeToast("success", "Success!", "Succesfully changed production");
        this.refreshProductions();
      }

      //Reset & clean form result and selected production before next event
      this.resetForm();
    },
    async archiveProduction() {
      //add isArchived to formresult
      this.formResult.isArchived = true;

      //set reason for change
      this.formResult.reason = "Archiving production";

      //api call to change production
      var response = await api.changeProduction(
        this.selected._id,
        this.formResult
      );

      //notifying user whether or not production was updated
      if (response.status === false) {
        this.makeToast("danger", "Error", "Production not archived!");
      } else {
        this.makeToast(
          "success",
          "Success!",
          "Succesfully archived production"
        );
        this.refreshProductions();
      }

      //Reset & clean form result and selected production before next event
      this.resetForm();
    },
    showModal(modal) {
      this.$refs[modal].show();
    },
    hideModal(modal) {
      this.$refs[modal].hide();
    },
    resetForm() {
      this.formResult = {};
      this.selected = {};
    },
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    onSubmit(modal) {
      if (modal === "add") {
        this.addProduction();
      }
      if (modal === "edit") {
        this.editProduction();
      }

      this.hideModal(modal);
    },
    showConfirmModal() {
      //reset box
      this.box = "";
      this.$bvModal
        .msgBoxConfirm(
          "Are you sure you would like to archive production: " +
            this.selected.title,
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
            this.archiveProduction();
          }
        });
    }
  }
};
</script>
