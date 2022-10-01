<template>
  <div>
    <q-separator class="q-mt-sm" size="2px"></q-separator>
    <div class="row q-mt-sm">
      <div class="col">
        <div class="q-gutter-md row justify-center">
          <q-select
            label-color="red-6"
            v-model="comp_name1"
            :options="component_names"
            hide-bottom-space
            outlined
            dense
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
            outlined
            dense
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
            outlined
            dense
            square
            label="prop2"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectSecProp1"
          />
          <q-select
            class="q-ml-md"
            label-color="green-6"
            v-model="comp_name2"
            :options="component_names"
            hide-bottom-space
            outlined
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
            outlined
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
            outlined
            dense
            square
            label="prop2"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectSecProp2"
          />

          <q-select
            class="q-ml-md"
            label-color="blue-6"
            v-model="comp_name3"
            :options="component_names"
            hide-bottom-space
            outlined
            dense
            square
            label="y3"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectComponent3"
          />

          <q-select
            v-if="prim_prop_visible3"
            label-color="blue-6"
            v-model="selected_prim_prop_name3"
            :options="prim_prop_names3"
            hide-bottom-space
            outlined
            dense
            square
            label="prop1"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectPrimProp3"
          />
          <q-select
            v-if="sec_prop_visible3"
            label-color="blue-6"
            v-model="selected_sec_prop_name3"
            :options="sec_prop_names3"
            hide-bottom-space
            outlined
            dense
            square
            label="prop2"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectSecProp3"
          />
        </div>
      </div>
    </div>

    <div class="chart" :id="chartId"></div>

    <div class="row q-mt-sm">
      <div class="col">
        <div class="q-gutter-sm row justify-center">
          <q-checkbox
            v-model="show_summary"
            @update:model-value="analyzeData"
            dense
            label="analyze"
            style="font-size: 12px"
          />
          <q-checkbox
            v-model="autoscale"
            dense
            label="autoscale"
            @update:model-value="autoscaling"
            style="font-size: 12px"
          />
          <q-input
            v-if="!autoscale"
            v-model.number="y_min"
            type="number"
            @update:model-value="autoscaling"
            label="min"
            filled
            dense
            hide-bottom-space
            style="width: 100px; font-size: 12px"
          />
          <q-input
            v-if="!autoscale"
            v-model.number="y_max"
            type="number"
            @update:model-value="autoscaling"
            label="max"
            filled
            dense
            hide-bottom-space
            style="width: 100px; font-size: 12px"
          />

          <q-checkbox
            v-model="scaling"
            dense
            label="multipliers"
            style="font-size: 12px"
          />
          <q-input
            v-if="scaling"
            v-model.number="chart1_factor"
            type="number"
            label="y1"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />
          <q-input
            v-if="scaling"
            v-model.number="chart2_factor"
            type="number"
            label="y2"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />
          <q-input
            v-if="scaling"
            v-model.number="chart3_factor"
            type="number"
            label="y3"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />

          <q-btn color="black" size="sm" @click="calculate">EXPORT</q-btn>
        </div>
      </div>
    </div>

    <div v-if="show_summary" class="q-mt-sm">
      <div v-if="chart1_enabled" class="q-gutter-xs row justify-center q-mt-xs">
        <q-input
          color="black"
          v-model="y1_max"
          outlined
          dense
          square
          label="y1 max"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_min"
          outlined
          dense
          square
          label="y1 min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y1_perbeat"
          outlined
          dense
          square
          label="y1 max-min"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_mean"
          outlined
          dense
          square
          label="y1 mean"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_sd"
          outlined
          dense
          square
          label="y1 sd"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_perminute"
          outlined
          dense
          square
          label="y1 /min"
          style="width: 100px; font-size: 12px"
        />
      </div>
      <div v-if="chart2_enabled" class="q-gutter-xs row justify-center q-mt-xs">
        <q-input
          color="black"
          v-model="y2_max"
          outlined
          dense
          square
          label="y2 max"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y2_min"
          outlined
          dense
          square
          label="y2 min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y2_perbeat"
          outlined
          dense
          square
          label="y2 max-min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y2_mean"
          outlined
          dense
          square
          label="y2 mean"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y2_sd"
          outlined
          dense
          square
          label="y2 sd"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y2_perminute"
          outlined
          dense
          square
          label="y2 /min"
          style="width: 100px; font-size: 12px"
        />
      </div>
      <div v-if="chart3_enabled" class="q-gutter-xs row justify-center q-mt-xs">
        <q-input
          color="black"
          v-model="y3_max"
          outlined
          dense
          square
          label="y3 max"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y3_min"
          outlined
          dense
          square
          label="y3 min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y3_perbeat"
          outlined
          dense
          square
          label="y3 max-min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y3_mean"
          outlined
          dense
          square
          label="y3 mean"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y3_sd"
          outlined
          dense
          square
          label="y3 sd"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y3_perminute"
          outlined
          dense
          square
          label="y3 /min"
          style="width: 100px; font-size: 12px"
        />
      </div>
    </div>
    <q-separator class="q-mt-sm" size="2px"></q-separator>
  </div>
</template>

<script>
// we have to declare the chart object here otherwise some chart functions won't work!
let chartsXY = {};

import { explainModel } from "src/boot/explain";
import * as Stat from "simple-statistics";

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
      data_source: 0,
      y1_min: 0,
      y1_max: 0,
      y1_mean: 0,
      y1_sd: 0,
      y1_perminute: 0,
      y1_perbeat: 0,
      y2_min: 0,
      y2_max: 0,
      y2_mean: 0,
      y2_sd: 0,
      y2_perminute: 0,
      y2_perbeat: 0,
      y3_min: 0,
      y3_max: 0,
      y3_mean: 0,
      y3_sd: 0,
      y3_perminute: 0,
      y3_perbeat: 0,
      show_summary: false,
      export_file_name: "",
      y_min: 0,
      y_max: 100,
      autoscale: true,
      scaling: false,
      chart1_factor: 1.0,
      chart2_factor: 1.0,
      chart3_factor: 1.0,

      component_names: [],
      comp_name1: "",
      comp_name2: "",
      comp_name3: "",
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
      chart1_enabled: false,
      chart2_enabled: false,
      chart3_enabled: false,
      autoscaleX: false,
      autoscaleY: false,
      title: "Title",
      lineTitle: "LineTitle",
      yLabel: "",
      xLabel: "time(s)",
      width: "100%",
      height: "300px",
      first_run: true,
      lineSeries1: null,
      lineSeries2: null,
    };
  },
  methods: {
    resetAnalysisResults() {
      this.y1_max = 0;
      this.y1_min = 0;
      this.y1_mean = 0;
      this.y1_perbeat = 0;
      this.y1_perminute = 0;
      this.y1_sd = 0;

      this.y2_max = 0;
      this.y2_min = 0;
      this.y2_mean = 0;
      this.y2_perbeat = 0;
      this.y2_perminute = 0;
      this.y2_sd = 0;

      this.y3_max = 0;
      this.y3_min = 0;
      this.y3_mean = 0;
      this.y3_perbeat = 0;
      this.y3_perminute = 0;
      this.y3_sd = 0;
    },
    analyzeData() {
      this.resetAnalysisResults();

      const y1_values = [];
      const y2_values = [];
      const y3_values = [];

      if (this.chart1_enabled) {
        this.chartData1.forEach((datapoint) => {
          y1_values.push(datapoint.y);
        });
        this.y1_min = Stat.min(y1_values).toFixed(4);
        this.y1_max = Stat.max(y1_values).toFixed(4);
        this.y1_mean = Stat.mean(y1_values).toFixed(4);
        this.y1_sd = Stat.standardDeviation(y1_values).toFixed(4);
        this.y1_perminute = (
          (Stat.sum(y1_values) / parseFloat(y1_values.length)) *
          60.0
        ).toFixed(4);
        this.y1_perbeat = (this.y1_max - this.y1_min).toFixed(4);
      }

      if (this.chart2_enabled) {
        this.chartData2.forEach((datapoint) => {
          y2_values.push(datapoint.y);
        });
        this.y2_min = Stat.min(y2_values).toFixed(4);
        this.y2_max = Stat.max(y2_values).toFixed(4);
        this.y2_mean = Stat.mean(y2_values).toFixed(4);
        this.y2_sd = Stat.standardDeviation(y2_values).toFixed(4);
        this.y2_perminute = (
          (Stat.sum(y2_values) / parseFloat(y2_values.length)) *
          60.0
        ).toFixed(4);
        this.y2_perbeat = (this.y2_max - this.y2_min).toFixed(4);
      }

      if (this.chart3_enabled) {
        this.chartData3.forEach((datapoint) => {
          y3_values.push(datapoint.y);
        });
        this.y3_min = Stat.min(y3_values).toFixed(4);
        this.y3_max = Stat.max(y3_values).toFixed(4);
        this.y3_mean = Stat.mean(y3_values).toFixed(4);
        this.y3_sd = Stat.standardDeviation(y3_values).toFixed(4);
        this.y3_perminute = (
          (Stat.sum(y3_values) / parseFloat(y3_values.length)) *
          60.0
        ).toFixed(4);
        this.y3_perbeat = (this.y3_max - this.y3_min).toFixed(4);
      }
    },
    exportData() {},

    autoscaling() {
      if (this.autoscale) {
        chartsXY[this.chartId].chartYAxis.setScrollStrategy(
          AxisScrollStrategies.fitting
        );
      } else {
        chartsXY[this.chartId].chartYAxis.setScrollStrategy(
          AxisScrollStrategies.Numeric
        );
        chartsXY[this.chartId].chartYAxis.setInterval(this.y_min, this.y_max);
      }
    },
    selectSecProp1() {
      if (this.selected_component_name1 && this.selected_prim_prop_name1) {
        explainModel.watchModelProperty(
          this.selected_component_name1,
          this.selected_prim_prop_name1,
          this.selected_sec_prop_name1
        );
      }
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
        // add to the watcher
        if (this.selected_component_name1 && this.selected_prim_prop_name1) {
          explainModel.watchModelProperty(
            this.selected_component_name1,
            this.selected_prim_prop_name1,
            this.selected_sec_prop_name1
          );
        }
      }
    },
    selectSecProp2() {
      if (this.selected_component_name2 && this.selected_prim_prop_name2) {
        explainModel.watchModelProperty(
          this.selected_component_name2,
          this.selected_prim_prop_name2,
          this.selected_sec_prop_name2
        );
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
        // add to the watcher
        if (this.selected_component_name2 && this.selected_prim_prop_name2) {
          explainModel.watchModelProperty(
            this.selected_component_name2,
            this.selected_prim_prop_name2,
            this.selected_sec_prop_name2
          );
        }
      }
    },
    selectSecProp3() {
      if (this.selected_component_name3 && this.selected_prim_prop_name3) {
        explainModel.watchModelProperty(
          this.selected_component_name3,
          this.selected_prim_prop_name3,
          this.selected_sec_prop_name3
        );
      }
    },
    selectPrimProp3(selection) {
      // reset the secondary property names
      this.sec_prop_names3 = [];
      // clear the currently selected secundary prop name
      this.selected_sec_prop_name3 = "";
      // find any secondary property names
      Object.keys(
        explainModel.modelState[this.selected_component_name3][selection]
      ).forEach((key) => {
        if (
          typeof explainModel.modelState[this.selected_component_name3][
            selection
          ] !== "string" &&
          typeof explainModel.modelState[this.selected_component_name3][
            selection
          ] !== "boolean"
        ) {
          // add the property to the list
          this.sec_prop_names3.push(key);
        }
      });
      // sort the list of any items are on it
      if (this.sec_prop_names3.length > 0) {
        // make the secondary property visible
        this.sec_prop_visible3 = true;
        // sort th elist
        this.sec_prop_names3.sort();
      } else {
        // hide the secundary property
        this.sec_prop_visible3 = false;
        // add to the watcher
        if (this.selected_component_name3 && this.selected_prim_prop_name3) {
          explainModel.watchModelProperty(
            this.selected_component_name3,
            this.selected_prim_prop_name3,
            this.selected_sec_prop_name3
          );
        }
      }
    },
    selectComponent1(selection) {
      if (selection === "") {
        if (this.selected_component_name1 && this.selected_prim_prop_name1) {
          explainModel.unwatchModelProperty(
            this.selected_component_name1,
            this.selected_prim_prop_name1,
            this.selected_sec_prop_name1
          );
        }
      }
      this.selected_component_name1 = selection;
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
      if (selection === "") {
        if (this.selected_component_name2 && this.selected_prim_prop_name2) {
          explainModel.unwatchModelProperty(
            this.selected_component_name2,
            this.selected_prim_prop_name2,
            this.selected_sec_prop_name2
          );
        }
      }
      this.selected_component_name2 = selection;
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
    selectComponent3(selection) {
      if (selection === "") {
        if (this.selected_component_name3 && this.selected_prim_prop_name3) {
          explainModel.unwatchModelProperty(
            this.selected_component_name3,
            this.selected_prim_prop_name3,
            this.selected_sec_prop_name3
          );
        }
      }
      // component1 has been selected, clear the primary and secundary property lists
      this.prim_prop_names3 = [];
      this.sec_prop_names3 = [];
      // component1 has been selected, clear the primary and secundary selected properties
      this.selected_prim_prop_name3 = "";
      this.selected_sec_prop_name3 = "";
      // hide secondary properties as we don't know if they exist yet
      this.sec_prop_visible3 = false;
      // show the primary properties as we selected a component
      this.prim_prop_visible3 = false;

      if (selection) {
        // find the primary properties of the selected component
        Object.keys(explainModel.modelState[selection]).forEach((key) => {
          if (
            typeof explainModel.modelState[selection][key] !== "string" &&
            typeof explainModel.modelState[selection][key] !== "boolean"
          ) {
            this.prim_prop_names3.push(key);
          }
        });
        // if the propery list is not empty then sort the list alphabetically
        if (this.prim_prop_names3.length > 0) {
          this.prim_prop_names3.sort();
          this.prim_prop_visible3 = true;
        }
      }
    },
    stateUpdate() {
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
    rtUpdate() {
      this.data_source = 1;
      this.dataUpdate();
      this.data_source = 0;
    },
    dataUpdate() {
      if (this.data_source === 0) {
        this.chartData1 = [];
        this.chartData2 = [];
        this.chartData3 = [];
      }
      this.lineSeries1.clear();
      this.lineSeries2.clear();
      this.lineSeries3.clear();

      if (!this.scaling) {
        this.chart1_factor = 1.0;
        this.chart2_factor = 1.0;
        this.chart3_factor = 1.0;
      }

      let prop1 = "";
      let postFix1 = "";
      this.chart1_enabled = false;
      if (this.selected_component_name1 && this.selected_prim_prop_name1) {
        this.chart1_enabled = true;
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
      this.chart2_enabled = false;
      if (this.selected_component_name2 && this.selected_prim_prop_name2) {
        this.chart2_enabled = true;
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

      let prop3 = "";
      let postFix3 = "";
      this.chart3_enabled = false;
      if (this.selected_component_name3 && this.selected_prim_prop_name3) {
        this.chart3_enabled = true;
        prop3 =
          this.selected_component_name3 + "." + this.selected_prim_prop_name3;
        if (this.selected_sec_prop_name3) {
          prop3 += "." + this.selected_sec_prop_name3;
        }

        postFix3 = "";
        if (this.selected_prim_prop_name2 === "compounds") {
          postFix3 = "conc";
        }
      }

      explainModel.modelData.forEach((data) => {
        if (this.chart1_enabled) {
          let y1 = parseFloat(data[prop1]) * this.chart1_factor;
          if (postFix1) {
            y1 = parseFloat(data[prop1][postFix1]) * this.chart1_factor;
          }

          this.chartData1.push({
            x: data.time,
            y: y1,
          });

          if (this.data_source === 1) {
            this.chartData1.shift();
          }
        }

        if (this.chart2_enabled) {
          let y2 = parseFloat(data[prop2]) * this.chart2_factor;
          if (postFix2) {
            y2 = parseFloat(data[prop2][postFix2]) * this.chart2_factor;
          }

          this.chartData2.push({
            x: data.time,
            y: y2,
          });
          if (this.data_source === 1) {
            this.chartData2.shift();
          }
        }

        if (this.chart3_enabled) {
          let y3 = parseFloat(data[prop3]) * this.chart3_factor;
          if (postFix3) {
            y3 = parseFloat(data[prop3][postFix3]) * this.chart3_factor;
          }

          this.chartData3.push({
            x: data.time,
            y: y3,
          });
          if (this.data_source === 1) {
            this.chartData3.shift();
          }
        }
      });

      if (this.chart1_enabled) {
        this.lineSeries1.add(this.chartData1);
      }
      if (this.chart2_enabled) {
        this.lineSeries2.add(this.chartData2);
      }
      if (this.chart3_enabled) {
        this.lineSeries3.add(this.chartData3);
      }

      if (this.show_summary) {
        this.analyzeData();
      }
    },
    calculate() {
      explainModel.calculate(parseInt(this.number_of_seconds));
      if (this.first_run) {
        explainModel.getModelState();
        this.first_run = false;
      }

      this.resetAnalysisResults();
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

      // chart_object.chart.setTitle(this.title);
      // chart_object.chart.setTitleFont(
      //   new FontSettings({ size: 12, style: "normal" })
      // );
      chart_object.chart.setTitleFillStyle(emptyFill);
      chart_object.chart.setPadding({
        top: 10,
        bottom: 0,
        left: 15,
        right: 30,
      });

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

      this.lineSeries3 = chart_object.chart
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries3.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries3.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 0, 200) }))
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
    document.removeEventListener("state", this.stateUpdate);
    document.removeEventListener("rt", this.rtUpdate);
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
    document.addEventListener("rt", this.rtUpdate);
    document.addEventListener("data", this.dataUpdate);
    document.addEventListener("state", this.stateUpdate);
  },
};
</script>

<style>
.chart {
  background: black;
  width: 100%;
  height: 250px;
  align-self: flex-start;
}
</style>
