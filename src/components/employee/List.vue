<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Employees</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-btn color="primary" dark class="ml-3" @click="addEmployee">
        Add Employee
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="employees"
      :search="search"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:[`item.name`]="{ item }">
        <RouterLink :to="'/employee/'+item.id">{{ item.name }}</RouterLink>
      </template>
      <template v-slot:[`item.company`]="{ item }">
        <RouterLink :to="'/company/'+item.company.id">{{ item.company?.name }}</RouterLink>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <div class="ma-1">
          <v-switch
            :disabled="item.user?.status=='Active'"
            hide-details
            :model-value="item.user?.status=='Pending' || item.user?.status=='Active'"
            @change="invite(item,item.user?.status)"
            :color="getStatusColor(item.user?.status)">
            <template v-slot:label>
              <v-progress-circular
                :indeterminate="item.user?.status=='Pending'"
                v-if="item.user?.status!=='Inactive'"
                size="24"
                :color="getStatusColor(item.user?.status)"
                color="success"
                :model-value="item.user?.status=='Active'"
              ></v-progress-circular>
            </template>
          </v-switch>
          <v-chip :color="getStatusColor(item.user?.status)" dark>{{ item.user?.status }}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editEmployee(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2" @click="deleteEmployee(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogMode === 'add' ? 'Add' : 'Edit' }} Employee</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert color="red" icon="mdi-alert-circle" v-if="errorMessage">{{ errorMessage }}</v-alert>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedEmployee.name" label="Name" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :readonly="dialogMode =='edit'"
                  v-model="editedEmployee.email" label="Email" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedEmployee.company_id"
                  :value="company_id"
                  :disabled="company_id"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  label="Company">
                </v-autocomplete>
              </v-col>
              <template v-if="false">
                <v-col cols="12">
                  <v-text-field v-model="editedEmployee.address" label="Address"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedEmployee.phone_number" label="Phone Number"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedEmployee.birth_at" label="Date of Birth" type="date"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select v-model="editedEmployee.status" :items="statuses" label="Status"></v-select>
                </v-col>
              </template>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEmployee">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_delete_employee"
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
            @click="dialog_delete_employee = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="dialog_delete_employee = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </div>
</template>

<script>
import {getStatusColor} from "@/utils";
import axios from "@/services/axios.service";

export default {
  props: {
    company_id: {default: null}
  },
  data() {
    return {
      snackText: '',
      snackbar: false,
      dialog_delete_employee: false,
      errorMessage: "",
      dialog: false,
      loading: false,
      dialogMode: '',
      menu: false,
      companies: [],
      editedEmployee: {
        name: '',
        email: '',
        address: '',
        phone_number: '',
        birth_at: '',
        company_id: null,
        status: ''
      },
      editedIndex: -1,
      search: '',
      headers: [
        {title: 'ID', key: 'id'},
        {title: 'Actions', key: 'actions', sortable: false, width: '200px'},
      ],
      statuses: ['Active', 'Pending', 'Inactive'],
      employees: []
    };
  },
  mounted() {
    this.loadHeader();
    this.getCompanies();
    this.getEmployees();
  },
  methods: {
    loadHeader() {
      if (!this.company_id) {
        this.headers = [
          {title: 'ID', key: 'id'},
          {title: 'Name', key: 'name'},
          {title: 'Email', key: 'email'},
          {title: 'Status', key: 'status', width: '300px'},
          {title: 'Address', key: 'address'},
          {title: 'Phone Number', key: 'phone_number'},
          {title: 'Birthday', key: 'birth_at'},
          {title: 'Company', key: 'company'},
          {title: 'Actions', key: 'actions', sortable: false},
        ]
      } else {
        this.headers = [
          {title: 'Name', key: 'name'},
          {title: 'Email', key: 'email'},
          {title: 'Status', key: 'status', width: '300px'},
          {title: 'Actions', key: 'actions', sortable: false, width: '200px'},
        ]
      }
    },
    async invite(item, status) {
      const initial=item.status;
      if (this.employees.find(e => e.id == item.id) == null) {
        console.log(item);
        return;
      }
      let become = "Inactive";
      switch (status) {
        case "Pending" :
          become = "Inactive";
          break;
        case "Inactive" :
          become = "Pending";
          break;
        case "Active" :
          become = "Active";
          break;
        default:
          become = "Inactive";
          break;
      }
      this.employees.find(e => e.id == item.id).user.status = become;
      await axios.put('api/employees/' + item.id + '/status', {status: become})
        .then((response) => {
          this.employees.find(e => e.id == item.id).user.status = response.data.status;
          if (response.data.status == "Pending") {
            this.snackText = "Invitation sent to : " + item.email
            this.snackbar = true;
          }
        })
      ;
    },
    async saveEmployee() {
      if (this.dialogMode === 'add') {
        await axios.post('api/employees', this.editedEmployee).then((response) => {
          this.getEmployees();
          this.closeDialog();
          this.errorMessage = null;
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        })

      } else if (this.dialogMode === 'edit') {
        await axios.put('api/employees/' + this.editedEmployee.id, this.editedEmployee).then((response) => {
          this.getEmployees();
          this.closeDialog();
          this.errorMessage = null;
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        })
      }
    },
    async getEmployees() {
      this.loading = true;
      let url = "api/employees";
      if (this.company_id) {
        url = url + "?company=" + this.company_id;
      }
      await axios.get(url).then(
        (response) => {
          this.employees = response.data
          this.loading = false;
        }
      )
    },
    addEmployee() {
      this.editedIndex = -1;
      this.editedEmployee = {
        name: '',
        email: '',
        address: '',
        phone_number: '',
        birth_at: '',
        company_id: this.company_id ? parseInt(this.company_id) : null,
        status: ''
      };
      this.dialogMode = 'add';
      this.dialog = true;
    },
    editEmployee(item) {
      this.editedIndex = this.employees.indexOf(item);
      this.editedEmployee = Object.assign({}, item);
      this.dialogMode = 'edit';
      this.dialog = true;
    },
    deleteEmployee(employee) {
      this.selected_employee = employee;
      this.dialog_delete_employee = true;
    },
    closeDialog() {
      this.dialog = false;
      this.editedEmployee = {
        name: '',
        email: '',
        address: '',
        phone_number: '',
        birth_at: '',
        company_id: '',
        status: ''
      };
      this.editedIndex = -1;
    },
    getStatusColor,
    async getCompanies() {
      this.loading = true;
      await axios.get("api/companies").then(
        (response) => {
          this.companies = response.data
          this.loading = false;
        }
      )
    },
  },
};
</script>
