<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于创建比赛
-->

<template>
  <v-container>
    <v-card>
      <v-card-title>比赛信息</v-card-title>
      <v-card-text>
        <v-text-field label="比赛名称" v-model="contestName"></v-text-field>
        <v-select
          label="用户组"
          :items="userGroupCreatedList"
          v-model="userGroup"
        ></v-select>
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="开始日期"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @input="dateMenu = false"
          ></v-date-picker>
        </v-menu>
        <v-menu
          ref="menu"
          v-model="timeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="startTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startTime"
              label="开始时间"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="timeMenu"
            v-model="startTime"
            full-width
            @click:minute="$refs.menu.save(startTime)"
          ></v-time-picker>
        </v-menu>
        <v-select
          label="持续时间(小时)"
          :items="durationList"
          v-model="duration"
        ></v-select>
        <v-spacer />
        <v-btn color="green" v-on:click="createContest" dark>创建比赛</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Contest",

  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    dateMenu: false,
    timeMenu: false,
    startTime: null,
    userGroupCreatedList: [],
    userGroup: "",
    contestName: "",
    durationList: [1, 2, 3, 4, 5, 6],
    duration: 0,
  }),
  methods: {
    showMainDialog(title, content, callback) {
      let event = new CustomEvent("showMainDialog", {
        detail: {
          title: title,
          content: content,
          callback: callback,
        },
        cancelable: true,
      });
      document.dispatchEvent(event);
    },

    //发送创建比赛请求
    createContest() {
      if (this.contestName.length > 15) {
        this.showMainDialog("提示", "比赛名不得长于15", () => {});
        return;
      }
      let param = {
        name: this.contestName,
        creator: parseInt(localStorage.getItem("userId")),
        gid: parseInt(this.userGroup.split(" ")[1]),
        start: this.date + "T" + this.startTime + ":00+08:00",
        duration: this.duration,
      };
      //console.log(param);

      this.axios
        .post("http://127.0.0.1:8060/addcontest", param)
        .then((response) => {
          console.log(response);
          let event = new CustomEvent("showMainDialog", {
            detail: {
              title: "比赛添加结果",
              content: "比赛添加成功",
              callback: () => {
                this.$router.push("/contest");
              },
            },
            cancelable: true,
          });
          document.dispatchEvent(event);
        })
        .catch((err) => {
          let event = new CustomEvent("showMainDialog", {
            detail: {
              title: "比赛添加结果",
              content: "比赛添加失败",
              callback: () => {},
            },
            cancelable: true,
          });
          document.dispatchEvent(event);
        });
    },
  },
  mounted: function () {
    //状态转换
    let event = new CustomEvent("changeState", {
      detail: {
        state: -4,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);

    //请求自身创建的用户组
    this.axios
      .get(`http://127.0.0.1:8060/usergroup?attend=0`)
      .then((response) => {
        console.log(response);
        this.userGroupCreatedList = [];
        for (let item of response.data) {
          this.userGroupCreatedList.push(
            "ID: " + item.id + " 名称 " + item.name
          );
        }
        console.log(this.userGroupCreatedList);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
