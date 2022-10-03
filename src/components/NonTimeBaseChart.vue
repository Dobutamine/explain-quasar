<template>
  <div>
    <q-separator class="q-mt-sm" size="2px"></q-separator>
    <div class="row q-mt-sm">
      <div class="col">
        <div class="q-gutter-md row justify-center">
          <q-select
            label-color="red-6"
            v-model="comp_namex"
            :options="component_names"
            hide-bottom-space
            outlined
            dense
            label="x"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectComponentX"
          />
          <q-select
            v-if="prim_prop_visible_x"
            label-color="red-6"
            v-model="selected_prim_prop_name_x"
            :options="prim_prop_names_x"
            hide-bottom-space
            outlined
            dense
            label="prop1"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectPrimPropX"
          />
          <q-select
            v-if="sec_prop_visible_x"
            label-color="red-6"
            v-model="selected_sec_prop_name_x"
            :options="sec_prop_names_x"
            hide-bottom-space
            outlined
            dense
            square
            label="prop2"
            style="width: 100px; font-size: 12px"
            @update:model-value="selectSecPropX"
          />

          <q-select
            label-color="red-6"
            v-model="comp_name1"
            :options="component_names"
            hide-bottom-space
            outlined
            dense
            label="y"
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
            v-model.number="x_min_axis"
            type="number"
            @update:model-value="autoscaling"
            label="x min"
            filled
            dense
            hide-bottom-space
            style="width: 100px; font-size: 12px"
          />
          <q-input
            v-if="!autoscale"
            v-model.number="x_max_axis"
            type="number"
            @update:model-value="autoscaling"
            label="x max"
            filled
            dense
            hide-bottom-space
            style="width: 100px; font-size: 12px"
          />
          <q-input
            v-if="!autoscale"
            v-model.number="y_min"
            type="number"
            @update:model-value="autoscaling"
            label="y min"
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
            label="y max"
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
            v-model.number="chartx_factor"
            type="number"
            label="x"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />
          <q-input
            v-if="scaling"
            v-model.number="chart1_factor"
            type="number"
            label="y"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />

          <q-btn color="black" size="sm" @click="exportData">EXPORT</q-btn>
        </div>
      </div>
    </div>

    <div v-if="show_summary" class="q-mt-sm">
      <div v-if="chart1_enabled" class="q-gutter-xs row justify-center q-mt-xs">
        <q-input
          color="black"
          v-model="x_max"
          outlined
          dense
          square
          label="x max"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="x_min"
          outlined
          dense
          square
          label="x min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="x_perbeat"
          outlined
          dense
          square
          label="x max-min"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="x_mean"
          outlined
          dense
          square
          label="x mean"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="x_sd"
          outlined
          dense
          square
          label="x sd"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="x_perminute"
          outlined
          dense
          square
          label="x /min"
          style="width: 100px; font-size: 12px"
        />
      </div>
      <div v-if="chart1_enabled" class="q-gutter-xs row justify-center q-mt-xs">
        <q-input
          color="black"
          v-model="y1_max"
          outlined
          dense
          square
          label="y max"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_min"
          outlined
          dense
          square
          label="y min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y1_perbeat"
          outlined
          dense
          square
          label="y max-min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y1_mean"
          outlined
          dense
          square
          label="y mean"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_sd"
          outlined
          dense
          square
          label="y sd"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y1_perminute"
          outlined
          dense
          square
          label="y /min"
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
import { h } from "vue";

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
      x_min: 0,
      x_max: 0,
      x_mean: 0,
      x_sd: 0,
      x_perminute: 0,
      x_perbeat: 0,
      y1_min: 0,
      y1_max: 0,
      y1_mean: 0,
      y1_sd: 0,
      y1_perminute: 0,
      y1_perbeat: 0,

      show_summary: false,
      export_file_name: "",
      x_min_axis: 0,
      x_max_axis: 100,
      y_min: 0,
      y_max: 100,
      autoscale: true,
      scaling: false,
      chart1_factor: 1.0,
      chartx_factor: 1.0,
      component_names: [],
      comp_name1: "",
      comp_namex: "",
      selected_component_name_x: "",
      selected_prim_prop_name_x: "",
      selected_sec_prop_name_x: "",
      prim_prop_visible_x: false,
      sec_prop_visible_x: false,
      selected_component_name1: "",
      selected_prim_prop_name1: "",
      selected_sec_prop_name1: "",
      prim_prop_visible1: false,
      sec_prop_visible1: false,
      prim_prop_names_x: [],
      sec_prop_names_x: [],
      prim_prop_names1: [],
      sec_prop_names1: [],
      chartId: "chart",
      chartData: [],
      chart1_enabled: false,
      autoscaleX: false,
      autoscaleY: false,
      title: "Title",
      lineTitle: "LineTitle",
      yLabel: "",
      xLabel: "",
      width: "100%",
      height: "300px",
      first_run: true,
      lineSeries1: null,
      exportFileName: "data.csv",
    };
  },
  methods: {
    resetAnalysisResults() {
      this.x_max = 0;
      this.x_min = 0;
      this.x_mean = 0;
      this.x_perbeat = 0;
      this.x_perminute = 0;
      this.x_sd = 0;

      this.y1_max = 0;
      this.y1_min = 0;
      this.y1_mean = 0;
      this.y1_perbeat = 0;
      this.y1_perminute = 0;
      this.y1_sd = 0;
    },
    analyzeData() {
      this.resetAnalysisResults();

      const x_values = [];
      const y1_values = [];

      if (this.chart1_enabled) {
        this.chartData1.forEach((datapoint) => {
          x_values.push(datapoint.x);
          y1_values.push(datapoint.y);
        });
        this.x_min = Stat.min(x_values).toFixed(4);
        this.x_max = Stat.max(x_values).toFixed(4);
        this.x_mean = Stat.mean(x_values).toFixed(4);
        this.x_sd = Stat.standardDeviation(x_values).toFixed(4);
        this.x_perminute = (
          (Stat.sum(x_values) / parseFloat(x_values.length)) *
          60.0
        ).toFixed(4);
        this.x_perbeat = (this.x_max - this.x_min).toFixed(4);

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
    },
    exportData() {
      let header = "";
      let t = new Date().toLocaleString();
      if (this.chart1_enabled) {
        header =
          this.selected_component_name_x +
          this.selected_prim_prop_name_x +
          this.selected_sec_prop_name_x +
          "_vs_" +
          this.selected_component_name1 +
          this.selected_prim_prop_name1 +
          this.selected_sec_prop_name1 +
          ".csv";
        this.exportFileName = `${header}_${t}.csv`;
        this.writeDataToDisk(this.chartData1, header);
      }
    },
    writeDataToDisk(data_object, header) {
      // download to local disk
      const data_csv = this.jsonToCsv(data_object, header);
      const blob = new Blob([data_csv], { type: "text/json" });
      // create an element called a
      const a = document.createElement("a");
      a.download = this.exportFileName;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      // create a synthetic click MouseEvent
      let evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      // dispatch the mouse click event
      a.dispatchEvent(evt);
      // remove the element from the document
      a.remove();
    },
    jsonToCsv(items, _headerString) {
      const headerString = _headerString;
      const rowItems = [];
      items.forEach((data_row) => {
        let x = data_row.x;
        let y = data_row.y;

        let item = x.toString() + ";" + y.toString();
        rowItems.push(item);
      });

      //const csv = "";
      // join header and body, and break into separate lines
      const csv = [headerString, ...rowItems].join("\r\n");

      return csv;
    },

    autoscaling() {
      if (this.autoscale) {
        chartsXY[this.chartId].chartXAxis.setScrollStrategy(
          AxisScrollStrategies.fitting
        );

        chartsXY[this.chartId].chartYAxis.setScrollStrategy(
          AxisScrollStrategies.fitting
        );
      } else {
        chartsXY[this.chartId].chartXAxis.setScrollStrategy(
          AxisScrollStrategies.Numeric
        );
        chartsXY[this.chartId].chartXAxis.setInterval(
          this.x_min_axis,
          this.x_max_axis
        );

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
        // add to watcher
        // add to watcher
        if (this.selected_component_name1 && this.selected_prim_prop_name1) {
          explainModel.watchModelProperty(
            this.selected_component_name1,
            this.selected_prim_prop_name1,
            this.selected_sec_prop_name1
          );
        }
      }
    },
    selectSecPropX() {
      if (this.selected_component_name_x && this.selected_prim_prop_name_x) {
        explainModel.watchModelProperty(
          this.selected_component_name_x,
          this.selected_prim_prop_name_x,
          this.selected_sec_prop_name_x
        );
      }
    },
    selectPrimPropX(selection) {
      // reset the secondary property names
      this.sec_prop_names_x = [];
      // clear the currently selected secundary prop name
      this.selected_sec_prop_name_x = "";
      // find any secondary property names
      Object.keys(
        explainModel.modelState[this.selected_component_name_x][selection]
      ).forEach((key) => {
        if (
          typeof explainModel.modelState[this.selected_component_name_x][
            selection
          ] !== "string" &&
          typeof explainModel.modelState[this.selected_component_name_x][
            selection
          ] !== "boolean"
        ) {
          // add the property to the list
          this.sec_prop_names_x.push(key);
        }
      });
      // sort the list of any items are on it
      if (this.sec_prop_names_x.length > 0) {
        // make the secondary property visible
        this.sec_prop_visible_x = true;
        // sort th elist
        this.sec_prop_names_x.sort();
      } else {
        // hide the secundary property
        this.sec_prop_visible_x = false;
        // add to watcher
        if (this.selected_component_name_x && this.selected_prim_prop_name_x) {
          explainModel.watchModelProperty(
            this.selected_component_name_x,
            this.selected_prim_prop_name_x,
            this.selected_sec_prop_name_x
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
    selectComponentX(selection) {
      if (selection === "") {
        if (this.selected_component_name_x && this.selected_prim_prop_name_x) {
          explainModel.unwatchModelProperty(
            this.selected_component_name_x,
            this.selected_prim_prop_name_x,
            this.selected_sec_prop_name_x
          );
        }
      }
      this.selected_component_name_x = selection;
      // component1 has been selected, clear the primary and secundary property lists
      this.prim_prop_names_x = [];
      this.sec_prop_names_x = [];
      // component1 has been selected, clear the primary and secundary selected properties
      this.selected_prim_prop_name_x = "";
      this.selected_sec_prop_name_x = "";
      // hide secondary properties as we don't know if they exist yet
      this.sec_prop_visible_x = false;
      // show the primary properties as we selected a component
      this.prim_prop_visible_x = false;

      if (selection) {
        // find the primary properties of the selected component
        Object.keys(explainModel.modelState[selection]).forEach((key) => {
          if (
            typeof explainModel.modelState[selection][key] !== "string" &&
            typeof explainModel.modelState[selection][key] !== "boolean"
          ) {
            this.prim_prop_names_x.push(key);
          }
        });
        // if the propery list is not empty then sort the list alphabetically
        if (this.prim_prop_names_x.length > 0) {
          this.prim_prop_names_x.sort();
          this.prim_prop_visible_x = true;
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
      this.prim_prop_visible_x = false;
      this.prim_prop_visible1 = false;
    },
    clearSecondaryProperties() {
      // hide all secundary properties
      this.sec_prop_visible_x = false;
      this.sec_prop_visible1 = false;
    },
    rtUpdate() {
      this.data_source = 1;
      this.dataUpdate();
      this.data_source = 0;
    },
    dataUpdate() {
      if (this.data_source === 0) {
        this.chartData1 = [];
      }
      this.lineSeries1.clear();

      if (!this.scaling) {
        this.chartx_factor = 1.0;
        this.chart2_factor = 1.0;
      }

      let prop_x = "";
      let postFix_x = "";
      this.chart1_enabled = false;
      if (this.selected_component_name_x && this.selected_prim_prop_name_x) {
        this.chart1_enabled = true;
        prop_x =
          this.selected_component_name_x + "." + this.selected_prim_prop_name_x;
        if (this.selected_sec_prop_name_x) {
          prop_x += "." + this.selected_sec_prop_name_x;
        }

        postFix_x = "";
        if (this.selected_prim_prop_name_x === "compounds") {
          postFix_x = "conc";
        }
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

      explainModel.modelData.forEach((data) => {
        if (this.chart1_enabled) {
          let x1 = parseFloat(data[prop_x]) * this.chartx_factor;
          let y1 = parseFloat(data[prop1]) * this.chart1_factor;
          if (postFix1) {
            y1 = parseFloat(data[prop1][postFix1]) * this.chart1_factor;
          }
          if (postFix_x) {
            x1 = parseFloat(data[prop_x][postFix_x]) * this.chartx_factor;
          }

          this.chartData1.push({
            x: x1,
            y: y1,
          });
          if (this.data_source === 1) {
            this.chartData1.shift();
          }
        }
      });

      if (this.chart1_enabled) {
        this.lineSeries1.add(this.chartData1);
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

      //this.lineSeries.add(this.points);

      // add the chart to the global chartsXY array
      chartsXY[this.chartId] = chart_object;
    },
  },
  beforeUnmount() {
    // remove the current chart from the chartsXY array (which is a global object)
    delete chartsXY[this.chartId];

    document.removeEventListener("rt", this.rtUpdate);
    document.removeEventListener("data", this.dataUpdate);
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
