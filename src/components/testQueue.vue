<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于显示评测队列
-->

<template>
  <v-container>
    <v-data-table
      @click:row="showStatusDetail"
      :headers="headers"
      :items="statusShowed"
      :loading="loading"
      :options.sync="options"
      :server-items-length="statusCnt"
      class="elevation-1"
    >
      <template v-slot:item.state="{ item }">
        <v-chip :color="getColor(item.state)" small dark>
          {{ item.state }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "TestQueue",

  data: () => ({
    loading: true,
    options: {},
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      {
        text: "题目",
        align: "start",
        sortable: false,
        value: "qid",
      },
      {
        text: "提交者",
        //align: 'start',
        sortable: true,
        value: "uid",
      },
      {
        text: "提交时间",
        align: "start",
        sortable: true,
        value: "commitTime",
      },
      {
        text: "评测状态",
        align: "start",
        sortable: true,
        value: "state",
      },
    ],
    statusCnt: 0,
    statusShowed: [],
    status: [],
  }),

  watch: {
    options: {
      handler() {
        this.getStatus(); //在页面改变时请求数据
      },
      deep: true,
    },
  },

  methods: {
    //显示评测状态细节
    showStatusDetail(item, other) {
      this.$router.push("/sdetail/" + item.id);
    },

    getColor(state) {
      if ("AC" == state) return "green";
      if ("WA" == state) return "red";
      if ("TLE" == state || "MLE" == state) return "blue";
      if ("RE" == state) return "purple";
      if ("CE" == state) return "yellow";
      if ("SYS_ERR" == state) return "orange";
      else return "grey";
    },
    //将数据转化为可读模式
    parseResponse(respose) {
      let ret = respose;
      for (let st of ret) {
        switch (st.state) {
          case 0:
            st.state = "PENDING";
            break;
          case 1:
            st.state = "AC";
            break;
          case 2:
          case 3:
            st.state = "TLE";
            break;
          case 4:
            st.state = "MLE";
            break;
          case 5:
            st.state = "RE";
            break;
          case 6:
            st.state = "SYS_ERR";
            break;
          case 7:
            st.state = "CE";
            break;
          case 8:
            st.state = "WA";
            break;
          default:
            st.state = "UNKOWN";
            break;
        }
        console.log(st.commitTime);
        let tm = st.commitTime.split("T");
        let day = tm[0];
        let hr = tm[1].split("+")[0];
        st.commitTime = day + " " + hr;
      }
      return ret;
    },

    //Only for response with conditions
    //按页在已请求的数据中获得需要显示的数据
    getResponseByPage(page, cnt) {
      let st = (page - 1) * cnt;
      if (st > this.statusCnt) {
        this.statusShowed = [];
        return;
      }
      let en = page * cnt;
      en = en > this.statusCnt ? this.statusCnt : en;
      this.statusShowed = this.status.slice(st, en);
    },

    //向后端请求数据
    getStatus() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      //获取本页查询参数
      let param = {
        id: 1, //NOT ZERO
        qid:
          typeof this.$route.query.qid == undefined
            ? 0
            : parseInt(this.$route.query.qid),
        uid:
          typeof this.$route.query.uid == undefined
            ? 0
            : parseInt(this.$route.query.uid),
      };
      //有条件的筛选
      if (param.qid > 0 || param.uid > 0) {
        //不是第一页表明此前获取过数据，直接加载
        if (page > 1) {
          this.getResponseByPage(page, itemsPerPage);
          return;
        }

        //请求数据
        this.axios
          .post("http://127.0.0.1:8060/status", param)
          .then((response) => {
            console.log(response);
            this.status = this.parseResponse(response.data);
            this.statusCnt = this.status.length;
            this.getResponseByPage(page, itemsPerPage);
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        //按页面无条件，每页都需要重新加载数据
        this.axios
          .get(
            `http://127.0.0.1:8060/pgstatus?pg=${page}&cnt=${itemsPerPage}`,
            param
          )
          .then((response) => {
            console.log(response);
            this.statusShowed = this.parseResponse(response.data.status);
            this.statusCnt = response.data.count;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      }
    },
  },
  mounted: function () {
    //表明状态改变
    let event = new CustomEvent("changeState", {
      detail: {
        state: 1,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    this.getStatus();
  },
};
</script>
