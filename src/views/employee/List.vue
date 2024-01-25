<template>
  <v-card flat title="Employee Management" class="overflow-x-auto" min-width="70vw">
    <List></List>
  </v-card>
</template>

<script>
import {getStatusColor} from "@/utils";
import axios from "@/services/axios.service";
import {defineComponent} from "vue";
import List from "@/components/employee/List.vue";

export default defineComponent({
  components: {List}
})


</script>
