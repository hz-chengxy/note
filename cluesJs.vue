<template>
  <div class="box3">
    <div class="head head2">
      <span class="on">突发线索</span>
    </div>
    <div class="jjxs room">
      <div
        class="carousels"
        v-for="(item, index) in showDatas"
        :key="'clue' + index"
        v-html="showDatas[index].TITLE"
      ></div>
    </div>
  </div>
</template>

<script>
import MarqueeTips from "vue-marquee-tips";
export default {
  components: { MarqueeTips },
  name: "clues",
  data() {
    return {
      dataList: [],
      showDatas: [],
      len: 0,
      num: 7,
      timer: "",
      scrollTimer: null,
      timeIndex:0,
    };
  },
  mounted() {
    this.getdata();
    this.timer = setInterval(() => {
      this.getdata();
    }, 1000 * 60 * 3);
  },
  methods: {
    getdata() {
      this.axios.get("/bigScreenJson/xiansuo.json").then((res) => {
        if (res.data) {
          this.dataList = res.data.data;
          this.showDatas = JSON.parse(
            JSON.stringify(this.dataList.slice(0, 7))
          );
          if (this.scrollTimer) {
            for (var i = this.timeIndex; i <= this.scrollTimer; i++) {
              clearInterval(i);
            }
          }
          this.len = this.dataList.length;

          /* 
          如果数据小于7条，证明此时一个屏已经够显示完所有的数据，则直接从0条数据开始下一轮的滚动循环即可，
          如果数据大于7条，则此时一个屏不够显示完所有的数据，则需要从数组index的7开始继续本轮的循环。
          此前在没有加这层逻辑的时候，当数据不够7条的时候会莫名其妙报TITLE未定义的错，
          定位的原因就是dataList的长度小于7时，如果num定死为7时，dataList[7]是不存在，所以会报TITLE未定义的错。
          */
          if(this.len > 7){
            this.num = 7
          }else{
            this.num = 0
          }

          this.$nextTick(() => {
            this.cluesScroll();
          });
        }
      });
    },
    cluesScroll() {
      var top = 0;
      var that = this;
      $(".carousels").each(function (index, item) {
        var speed = Math.floor(Math.random() * 4 + 2);
        var colorList = ["#f2f1f1", "#fff", "#fbc81b", "#4f96f9", "#FFDEAD"];
        var sizeList = [32, 34, 36, 42, 46, 48];
        var bigSizeList = [36, 38, 42, 46];
        var left = 1692;
        $(this).css("top", top);
        $(this).css("color", colorList[Math.floor(Math.random() * 5)]);
        $(this).css("fontSize", bigSizeList[Math.floor(Math.random() * 4)]);
        top += $(this).innerHeight();
        that.scrollTimer = setInterval(() => {
          left -= speed;
          if (left <= -$(this).width()) {
            left = 1692;
            speed = Math.floor(Math.random() * 4 + 2);
            that.showDatas[index].TITLE = that.dataList[that.num].TITLE;
            $(this).css("color", colorList[Math.floor(Math.random() * 5)]);
            $(this).css("fontSize", sizeList[Math.floor(Math.random() * 6)]);
            that.num++;
            if (that.num >= that.len) that.num = 0;
          }
          $(this).css("left", left);
        }, 16);
        // 为了准确定位需要清除的7个定时器的值，在这里记录下来。之前未做这一逻辑的时候误删了很多定时器，导致首页一些定时器任务被清除，数据不会刷新。
        if(index == 0){
          that.timeIndex = that.scrollTimer;
        }
        // console.log(that.timeIndex)
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.scrollTimer);
  },
};
</script>

<style lang="less" scoped>
.box3 {
  width: 1692px;
  height: 602px;
  background: url("../assets/images/box3.png") no-repeat center top;
  margin-top: 10px;
  overflow: hidden;
}
.box3 .head {
  margin-top: 50px;
}
.jjxs {
  width: 1692px;
  height: 360px;
  margin: 20px 0px 0;
  position: relative;
  .carousels {
    position: absolute;
    white-space: nowrap;
    left: 1692px;
  }
}
</style>