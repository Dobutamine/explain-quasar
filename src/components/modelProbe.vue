<template>
  <div>
    <div class="chart" :id="chartId"></div>
    <q-btn @click="calculate">CALCULATE</q-btn>
  </div>
</template>

<script>
// we have to declare the chart object here otherwise some chart functions won't work!
let chartsXY = {};

import { explainModel } from "src/boot/explain";

import {
  lightningChart,
  emptyFill,
  ColorRGBA,
  SolidFill,
  ColorHEX,
  AxisTickStrategies,
  AxisScrollStrategies,
  FontSettings,
  Themes,
} from "@arction/lcjs";

export default {
  setup() {},
  props: {
    model: String,
    prim_prop: String,
    sec_prop: String,
  },
  data() {
    return {
      chartId: "chart",
      chartData: [],
      autoscaleX: false,
      autoscaleY: false,
      title: "Title",
      lineTitle: "LineTitle",
      yLabel: "parameter",
      xLabel: "time",
      width: "100%",
      height: "300px",
      minX: 0,
      maxX: 100,
      minY: 0,
      maxY: 100,
    };
  },
  methods: {
    compUpdate() {
      console.log(explainModel.modelComponents);
    },
    errorUpdate() {
      console.log(explainModel.errorMessage);
    },
    dataUpdate() {
      this.chartData = [];
      this.lineSeries.clear();
      explainModel.modelData.forEach((data) => {
        this.chartData.push({ x: data.time, y: data["AA.pres"] });
      });
      this.lineSeries.add(this.chartData);
    },
    statusUpdate() {
      console.log(explainModel.statusMessage);
    },
    calculate() {
      explainModel.calculate(5);
      explainModel.getComponents();
    },
    createChart() {
      let chart_object = {
        chart: null,
        chartXAxis: null,
        chartYAxis: null,
      };

      // Set up chart
      chart_object.chart = lightningChart().ChartXY({
        container: this.chartId,
        theme: Themes.light,
        antialias: true,
        disableAnimations: false,
        responsive: true,
        maintainAspectRatio: false,
      });

      chart_object.chart.setTitle(this.title);
      chart_object.chart.setTitleFont(
        new FontSettings({ size: 12, style: "normal" })
      );
      chart_object.chart.setPadding({ top: 0, bottom: 0, left: 15, right: 30 });

      // Set up axes
      chart_object.chartXAxis = chart_object.chart.getDefaultAxisX();
      chart_object.chartXAxis
        .setTitle(this.xLabel)
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#000") }))
        .setTitleFont(new FontSettings({ size: 12, style: "normal" }))

        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )

        .setScrollStrategy(AxisScrollStrategies.fitting)
        .setAnimationScroll(false);

      chart_object.chartYAxis = chart_object.chart.getDefaultAxisY();
      chart_object.chartYAxis
        .setTitle(this.yLabel)
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#000") }))
        .setTitleFont(new FontSettings({ size: 12, style: "normal" }))

        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting);
      //.setAnimationScroll(false);

      /*  Axis.setScrollStrategy | configure automatic scrolling behavior.
          Axis.setInterval | configure active axis interval.
          Axis.getInterval | get active axis interval.
          Axis.fit | fit axis interval to contain all attached series boundaries.
          Axis.stop | stop automatic scrolling momentarily.
          Axis.onScaleChange | trigger a custom action whenever axis scale changes.
          Axis.setAnimationScroll | Enable/disable automatic scrolling animation.
          Axis.disableAnimations | Disable all animations for the Axis.
      */

      // https://lightningchart.com/lightningchart-js-api-documentation/v3.4.0/classes/axis.html

      //   dummy data
      this.lineSeries = chart_object.chart
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) }))
      );
      //this.lineSeries.add(this.points);

      // add the chart to the global chartsXY array
      chartsXY[this.chartId] = chart_object;
    },
  },
  beforeUnmount() {
    // remove the current chart from the chartsXY array (which is a global object)
    delete chartsXY[this.chartId];

    document.removeEventListener("data", this.dataUpdate);
    document.removeEventListener("error", this.errorUpdate);
    document.removeEventListener("status", this.statusUpdate);
    document.removeEventListener("comp", this.compUpdate);
  },
  beforeMount() {
    // generate a unique chartID
    this.chartId = "chart" + Math.floor(Math.random() * 10000);
  },
  mounted() {
    // create the chart
    this.createChart();

    document.addEventListener("data", this.dataUpdate);
    document.addEventListener("status", this.statusUpdate);
    document.addEventListener("error", this.errorUpdate);
    document.addEventListener("comp", this.compUpdate);
  },
};
</script>

<style>
.chart {
  background: black;
  width: 100%;
  height: 300px;
}
</style>
