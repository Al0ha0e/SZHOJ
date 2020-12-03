<template>
  <v-container>
    <v-dialog v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title>删除题目</v-card-title>
        <v-card-text><v-select label="题目"></v-select></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" left text>确认</v-btn>
          <v-btn v-on:click="deleteDialog = false" color="primary" right text
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addDialog" width="500">
      <v-card>
        <v-card-title>添加题目</v-card-title>
        <v-card-text>
          <v-text-field dense label="题目名称" />
          <v-select label="时间限制" dense></v-select>
          <v-select label="空间限制" dense></v-select>
          <v-file-input dense label="题目描述" />
          <v-file-input dense label="测试输入" />
          <v-file-input dense label="答案" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="addContestProblem" color="primary" left text
            >确认</v-btn
          >
          <v-btn v-on:click="addDialog = false" color="primary" right text
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-progress-linear value="15"></v-progress-linear>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-card-title>题目列表</v-card-title>
          <v-card-text>
            <div v-if="(contestInfo.creator = userId)">
              <v-btn color="green" v-on:click="addDialog = true" dark
                >新增</v-btn
              >
              &nbsp;
              <v-btn color="red" v-on:click="deleteDialog = true" dark
                >删除</v-btn
              >
            </div>
            <v-data-table
              :headers="headers"
              :items="contestInfo.questions"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-col cols="12">
          <v-card>
            <v-card-title>比赛信息</v-card-title>
            <v-card-text>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >比赛名: &nbsp;{{ contestInfo.name }}</v-list-item-title
                  >
                </v-list-item-content></v-list-item
              >
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >比赛ID: &nbsp;{{ contestInfo.id }}</v-list-item-title
                  >
                </v-list-item-content></v-list-item
              >
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >用户组: &nbsp;{{ contestInfo.gid }}</v-list-item-title
                  >
                </v-list-item-content></v-list-item
              >
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >创建者: &nbsp;{{ contestInfo.creator }}</v-list-item-title
                  >
                </v-list-item-content></v-list-item
              >
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >开始时间:
                    <p />
                    &nbsp;{{ contestInfo.start }}</v-list-item-title
                  >
                </v-list-item-content></v-list-item
              >
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >持续时间: &nbsp;{{
                      contestInfo.duration
                    }}&nbsp;小时</v-list-item-title
                  >
                </v-list-item-content></v-list-item
              >
              <v-divider />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-btn color="purple" class="ma-2 white--text">
                状态
                <v-icon right dark> mdi-chart-pie </v-icon>
              </v-btn>
              <v-btn color="orange" class="ma-2 white--text">
                排行
                <v-icon right dark> mdi-lightbulb-on-outline </v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ContestInfo",

  data: () => ({
    addDialog: false,
    deleteDialog: false,
    userId: 0,
    headers: [
      {
        text: "状态",
        align: "start",
        sortable: false,
        value: "state",
      },
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      {
        text: "题目名称",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "提交总数",
        align: "start",
        sortable: false,
        value: "totCnt",
      },
      {
        text: "AC数",
        align: "start",
        sortable: false,
        value: "acCnt",
      },
    ],
    contestInfo: { questions: [] },
  }),
  methods: {
    addContestProblem() {},
    parstTime(time) {
      let tm = time.split("T");
      let day = tm[0];
      let hr = tm[1].split("+")[0];
      return day + " " + hr;
    },
  },
  mounted: function () {
    let event = new CustomEvent("changeState", {
      detail: {
        state: -5,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    //console.log(this.$route.params.id)
    this.userId = localStorage.getItem("userId");
    this.axios
      .get(`http://127.0.0.1:8060/contest?cid=${this.$route.params.id}`)
      .then((response) => {
        this.contestInfo = response.data;
        this.contestInfo.start = this.parstTime(this.contestInfo.start);
        if (response.data.questions === null) {
          this.contestInfo.questions = [];
        }
        console.log(this.contestInfo);
      })
      .catch((err) => {
        let event = new CustomEvent("showMainDialog", {
          detail: {
            title: "提示",
            content: "您不能查看这场比赛的内容",
            callback: () => {
              this.$router.push("/contest");
            },
          },
          cancelable: true,
        });
        document.dispatchEvent(event);
      });
  },
};
</script>
