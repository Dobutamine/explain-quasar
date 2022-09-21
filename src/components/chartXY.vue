<template>
  <div>
    <q-btn @click="test">TEST</q-btn>
    <div class="chart" :id="chartId"></div>
  </div>
</template>

<script>
// we have to declare the chart object here otherwise some chart functions won't work!
let chartsXY = {};

import {
  lightningChart,
  emptyFill,
  SolidFill,
  ColorHEX,
  AxisTickStrategies,
  FontSettings,
  Themes,
} from "@arction/lcjs";

export default {
  props: ["points"],
  data() {
    return {
      chartId: "chart",
      lineSeries: null,
      arrayY: [100, 200, 300],
    };
  },
  methods: {
    test() {
      this.lineSeries.addArrayY([500]);
      chartsXY[this.chartId].chartYAxis.setTitle("Changed");
    },
    createChart() {
      let chart_object = {
        chart: null,
        chartXAxis: null,
        chartYAxis: null,
      };

      chart_object.chart = lightningChart().ChartXY({
        container: this.chartId,
        thems: Themes.auroraBorealis,
        antialias: true,
      });
      chart_object.chart.setTitle("Power Spectrum Density");
      chart_object.chart.setTitleFont(
        new FontSettings({ size: 12, style: "italic" })
      );

      // Set up axes
      chart_object.chartXAxis = chart_object.chart.getDefaultAxisX();
      chart_object.chartXAxis
        .setTitle("Time")
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#FFF") }))
        .setTickStrategy(AxisTickStrategies.Numeric);

      chart_object.chartYAxis = chart_object.chart.getDefaultAxisY();
      chart_object.chartYAxis
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#FFF") }))
        .setTitleFont(new FontSettings({ size: 12, style: "italic" }))
        .setTitle("Frequency (Hz)")
        .setInterval(0, 750, false, true);

      //   dummy data
      this.lineSeries = chart_object.chart.addLineSeries().setName("Test");
      this.lineSeries.addArrayY([100, 200, 300]);

      // add the chart to the global charts object
      chartsXY[this.chartId] = chart_object;
    },
  },
  beforeUnmount() {
    delete chartsXY[this.chartId];
    console.log(`Removed chart with id: ${this.chartId} from charts`);
  },
  beforeMount() {
    this.chartId = "chart" + Math.floor(Math.random() * 1000);
  },
  mounted() {
    this.createChart();
  },
};
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style>
.chart {
  background: black;
  width: 100%;
  height: 300px;
}
</style>
