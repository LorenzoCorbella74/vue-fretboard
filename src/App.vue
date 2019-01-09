<template>
  <div id="app">
    <b-navbar toggleable type="light" variant="light">
      <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
      <b-navbar-brand>Sovrapposizioni</b-navbar-brand>
      <b-collapse is-nav id="nav_text_collapse">
        <b-navbar-nav>
          <b-nav-item to="/">List</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
