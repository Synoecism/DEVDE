<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Settings</h1>

    <!-- User handling -->
    <h2 class="h2">Users</h2>

        <!--- Filtering for the table --->
    <b-col lg="6" class="my-1">
      <b-input-group size="sm">
        <b-form-input
          v-model="userFilter"
          type="search"
          id="userFilterInput"
          placeholder="Type to Search"
        ></b-form-input>
        <b-input-group-append>
          <b-button :disabled="!userFilter" @click="userFilter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-col>
    <!--- End of the filtering --->

    <!-- Table start -->
    <b-table
      :striped="true"
      :fields="userFields"
      :filter="userFilter"
      :items="users"
    >
    <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(user_level)="row">
        <p>{{row.value }}</p>
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(change_access)="row">
        <b-button
          variant="danger"
          v-on:click="selectUser(row.index), grantAccess()"
          >Change</b-button
        >
      </template>
    </b-table>
    <!-- Table ending -->

    <!-- Attribute handling -->
    <h2 class="h2">Attributes</h2>
    <!-- Modal
     @ hide-footer: removes default ok/cancel buttons of modal
     @ no-close-on-backdrop: disables ability to hiding the modal upon clicking the backdorp
    --->
    <b-modal
      ref="add"
      hide-footer
      no-close-on-backdrop
      title="Add new attribute"
    >
      <!--- Form in modal --->
      <ValidationObserver v-slot="{ invalid }">
        <b-form @submit.prevent="onSubmit('add')">
          <b-form-group
            id="input-group-1"
            label="Title of attribute:"
            label-for="input-1"
          >
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="attribute_input"
                v-model="formResult.title"
                placeholder="Enter title of attribute"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Value of attribute:"
            label-for="input-2"
          >
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="value_input"
                v-model="formResult.value"
                placeholder="Enter value of attribute"
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
      v-bind:title="`Change attribute: ${selectedAttribute.title}`"
    >
      <!--- Form in modal 
       @ <ValidationObserver v-slot="{ pristine }"> : used to be able to guarantee input in the form (ie. submit button inactived if there are no values in the form)
      --->
      <ValidationObserver v-slot="{ pristine }">
        <b-form @submit.prevent="onSubmit('edit')">
          <b-form-group
            id="input-group-1"
            label="Title of attribute:"
            label-for="input-1"
          >
            <ValidationProvider v-slot="{ errors }">
              <b-form-input
                id="input-1"
                name="title_input"
                v-model="formResult.title"
                placeholder="Change title of attribute"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Value of attribute:"
            label-for="input-2"
          >
            <ValidationProvider v-slot="{ errors }">
              <b-form-input
                id="input-2"
                name="value_input"
                v-model="formResult.value"
                placeholder="Change value of attribute"
              ></b-form-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="Reason for change:"
            label-for="input-3"
          >
            <ValidationProvider v-slot="{ errors }">
              <b-form-input
                id="input-3"
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

    <!-- Table start -->
    <b-table
      :striped="true"
      :fields="attributeFields"
      :items="attributes"
    >
      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(edit)="row">
        <b-button variant="warning" v-on:click="selectAttribute(row.index)"
          >Edit</b-button
        >
      </template>

      <!-- Button per each row. cell(column_header) -->
      <template v-slot:cell(remove)="row">
        <b-button variant="danger" v-on:click="selectAttribute(row.index)"
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
      formResult: {},
      users: [],
      userFields: [
        {
          key: "profile.firstName",
          label: "Name",
          sortable: true
        },
        {
          key: "profile.email",
          label: "Email",
          sortable: true
        },
        {
          key: "user_level",
          label: "User Level",
          sortable: true
        },
        {
          key: "change_access"
        }
      ],
      userFilter: null,
      selectedUser: {},
      attributes: [],
      attributeFields: [
        {
          key: "title",
          sortable: true
        },
        {
          key: "value",
          sortable: true
        },
        {
          key: "edit"
        }
      ],
      selectedAttribute: {},
      box: "",
      userLevels : []
    };
  },
  beforeMount() {
    this.refreshUsers();
  },
  methods: {
    async refreshUsers() {
      //what is this = this ? :D this is the this hell
      var self = this;

      //get all okta users
      await api.getOktaUsers()
        .then(function(response){
          self.matchUserLevel(self,response)
        });
    },
    async matchUserLevel(self,response){
      //get current production
      var currentProduction = await self.$store.state.production;

      //loop over the users and add accurate user level to their objects
      for(var i = 0; i < response.length; i++){
        //check if admin
        if(currentProduction.users.admins.includes(response[i].id)){
          response[i].user_level = 'Admin'
        } else if(currentProduction.users.coordinators.includes(response[i].id)){
          response[i].user_level = 'Coordinator'
        } else if(currentProduction.users.accounting.includes(response[i].id)){
          response[i].user_level = 'Accounting'
        } else {
          response[i].user_level = 'No access'
        }
      }
      //this equals this.users
      self.users = response;
    },
    async refreshAttributes(){

    },
    selectUser(index) {
      this.selectUser = this.items[index];
    },
    showModal(modal) {
      this.$refs[modal].show();
    },
    hideModal(modal) {
      this.$refs[modal].hide();
    },
    resetForm() {
      this.formResult = {};
      this.selectedUser = {};
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
        //do something
      }
      if (modal === "edit") {
        //do something
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
            //do something
          }
        });
    }
  }
};
</script>
