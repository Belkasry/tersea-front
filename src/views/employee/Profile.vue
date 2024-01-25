<template>
  <v-container>
    <v-row>
      <!-- Employee Information Column -->
      <v-col cols="12" md="6">
        <v-card class="mb-5">
          <v-card-title> {{ employee.name }}</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>Name: {{ employee.name }}</v-list-item>
              <v-list-item>Email: {{ employee.email }}</v-list-item>
              <v-list-item>Address: {{ employee.address }}</v-list-item>
              <v-list-item>Phone Number: {{ employee.phone_number }}</v-list-item>
              <v-list-item>Date of Birth: {{ employee.birth_at }}</v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" text @click="dialog_edit=true">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-5">
          <v-card-title>Company Details</v-card-title>
          <v-card-text>
            <div>Name:
              <strong>{{ employee.company?.name }}</strong>
            </div>
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
    <v-dialog v-model="dialog_edit" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ employee.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert color="red" icon="mdi-alert-circle" v-if="errorMessage">{{ errorMessage }}</v-alert>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="employee.name" label="Name" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="employee.email" label="Email" required readonly></v-text-field>
              </v-col>
                <v-col cols="12">
                  <v-text-field v-model="employee.address" label="Address"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="employee.phone_number" label="Phone Number"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="employee.birth_at" label="Date of Birth" type="date"></v-text-field>
                </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog_edit=false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEmployee">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "@/services/axios.service";

export default {
  data() {
    return {
      search_employee: '',
      employee: {},
      dialog_edit: false,
      otherEmployees: [],
      errorMessage: ''
    };
  },
  mounted() {
    this.getEmployee();
    this.getCollegues();
  },
  methods: {
    async saveEmployee() {
      await axios.put('api/me', this.employee).then((response) => {
        this.getEmployee();
        this.dialog_edit=false;
        this.errorMessage = null;
      }).catch((err) => {
        this.errorMessage = err.response.data.message;
      })
    },
    async getEmployee() {
      await axios.get("api/me").then(
        (response) => {
          this.employee = response.data
        }
      )
    },
    async getCollegues() {
      await axios.get("api/me/collegues").then(
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
