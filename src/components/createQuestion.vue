<template>
<v-container>
    <v-row>
        <v-col cols="9">
            <v-col cols="12">
                <v-card>
                    <v-card-title>题目描述</v-card-title>
                    <mavon-editor v-model="value" z-index="2" />
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card padding="0px">
                    <v-card-title>样例程序</v-card-title>
                    <div class="in-coder-panel">
                        <textarea ref="textarea"></textarea>
                    </div>
                </v-card>
            </v-col>
        </v-col>
        <v-col cols="3">
            <v-card>
                <v-card-title>题目信息</v-card-title>
                <v-card-text>
                <v-form>
                    <b>时间限制(ms)</b>
                    <template>
                        <v-text-field></v-text-field>
                    </template>
                    <b>空间限制(KB)</b>
                    <template>
                        <v-text-field></v-text-field>
                    </template>
                    <b>测试点</b>
                    <v-file-input></v-file-input>
                    <v-btn color="green" class="ma-3 white--text">
                        上传
                        <v-icon right dark>
                            mdi-upload
                        </v-icon>
                    </v-btn>

                    <v-btn color="orange" class="ma-3 white--text">
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
// 引入全局实例
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'

export default {
    name: 'CreateQuestion',

    data: () => ({
        value: ``,
        code: ``,
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
        initCodeMirror() {
            this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
            this.coder.setValue(this.code)
            this.coder.on('change', (coder) => {
                this.code = coder.getValue()
            })
        },
    },
    mounted: function () {
        let event = new CustomEvent('changeState', {
            detail: {
                state: -3
            },
            cancelable: true
        });
        document.dispatchEvent(event);
        this.initCodeMirror()
    }
}
</script>
