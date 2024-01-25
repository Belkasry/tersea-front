<template>
  <v-container>
    <div>
      <v-alert
        v-if="messageError" class="ma-auto my-3" width="50%"
        variant="outlined"
        type="warning"
        prominent
        border="top"
      >
        {{ messageError }}
      </v-alert>
    </div>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card v-if="user" class="pa-7">
          <h2>Enter your Password {{ user.name }}</h2>
          <v-form @submit.prevent="resetPassword">
            <v-text-field
              v-model="password"
              label="New Password"
              type="password"
              :rules="rules"
              required
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              label="Confirm New Password"
              :rules="rules"
              type="password"
              required
            ></v-text-field>
            <v-btn color="primary" type="submit">Reset Password</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import router from "@/router";

export default {
  data: () => ({
    user: null,
    password: '',
    newPassword: '',
    token: '',
    messageError: "",
    rules: [
      value => {
        if (value) return true
        return 'You must enter password.'
      },
    ],
  }),
  created() {
    this.token = this.getTokenFromUrl();
    this.checkUser();
  },
  methods: {
    getTokenFromUrl() {
      const queryParams = new URLSearchParams(window.location.search);
      return queryParams.get('token');
    },
    async checkUser() {
      await axios
        .get(`/api/password/check-token?token=${this.token}`, {
          headers: {'Accept': 'application/json'}
        })
        .then(response => {
          this.user = response.data.user;
          this.messageError = null;
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          this.user = null;
          console.log(error)
          this.messageError = error.response?.data?.message
        });
    },
    async resetPassword() {

      if (this.newPassword != this.password) {
        this.messageError = "Passwords don't match";
        return;
      }

      const data = new FormData();
      data.append('new_password', this.newPassword);
      data.append('token', this.token);

      await axios
        .post('api/password/reset', data, {
          headers: {
            'Accept': 'application/json',
          }
        })
        .then(response => {
          console.log('Password reset successful:', response.data);
          this.messageError = null;
          router.push({path: 'login',  query: {email: this.user?.email}})
        })
        .catch(error => {
          console.error('Error resetting password:', error);
          this.messageError = error.response?.data?.message
        });
    }
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
