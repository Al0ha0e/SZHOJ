<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-col cols="12">
          <v-card>
            <v-card-text> 我的代码 &nbsp; </v-card-text>
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
              &nbsp; 提交信息
            </v-card-title>
            <v-card-text>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >ID: &nbsp;{{ status.id }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >题目ID: &nbsp; {{ status.qid }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >用户ID: &nbsp; {{ status.uid }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >状态: &nbsp;
                    <v-chip :color="getColor(status.state)" small dark>
                      {{ status.state }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >运行时间: &nbsp;{{ status.time }}ms</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >运行内存: &nbsp;{{ status.memory }}MB</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider />
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
  name: "StatusDetail",

  data: () => ({
    coder: {},
    status: {},
    code: ``,
    options: {
      tabSize: 2,
      theme: "eclipse",
      lineNumbers: true,
      line: true,
      readOnly: true,
    },
  }),
  methods: {
    initCodeMirror() {
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
    },
    getColor(state) {
      if (state == "AC") return "green";
      if (state == "WA") return "red";
      if (state == "TLE" || state == "MLE") return "blue";
      if (state == "RE") return "purple";
      if (state == "CE") return "yellow";
      if (state == "SYS_ERR") return "orange";
      else return "grey";
    },
  },
  mounted: function () {
    let event = new CustomEvent("changeState", {
      detail: {
        state: -3,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    this.initCodeMirror();
    this.axios
      .get(`http://127.0.0.1:8060/singlestatus?sid=${this.$route.params.id}`)
      .then((response) => {
        console.log(response.data);
        this.status = response.data.status;
        this.status.memory = Math.floor(this.status.memory / (1024 * 1024));
        switch (this.status.state) {
          case 0:
            this.status.state = "PENDING";
            break;
          case 1:
            this.status.state = "AC";
            break;
          case 2:
          case 3:
            this.status.state = "TLE";
            break;
          case 4:
            this.status.state = "MLE";
            break;
          case 5:
            this.status.state = "RE";
            break;
          case 6:
            this.status.state = "SYS_ERR";
            break;
          case 7:
            this.status.state = "CE";
            break;
          case 8:
            this.status.state = "WA";
            break;
          default:
            this.status.state = "UNKOWN";
            break;
        }
        this.code = response.data.code;
        this.coder.setValue(this.code);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
