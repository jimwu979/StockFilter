<template>
  <div class="index">
    <div class="container">
      <ul class="btns">
        <li @click="getStockCode">更新股票代碼</li>
        <li @click="getTradeData">更新本月交易資料</li>
        <li @click="filterStock">篩選</li>
      </ul>
      <div class="status">
        <p v-if="stockCode.isLoading">股票代碼更新中, 目前進度 {{ stockCode.schedule }}</p>
        <p v-if="stockDataFromApi.isLoading">交易資料更新中, 目前進度 {{ stockDataFromApi.schedule }}</p>
      </div>
      <!-- <chartjs :chartData="chartData" :options="options" /> -->
      <div class="data">
        <h2>篩選結果</h2>
        <p>篩選條件: 
          <ul>
            <li>今日收盤價 >= 5日線</li>
            <li>今日交易量 <= 昨日交易量的一半</li>
            <li>交易量為所有股票中的前50%</li>
          </ul>
          <table>
            <thead>
              <tr>
                <th>成交量排名</th>
                <th>股票代號</th>
                <th>日期</th>
                <th>公司名稱</th>
                <th>五日線</th>
                <th>收盤價</th>
                <th>成交量</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(i, index) in filterResult">
                <tr v-if="
                  i[TradeDaysLength - 1].tradingAbnormal && 
                  i[TradeDaysLength - 1].closingPrice > i[TradeDaysLength - 1].average5
                ">
                  <th>{{ index + 1 }}</th>
                  <td>{{ i[TradeDaysLength - 1].stockNum }}</td>
                  <td>{{ i[TradeDaysLength - 1].date }}</td>
                  <td>x</td>
                  <td>{{ i[TradeDaysLength - 1].average5 }}</td>
                  <td>{{ i[TradeDaysLength - 1].closingPrice }}</td>
                  <td>{{ i[TradeDaysLength - 1].tradingVolume }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
// import chartjs from '@/components/chartjs.vue'
// import { Bar } from 'vue-chartjs'
// import { Bar } from 'vue-chartjs/legacy'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  // components: { chartjs },
  data () {
    return {
      TradeDaysLength: null,
      stockCode: {
        data: [],
        schedule: '',
        isLoading: false,
        // chartData: {
        //   labels: [
        //     '1月', 
        //     '2月', 
        //     '3月', 
        //     '4月', 
        //     '5月', 
        //     '6月', 
        //     '7月'
        //   ],
        //   datasets: [
        //     {
        //       labels: 'data 1',
        //       data: [2, 10, 5, 9, 0, 6, 20],
        //       backgroundColor: this.gradient,
        //       borderColor: '#FC2525',
        //       pointBackgroundColor: 'rgba(171, 71, 188, 1)'
        //     }
        //   ]
        // },
        // options: {
        //   responsive: true,
        //   maintainAspectRatio: false,
        //   title: {
        //     display: true, 
        //     text: 'My Data'
        //   }
        // }
      },
      stockDataFromApi: {
        data: [
          // {
            // 日期
            // 成交股數
            // 成交金額
            // 開盤價
            // 最高價
            // 最低價
            // 收盤價
            // 漲跌價差
            // 成交筆數
          // }
        ],
        schedule: '',
        isLoading: false
      },
      cleanData: [],
      filterResult: [
        // 股票代號
        // 公司名稱
        // 五日線
        // 收盤價
        // 成交量
      ]
    }
  },
  mounted(){
  },
  computed: {
    axios(){
      return require('axios').default;
    }
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      if(localStorage.stockCode){
        this.stockCode.data = localStorage.getItem('stockCode').split(',');
      }
    },
    filterStock(){
      this.formatData();
      // 成交量排序
        let data = this.filterResult;
        let lastDayIndex = this.TradeDaysLength - 1;
        data.sort(function(a, b){
          let x = Number(a[lastDayIndex].tradingVolume.replace(/,/g, ''));
          let y = Number(b[lastDayIndex].tradingVolume.replace(/,/g, ''));
          return y - x;
        });
    },
    formatData(){
      let stockLength = this.cleanData.length;
      let dayLength = this.TradeDaysLength = this.cleanData[0].data.length;
      for(let s = 0; s < stockLength; s++){
        let stock = this.cleanData[s];
        this.filterResult.push([])
        for(let d = 0; d < dayLength; d++){
          this.filterResult[s].push({
            stockNum: stock.stockNum,
            date: stock.data[d][0],
            closingPrice: stock.data[d][6],
            tradingVolume: stock.data[d][1],
            tradingAbnormal: false,
            average5: null
          });
          if(d == dayLength -1){
            // 計算五日線
            let price = 0;
            for(let n=0; n<5; n++){
              price += Number(this.filterResult[s][d - n].closingPrice.replace(/,/g, ''));
              this.filterResult[s][dayLength - 1].average5 = price / 5;
            }
            // 成交量異常
            let d1 = Number(this.filterResult[s][d - 2].tradingVolume.replace(/,/g, ''));
            let d2 = Number(this.filterResult[s][d - 1].tradingVolume.replace(/,/g, ''));
            let d3 = Number(this.filterResult[s][d - 0].tradingVolume.replace(/,/g, ''));
            if(d2 >= (d1 * 5) && d3 <= (d2 / 4 )){
              this.filterResult[s][dayLength - 1].tradingAbnormal = true;
            }
            // for(let n=0; n<3; n++){

            // }
          }
        }
      }
    },
    clearData(){
      let data = this.stockDataFromApi.data;
      let dataLength = data.length;
      for(let i=0; i<dataLength; i++){
        this.cleanData.push({
          stockNum: data[i].stockNum,
          data: []
        });
        this.cleanData[i].data = data[i].data[0];
      }
    },
    // getTradeDaysLength(){

    // },
    getTradeData () {
      console.log('getTradeData()');
      this.stockDataFromApi.isLoading = true;
      let com_length = this.stockCode.data.length;
      let _this = this;
      for(let i = 0; i < com_length; i++){
        setTimeout(() => {
          let stockNum = _this.stockCode.data[i];
          _this.axios.get(`https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20220501&stockNo=${stockNum}`)
          .then(function(res){
            let schedule = i / (com_length - 1);
            schedule = (schedule * 100).toString();
            let pointIndex = schedule.indexOf('.');
            _this.stockDataFromApi.schedule = schedule.slice(0, pointIndex) + '%';
            if (res.data.stat === 'OK') {
              _this.stockDataFromApi.data.push({
                stockNum: stockNum,
                data: [res.data.data]
              });
              if(i == com_length - 1){
                _this.stockDataFromApi.isLoading = false;
                _this.clearData();
              }
            } else {
              console.error(`is not OK?? this is ${stockNum}`);
              console.log(res);
            }
          })
        }, 10 * i);
      }
    },
    getStockCode () {
      this.stockCode.isLoading = true;
      let _this = this;
      let lastCompany = 9999;
      _this.stockCode.data = [];
      for(let i = 0; i <= lastCompany; i++){
        setTimeout(() => {
          let codeNumber = _this.numberToString(i);
          _this.axios.get(`https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20220409&stockNo=${codeNumber}`)
          .then(function(res){
            let schedule = i / lastCompany;
            schedule = (schedule * 100).toString();
            let pointIndex = schedule.indexOf('.');
            _this.stockCode.schedule = schedule.slice(0, pointIndex) + '%';
            console.log(schedule);
            if (res.data.stat === 'OK') {
              _this.stockCode.data.push(codeNumber);
            }
            if(i == lastCompany){
              localStorage.setItem('stockCode', _this.stockCode.data)
              _this.stockCode.isLoading = false;
            }
          })
        }, 10 * i);
      }
    },
    numberToString (codeNumber) {
      let string = codeNumber.toString();
      let zeroString = '';
      for(let i=0; i<4 - string.length; i++){
        zeroString += '0'
      }
      string = zeroString + string;
      return string;
    }
  }
}
</script>
<style scoped lang="scss" src="@/assets/scss/index.scss" />