<template>
  <div id="app">
    <b-navbar toggleable type="light" variant="light">
      <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
      <b-navbar-brand>Sovrapposizione scale/arpeggi</b-navbar-brand>
      <b-collapse is-nav id="nav_text_collapse">
        <b-navbar-nav>
          <b-nav-item to="/">List</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="margine-da-navbar">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
.margine-da-navbar {
  margin-top: 24px;
}
</style>
