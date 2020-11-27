<template>
<v-container>
    <v-data-table @click:row="showQuestionInfo" :headers="headers" :items="questions" :items-per-page="5" class="elevation-1">
        <template v-slot:item.state="{ item }">
            <v-icon v-if="item.state=='ac'" color="green" medium dark>
                mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-if="item.state!='ac' && item.state!='unkown'" color="red" medium dark>
                mdi-close-circle
            </v-icon>
        </template>
        <template v-slot:item.difficulty="{ item }">
            <v-chip :color="getColor(item.difficulty)" small dark>
                {{ item.difficulty }}
            </v-chip>
        </template>
        <template v-slot:item.tags="{item}">
            <v-chip-group>
                <v-chip outlined small v-for="tag in item.tags" :key="tag">
                    {{tag}}
                </v-chip>
            </v-chip-group>
        </template>
    </v-data-table>
</v-container>
</template>

<script>
export default {
    name: 'QuestList',

    data: () => ({
        headers: [{
                text: '状态',
                align: 'start',
                sortable: false,
                value: 'state',
            },
            {
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
                text: '难度',
                align: 'start',
                sortable: true,
                value: 'difficulty'
            },
            {
                text: '提交总数',
                align: 'start',
                sortable: true,
                value: 'tot_cnt'
            },
            {
                text: 'AC数',
                align: 'start',
                sortable: true,
                value: 'ac_cnt'
            },
            {
                text: '标签',
                sortable: false,
                align: 'start',
                value: 'tags'
            }
        ],
        questions: [{
            state: "ac",
            id: "114514",
            name: "A+B Problem",
            difficulty: "easy",
            tot_cnt: 10,
            ac_cnt: 5,
            tags: ["入门", "算法"]
        }, {
            state: "unkown",
            id: "1919810",
            name: "下北泽旅行商",
            difficulty: "hard",
            tot_cnt: 2,
            ac_cnt: 1,
            tags: ["入门"]
        },
        {
            state: "wa",
            id: "2021309",
            name: "三回啊三回",
            difficulty: "normal",
            tot_cnt: 3,
            ac_cnt: 3,
            tags: ["入门","IOI2022"]
        },  ]
    }),
    methods: {
        getColor(difficulty) {
            if (difficulty == 'hard') {
                return 'red'
            } else if (difficulty == 'normal') {
                return 'orange'
            } else {
                return 'green'
            }
        },
        showQuestionInfo(item, other) {
            //console.log(arg1)
            this.$router.push('/qinfo/' + item.id);

        }
    },
    mounted: () => {
        let event = new CustomEvent('changeState', {
            detail: {
                state: 0
            },
            cancelable: true
        });
        document.dispatchEvent(event);
    }
}
</script>
