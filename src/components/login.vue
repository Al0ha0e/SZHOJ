<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于登录
-->

<template>
  <v-container>
    <v-dialog v-model="loginDialog" width="500">
      <v-card>
        <v-card-title>登陆提示</v-card-title>
        <v-card-text>{{ loginOutcome }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="confirmOutcome" color="primary" text>确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>请登录SZHOJ</v-card-title>
          <v-card-text>
            <v-text-field
              label="用户名"
              :rules="usnameRules"
              hide-details="auto"
              v-model="username"
            ></v-text-field>
            <v-text-field
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwdRules"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-2"
              label="密码"
              class="input-group--focused"
              @click:append="showPassword = !showPassword"
              v-model="password"
            ></v-text-field>
            <v-btn color="green" class="ma-2 white--text" v-on:click="login"
              >登录</v-btn
            >
            <v-btn color="blue" class="ma-2 white--text" v-on:click="goRegister"
              >注册</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    loginDialog: false,
    loginOutcome: "",
    loginSuccess: false,
    //输入过滤规则
    usnameRules: [
      (value) => !!value || "字段不能为空",
      (value) => (value && value.length >= 3) || "至少三个字符",
      (value) => (value && value.length <= 15) || "至多十五个字符",
    ],
    passwdRules: [
      (value) => !!value || "字段不能为空",
      (value) => (value && value.length >= 8) || "至少三个字符",
      (value) => (value && value.length <= 15) || "至多十五个字符",
    ],
    showPassword: false,
    username: "",
    password: "",
  }),
  methods: {
    //确认登陆结果
    confirmOutcome() {
      this.loginDialog = false;
      if (this.loginSuccess) {
        this.goList();
      }
    },

    goRegister() {
      this.$router.push("/register");
    },

    goList() {
      this.$router.push("/list");
    },
    //处理登录
    login() {
      //判断输入格式
      if (
        this.username.length > 15 ||
        this.password.length > 15 ||
        this.password.length < 8
      ) {
        this.loginOutcome = "输入格式无效";
        this.loginSuccess = false;
        this.loginDialog = true;
        return;
      }
      let param = {
        id: 0,
        name: this.username,
        password: this.password,
      };

      this.axios
        .post("http://127.0.0.1:8060/login", param)
        .then((response) => {
          console.log(response);
          this.loginDialog = true;

          if ("invalid form" == response.data) {
            this.loginSuccess = false;
            this.loginOutcome = "登陆失败，数据格式无效";
          } else if ("wrong password or unregistered" == response.data) {
            this.loginSuccess = false;
            this.loginOutcome = "登陆失败，密码错误或未注册";
          } else {
            let res = response.data.split(" ");
            if (3 == res.length && "login" == res[0] && "success" == res[1]) {
              //登陆成功，保存登陆状态
              localStorage.setItem("userId", parseInt(res[2]));
              localStorage.setItem("username", this.username);
              //触发登陆成功事件
              let event = new CustomEvent("loggedIn", {
                detail: {
                  userId: parseInt(res[2]),
                  username: this.username,
                },
                cancelable: true,
              });
              document.dispatchEvent(event);
              this.loginSuccess = true;
              this.loginOutcome = "登录成功";
            } else {
              this.loginSuccess = false;
              this.loginOutcome = "登录失败，未知错误";
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.loginDialog = true;
          this.loginSuccess = false;
          this.loginOutcome = "登录失败，服务器错误";
        });
    },
  },

  mounted: function () {
    //表明状态转换
    let event = new CustomEvent("changeState", {
      detail: {
        state: -100,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
  },
};
</script>
