<template>
<v-container>
    
</v-container>
</template>

<script>
export default {
    name: 'JudgeOutcome',

    data: () => ({}),
    methods: {},
    mounted: function () {
        let event = new CustomEvent('changeState', {
            detail: {
                state: -2
            },
            cancelable: true
        });
        document.dispatchEvent(event);
        console.log(this.$route.params.id)
    }
}
</script>
