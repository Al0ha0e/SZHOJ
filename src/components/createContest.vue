<template>
  <v-container>
    <v-card>
      <v-card-title>比赛信息</v-card-title>
      <v-card-text>
        <v-text-field label="题目名称" v-model="contestName"></v-text-field>
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
    durationList: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6],
    duration: 0,
  }),
  methods: {
    createContest() {
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
          let event = new CustomEvent("showMainDialog", {
            detail: {
              title: "添加结果",
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
    let event = new CustomEvent("changeState", {
      detail: {
        state: -4,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);

    this.axios
      .get(`http://127.0.0.1:8060/usergroup?attend=0`)
      .then((response) => {
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
