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
import { explainModel } from "src/boot/explain";

import TimeBasedChart from "../components/TimeBasedChart.vue";
import NonTimeBasedChart from "../components/NonTimeBaseChart.vue";

export default {
  components: {
    TimeBasedChart,
    NonTimeBasedChart,
  },
  methods: {
    StartRT() {
      explainModel.start();
    },
    StopRT() {
      explainModel.stop();
    },
  },
  data() {
    return {};
  },
};
</script>

<style></style>
