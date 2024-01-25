<script setup>
import {getMe, getToken} from "@/helpers/token.helper.js";
import {ref} from "vue";

const token = ref(getToken());
const me = ref(getMe());
const rail = ref(false);
const drawer = ref(null);
const links = ref([
  {icon: 'mdi-shield-account', label: 'Administrateurs', link: "admin"},
  {icon: 'mdi-domain', label: 'Entreprises', link: "company"},
  {icon: 'mdi-badge-account', label: 'Employés', link: "employee"},
  {icon: 'mdi-timeline-clock-outline', label: 'Historique', link: "historique"},
])
</script>

<template>
  <v-navigation-drawer color="#080f05" :rail="rail" expand-on-hover app permanent v-model="drawer">
    <v-sheet
      color="grey-darken-4"
    >
      <v-list>
        <v-list-item prepend-icon="mdi-account-tie">
          {{ me?.name }}
        </v-list-item>
        <v-list-item>
          <v-btn
            block
            @click="rail = !rail"
            :color="rail ? 'primary' : 'secondary'"
            variant="text"
          >
            <v-icon size="large">{{ rail ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-if="me && me.role == 'employee'"
        prepend-icon="mdi-account-cog-outline"
        title="Profile"
        :to="'/me'"
        link
      ></v-list-item>
      <v-list-item
        v-if="me && me.role == 'admin'"
        v-for="link in links"
        :key="link.icon"
        :prepend-icon="link.icon"
        :title="link.label"
        :to="'/'+link.link"
        link
      ></v-list-item>
      <br/>
      <v-divider></v-divider>
      <v-list-item
        prepend-icon="mdi-logout"
        title="LOGOUT"
        :to="'/logout'"
        link
      ></v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<style scoped>

</style>
