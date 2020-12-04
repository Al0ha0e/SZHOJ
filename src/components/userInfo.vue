<!--
孙梓涵编写
SZHOJ v1.0.0
本页面用于显示用户信息
2020.12.3：没时间做了
-->


<template>
  <v-container> </v-container>
</template>

<script>
export default {
  name: "UserInfo",

  data: () => ({}),
  methods: {},
  mounted: function () {
    let event = new CustomEvent("changeState", {
      detail: {
        state: -2,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    //console.log(this.$route.params.id)
  },
};
</script>
