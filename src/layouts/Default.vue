<template>
  <v-app>
    <NavSection/>
    <v-main>
      <div class="mx-6 mt-2">
        <router-view></router-view>
      </div>
    </v-main>
    <v-footer
      class="text-center d-flex flex-column bg-transparent"
    >
      <br/>
    </v-footer>
  </v-app>
</template>

<script setup>
import NavSection from "@/layouts/NavSection.vue";
</script>

<style>
.container-layout {
  display: flex;
  min-height: 100vh;
}

.menu-layout {
  flex: 0 0 auto;
  min-height: 100vh;
  /* Add any additional styles for the menu */
}

.card-layout {
  flex: 1;
  /* Add any additional styles for the card */
}
</style>
