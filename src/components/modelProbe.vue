<template>
  <div>
    <div class="chart" :id="chartId"></div>
    <div class="row q-mt-sm">
      <div class="col">
        <div class="q-gutter-es row gutter justify-center">
          <q-select
            label-color="red-6"
            v-model="selected_component_name1"
            :options="component_names"
            hide-bottom-space
            filled
            dense
            square
            label="y1"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectComponent1"
          />
          <q-select
            v-if="prim_prop_visible1"
            label-color="red-6"
            v-model="selected_prim_prop_name1"
            :options="prim_prop_names1"
            hide-bottom-space
            filled
            dense
            square
            label="prop1"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectPrimProp1"
          />
          <q-select
            v-if="sec_prop_visible1"
            label-color="red-6"
            v-model="selected_sec_prop_name1"
            :options="sec_prop_names1"
            hide-bottom-space
            filled
            dense
            square
            label="prop2"
            style="width: 100px; font-size: 12px"
          />
          <q-select
            class="q-ml-md"
            label-color="green-6"
            v-model="selected_component_name2"
            :options="component_names"
            hide-bottom-space
            filled
            dense
            square
            label="y2"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectComponent2"
          />

          <q-select
            v-if="prim_prop_visible2"
            label-color="green-6"
            v-model="selected_prim_prop_name2"
            :options="prim_prop_names2"
            hide-bottom-space
            filled
            dense
            square
            label="prop1"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectPrimProp2"
          />
          <q-select
            v-if="sec_prop_visible2"
            label-color="green-6"
            v-model="selected_sec_prop_name2"
            :options="sec_prop_names2"
            hide-bottom-space
            filled
            dense
            square
            label="prop2"
            style="width: 100px; font-size: 12px"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <q-btn class="col-1 q-pa-sm q-ma-sm" size="sm" dense @click="calculate"
        >CALCULATE</q-btn
      >
      <q-input
        class="col-1"
        dense
        stack-label
        label="numer of seconds"
        v-model="number_of_seconds"
        type="number"
      >
      </q-input>
      <q-toggle
        class="col-1 q-pa-sm q-ma-sm"
        size="sm"
        v-model="hiresLogging"
        dense
        @click="setDataloggingResolution"
        >Hires</q-toggle
      >
      <q-toggle
        class="col-2 q-pa-sm q-ma-sm"
        size="sm"
        v-model="autoscale"
        dense
        @click="autoscaling"
        >Autoscale</q-toggle
      >
      <q-input
        v-if="!autoscale"
        class="col-1"
        dense
        stack-label
        label="y min"
        v-model="y_min"
        type="number"
        @click="setScale"
      >
      </q-input>
      <q-input
        v-if="!autoscale"
        class="col-1"
        dense
        stack-label
        label="y max"
        v-model="y_max"
        type="number"
        @click="setScale"
      >
      </q-input>
    </div>
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
      y_min: 0,
      y_max: 100,
      autoscale: true,
      number_of_seconds: 5,
      hiresLogging: false,
      component_names: [],
      selected_component_name1: "",
      selected_prim_prop_name1: "",
      selected_sec_prop_name1: "",
      prim_prop_visible1: false,
      sec_prop_visible1: false,
      selected_component_name2: "",
      selected_prim_prop_name2: "",
      selected_sec_prop_name2: "",
      prim_prop_visible2: false,
      sec_prop_visible2: false,
      selected_component_name3: "",
      selected_prim_prop_name3: "",
      selected_sec_prop_name3: "",
      prim_prop_visible3: false,
      sec_prop_visible3: false,
      selected_component_name4: "",
      selected_prim_prop_name4: "",
      selected_sec_prop_name4: "",
      prim_prop_visible4: false,
      sec_prop_visible4: false,
      selected_component_name5: "",
      selected_prim_prop_name5: "",
      selected_sec_prop_name5: "",
      prim_prop_visible5: false,
      sec_prop_visible5: false,
      prim_prop_names1: [],
      sec_prop_names1: [],
      prim_prop_names2: [],
      sec_prop_names2: [],
      prim_prop_names3: [],
      sec_prop_names3: [],
      prim_prop_names4: [],
      sec_prop_names4: [],
      prim_prop_names5: [],
      sec_prop_names5: [],
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
      first_run: true,
      lineSeries1: null,
      lineSeries2: null,
    };
  },
  methods: {
    setScale() {
      //chart_object.chartXAxis.setScrollStrategy(AxisScrollStrategies.Numeric);
      chartsXY[this.chartId].chartYAxis.setInterval(this.y_min, this.y_max);
    },
    autoscaling() {
      if (this.autoscale) {
        chartsXY[this.chartId].chartYAxis.fit(true);
      }
    },
    setDataloggingResolution() {
      explainModel.setDataloggingResolution(this.hiresLogging);
    },
    selectPrimProp1(selection) {
      // reset the secondary property names
      this.sec_prop_names1 = [];
      // clear the currently selected secundary prop name
      this.selected_sec_prop_name1 = "";
      // find any secondary property names
      Object.keys(
        explainModel.modelState[this.selected_component_name1][selection]
      ).forEach((key) => {
        if (
          typeof explainModel.modelState[this.selected_component_name1][
            selection
          ] !== "string" &&
          typeof explainModel.modelState[this.selected_component_name1][
            selection
          ] !== "boolean"
        ) {
          // add the property to the list
          this.sec_prop_names1.push(key);
        }
      });
      // sort the list of any items are on it
      if (this.sec_prop_names1.length > 0) {
        // make the secondary property visible
        this.sec_prop_visible1 = true;
        // sort th elist
        this.sec_prop_names1.sort();
      } else {
        // hide the secundary property
        this.sec_prop_visible1 = false;
      }
    },
    selectPrimProp2(selection) {
      // reset the secondary property names
      this.sec_prop_names2 = [];
      // clear the currently selected secundary prop name
      this.selected_sec_prop_name2 = "";
      // find any secondary property names
      Object.keys(
        explainModel.modelState[this.selected_component_name2][selection]
      ).forEach((key) => {
        if (
          typeof explainModel.modelState[this.selected_component_name2][
            selection
          ] !== "string" &&
          typeof explainModel.modelState[this.selected_component_name2][
            selection
          ] !== "boolean"
        ) {
          // add the property to the list
          this.sec_prop_names2.push(key);
        }
      });
      // sort the list of any items are on it
      if (this.sec_prop_names2.length > 0) {
        // make the secondary property visible
        this.sec_prop_visible2 = true;
        // sort th elist
        this.sec_prop_names2.sort();
      } else {
        // hide the secundary property
        this.sec_prop_visible2 = false;
      }
    },
    selectComponent1(selection) {
      // component1 has been selected, clear the primary and secundary property lists
      this.prim_prop_names1 = [];
      this.sec_prop_names1 = [];
      // component1 has been selected, clear the primary and secundary selected properties
      this.selected_prim_prop_name1 = "";
      this.selected_sec_prop_name1 = "";
      // hide secondary properties as we don't know if they exist yet
      this.sec_prop_visible1 = false;
      this.prim_prop_visible1 = false;

      // find the primary properties of the selected component
      if (selection) {
        Object.keys(explainModel.modelState[selection]).forEach((key) => {
          if (
            typeof explainModel.modelState[selection][key] !== "string" &&
            typeof explainModel.modelState[selection][key] !== "boolean"
          ) {
            this.prim_prop_names1.push(key);
          }
        });
        // if the propery list is not empty then sort the list alphabetically
        if (this.prim_prop_names1.length > 0) {
          this.prim_prop_names1.sort();
          // show the primary properties as we selected a component
          this.prim_prop_visible1 = true;
        }
      }
    },
    selectComponent2(selection) {
      // component1 has been selected, clear the primary and secundary property lists
      this.prim_prop_names2 = [];
      this.sec_prop_names2 = [];
      // component1 has been selected, clear the primary and secundary selected properties
      this.selected_prim_prop_name2 = "";
      this.selected_sec_prop_name2 = "";
      // hide secondary properties as we don't know if they exist yet
      this.sec_prop_visible2 = false;
      // show the primary properties as we selected a component
      this.prim_prop_visible2 = false;

      if (selection) {
        // find the primary properties of the selected component
        Object.keys(explainModel.modelState[selection]).forEach((key) => {
          if (
            typeof explainModel.modelState[selection][key] !== "string" &&
            typeof explainModel.modelState[selection][key] !== "boolean"
          ) {
            this.prim_prop_names2.push(key);
          }
        });
        // if the propery list is not empty then sort the list alphabetically
        if (this.prim_prop_names2.length > 0) {
          this.prim_prop_names2.sort();
          this.prim_prop_visible2 = true;
        }
      }
    },
    stateUpdate() {
      console.log("Model state object updated!");
      // reset the component names as the model state is updated
      this.component_names = [""];
      // read all model components
      Object.keys(explainModel.modelState).forEach((key) => {
        this.component_names.push(key);
      });
      // sort the model components alphabetically
      this.component_names.sort();
    },
    clearPrimaryProperties() {
      // hide all primary properties
      this.prim_prop_visible1 = false;
      this.prim_prop_visible2 = false;
      this.prim_prop_visible3 = false;
      this.prim_prop_visible4 = false;
      this.prim_prop_visible5 = false;
    },
    clearSecondaryProperties() {
      // hide all secundary properties
      this.sec_prop_visible1 = false;
      this.sec_prop_visible2 = false;
      this.sec_prop_visible3 = false;
      this.sec_prop_visible4 = false;
      this.sec_prop_visible5 = false;
    },
    errorUpdate() {
      console.log(explainModel.errorMessage);
    },
    dataUpdate() {
      this.chartData1 = [];
      this.chartData2 = [];
      this.lineSeries1.clear();
      this.lineSeries2.clear();

      let prop1 = "";
      let postFix1 = "";
      let chart1_enabled = false;
      if (this.selected_component_name1 && this.selected_prim_prop_name1) {
        chart1_enabled = true;
        prop1 =
          this.selected_component_name1 + "." + this.selected_prim_prop_name1;
        if (this.selected_sec_prop_name1) {
          prop1 += "." + this.selected_sec_prop_name1;
        }

        postFix1 = "";
        if (this.selected_prim_prop_name1 === "compounds") {
          postFix1 = "conc";
        }
      }

      let prop2 = "";
      let postFix2 = "";
      let chart2_enabled = false;
      if (this.selected_component_name2 && this.selected_prim_prop_name2) {
        chart2_enabled = true;
        prop2 =
          this.selected_component_name2 + "." + this.selected_prim_prop_name2;
        if (this.selected_sec_prop_name2) {
          prop2 += "." + this.selected_sec_prop_name2;
        }

        postFix2 = "";
        if (this.selected_prim_prop_name2 === "compounds") {
          postFix2 = "conc";
        }
      }

      explainModel.modelData.forEach((data) => {
        if (chart1_enabled) {
          let y1 = parseFloat(data[prop1]);
          if (postFix1) {
            y1 = parseFloat(data[prop1][postFix1]);
          }

          this.chartData1.push({
            x: data.time,
            y: y1,
          });
        }

        if (chart2_enabled) {
          let y2 = parseFloat(data[prop2]);
          if (postFix2) {
            y2 = parseFloat(data[prop2][postFix2]);
          }

          this.chartData2.push({
            x: data.time,
            y: y2,
          });
        }
      });

      if (chart1_enabled) {
        this.lineSeries1.add(this.chartData1);
      }
      if (chart2_enabled) {
        this.lineSeries2.add(this.chartData2);
      }
    },
    statusUpdate() {
      console.log(explainModel.statusMessage);
    },
    calculate() {
      if (this.selectComponent1 && this.selected_prim_prop_name1) {
        explainModel.watchModelProperty(
          this.selected_component_name1,
          this.selected_prim_prop_name1,
          this.selected_sec_prop_name1
        );
      }

      if (this.selectComponent2 && this.selected_prim_prop_name2) {
        explainModel.watchModelProperty(
          this.selected_component_name2,
          this.selected_prim_prop_name2,
          this.selected_sec_prop_name2
        );
      }
      explainModel.calculate(parseInt(this.number_of_seconds));
      if (this.first_run) {
        explainModel.getModelState();
        this.first_run = false;
      }
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
      this.lineSeries1 = chart_object.chart
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries1.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries1.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) }))
      );

      this.lineSeries2 = chart_object.chart
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries2.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries2.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) }))
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
    document.removeEventListener("state", this.stateUpdate);
  },
  beforeMount() {
    // generate a unique chartID
    this.chartId = "chart" + Math.floor(Math.random() * 10000);
  },
  mounted() {
    // create the chart
    this.createChart();

    // get the model state
    explainModel.getModelState();

    document.addEventListener("data", this.dataUpdate);
    document.addEventListener("status", this.statusUpdate);
    document.addEventListener("error", this.errorUpdate);
    document.addEventListener("state", this.stateUpdate);
  },
};
</script>

<style>
.chart {
  background: black;
  width: 100%;
  height: 300px;
  align-self: flex-start;
}
</style>
