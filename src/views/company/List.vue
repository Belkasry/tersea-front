<template>
  <v-card flat title="Company Management">
    <v-toolbar flat color="white">
      <v-toolbar-title>Companies</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-btn color="primary" dark class="ml-3" @click="addCompany">
        Add Company
      </v-btn>
    </v-toolbar>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="companies"
      :search="search"
      class="elevation-1"
    >

      <template v-slot:item.name="{ item }">
        <RouterLink :to="'/company/'+item.id">{{ item.name }}</RouterLink>
      </template>
      <template v-slot:item.sector="{ item }">
        <v-chip label>{{ item.sector?.name }}</v-chip>
      </template>
      <template v-slot:item.employees_count="{ item }">
        <v-chip label variant="outlined" color="info">{{ item.employees_count }}</v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <RouterLink :to="'/company/'+item.id">
          <v-icon small class="mr-2">
            mdi-eye
          </v-icon>
        </RouterLink>
        <v-icon small class="mr-2" @click="editCompany(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2" @click="confirmDelete(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogMode === 'add' ? 'Add' : 'Edit' }} Company</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedCompany.name"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedCompany.email"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedCompany.sector_id"
                  label="Sector"
                  :items="sectors"
                  item-value="id"
                  item-title="name"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedCompany.address"
                  label="Address"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedCompany.phone_number"
                  label="Phone Number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveCompany">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_delete_company"
      persistent
      width="auto"
    >
      <v-card>
        <v-card-title class="text-h5">
          Delete Company
        </v-card-title>
        <v-card-text>Delete permanently the company?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="dialog_delete_company = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteCompany(selectedCompany)"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
  <v-snackbar
    v-model="snackbar"
    multi-line
  >
    {{ snackText }}

    <template v-slot:actions>
      <v-btn
        color="red"
        variant="text"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import axios from "@/services/axios.service";

export default {
  data() {
    return {
      selectedCompany: {},
      dialog_delete_company: false,
      snackbar: false,
      snackText: "",
      dialog: false,
      loading: false,
      dialogMode: '',
      editedCompany: {
        sector_id: null,
        name: '',
        email: '',
        sector: {},
        address: '',
        phone_number: ''
      },
      editedIndex: -1,
      search: '',
      headers: [
        {title: 'ID', key: 'id'},
        {title: 'Name', key: 'name'},
        {title: 'Email', key: 'email'},
        {title: 'Sector', key: 'sector'},
        {title: 'Address', key: 'address'},
        {title: 'Phone Number', key: 'phone_number'},
        {title: 'Count Employees', key: 'employees_count'},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      sectors: [],
      companies: [],
    };
  },
  methods: {
    async getCompanies() {
      this.loading = true;
      await axios.get("api/companies").then(
        (response) => {
          this.companies = response.data
          this.loading = false;
        }
      )
    },
    addCompany() {
      this.editedIndex = -1;
      this.editedCompany = {name: '', email: '', sector: '', address: '', phone_number: ''};
      this.dialogMode = 'add';
      this.dialog = true;
    },
    async getValref() {
      this.loading = true;
      await axios.get("api/valref/sectors").then(
        (response) => {
          this.sectors = response.data
        }
      )
    },
    editCompany(item) {
      this.editedIndex = this.companies.indexOf(item);
      this.editedCompany = Object.assign({}, item);
      this.dialogMode = 'edit';
      this.dialog = true;
    },
    async confirmDelete(company) {
      this.selectedCompany = company;
      this.dialog_delete_company = true;
    },
    async deleteCompany() {
      await axios.delete('api/companies/' + this.selectedCompany.id).then((response) => {
        this.getCompanies();
        this.dialog_delete_company = false;
      }).catch((err) => {
        this.dialog_delete_company = false;
        this.snackbar=true;
        this.snackText = err.response?.data?.message;
      })
    },
    closeDialog() {
      this.dialog = false;
      this.editedCompany = {name: '', email: '', sector: '', address: '', phone_number: ''};
      this.editedIndex = -1;
    },
    async saveCompany() {
      if (this.dialogMode === 'add') {
        await axios.post('api/companies', this.editedCompany).then((response) => {
          this.getCompanies();
          this.closeDialog();
          this.errorMessage = null;
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        })

      } else if (this.dialogMode === 'edit') {
        await axios.put('api/companies/' + this.editedCompany.id, this.editedCompany).then((response) => {
          this.getCompanies();
          this.closeDialog();
          this.errorMessage = null;
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        })
      }

    },
  },
  mounted() {
    this.getValref();
    this.getCompanies();
  }
};
</script>
