<template>
  <div class="wk">
    <div class="banner_card">
      <div class="box">
        <div class="left">
          <p>{{$t('finance_dividend.Last_7_days_mining')}}</p>
          <span>{{total_mining}} <i>{{coin_name}}</i></span>
        </div>
        <div class="center">
          <p>{{$t('finance_dividend.Yesterday_mining')}}</p>
          <span>{{yesterday_mining}} <i>{{coin_name}}</i></span>
        </div>
        <!--<div class="right">-->
        <!--<p>{{$t('finance_dividend.Miner_status')}}</p>-->
        <!--<h4>{{mining_speed}}</h4>-->
        <!--</div>-->
      </div>
    </div>
    <div id="myChart" ref="echarts"></div>
    <ul>
      <li v-for="item in tokenomics">
        <p>{{item.name}}</p>
        <h5>{{item.value}}</h5>
      </li>
      <!--<li>-->
      <!--<p class="changeline">{{$t('finance_dividend.Next_difficulty_change_countdown')}}</p>-->
      <!--<h5>{{next_difficulty_adjust}}</h5>-->
      <!--</li>-->
    </ul>
    <div class="rule" >
      <div v-html="mining_rule"></div>
    </div>
    <router-link v-if="lang=='cn'" class="toRule" to="/wk/rule">{{$t('finance_dividend.Mining_mechanism')}} ></router-link>
    <router-link v-else class="toRule" to="/wk/rule_en">{{$t('finance_dividend.Mining_mechanism')}} ></router-link>
    <div class="btn" @click="toDefi">{{$t('finance_dividend.Mining')}}</div>
    <diaLog :args='dislogData' v-if="popisshow"></diaLog>
  </div>
</template>

<script>
  import diaLog from '@/components/Dialogs'
  import echarts from 'echarts'
  import {getI18n} from "@/assets/js/utils/tool";
  import {api_getWkInfo} from '@/assets/js/request/api'
  export default {
    data() {
      return {
        coin_name:'',
        total_mining: '',
        yesterday_mining: '',
        mining_chart: [],
        mining_rule:'',
        tokenomics:[],
        dateList:[],
        x_dateList:[],
        valueList:[],
        lang:getI18n(),
        popisshow: false,
        dislogData:{},
        POS_Y:0
      }
    },
    methods: {
      drawLine() {
        if(!document.getElementById('myChart')){
          return;
        }
        let myChart = echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          // Make gradient line here
          width:'auto',
          height:'auto',
          visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: this.dateList.length - 1
          }],
          legend: {
            textStyle: {
              color: '#fff'          // 图例文字颜色
            },
            padding:12
          },
          tooltip: {
            extraCssText:'z-index:1',
            show:true,
            seriesIndex:0,
            dataIndex:1,
            trigger: 'axis',
            backgroundColor: '#FFFFFF',
            formatter(value, format) {
              let str = `<span style="color: #333;">${new Date().getFullYear()}-${value[0].name}</span></br>`
              value.forEach(item => {
                str += `<span style="color: #DD4F4F;">${item.data} AXON</span>`;
              })
              return str;
            }
          },
          xAxis: {
            boundaryGap: false,  // 靠左对齐
            data: this.x_dateList,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            //坐标轴内线的样式
            splitLine: {
              show: true,
              lineStyle: {
                color: '#fff',
                type:'dotted',
                width: 0.2,
                //opacity:0.6
              }
            },
            splitNumber :7,
            xisLabel: {
              interval: 0,
            }
          },
          yAxis: {
            //name:'平台出矿量(千)',
            name:`${this.$t('finance_dividend.Platform_mining')} (k)`,
            position:'left',
            nameTextStyle:{
              fontSize:'12',
              padding:[35/40,0 , 0,0],
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            //坐标轴内线的样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#fff'],
                type:'solid',//虚线
                width: 0.2,

              },
            },
            splitNumber : 4,  // 分割数量
            minInterval: 0, // y 轴间隔值
            maxInterval: 1000000000000
          },
          // radiusAxis:{
          //   splitLine:{
          //     lineStyle:{
          //       color:['#aaa', '#ddd']
          //     }
          //   }
          // },
          grid: [{
            top:'16%',
            //left:60
            left:"15%"
          }],
          series: {
            type: 'line',
            showSymbol: false,
            data: this.valueList,
            // 折线颜色
            itemStyle: {
              normal: {
                color: '#fff',
                lineStyle: {
                  color: '#fff',
                },
                //label:{show: true}
              }
            },
          }
        })
        setTimeout(function(){
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex:0,  // 显示第几个series
            dataIndex: 6 // 显示第几个数据
          });
        })
        return myChart
      },
      async getInfo() {
        const {code,data:{coin_name,total_mining, yesterday_mining, mining_rule, mining_chart, tokenomics}} = await api_getWkInfo();
        const {data} = await api_getWkInfo();
        if (code == 200) {
          this.coin_name = coin_name;
          this.total_mining = total_mining;
          this.yesterday_mining = yesterday_mining;
          this.mining_rule = mining_rule;
          this.mining_chart = mining_chart;
          this.tokenomics = tokenomics;
          this.dateList = mining_chart.map((item) => {
            return item.date
          })
          this.x_dateList = this.dateList.map(item => {
            return item.substr(5)
          })
          this.valueList = mining_chart.map((item) => {
            return item.value
          })
          this.$nextTick(() => {
            this.drawLine();
          })
        }
      },
      toDefi(){
        this.popisshow = true;
        this.dislogData = {
          //title:'开创挖矿之旅',
          title:this.$t('finance_dividend.Start_your_mining_trip'),
          content:`<P>${this.$t('finance_dividend.1_Investing_is_mining')}</P>
                   <P>${this.$t('finance_dividend.2_Invest_to_gain_high_yield')}</P>
                   <P style="word-wrap: break-word;word-break: normal;">${this.$t('finance_dividend.3_Mine_to_win_AXON_double_reward')}</P>`,
          leftBtnText:this.$t('finance_dividend.Think_it_over'),
          rightBtnText:this.$t('finance_dividend.Go_to_mine'),
          leftBtnCallBack:this.escFun,
          rightBtnCallBack:this.sueFun
        };
      },
      escFun(){
        this.popisshow = false;
        return false;
      },
      sueFun(){
        this.popisshow = false;
        this.$router.push('/defi')
        window.location.reload()
      }
    },
    mounted() {
      this.getInfo();
    },
    components:{
      diaLog
    },
    // beforeRouteLeave (to, from, next) {
    //   this.POS_Y = window.scrollY
    //   if (this.POS_Y == null) this.POS_Y = 0
    //   next()
    // },
    // watch:{
    //   '$route'(to, from){
    //     if (from.path === '/defi') {
    //       window.scrollTo(0, this.POS_Y)
    //     }
    //   }
    // }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/mixin";
  .wk{
    padding-bottom: 240px;
  }
  .toRule{
    display: block;
    padding-right: 30px;
    text-align: right;
    height:44px;
    font-size:26px;
    font-weight:400;
    color:rgba(106,78,255,1);
    line-height:44px;
    margin-bottom: 10px;
  }
  .btn{
    position: fixed;
    left: 4%;
    bottom: 130px;
    margin: 0 auto;
    width:92%;
    height:88px;
    background:linear-gradient(90deg,rgba(158,141,255,1) 0%,rgba(106,78,255,1) 100%);
    border-radius:44px;
    font-size:32px;
    font-weight:600;
    color:rgba(255,255,255,1);
    line-height:88px;
    text-align: center;
  }
  .rule{
    background-color: #ffffff;
    padding: 25px 30px 0;
    font-size:26px;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:44px;
    word-wrap : break-word ;
    word-break : normal ;
  }
  .title {
    text-align: center;
    height: 80px;
    line-height: 80px;
    background-color: #dbc28a;
    font-size: 30px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }

  .banner_card {
    padding: 20px 30px;
    background-color: #f9fafb;

    .box {
      display: flex;
      justify-content: space-around;
      background-color: #ffffff;
      //width: 690px;
      box-sizing: border-box;
      padding: 34px 8px;
      border-radius: 8px;
      box-shadow: 0px 5px 30px 0px #E4E9EF;
      div {
        flex-direction: column;
        text-align: center;
      }

      span, i, h4, p {
        height: 30px;
        font-size: 30px;
        font-weight:bold;
        color: rgba(106, 78, 255, 1);
        line-height: 30px;
        //vertical-align: bottom;
      }

      p {
        font-size: 20px;
        font-weight: 400;
        color: rgba(152, 149, 172, 1);
        margin-bottom: 14px;
      }

      i {
        font-style: normal;
        font-size: 20px;
      }

      h4 {
        color: rgba(51, 51, 51, 1);
      }

    }

  }

  #myChart {
    width: 100%;
    height: 502px;
    background:linear-gradient(180deg,rgba(154,127,255,1) 0%,rgba(106,78,255,1) 100%);
    position: relative;
  }

  ul {
    padding: 30px 40px 10px 30px;
    display: flex;
    flex-direction: column;
    background-color: #F9FAFB;
    position: relative;
    margin-top:-20px;
    li {
      height: 66px;
      //line-height: 66px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    p {
      font-size: 26px;
      //width: 200px;
      //@overflow();
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      @changeline();
    }
    .changeline{
      width: 320px;
    }

    span {
      font-size: 26px;
      font-weight:bold;
      color: rgba(129, 122, 168, 1);
    }

    h5 {
      text-align: right;
      font-size: 26px;
      font-weight:bold;
      color: rgba(51, 51, 51, 1);
      @changeline();
    }
  }
</style>
