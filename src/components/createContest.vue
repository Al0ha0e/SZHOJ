<template>
  <v-container>
    <v-card>
      <v-card-title>比赛信息</v-card-title>
      <v-card-text>
        <v-text-field label="题目名称"></v-text-field>
        <v-select label="用户组"></v-select>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Contest",

  data: () => ({}),
  methods: {},
  mounted: function () {
    let event = new CustomEvent("changeState", {
      detail: {
        state: -4,
      },
      cancelable: true,
    });
    document.dispatchEvent(event);
    //console.log(this.$route.params.id)
  },
};
</script>
