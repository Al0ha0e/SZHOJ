<template>
  <v-container>
    <v-data-table
      @click:row="showQuestionInfo"
      :headers="headers"
      :items="questions"
      :loading="loading"
      :options.sync="options"
      :server-items-length="questionCnt"
      class="elevation-1"
    >
      <template v-slot:item.state="{ item }">
        <v-icon v-if="item.state == 'ac'" color="green" medium dark>
          mdi-checkbox-marked-circle
        </v-icon>
        <v-icon
          v-if="item.state != 'ac' && item.state != 'unkown'"
          color="red"
          medium
          dark
        >
          mdi-close-circle
        </v-icon>
      </template>
      <template v-slot:item.difficulty="{ item }">
        <v-chip :color="getColor(item.difficulty)" small dark>
          {{ item.difficulty }}
        </v-chip>
      </template>
      <template v-slot:item.tags="{ item }">
        <v-chip-group>
          <v-chip outlined small v-for="tag in item.tags" :key="tag">
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "QuestList",

  data: () => ({
    loading: true,
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
        text: "难度",
        align: "start",
        sortable: false,
        value: "difficulty",
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
      {
        text: "标签",
        sortable: false,
        align: "start",
        value: "tags",
      },
    ],
    questions: [],
    questionCnt: 0,
    questionStatus: {},
    options: {},
  }),
  watch: {
    options: {
      handler() {
        this.getQuestions(false);
      },
      deep: true,
    },
  },
  methods: {
    getColor(difficulty) {
      if (difficulty == "困难") return "red";
      else if (difficulty == "中等") return "orange";
      else if (difficulty == "简单") return "yellow";
      else return "green";
    },
    showQuestionInfo(item, other) {
      //console.log(arg1)
      this.$router.push("/qinfo/" + item.id);
    },
    getQuestions(refreshStatus) {
      //TODO: PAGING BUG!!!
      this.loading = true;

      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      if (refreshStatus) {
        this.questionStatus = new Map();
        this.axios
          .get(`http://127.0.0.1:8060/ministatus?uid=${this.userId}`)
          .then((response) => {
            for (let st of response.data) {
              st.qid = st.qid.toString();
              if (this.questionStatus.has(st.qid)) {
                let qst = this.questionStatus.get(st.qid);
                if (qst == "1") {
                  continue;
                }
                this.questionStatus.set(st.qid, st.state.toString());
              } else if (st.state != 0) {
                this.questionStatus.set(st.qid, st.state.toString());
              }
            }
            return this.axios.get(
              `http://127.0.0.1:8060/pgquest?pg=${page}&cnt=${itemsPerPage}`
            );
          })
          .then((response) => {
            this.questions = response.data;
            for (let question of this.questions) {
              switch (question.difficulty) {
                case 1:
                  question.difficulty = "入门";
                  break;
                case 2:
                  question.difficulty = "简单";
                  break;
                case 3:
                  question.difficulty = "中等";
                  break;
                default:
                  question.difficulty = "困难";
                  break;
              }
              if (this.questionStatus.has(question.id.toString())) {
                question["state"] =
                  this.questionStatus.get(question.id.toString()) == "1"
                    ? "ac"
                    : "nac";
              } else {
                question["state"] = "unkown";
              }
              let tags = [];
              for (let tag of question.tags) {
                tags.push(tag.name);
              }
              question.tags = tags;
            }
            this.loading = false;
            this.questionCnt = this.questions.length;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.axios
          .get(`http://127.0.0.1:8060/pgquest?pg=${page}&cnt=${itemsPerPage}`)
          .then((response) => {
            this.questions = response.data;
            for (let question of this.questions) {
              switch (question.difficulty) {
                case 1:
                  question.difficulty = "入门";
                  break;
                case 2:
                  question.difficulty = "简单";
                  break;
                case 3:
                  question.difficulty = "中等";
                  break;
                default:
                  question.difficulty = "困难";
                  break;
              }
              if (this.questionStatus.has(question.id.toString())) {
                question["state"] =
                  this.questionStatus.get(question.id.toString()) == "1"
                    ? "ac"
                    : "nac";
              } else {
                question["state"] = "unkown";
              }
              let tags = [];
              for (let tag of question.tags) {
                tags.push(tag.name);
              }
              question.tags = tags;
            }
            this.loading = false;
            this.questionCnt = this.questions.length;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      }
    },
  },
  mounted: function () {
    this.userId = localStorage.getItem("userId");
    let event = new CustomEvent("changeState", {
      detail: {
        state: 0,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    this.getQuestions(true);
  },
};
</script>
