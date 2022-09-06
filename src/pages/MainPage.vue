<template>
  <q-layout>
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn dense flat round icon="menu" />
        <q-toolbar-title> KIND ZOEKT BED</q-toolbar-title>

        <div>Ingelogd als:</div>
        <div class="text-bold q-ml-sm">{{ user.name }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useLoggedInUserStore } from "stores/loggedInUser";

export default defineComponent({
  setup() {
    const user = useLoggedInUserStore();
    return { user };
  },
  name: "MainLayout",
  components: {},
});
</script>
