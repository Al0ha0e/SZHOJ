<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于用户注册
-->

<template>
  <v-container>
    <v-dialog v-model="registerDialog" width="500">
      <v-card>
        <v-card-title>注册提示</v-card-title>
        <v-card-text>{{ registerOutcome }}</v-card-text>
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
          <v-card-title>注册</v-card-title>
          <v-card-text>
            <v-text-field
              label="用户名"
              :rules="usnameRules"
              hide-details="auto"
              v-model="username"
            ></v-text-field>
            <p />
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
            <v-text-field
              :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[checkDuplicate]"
              :type="showPassword2 ? 'text' : 'password'"
              name="input-10-2"
              label="重复密码"
              class="input-group--focused"
              @click:append="showPassword2 = !showPassword2"
              v-model="password2"
            ></v-text-field>
            <v-btn color="green" class="ma-2 white--text" v-on:click="goLogin"
              >返回登录</v-btn
            >
            <v-btn color="blue" class="ma-2 white--text" v-on:click="register"
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
  name: "Register",

  data: () => ({
    registerDialog: false,
    registerOutcome: "",
    registerSuccess: false,
    showPassword: false,
    showPassword2: false,
    username: "",
    password: "",
    password2: "",

    //名称及密码过滤规则
    usnameRules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters",
      (value) => (value && value.length <= 15) || "Max 15 characters",
    ],
    passwdRules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 8) || "Min 8 characters",
      (value) => (value && value.length <= 15) || "Max 15 characters",
    ],
  }),
  methods: {
    //检查密码重复是否正确
    checkDuplicate(val) {
      if (val != this.password) {
        return "please repeat the password";
      }
      return true;
    },

    goLogin() {
      this.$router.push("/login");
    },
    //注册
    register() {
      if (
        this.username.length > 15 ||
        this.password != this.password2 ||
        this.password.length > 15 ||
        this.password.length < 8
      ) {
        this.registerOutcome = "输入格式无效";
        this.registerSuccess = false;
        this.registerDialog = true;
        return;
      }
      let param = {
        id: 0,
        name: this.username,
        password: this.password,
      };
      //向后端发送注册信息
      this.axios
        .post("http://127.0.0.1:8060/register", param)
        .then((response) => {
          console.log(response);
          if (response.data == "register success") {
            this.registerOutcome = "注册成功";
            this.registerSuccess = true;
            this.registerDialog = true;
          } else if (response.data == "username has been registered") {
            this.registerOutcome = "注册失败，用户名已被注册";
            this.registerSuccess = false;
            this.registerDialog = true;
          } else if (response.data == "invalid form") {
            this.registerOutcome = "注册失败，数据格式无效";
            this.registerSuccess = false;
            this.registerDialog = true;
          } else {
            this.registerOutcome = "注册失败，未知错误";
            this.registerSuccess = false;
            this.registerDialog = true;
          }
        })
        .catch((err) => {
          console.log(err);
          this.registerOutcome = "注册失败，服务器错误";
          this.registerSuccess = false;
          this.registerDialog = true;
        });
    },
    //确认注册信息
    confirmOutcome() {
      this.registerDialog = false;
      if (this.registerSuccess) {
        this.goLogin();
      }
    },
  },
  mounted: function () {
    //显示状态改变
    let event = new CustomEvent("changeState", {
      detail: {
        state: -101,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
  },
};
</script>
