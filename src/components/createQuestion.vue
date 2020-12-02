<template>
<v-container>
    <v-dialog v-model="outcomeDialog" width="500">
        <v-card>
            <v-card-title v-if="uploadSuccess">题目上传成功</v-card-title>
            <v-card-title v-if="!uploadSuccess">题目上传失败</v-card-title>
            <v-card-actions v-if="uploadSuccess">
                <v-spacer></v-spacer>
                <v-btn v-on:click="onSuccessClose" color="primary" text>确认</v-btn>
            </v-card-actions>
            <v-card-actions v-if="!uploadSuccess">
                <v-spacer></v-spacer>
                <v-btn v-on:click="onFailedClose" color="primary" text>确认</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="saveDialog" width="500">
        <v-card>
            <v-card-title>题目暂存成功</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-on:click="saveDialog=false" color="primary" text>确认</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-row>
        <v-col cols="9">
            <v-col cols="12">
                <v-card>
                    <v-card-title>题目描述</v-card-title>
                    <mavon-editor v-model="description" v-on:change="onMdEditorChange" id="mveditor" />
                </v-card>
            </v-col>
        </v-col>
        <v-col cols="3">
            <v-card>
                <v-card-title>题目信息</v-card-title>
                <v-card-text>
                    <v-form>
                        <b>题目名称</b>
                        <v-text-field dense v-model="name"></v-text-field>
                        <b>难度</b>
                        <v-select :items="difficultyList" dense v-model="difficulty"></v-select>
                        <b>时间限制 {{timeLimit}} (ms)</b>
                        <v-slider min="500" max="20000" v-model="timeLimit"></v-slider>
                        <b>空间限制 {{memoryLimit}} (MB)</b>
                        <v-slider min="1" max="512" v-model="memoryLimit"></v-slider>
                        <b>测试输入</b>
                        <v-file-input dense v-on:change="getInput"></v-file-input>
                        <b>答案</b>
                        <v-file-input dense v-on:change="getOutput"></v-file-input>
                        <v-btn color="green" class="ma-3 white--text" v-on:click="uploadQuestion">
                            上传
                            <v-icon right dark>
                                mdi-upload
                            </v-icon>
                        </v-btn>

                        <v-btn color="orange" class="ma-3 white--text" v-on:click="saveQuestion">
                            暂存
                            <v-icon right dark>
                                mdi-upload
                            </v-icon>
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

</v-container>
</template>

<script>
import questionInfoVue from './questionInfo.vue'

export default {
    name: 'CreateQuestion',

    data: () => ({
        description: ``,
        rendered: ``,
        name: "",
        difficultyList: ["入门", "简单", "中等", "困难"],
        difficulty: "",
        timeLimit: 500,
        memoryLimit: 1,
        input: "",
        output: "",
        outcomeDialog: false,
        saveDialog: false,
        uploadSuccess: false
    }),
    methods: {
        onMdEditorChange(v, render) {
            this.rendered = render
        },
        onSuccessClose() {
            this.outcomeDialog = false
            this.$router.push('/list')
        },
        onFailedClose() {
            this.outcomeDialog = false
        },
        getInput(file) {
            this.input = file
        },
        getOutput(file) {
            this.output = file
        },
        saveQuestion() {
            let questionToCommit = {
                description: this.description,
                name: this.name,
                difficulty: this.difficulty,
                timeLimit: this.timeLimit,
                memoryLimit: this.memoryLimit,
            }
            localStorage.setItem("questionToCommit", JSON.stringify(questionToCommit))
            this.saveDialog = true
        },
        recoverQuestion(questionToCommit) {
            questionToCommit = JSON.parse(questionToCommit)
            this.description = questionToCommit.description
            this.name = questionToCommit.name
            this.difficulty = questionToCommit.difficulty
            this.timeLimit = questionToCommit.timeLimit
            this.memoryLimit = questionToCommit.memoryLimit
        },
        uploadQuestion() {
            let form = new FormData()
            let numdifficulty = 0
            switch (this.difficulty) {
                case "入门":
                    numdifficulty = 1;
                    break;
                case "简单":
                    numdifficulty = 2;
                    break;
                case "中等":
                    numdifficulty = 3;
                    break;
                case "困难":
                    numdifficulty = 4;
                    break;
                default:
                    break;
            }
            let qInfo = {
                name: this.name,
                creator: parseInt(localStorage.getItem("userId")),
                difficulty: numdifficulty,
                timeLimit: this.timeLimit,
                memoryLimit: this.memoryLimit,
                tags: []
            }
            form.append("qinfo", JSON.stringify(qInfo))
            let descBlob = new Blob([this.rendered])
            let descFile = new File([descBlob], 'desc')
            form.append('file', descFile)
            form.append('file', this.input)
            form.append('file', this.output)
            //data.append('file', );
            //data.append('file',);
            let config = {
                method: 'post',
                url: 'http://127.0.0.1:8060/upquestion',
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: form
            };
            this.axios(config)
                .then((response) => {
                    //console.log(response.data);
                    this.uploadSuccess = true;
                    this.outcomeDialog = true;
                })
                .catch((error) => {
                    this.uploadSuccess = false;
                    this.outcomeDialog = true;
                    //console.log(error);
                });
        }
    },
    mounted: function () {
        let event = new CustomEvent('changeState', {
            detail: {
                state: -3
            },
            cancelable: true
        });
        document.dispatchEvent(event);
        let questionToCommit = localStorage.getItem("questionToCommit")
        if (!(questionToCommit === null)) {
            this.recoverQuestion(questionToCommit)
        }
    }
}
</script>

<style scoped>
#mveditor {
    z-index: 1 !important;
}
</style>
