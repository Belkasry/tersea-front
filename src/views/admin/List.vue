<template>
  <v-card flat title="Admin Management">
    <v-toolbar flat color="white">
      <v-toolbar-title>Admins</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-btn color="primary" dark class="ml-3" @click="addAdmin">
        Add Admin
      </v-btn>
    </v-toolbar>

    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="admins"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.invitation="{ item }">
        <v-switch
          :disabled="item.status=='Active'"
          :model-value="item.status=='Pending' || item.status=='Active'"
          @change="invite(item,item.status)"
          :color="getStatusColor(item.status)">
          <template v-slot:label>
            <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
            <v-progress-circular
              :indeterminate="item.status=='Pending'"
              v-if="item.status!=='Inactive'"
              size="24"
              :color="getStatusColor(item.status)"
              class="ms-2"
              color="success"
              :model-value="item.status=='Active'"
            ></v-progress-circular>
          </template>
        </v-switch>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editAdmin(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2" @click="deleteAdmin(item)" color="red">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogMode === 'add' ? 'Add' : 'Edit' }} Admin</span>
        </v-card-title>
        <v-card-text>
          <v-alert color="red" icon="mdi-alert-circle" class="my-2" v-if="errorMessage">{{ errorMessage }}</v-alert>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedAdmin.name"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedAdmin.email"
                  v-if="dialogMode!='edit'"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveAdmin">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_delete"
      persistent
      width="auto"
    >
      <v-card>
        <v-card-title class="text-h5">
          Delete {{ selectedAdmin.name }} ?
        </v-card-title>
        <v-card-text>Delete Permanently this user.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="dialog_delete = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="red"
            variant="text"
            @click="destroyAdmin"
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
import {getStatusColor} from "@/utils";
import {getToken} from "@/helpers/token.helper";
import axios from "@/services/axios.service";

export default {
  data() {
    return {
      loading: false,
      errorMessage: "",
      snackText: "",
      snackbar: false,
      selectedAdmin: {},
      invitations: [],
      dialog_delete: false,
      dialog: false,
      dialogMode: '',
      editedAdmin: {
        name: '',
        email: '',
      },
      editedIndex: -1,
      search: '',
      headers: [
        {
          title: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {title: 'Email', value: 'email'},
        {title: 'Invitation', value: 'invitation'},
        {title: 'Actions', value: 'actions', sortable: false},
      ],
      admins: [],
    };
  },
  methods: {
    getStatusColor,
    async getAdmins() {
      this.loading = true;
      await axios.get("api/admins").then(
        (response) => {
          this.admins = response.data
          this.loading = false;
        }
      )
    },
    async invite(item, status) {
      if (this.admins.find(e => e.id == item.id) == null) {
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
          this.admins.find(e => e.id == item.id).status = become;
          break;
        default:
          become = "Inactive";
          this.admins.find(e => e.id == item.id).status = become;
          break;
      }
      this.admins.find(e => e.id == item.id).status = become;
      await axios.put('api/admins/' + item.id + '/status', {status: become})
        .then((response) => {
          this.admins.find(e => e.id == item.id).status = response.data.status;
        })
    },
    addAdmin() {
      this.editedIndex = -1;
      this.editedAdmin = {name: '', email: ''};
      this.dialogMode = 'add';
      this.dialog = true;
    },
    editAdmin(item) {
      this.editedIndex = this.admins.indexOf(item);
      this.editedAdmin = Object.assign({}, item);
      this.dialogMode = 'edit';
      this.dialog = true;
    },
    async saveAdmin() {
      if (this.dialogMode === 'add') {
        await axios.post('api/admins', this.editedAdmin).then((response) => {
          this.getAdmins();
          this.closeDialog();
          this.errorMessage = null;
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        })

      } else if (this.dialogMode === 'edit') {
        await axios.put('api/admins/'+this.editedAdmin.id, this.editedAdmin).then((response) => {
          this.getAdmins();
          this.closeDialog();
          this.errorMessage = null;
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        })
      }

    },
    closeDialog() {
      this.dialog = false;
      this.editedAdmin = {name: '', email: ''};
      this.editedIndex = -1;
    },
    deleteAdmin(admin) {
      this.dialog_delete = true;
      this.selectedAdmin = admin;
    },
    async destroyAdmin(){
      await axios.delete('api/admins/' + this.selectedAdmin.id).then((response) => {
        this.getAdmins();
        this.dialog_delete = false;
      }).catch((err) => {
        this.dialog_delete = false;
        this.snackbar=true;
        this.snackText = err.response?.data?.message;
      })
    }
  },
  created() {
    console.log(getToken());
    this.getAdmins();
  }
};
</script>

<style>
/* Add custom styles here */
</style>
