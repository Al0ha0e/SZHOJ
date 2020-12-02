<template>
  <v-app>
    <v-app-bar app color="blue" dark elevation="2">
      <v-btn class="d-flex align-center" v-on:click="showList" text large>
        SZHOJ
      </v-btn>

      <v-spacer></v-spacer>
      <template>
        <v-tabs
          align-with-title
          v-model="currPos"
          id="stateTabs"
          v-if="currPos >= 0"
        >
          <v-tab key="list" v-on:click="showList">题目列表</v-tab>
          <v-tab key="queue" v-on:click="showQueue">评测队列</v-tab>
          <v-tab key="contest" v-on:click="showContest">比赛</v-tab>
        </v-tabs>
      </template>
      <v-spacer></v-spacer>
      <div v-if="currPos > -50">
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              {{ username }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>{{ username }}</v-card-title>
            <v-divider />
            <v-card-actions>
              <v-btn text v-on:click="showUserInfo">我的信息</v-btn>
              <v-btn text v-on:click="createQuestion">创建题目</v-btn>
              <v-btn text v-on:click="logOut">登出</v-btn>
            </v-card-actions>
            <!--v-card-text>
                   
                    <v-list>
                    <v-list-item>
                        <v-list-item-title>我的信息</v-list-item-title>
                    </v-list-item>
                </v-list>
                </v-card-text-->
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-content class="grey lighten-5">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    currPos: 0,
    userId: "1726tgyeuva",
    username: "Al0ha0e",
  }),
  methods: {
    logOut: function () {
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      this.$router.push("/login");
    },
    showList: function () {
      if (this.currPos == 0) {
        return;
      }
      this.currPos = 0;
      //console.log(this.currPos)
      this.$router.push("/list");
    },
    showQueue: function () {
      if (this.currPos == 1) {
        return;
      }
      this.currPos = 1;
      //console.log(this.currPos)
      this.$router.push("/queue");
    },
    showContest: function () {
      this.currPos = 2;
    },
    showUserInfo: function () {
      if (this.currPos == -2) return;
      this.currPos = -2;
      this.$router.push("/user/" + this.userId);
    },
    createQuestion() {
      if (this.currPos == -3) return;
      this.currPos = -3;
      this.$router.push("/createq");
    },
  },
  mounted: function () {
    this.userId = localStorage.getItem("userId");
    this.username = localStorage.getItem("username");
    this.$cookies.config("30d");
    console.log(this.$cookies.get("mysession"), this.$cookies.keys());
    if (this.$route.path == "/login") {
      this.currPos = -100;
    } else if (this.$route.path == "/register") {
      this.currPos = -101;
    } else if (this.$route.path == "/list") {
      this.currPos = 0;
    } else if (this.$route.path == "/queue") {
      this.currPos = 1;
    } else if (this.$route.path.split("/")[1] == "qinfo") {
      this.currPos = -1;
    } else if (this.$route.path.split("/")[1] == "user") {
      this.currPos = -2;
    }
    document.addEventListener("changeState", (e) => {
      this.currPos = e.detail.state;
    });
    document.addEventListener("loggedIn", (e) => {
      this.userId = e.detail.userId;
      this.username = e.detail.username;
      console.log("LOGGED IN ", this.userId, this.username);
    });
  },
};
</script>
