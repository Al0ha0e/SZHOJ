<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于显示比赛信息列表
-->

<template>
  <v-container>
    <v-data-table
      @click:row="showContestInfo"
      :headers="headers"
      :items="contests"
      :loading="loading"
      :options.sync="options"
      :server-items-length="contestCnt"
    ></v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "Contest",

  data: () => ({
    loading: true,
    options: {},
    contestCnt: 0,
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      {
        text: "比赛名",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "创建者",
        align: "start",
        sortable: false,
        value: "creator",
      },
      {
        text: "开始时间",
        align: "start",
        sortable: false,
        value: "start",
      },
      {
        text: "持续时间",
        align: "start",
        sortable: false,
        value: "duration",
      },
    ],
    contests: [],
  }),
  watch: {
    options: {
      handler() {
        this.getContest(); //页码发生改动时重新获取数据
      },
      deep: true,
    },
  },
  methods: {
    showContestInfo(item, other) {
      //跳转至详细信息页面
      this.$router.push("/cinfo/" + item.id);
    },

    parstTime(time) {
      //处理时间格式
      let tm = time.split("T");
      let day = tm[0];
      let hr = tm[1].split("+")[0];
      return day + " " + hr;
    },

    getContest() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      this.axios
        .get(`http://127.0.0.1:8060/pgcontest?pg=${page}&cnt=${itemsPerPage}`) //向后端按页请求数据
        .then((response) => {
          console.log(response);
          this.contests = response.data.contest;
          console.log(this.contests);

          for (let contest of this.contests) {
            //处理数据格式转换
            contest.start = this.parstTime(contest.start);
            contest.duration = contest.duration.toString() + " 小时";
          }
          this.loading = false;
          this.contestCnt = response.data.count;
        })
        .catch((err) => {});
    },
  },

  //此函数在组件加载时自动调用
  mounted: function () {
    let event = new CustomEvent("changeState", {
      //向主组件表明状态切换至此页面
      detail: {
        state: 2,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    this.getContest();
  },
};
</script>
