<template>
  <v-container>
    <v-dialog v-model="submitDialog" width="500">
      <v-card>
        <v-card-title>提交结果</v-card-title>
        <v-card-text>{{ submitOutcome }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="confirmOutcome" color="primary" text>确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="9">
        <v-col cols="12">
          <v-card padding="10px">
            <v-card-text>
              <article
                v-html="description"
                slot="default"
                id="mveditor"
              ></article>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-text>
              我的代码 &nbsp;
              <v-btn
                color="green"
                class="ma-2 white--text"
                v-on:click="commitAnswer"
              >
                提交
                <v-icon right dark> mdi-upload </v-icon>
              </v-btn>
            </v-card-text>
            <div class="in-coder-panel">
              <textarea ref="textarea"></textarea>
            </div>
          </v-card>
        </v-col>
      </v-col>

      <v-col cols="3">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-icon medium>mdi-information</v-icon>
              &nbsp; 题目信息
            </v-card-title>
            <v-card-text>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >ID: &nbsp;{{ questionInfo.id }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >难度: &nbsp;
                    <v-chip
                      :color="getColor(questionInfo.difficulty)"
                      small
                      dark
                    >
                      {{ questionInfo.difficulty }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >通过/提交: &nbsp;{{ questionInfo.acCnt }}/{{
                      questionInfo.totCnt
                    }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >时间限制: &nbsp;{{
                      questionInfo.timeLimit
                    }}ms</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >空间限制: &nbsp;{{
                      questionInfo.memoryLimit
                    }}MB</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <!--v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >标签
                    <p />
                    <v-chip-group column>
                      <v-chip
                        outlined
                        small
                        v-for="tag in questionInfo.tags"
                        :key="tag"
                      >
                        {{ tag }}
                      </v-chip>
                    </v-chip-group>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item-->
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-btn
                color="purple"
                v-on:click="showStatus"
                class="ma-2 white--text"
              >
                状态
                <v-icon right dark> mdi-chart-pie </v-icon>
              </v-btn>
              <!--v-btn color="orange" class="ma-2 white--text">
                题解
                <v-icon right dark> mdi-lightbulb-on-outline </v-icon>
              </v-btn-->
            </v-card-text>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/python/python.js";

export default {
  name: "QuestionInfo",
  data: () => ({
    submitDialog: false,
    submitOutcome: "",
    submitSuccess: false,
    questionInfo: {},
    value: ``,
    description: ``,
    code: ``,
    mode: "text/x-csrc",
    coder: null,
    options: {
      tabSize: 2,
      theme: "eclipse",
      lineNumbers: true,
      line: true,
    },
    modes: [
      {
        value: "javascript",
        label: "Javascript",
      },
      {
        value: "x-python",
        label: "Python",
      },
      {
        value: "x-csrc",
        label: "C",
      },
    ],
  }),
  methods: {
    getColor(difficulty) {
      if (difficulty == "困难") return "red";
      else if (difficulty == "中等") return "orange";
      else if (difficulty == "简单") return "yellow";
      else if (difficulty == "无") return "grey";
      else return "green";
    },
    showMd(a, b) {
      console.log(b);
    },

    initCodeMirror() {
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
      this.coder.setValue(this.code);
      this.coder.on("change", (coder) => {
        this.code = coder.getValue();
      });
    },
    showStatus() {
      this.$router.push(`/queue?qid=${this.questionInfo.id}`);
    },
    confirmOutcome() {
      if (this.submitSuccess) {
        this.$router.push("/queue");
      }
    },
    commitAnswer() {
      let form = new FormData();
      let ansInfo = {
        id: parseInt(localStorage.getItem("userId")),
        qid: this.questionInfo.id,
        state: 0,
      };
      let ansBlob = new Blob([this.code]);
      let ansFile = new File([ansBlob], "ans");
      form.append("commit", JSON.stringify(ansInfo));
      form.append("file", ansFile);
      let config = {
        method: "post",
        url: "http://127.0.0.1:8060/upanswer",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      };

      this.axios(config)
        .then((response) => {
          //console.log(response.data);
          //this.$router.push("/queue");
          this.submitSuccess = true;
          this.submitDialog = true;
          this.submitOutcome = "提交成功";
        })
        .catch((err) => {
          console.log(err);
          this.submitSuccess = false;
          this.submitDialog = true;
          this.submitOutcome = "提交失败";
        });
    },
  },
  mounted: function () {
    let event = new CustomEvent("changeState", {
      detail: {
        state: -1,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);

    this.axios
      .get(`http://127.0.0.1:8060/question?qid=${this.$route.params.id}`)
      .then((response) => {
        this.questionInfo = response.data;
        switch (this.questionInfo.difficulty) {
          case 0:
            this.questionInfo.difficulty = "无";
            break;
          case 1:
            this.questionInfo.difficulty = "入门";
            break;
          case 2:
            this.questionInfo.difficulty = "简单";
            break;
          case 3:
            this.questionInfo.difficulty = "中等";
            break;
          default:
            this.questionInfo.difficulty = "困难";
            break;
        }
        let tags = [];
        for (let tag of this.questionInfo.tags) {
          tags.push(tag.name);
        }
        this.questionInfo.tags = tags;
      })
      .catch((err) => {
        console.log(err);
      });
    this.axios
      .get(`http://127.0.0.1:8060/quedesc?qid=${this.$route.params.id}`)
      .then((response) => {
        this.description = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
    this.initCodeMirror();
  },
};
</script>
<style scoped>
#mveditor {
  z-index: 1 !important;
}
</style>
