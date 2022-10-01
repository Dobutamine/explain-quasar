.
<template>
  <div class="q-mt-sm">
    <div class="col">
      <div class="q-gutter-sm row justify-center">
        <q-btn color="black" size="sm" @click="calculate">CALCULATE</q-btn>
        <q-input
          v-model.number="number_of_seconds"
          type="number"
          label="timeframe(s)"
          outlined
          dense
          style="width: 95px; font-size: 10px"
          @update:model-value="calculate"
        />
        <q-checkbox
          v-model="hires"
          dense
          label="hires"
          @update:model-value="hires_toggle"
          style="font-size: 12px"
        />
        <q-btn :color="btn_color" size="sm" @click="start">{{
          rt_toggle_text
        }}</q-btn>
      </div>
    </div>
    <q-separator class="q-mt-sm" size="2px"></q-separator>
  </div>
</template>

<script>
import { explainModel } from "src/boot/explain";

export default {
  data() {
    return {
      hires: false,
      btn_color: "positive",
      number_of_seconds: 5,
      rt_running: false,
      rt_toggle_text: "START",
    };
  },
  methods: {
    hires_toggle() {
      explainModel.setDataloggingResolution(this.hires);
      this.calculate();
    },
    start() {
      if (this.rt_running) {
        this.rt_running = false;
        explainModel.stop();
        this.rt_toggle_text = "START";
        this.btn_color = "positive";
      } else {
        this.rt_running = true;
        explainModel.start();
        this.rt_toggle_text = "STOP";
        this.btn_color = "negative";
      }
    },
    calculate() {
      explainModel.calculate(this.number_of_seconds);
    },
  },
  beforeUnmount() {},
  mounted() {},
};
</script>

<style></style>
