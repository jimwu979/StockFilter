<template>
  <!-- <Line /> -->
  <!-- <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  /> -->
</template>

<script>
import { Line } from 'vue-chartjs'
// import { Bar } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'chartjs',
  components: { Line },
  // components: { Bar },
  props: ['chartData', 'options'],
  mounted(){
    this.renderChart(this.chartData, this.options);
  },
//   props: {
//     chartId: {
//       type: String,
//       default: 'bar-chart'
//     },
//     datasetIdKey: {
//       type: String,
//       default: 'label'
//     },
//     width: {
//       type: Number,
//       default: 400
//     },
//     height: {
//       type: Number,
//       default: 400
//     },
//     cssClasses: {
//       default: '',
//       type: String
//     },
//     styles: {
//       type: Object,
//       default: () => {}
//     },
//     plugins: {
//       type: Array,
//       default: () => []
//     }
//   },
  data() {
    return {
    //   chartData: {
    //     labels: [ 'January', 'February', 'March' ],
    //     datasets: [ { data: [40, 20, 12] } ]
    //   },
    //   chartOptions: {
    //     responsive: true
    //   }
    }
  }
}
</script>