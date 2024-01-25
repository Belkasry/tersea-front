<template>
  <v-container>
   <v-row>
     <v-col cols="12" md="4"> <v-card class="mb-5 h-100">
       <v-card-title><v-icon>mdi-office-building-marker-outline</v-icon>Company Details</v-card-title>
       <v-card-text>
         <v-list>
             <v-list-item>Name: {{ company.name }}</v-list-item>
             <v-list-item>Email: {{ company.email }}</v-list-item>
             <v-list-item>Sector: {{ company.sector?.name }}</v-list-item>
             <v-list-item>Address: {{ company.address }}</v-list-item>
             <v-list-item>Phone: {{ company.phone_number }}</v-list-item>
         </v-list>
       </v-card-text>
       <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="primary" variant="flat" @click="editCompany"><v-icon>mdi-pencil</v-icon></v-btn>
         <v-btn color="error" variant="flat" @click="confirmDelete"><v-icon>mdi-delete</v-icon></v-btn>
       </v-card-actions>
     </v-card></v-col>
     <v-col cols="12" md="8">
       <EmployeeList :company_id="id"></EmployeeList>
     </v-col>
   </v-row>
  </v-container>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Company</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="company.name"
                label="Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="company.email"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="company.sector_id"
                label="Sector"
                :items="sectors"
                item-value="id"
                item-title="name"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="company.address"
                label="Address"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="company.phone_number"
                label="Phone Number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog=false">Cancel</v-btn>
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
          @click="destroyCompany()"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialog_edit_employe" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogMode === 'add' ? 'Add' : 'Edit' }} Employee</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editedEmployee.name" label="Name" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedEmployee.email" label="Email"  disabled></v-text-field>
            </v-col>
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
import EmployeeList from "@/components/employee/List.vue";
import router from "@/router";

export default {
  components: {EmployeeList},
  data() {
    return {
      dialogMode: '',
      menu: false,
      editedEmployee: {
        name: '',
        email: '',
        address: '',
        phone_number: '',
        birth_at: '',
        company_id: '',
        status: ''
      },
      editedIndex: -1,
      dialog_edit_employe:false,
      dialog_delete_company:false,
      dialog:false,
      company: {
      },
      id: this.$route.params.id,
      employeeHeaders: [
        {title: 'Name', key: 'name'},
        {title: 'Email', key: 'email'},
        {title: 'Address', key: 'address'},
        {title: 'Phone Number', key: 'phone_number'},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      employees: [
        {
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          address: '123 Maple Street, Anytown, AT 12345',
          phone_number: '555-1234',
          birth_at: '1985-04-12',
          company_id: '1',
          status: 'Active'
        },
        {
          name: 'Bob Smith',
          email: 'bob.smith@example.com',
          address: '456 Oak Avenue, Othertown, OT 67890',
          phone_number: '555-5678',
          birth_at: '1990-07-23',
          company_id: '2',
          status: 'Pending'
        },
        {
          name: 'Carol White',
          email: 'carol.white@example.com',
          address: '789 Pine Road, Sometown, ST 13579',
          phone_number: '555-9012',
          birth_at: '1982-11-16',
          company_id: '3',
          status: 'Inactive'
        },
        {
          name: 'David Green',
          email: 'david.green@example.com',
          address: '321 Birch Lane, Anothertown, AT 24680',
          phone_number: '555-3456',
          birth_at: '1975-03-08',
          company_id: '1',
          status: 'Active'
        },
        // Add more employee data as needed
      ],
      sectors:[],
    };
  },
  mounted() {
    this.getValref();
    this.getCompany();
  },
  methods: {
    async getValref() {
      this.loading = true;
      await axios.get("api/valref/sectors").then(
        (response) => {
          this.sectors = response.data
        }
      )
    },
    async getCompany() {
      this.loading = true;
      const id=this.id?this.id:null;
      await axios.get("api/companies/"+id).then(
        (response) => {
          this.company = response.data
        }
      )
    },
    editCompany() {
      this.dialog = true;
    },
    async confirmDelete() {
      this.dialog_delete_company = true;
    },
    async destroyCompany() {
      await axios.delete('api/companies/' + this.company.id).then((response) => {
        router.push("/company")
      }).catch((err) => {
        this.dialog_delete_company = false;
        this.snackbar=true;
        this.snackText = err.response?.data?.message;
      })
    },
    async saveCompany() {
        await axios.put('api/companies/' + this.company.id, this.company).then((response) => {
          this.getCompany();
          this.dialog=false;
          this.errorMessage = null;
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        })
    },
  }
};
</script>
