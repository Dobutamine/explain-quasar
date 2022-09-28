.
<template>
  <q-page>
    <div class="row">
      <TimeBasedChart class="col"></TimeBasedChart>
    </div>
    <NonTimeBasedChart></NonTimeBasedChart>
  </q-page>
</template>

<script>
import TimeBasedChart from "../components/TimeBasedChart.vue";
import NonTimeBasedChart from "../components/NonTimeBaseChart.vue";

export default {
  components: {
    TimeBasedChart,
    NonTimeBasedChart,
  },
  methods: {},
  data() {
    return {};
  },
};
</script>

<style></style>
