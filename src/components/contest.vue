<template>
  <v-container>
    <v-data-table></v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "Contest",

  data: () => ({
    contests: {
      id: 0,
      name: 1,
      creator: 2,
      startTime: "",
      Duration: "",
    },
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
