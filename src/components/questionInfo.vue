<template>
<v-container>
    <!--mavon-editor v-model="value" v-on:save="showMd"/-->
    <v-row>
        <v-col cols="9">
            <v-col cols="12">
                <v-card padding="10px">
                    <v-card-text>
                        <article v-html="description" slot="default"></article>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        我的代码 &nbsp;
                        <v-btn color="green" class="ma-2 white--text">
                            提交
                            <v-icon right dark>
                                mdi-upload
                            </v-icon>
                        </v-btn>
                    </v-card-text>
                    <div class="in-coder-panel">
                        <textarea ref="textarea"></textarea>
                    </div>
                </v-card>
            </v-col>
        </v-col>

        <v-col cols="3">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-icon medium>mdi-information</v-icon>
                        &nbsp;
                        题目信息
                    </v-card-title>
                    <v-card-text>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>ID: &nbsp;{{questionInfo.id}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>难度: &nbsp;
                                    <v-chip :color="getColor(questionInfo.difficulty)" small dark>
                                        {{ questionInfo.difficulty }}
                                    </v-chip>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>通过/提交: &nbsp;{{questionInfo.acCnt}}/{{questionInfo.totCnt}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>时间限制: &nbsp;{{questionInfo.timeLimit}}秒</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>空间限制: &nbsp;{{questionInfo.memoryLimit}}KB</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>标签
                                    <p />
                                    <v-chip-group column>
                                        <v-chip outlined small v-for="tag in questionInfo.tags" :key="tag">
                                            {{tag}}
                                        </v-chip>
                                    </v-chip-group>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-btn color="purple" v-on:click="showStatus" class="ma-2 white--text">
                            状态
                            <v-icon right dark>
                                mdi-chart-pie
                            </v-icon>
                        </v-btn>
                        <v-btn color="orange" class="ma-2 white--text">
                            题解
                            <v-icon right dark>
                                mdi-lightbulb-on-outline
                            </v-icon>
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-col>
    </v-row>

</v-container>
</template>

<script>
import axios from 'axios'

import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'

export default {
    name: 'QuestionInfo',
    data: () => ({
        questionInfo: {},
        value: ``,
        description: ``,
        code: `#include<stdio.h>
#include<string.h>
#include<algorithm>
#define inf 1000
using namespace std;
int ans,v1,v2,edg;
bool link[1005][1005],pp[1005],vis[1005];
bool dfs(int);
int main()
{

scanf("%d%d%d",&v1,&v2,&edg);

int u,v;

int i;

for(i=1;i<=edg;i++)

{

scanf("%d%d",&u,&v);

link[u][v] = true;

}

if(v1<v2)

{

for(i=1;i<=v1;i++)

{

memset(vis,0,sizeof(vis));

if(dfs(i)) ans++;

}

}

else

{

for(i=1;i<=v2;i++)

{

memset(vis,0,sizeof(vis));

if(dfs(i)) ans++;

}

}

printf("%d",ans);

return 0;
}
bool dfs(int now)
{

int i = 1;

for(i=1;i<=inf;i++)

{

if(link[now][i]&&!vis[i])

{

vis[i] = true;

if(!pp[i]||dfs(i))

{

pp[i] = now;

return true;

}

}

}

return false;
}`,
        mode: "text/x-csrc",
        coder: null,
        options: {
            tabSize: 2,
            theme: 'eclipse',
            lineNumbers: true,
            line: true
        },
        modes: [{
            value: 'javascript',
            label: 'Javascript'
        }, {
            value: 'x-python',
            label: 'Python'
        }, {
            value: 'x-csrc',
            label: 'C'
        }]
    }),
    methods: {
        getColor(difficulty) {
            if (difficulty == 'hard') return 'red'
            else if (difficulty == 'normal') return 'orange'
            else return 'green'
        },
        showMd(a, b) {
            console.log(b)
        },

        initCodeMirror() {
            this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
            this.coder.setValue(this.code)
            this.coder.on('change', (coder) => {
                this.code = coder.getValue()
            })
        },
        showStatus() {
            this.$router.push(`/queue?qid=${this.questionInfo.id}`)
        }
    },
    mounted: function () {
        let event = new CustomEvent('changeState', {
            detail: {
                state: -1
            },
            cancelable: true
        });
        document.dispatchEvent(event);

        axios.get(`http://127.0.0.1:8060/question?qid=${this.$route.params.id}`).then((response) => {
            this.questionInfo = response.data
            switch (this.questionInfo.difficulty) {
                case 1:
                    this.questionInfo.difficulty = "easy";
                    break;
                case 2:
                    this.questionInfo.difficulty = "normal";
                    break;
                default:
                    this.questionInfo.difficulty = "hard";
                    break;
            }
            let tags = []
            for (let tag of this.questionInfo.tags) {
                tags.push(tag.name)
            }
            this.questionInfo.tags = tags
        }).catch((err) => {
            console.log(err)
        })
        axios.get(`http://127.0.0.1:8060/quedesc?qid=${this.$route.params.id}`).then((response) => {
            this.description = response.data
        }).catch((err) => {
            console.log(err)
        })
        this.initCodeMirror()
    }
}
</script>

<style scoped>
</style>
