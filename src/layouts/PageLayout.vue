<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-indigo-10 text-caption">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-h6" size="sm">
          Explanatory models in neonatology</q-toolbar-title
        >

        <div>Logged in user:</div>
        <div class="text-bold q-ml-sm">{{ user.name }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      show-if-above
      bordered
      :width="200"
    >
      <q-list class="q-mt-md">
        <q-item
          clickable
          @click="gotoMyHospital"
          target="_blank"
          rel="noopener"
        >
          <q-item-section avatar>
            <q-icon name="fa-solid fa-heart-pulse" />
          </q-item-section>
          <q-item-section>
            <q-item-label>New</q-item-label>
            <q-item-label caption>new model</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="gotoMyHospital"
          target="_blank"
          rel="noopener"
        >
          <q-item-section avatar>
            <q-icon name="fa-solid fa-download" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Open</q-item-label>
            <q-item-label caption>load model</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="gotoMyHospital"
          target="_blank"
          rel="noopener"
        >
          <q-item-section avatar>
            <q-icon name="fa-solid fa-save" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Save</q-item-label>
            <q-item-label caption>save model</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator></q-separator>

        <q-item clickable target="_blank" rel="noopener" @click="gotoBedView">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-sitemap" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Overview</q-item-label>
            <q-item-label caption>schematic model view </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable target="_blank" rel="noopener" @click="gotoBedView">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-list-check" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Interventions</q-item-label>
            <q-item-label caption>display interventions </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable target="_blank" rel="noopener" @click="gotoBedView">
          <q-item-section avatar>
            <q-icon name="monitor" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Monitor</q-item-label>
            <q-item-label caption>display outputs </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator></q-separator>
        <q-item clickable target="_blank" rel="noopener" @click="gotoBedView">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-gears" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
            <q-item-label caption>my settings </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" @click="gotoLogin">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-arrow-right-from-bracket" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Log uit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useLoggedInUserStore } from "stores/loggedInUser";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const user = useLoggedInUserStore();

    return {
      user,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {
    gotoAdmin() {
      this.$router.push("/admin301150");
    },
    gotoFilters() {
      this.$router.push("/filters");
    },
    gotoTransfers() {
      this.$router.push("/transfers");
    },
    gotoBedView() {
      this.$router.push("/mybeds");
    },
    gotoLogin() {
      this.$router.push("/");
    },
    gotoMyHospital() {
      this.$router.push("/myhospital");
    },
    gotoUser() {
      this.$router.push("/me");
    },
  },
};
</script>
