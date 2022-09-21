.
<template>
  <q-page>
    <div>
      <ChartXY :points="points"></ChartXY>
      <ChartXY :points="points"></ChartXY>
    </div>
  </q-page>
</template>

<script>
import ChartXY from "../components/chartXY.vue";

export default {
  components: {
    ChartXY,
  },
  data() {
    return {
      // Data points for the chart
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 7 },
        { x: 2, y: 3 },
        { x: 3, y: 10 },
        { x: 4, y: 12 },
        { x: 5, y: 9 },
        { x: 6, y: 15 },
      ],
    };
  },
};
</script>

<style></style>
