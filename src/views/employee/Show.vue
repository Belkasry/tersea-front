<template>
  <v-container>
    <v-row>
      <!-- Employee Information Column -->
      <v-col cols="12" md="6">
        <v-card class="mb-5">
          <v-card-title>Employee: {{ employee.name }}</v-card-title>
          <v-card-text>
          <v-list>
            <v-list-item>Name: {{ employee.name }}</v-list-item>
            <v-list-item>Email: {{ employee.email }}</v-list-item>
            <v-list-item>Address: {{ employee.address }}</v-list-item>
            <v-list-item>Phone Number: {{ employee.phone_number }}</v-list-item>
            <v-list-item>Date of Birth: {{ employee.birth_at }}</v-list-item></v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="deleteEmployee">Delete Employee</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Company Information Column -->
      <v-col cols="12" md="6">
        <v-card class="mb-5">
          <v-card-title>Company Details</v-card-title>
          <v-card-text>
            <div>Name: <RouterLink :to="'/company/'+employee.company?.id">{{ employee.company?.name }}</RouterLink></div>
            <div>Email: {{ employee.company?.email }}</div>
            <div>Sector: {{ employee.company?.sector?.name }}</div>
            <div>Address: {{ employee.company?.address }}</div>
            <div>Phone Number: {{ employee.company?.phone_number }}</div>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Other Employees in the Same Company</v-card-title>
          <v-card-text>
            <v-data-iterator :items="otherEmployees"
                             :search="search_employee"
                             :items-per-page="3">
              <template v-slot:header>

                  <v-text-field
                    v-model="search_employee"
                    clearable
                    class="my-2"
                    density="comfortable"
                    hide-details
                    placeholder="Search"
                    prepend-inner-icon="mdi-magnify"
                    style="max-width: 300px;"
                    variant="solo"
                  ></v-text-field>

              </template>
              <template v-slot:default="{ items }">
                <template
                  v-for="(item, i) in items"
                  :key="i"
                >
                  <v-alert>{{ item.raw.name }}</v-alert>
                  <br>
                </template>
              </template>
              <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                <div class="d-flex align-center justify-center pa-4">
                  <v-btn
                    :disabled="page === 1"
                    icon="mdi-arrow-left"
                    density="comfortable"
                    variant="tonal"
                    rounded
                    @click="prevPage"
                  ></v-btn>

                  <div class="mx-2 text-caption">
                    Page {{ page }} of {{ pageCount }}
                  </div>
                  <v-btn
                    :disabled="page >= pageCount"
                    icon="mdi-arrow-right"
                    density="comfortable"
                    variant="tonal"
                    rounded
                    @click="nextPage"
                  ></v-btn>
                </div>
              </template>
            </v-data-iterator>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/services/axios.service";

export default {
  data() {
    return {
      search_employee:'',
      id: this.$route.params.id,
      employee: {},
      otherEmployees: [
      ],
    };
  },
  mounted() {
    this.getEmployee();
    this.getCollegues();
  },
  methods: {
    async getEmployee() {
      const id=this.id?this.id:null;
      await axios.get("api/employees/"+id).then(
        (response) => {
          this.employee = response.data
        }
      )
    },
    async getCollegues() {
      const id=this.id?this.id:null;
      await axios.get("api/employees/"+id+"/collegues").then(
        (response) => {
          this.otherEmployees = response.data
        }
      )
    },
    editEmployee() {
      // Logic to edit employee
    },
    deleteEmployee() {
      // Logic to delete employee
    }
  }
};
</script>
