<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于显示并编辑用户组
-->


<template>
  <v-container>
    <v-dialog v-model="outcomeDialog" width="500">
      <v-card>
        <v-card-title>{{ outcomeTitle }}</v-card-title>
        <v-card-text>{{ outcomeContent }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="outcomeDialog = false" color="primary" text
            >确认</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="detailDialog" width="500">
      <v-card>
        <v-card-title>用户组信息</v-card-title>
        <v-card-text
          ><v-data-table
            :headers="userInfoHeaders"
            :items="userInfo"
          ></v-data-table
        ></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="detailDialog = false" color="primary" text
            >确认</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addDialog" width="500">
      <v-card>
        <v-card-title>创建用户组</v-card-title>
        <p />
        <v-card-text>
          组名&nbsp;<v-text-field
            dense
            v-model="newUserGroupName"
          ></v-text-field>
          配置文件&nbsp;<v-file-input dense v-model="newUserGroupFile" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="addUserGroup" color="primary" left text
            >确认</v-btn
          >
          <v-btn v-on:click="addDialog = false" color="primary" right text
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title>删除用户组</v-card-title>
        <v-card-text
          ><v-select
            :items="userGroupCreatedList"
            v-model="groupToBeDeleted"
            label="用户组"
          ></v-select
        ></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="deleteUserGroup" color="primary" left text
            >确认</v-btn
          >
          <v-btn v-on:click="deleteDialog = false" color="primary" right text
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>
            我创建的用户组
            <v-spacer />
            <v-btn color="green" v-on:click="addDialog = true" dark>新增</v-btn>
            &nbsp;
            <v-btn color="red" v-on:click="deleteDialog = true" dark
              >删除</v-btn
            >
          </v-card-title>
          <v-divider />
          <v-data-table
            :headers="headers"
            :items="userGroupCreated"
            @click:row="showGroupDetail"
          ></v-data-table>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>我参加的用户组</v-card-title>
          <v-divider />
          <v-data-table
            :headers="headers"
            :items="userGroupAttended"
            @click:row="showGroupDetail"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "UserGroup",

  data: () => ({
    detailDialog: false,
    addDialog: false,
    deleteDialog: false,
    outcomeDialog: false,
    outcomeTitle: "",
    outcomeContent: "",
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      {
        text: "组名",
        align: "start",
        sortable: false,
        value: "name",
      },
    ],
    userInfoHeaders: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      {
        text: "用户名",
        align: "start",
        sortable: false,
        value: "name",
      },
    ],
    userInfo: [],
    userGroupCreated: [],
    userGroupCreatedList: [],
    userGroupAttended: [],
    newUserGroupName: "",
    newUserGroupFile: {},
    groupToBeDeleted: "",
  }),

  methods: {
    //获取已参与的用户组
    getAttendedGroup() {
      this.axios
        .get(`http://127.0.0.1:8060/usergroup?attend=1`)
        .then((response) => {
          console.log(response);
          this.userGroupAttended = response.data;
          console.log("ADIDI", this.userGroupAttended);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取创建的用户组
    getCreatedGroup() {
      this.axios
        .get(`http://127.0.0.1:8060/usergroup?attend=0`)
        .then((response) => {
          console.log(response);
          this.userGroupCreatedList = [];
          this.userGroupCreated = response.data;
          for (let item of this.userGroupCreated) {
            this.userGroupCreatedList.push(
              "ID: " + item.id + " 名称 " + item.name
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //显示用户组详细信息
    showGroupDetail(item, other) {
      this.detailDialog = true;
      this.userInfo = item.users;
      console.log(this.userInfo);
    },

    //添加用户组
    addUserGroup() {
      this.addDialog = false;
      let form = new FormData();
      console.log(this.newUserGroupName, this.newUserGroupFile);
      form.append("name", this.newUserGroupName);
      form.append("file", this.newUserGroupFile);
      let config = {
        method: "post",
        url: "http://127.0.0.1:8060/addgroup",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      };
      //向后端发送请求
      this.axios(config)
        .then((response) => {
          console.log(response);
          this.outcomeDialog = true;
          this.outcomeTitle = "创建结果";
          this.outcomeContent = "创建成功";
          this.getAttendedGroup();
          this.getCreatedGroup();
        })
        .catch((error) => {
          this.outcomeDialog = true;
          this.outcomeTitle = "创建结果";
          this.outcomeContent = "创建失败";
        });
    },

    //删除用户组
    deleteUserGroup() {
      this.deleteDialog = false;
      let gid = parseInt(this.groupToBeDeleted.split(" ")[1]);
      this.axios
        .post(`http://127.0.0.1:8060/delgroup?gid=${gid}`)
        .then((response) => {
          console.log(response);
          this.outcomeDialog = true;
          this.outcomeTitle = "删除结果";
          this.outcomeContent = "删除成功";
          this.getAttendedGroup();
          this.getCreatedGroup();
        })
        .catch((error) => {
          this.outcomeDialog = true;
          this.outcomeTitle = "删除结果";
          this.outcomeContent = "删除失败";
        });
    },
  },

  mounted: function () {
    //表明状态转换
    let event = new CustomEvent("changeState", {
      detail: {
        state: 3,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    this.getAttendedGroup();
    this.getCreatedGroup();
  },
};
</script>
