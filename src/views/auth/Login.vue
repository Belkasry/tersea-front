<script setup>
import {reactive, ref} from "vue";
import axios from "axios";
import {getToken, setToken} from "@/helpers/token.helper.js";
import router from "@/router";

// I did name it identifier because it could email or username
const user = reactive({email: "", password: ""});
const message_error = ref("");
const loading=ref(false);
const queryParams = new URLSearchParams(window.location.search);
const email = queryParams.get('email');
if (email) {
  user.email = email;
}

async function submitLogin() {
  loading.value = true;
  try {
    const res = await axios.post("/api/login", user);
    message_error.value = "";
    const jwt = res.data.token;
    localStorage.setItem("me", JSON.stringify(res.data.user));
    setToken(jwt);
    console.log(getToken());
    window.location.href="/";
  } catch (err) {
    message_error.value = err.response.data.message;
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <v-container class="ma-auto">
    <div>
      <v-img class="my-5 mx-auto" width="20vw" src="@/assets/logo.svg"></v-img>
      <v-card class="pa-6 mx-auto" max-width="480"
      >
        <v-card-title class="text-center mb-6">Log in</v-card-title>
        <v-alert type="error" v-if="message_error">
          {{ message_error }}
        </v-alert>
        <v-container
        >
          <v-text-field
            v-model="user.email"
            label="Username/email"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            label="Password"
            type="password"
          ></v-text-field
          >
        </v-container>
        <v-card-actions
        >
          <v-btn @click="submitLogin" color="green" variant="tonal" block :loading="loading"
          >Sign in
          </v-btn
          >
        </v-card-actions
        >
      </v-card>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.auth-card-container {
  width: 100%;
  height: 100%;
  margin: auto;

  .logo {
    max-width: 470px;
    max-height: 79px;
    margin-bottom: 64px;
  }
}

.bg-logo {
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
