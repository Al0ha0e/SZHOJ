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
            <v-btn color="green" v-on:click="addDialog = true" dark>新增</v-btn>
            &nbsp;
            <v-btn color="red" v-on:click="deleteDialog = true" dark
              >删除</v-btn
            >
            <v-data-table></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card>
          <v-card-title>比赛信息</v-card-title>
          <v-card-text>
            <v-btn color="purple" class="ma-2 white--text">
              提交状态
              <v-icon right dark> mdi-chart-pie </v-icon>
            </v-btn>
            <v-btn color="orange" class="ma-2 white--text">
              排行榜
              <v-icon right dark> mdi-lightbulb-on-outline </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
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
  }),
  methods: {},
  mounted: function () {
    let event = new CustomEvent("changeState", {
      detail: {
        state: 2,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    //console.log(this.$route.params.id)
  },
};
</script>
