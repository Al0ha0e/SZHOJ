<template>
<v-container>
    <v-data-table :headers="headers" :items="questions" :items-per-page="5" class="elevation-1">
        <template v-slot:item.state="{ item }">
            <v-chip :color="getColor(item.state)" small dark>
                {{ item.state }}
            </v-chip>
        </template>
    </v-data-table>
</v-container>
</template>

<script>
export default {
    name: 'TestQueue',

    data: () => ({
        headers: [{
                text: 'ID',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            {
                text: '题目名称',
                align: 'start',
                sortable: false,
                value: 'name'
            },
            {
                text: '提交者',
                //align: 'start',
                sortable: true,
                value: 'userId'
            },
            {
                text: '提交时间',
                align: 'start',
                sortable: true,
                value: 'commitTime'
            },
            {
                text: '评测状态',
                align: 'start',
                sortable: true,
                value: 'state'
            },
        ],
        questions: [{
            id: "114514",
            name: "A+B Problem",
            userId: "szh11",
            commitTime: "2000-05-11 11:20:00",
            state: "AC"
        }, {
            id: "1919810",
            name: "下北泽旅行商",
            userId: "szh11",
            commitTime: "2000-05-11 11:20:00",
            state: "WA"
        }, ],
    }),
    methods: {
        getColor(state) {
            if (state == 'AC') return 'green'
            else if (state == 'WA') return 'red'
            else return 'orange'
        },
    },
    mounted: function(){
        console.log("QUERY",this.$route.query)
        let event = new CustomEvent('changeState', {
            detail: {
                state: 1
            },
            cancelable: true
        });
        document.dispatchEvent(event);
    }
}
</script>
