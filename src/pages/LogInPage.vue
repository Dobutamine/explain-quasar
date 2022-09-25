<template>
  <q-page class="bg-grey-9 flex flex-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h6 text-white q-my-sm">EXPLAIN</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-md shadow-1">
          <q-card-section>
            <q-form class="q-gutter-sm text-white">
              <q-input
                square
                filled
                clearable
                v-model="username"
                type="text"
                label="username"
              />
              <q-input
                square
                filled
                clearable
                v-model="password"
                type="password"
                label="password"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-sm">
            <q-btn
              unelevated
              color="negative"
              size="md"
              class="full-width"
              label="Login"
              @click="logInUser"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-red">
              {{ error }}
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useLoggedInUserStore } from "stores/loggedInUser";

export default {
  setup() {
    const user = useLoggedInUserStore();
    return { user, alert: ref(false) };
  },
  mounted() {
    // erase the store
    this.user.name = "";
    this.user.token = "";
  },
  data() {
    return {
      apiAddress: "http://188.166.29.24:80/api/auth",
      username: "Timothy",
      password: "Headwig73",
      error: "",
    };
  },
  methods: {
    async logInUser() {
      this.$router.push("/start");
      // get the user login data
      let response = await fetch(this.apiAddress, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: this.username, password: this.password }),
      });

      if (response.status === 200) {
        let data = await response.json();
        // we now have a user _id and isAdmin and a token
        this.user.token = data.token;
        this.user.id = data._id;
        this.user.name = data.name;
        this.user.email = data.email;
        this.user.isAdmin = data.isAdmin;
        this.user.lastLogin = data.lastLogin;

        // no error so set the error object to empy
        this.error = "";

        // show the startup screen
        this.$router.push("/start");
      } else {
        this.error = "Invalid login or password!";
        // reset the current user object
        this.user.resetUser();
        // reset the password entry
        this.password = "";
      }
    },
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
