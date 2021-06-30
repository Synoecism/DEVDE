<template>
  <div id="app">
    <b-navbar id="lead" toggleable="md" type="dark" variant="dark" class="mb-3">
      <!-- center title -->
      <b-navbar-brand to="/">DEVDE</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- left aligned nav items -->
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#" @click.prevent="login" v-if="!activeUser"
            >Login</b-nav-item
          >
          <b-nav-item v-if="activeUser && !activeProduction" to="/productions"
            >Productions</b-nav-item
          >
          <b-nav-item v-if="activeUser && activeProduction">{{
            activeProduction.title
          }}</b-nav-item>
          <b-nav-item v-if="activeUser && activeProduction" to="/groups"
            >Groups</b-nav-item
          >
          <b-nav-item v-if="activeUser && activeProduction" to="/reservations"
            >Reservations</b-nav-item
          >
          <b-nav-item v-if="activeUser && activeProduction" to="/settings"
            >Settings</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            right
            v-if="activeUser && activeProduction"
            to="/productions"
            >Change production</b-nav-item
          >

          <b-nav-item-dropdown v-if="activeUser" right>
            <template #button-content>
              <em>Logged in as: {{ activeUser.given_name }}</em>
            </template>
            <b-dropdown-item href="#" @click.prevent="logout"
              >Log Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- routes will be rendered here -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      activeUser: null,
      activeProduction: null,
    };
  },
  async created() {
    await this.updateApp();
  },
  watch: {
    $route: "updateApp",
  },
  methods: {
    login() {
      this.$auth.loginRedirect();
    },
    async updateApp() {
      this.activeUser = await this.$auth.getUser();
      this.activeProduction = await this.$store.state.production;
    },
    async logout() {
      await this.$auth.logout();
      await this.$store.commit("resetStore");
      await this.updateApp();
      this.$router.push("/");
    },
  },
};
</script>

<style>
@import "./assets/style.css";
</style>