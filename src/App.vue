<template>
  <div id="app">
    <b-navbar id="lead" toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">DEVDE</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="activeUser && !activeProduction" to="/productions">Productions</b-nav-item>
          <b-nav-item v-if="activeUser && activeProduction" >{{activeProduction.title}}</b-nav-item>
          <b-nav-item v-if="activeUser && activeProduction" to="/reservations">Reservations</b-nav-item>
          <b-nav-item v-if="activeUser && activeProduction" to="/holds">Holds</b-nav-item>
          <b-nav-item v-if="activeUser && activeProduction" to="/settings">Settings</b-nav-item>
          <b-nav-item href="#" @click.prevent="login" v-if="!activeUser">Login</b-nav-item>
          <b-nav-item href="#" @click.prevent="logout" v-else>Logout</b-nav-item>
          <b-nav-item v-if="activeUser && activeProduction" to="/productions">Change production</b-nav-item>
          <b-nav-item v-if="activeUser">Logged in as: {{activeUser.given_name}}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- routes will be rendered here -->
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      activeUser: null,
      activeProduction: null
    }
  },
  async created () {
    await this.updateApp()
  },
  watch : {
    '$route' : 'updateApp'
  },
  methods: {
    login () {
      this.$auth.loginRedirect()
    },
    async updateApp () {
      this.activeUser = await this.$auth.getUser()
      this.activeProduction = await this.$store.state.production
    },
    async logout () {
      await this.$auth.logout()
      await this.$store.commit('resetStore')
      await this.updateApp()
      this.$router.push('/')
    }
  }
}
</script>

<style>
  @import './assets/style.css'
</style>