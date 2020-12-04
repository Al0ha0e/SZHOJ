<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于显示比赛详细信息、榜单、状态及添加题目
-->

<template>
  <v-container>
    <v-dialog v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title>删除题目</v-card-title>
        <v-card-text
          ><v-select label="题目" :items="questionName"></v-select
        ></v-card-text>
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
          <v-text-field dense label="题目名称" v-model="newQuestionInfo.name" />
          <v-select
            label="时间限制"
            :items="timeLimitList"
            v-model="newQuestionInfo.timeLimit"
            dense
          ></v-select>
          <v-select
            label="空间限制"
            :items="memoryLimitList"
            v-model="newQuestionInfo.memoryLimit"
            dense
          ></v-select>
          <v-file-input v-model="description" dense label="题目描述" />
          <v-file-input v-model="input" dense label="测试输入" />
          <v-file-input v-model="output" dense label="答案" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="uploadQuestion" color="primary" left text
            >确认</v-btn
          >
          <v-btn v-on:click="addDialog = false" color="primary" right text
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="selfStatusDialog">
      <v-card>
        <v-card-title>评测状态</v-card-title>
        <v-card-text>
          <v-data-table :headers="statusHeaders" :items="status">
            <template v-slot:item.state="{ item }">
              <v-chip :color="getColor(item.state)" small dark>
                {{ item.state }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" v-on:click="selfStatusDialog = false" left text
            >确认</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="totStatusDialog">
      <v-card>
        <v-card-title>排行榜</v-card-title>
        <v-card-text>
          <v-data-table :headers="totStatusHeaders" :items="totStatus">
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" v-on:click="totStatusDialog = false" left text
            >确认</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text
            ><v-progress-linear v-model="timePercent"></v-progress-linear
          ></v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-card-title>题目列表</v-card-title>
          <v-card-text>
            <div v-if="contestInfo.creator == userId">
              <v-btn color="green" v-on:click="addDialog = true" dark
                >新增</v-btn
              >
              &nbsp;
              <!--v-btn color="red" v-on:click="deleteDialog = true" dark
                >删除</v-btn
              -->
            </div>
            <v-data-table
              @click:row="showQuestionInfo"
              :headers="headers"
              :items="contestInfo.questions"
            >
              <template v-slot:item.state="{ item }">
                <v-icon v-if="item.state == 'ac'" color="green" medium dark>
                  mdi-checkbox-marked-circle
                </v-icon>
                <v-icon v-if="item.state == 'nac'" color="red" medium dark>
                  mdi-close-circle
                </v-icon>
              </template>
            </v-data-table>
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
              <v-btn
                color="purple"
                v-on:click="showSelfStatus"
                class="ma-2 white--text"
              >
                状态
                <v-icon right dark> mdi-chart-pie </v-icon>
              </v-btn>
              <v-btn
                v-on:click="showTotalStatus"
                color="orange"
                class="ma-2 white--text"
              >
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
    //以下四条对应四个对话框的开关状态
    addDialog: false,
    deleteDialog: false,
    selfStatusDialog: false,
    totStatusDialog: false,

    userId: 0,
    newQuestionInfo: {
      name: "",
      timeLimit: 0,
      memoryLimit: 0,
      creator: 0,
      cid: 0,
    },
    description: null,
    input: null,
    output: null,
    timeLimitList: [500, 1000, 2000, 3000, 4000, 5000, 10000],
    memoryLimitList: [64, 128, 256, 512],
    //列表表头
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
    statusHeaders: [
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

    totStatusHeaders: [],
    contestInfo: { questions: [] },
    questionName: [],
    startTime: 0,
    timePercent: 0,
    status: [],
    totStatus: [],
  }),

  methods: {
    //显示用户本人在本场比赛中的提交状态
    showSelfStatus() {
      this.getSelfStatus();
      this.selfStatusDialog = true;
    },

    //计算排行榜
    getShowedTotalStatus(status) {
      let showedStatus = new Map();
      for (let st of status) {
        if (showedStatus.has(st.uid)) {
          //用户此前已被添加到榜单中
          let qid = st.qid.toString();
          let userStatus = showedStatus.get(st.uid);
          //
          if (userStatus[qid] != "ac") {
            //已经AC的不需要记录别的
            userStatus[qid] = 1 == st.state ? "ac" : "nac";
            if (0 == st.state) {
              userStatus[qid] = "unkown";
            }
            userStatus.cnt += 1 == st.state ? 1 : 0; //计算AC题数
            showedStatus.set(st.uid, userStatus);
          }
        } else {
          //用户此前未被添加到榜单中
          let userStatus = { id: 0, uid: st.uid, cnt: 0 };
          for (let question of this.contestInfo.questions) {
            //遍历所有比赛题目创建状态
            if (question.id == st.qid) {
              userStatus[st.qid.toString()] = 1 == st.state ? "ac" : "nac";
              if (0 == st.state) {
                userStatus[st.qid.toString()] = "unkown";
              }
              userStatus.cnt = 1 == st.state ? 1 : 0;
            } else {
              userStatus[question.id.toString()] = "unkown";
            }
          }
          showedStatus.set(st.uid, userStatus);
        }
      }
      //console.log(showedStatus, showedStatus.values());
      let showedStatusList = [];
      for (let st of showedStatus.values()) {
        showedStatusList.push(st);
      }
      showedStatusList.sort((a, b) => {
        //对结果排序
        a.cnt - b.cnt;
      });
      this.totStatus = showedStatusList;
    },

    //获取数据并显示排行榜
    showTotalStatus() {
      this.axios
        .get(`http://127.0.0.1:8060/totcstatus?cid=${this.$route.params.id}`)
        .then((response) => {
          console.log(response);
          this.getShowedTotalStatus(response.data);
          //this.totStatus = response.data;
          this.totStatusDialog = true;
        })
        .catch((err) => {});
    },

    //进入题目信息页面
    showQuestionInfo(item, other) {
      //console.log(arg1)
      this.$router.push("/qinfo/" + item.id);
    },
    //更新比赛时间
    updateContestTime() {
      console.log(new Date().getTime());
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

    //将格式数据转化为可视数据
    parseStatus(status) {
      let ret = status;
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
        let tm = st.commitTime.split("T");
        let day = tm[0];
        let hr = tm[1].split("+")[0];
        st.commitTime = day + " " + hr;
      }
      return ret;
    },

    //获取自身提交状态
    getSelfStatus() {
      this.axios
        .get(
          `http://127.0.0.1:8060/cstatus?cid=${this.$route.params.id}&uid=${this.userId}`
        )
        .then((response) => {
          console.log(response);
          this.status = this.parseStatus(response.data);

          //计算每道题的通过情况
          for (let question of this.contestInfo.questions) {
            for (let st of this.status) {
              if (question.id == st.qid) {
                //状态与题目相符
                if (question.state != "ac") {
                  if ("AC" == st.state) {
                    //已经AC的不需要更新
                    question.state = "ac";
                  } else if (st.state != "PENDING") {
                    question.state = "nac";
                  }
                }
              }
            }
          }
          this.$forceUpdate();
        })
        .catch((err) => {});
    },

    //获取比赛信息
    getContestInfo() {
      this.axios
        .get(`http://127.0.0.1:8060/contest?cid=${this.$route.params.id}`)
        .then((response) => {
          console.log(response);
          this.contestInfo = response.data;
          this.contestInfo.start = this.parstTime(this.contestInfo.start);
          this.startTime = Date.parse(this.contestInfo.start);
          if (response.data.questions === null) {
            this.contestInfo.questions = [];
          }
          this.questionName = [];
          this.totStatusHeaders = [
            { text: "排名", align: "start", sortable: false, value: "id" },
            { text: "用户ID", align: "start", sortable: false, value: "uid" },
          ];

          for (let quest of this.contestInfo.questions) {
            quest.state = "unkown";
            this.questionName.push(
              "ID: " + quest.id.toString() + " 名称: " + quest.name
            );
            this.totStatusHeaders.push({
              text: quest.name,
              align: "start",
              sortable: false,
              value: quest.id.toString(),
            });
          }
          console.log(this.totStatusHeaders);
          //this.timer = setInterval(this.updateContestTime, 1000);
          this.getSelfStatus();
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

    //上传题目
    uploadQuestion() {
      let form = new FormData();
      this.newQuestionInfo.creator = this.userId;
      this.newQuestionInfo.cid = this.contestInfo.id;
      form.append("qinfo", JSON.stringify(this.newQuestionInfo));
      form.append("file", this.description);
      form.append("file", this.input);
      form.append("file", this.output);

      let config = {
        method: "post",
        url: "http://127.0.0.1:8060/upquestion",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      };

      this.axios(config)
        .then((response) => {
          console.log(response);
          let event = new CustomEvent("showMainDialog", {
            detail: {
              title: "题目添加结果",
              content: "题目添加成功",
              callback: () => {
                this.addDialog = false;
                this.getContestInfo;
              },
            },
            cancelable: true,
          });
          document.dispatchEvent(event);
        })
        .catch((error) => {
          let event = new CustomEvent("showMainDialog", {
            detail: {
              title: "题目添加结果",
              content: "题目添加失败",
              callback: () => {},
            },
            cancelable: true,
          });
          document.dispatchEvent(event);
        });
    },
    parstTime(time) {
      let tm = time.split("T");
      let day = tm[0];
      let hr = tm[1].split("+")[0];
      return day + " " + hr;
    },
  },

  mounted: function () {
    document.addEventListener("timeTick", (e) => {
      //此处用于计算比赛进度
      let now = new Date().getTime();
      let percent =
        (now - this.startTime) / (this.contestInfo.duration * 3600 * 10);
      if (percent > 100) {
        this.timePercent = 100;
      } else if (percent < 0) {
        this.timePercent = 0;
      } else {
        this.timePercent = percent;
      }
      console.log(this.timePercent, new Date(this.timePercent));
    });

    //向主组件表明状态改变
    let event = new CustomEvent("changeState", {
      detail: {
        state: -5,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    //console.log(this.$route.params.id)
    this.userId = parseInt(localStorage.getItem("userId"));
    this.getContestInfo();
  },
};
</script>
