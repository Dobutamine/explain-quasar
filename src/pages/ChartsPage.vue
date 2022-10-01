.
<template>
  <q-page>
    <div class="row">
      <TimeBasedChart class="col"></TimeBasedChart>
    </div>

    <ModelControllerVue></ModelControllerVue>
  </q-page>
</template>

<script>
import { explainModel } from "src/boot/explain";

import TimeBasedChart from "../components/TimeBasedChart.vue";
import NonTimeBasedChart from "../components/NonTimeBaseChart.vue";
import ModelControllerVue from "src/components/ModelController.vue";

export default {
  components: {
    TimeBasedChart,

    ModelControllerVue,
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
