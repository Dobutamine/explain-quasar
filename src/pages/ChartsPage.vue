.
<template>
  <q-page>
    <div class="row">
      <TimeBasedChart class="col"></TimeBasedChart>
    </div>
    <NonTimeBasedChart></NonTimeBasedChart>
    <ModelControllerVue class="q-ma-sm absolute-bottom"></ModelControllerVue>
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
    NonTimeBasedChart,
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
