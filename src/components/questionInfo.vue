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
                        <v-btn  color="green" class="ma-2 white--text">
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
                                <v-list-item-title>通过/提交: &nbsp;{{questionInfo.ac_cnt}}/{{questionInfo.tot_cnt}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>时间限制: &nbsp;{{questionInfo.time_limit}}秒</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>空间限制: &nbsp;{{questionInfo.memory_limit}}KB</v-list-item-title>
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
                        <v-btn  color="purple" class="ma-2 white--text">
                            状态
                            <v-icon right dark>
                                mdi-chart-pie
                            </v-icon>
                        </v-btn>
                        <v-btn  color="orange" class="ma-2 white--text">
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
// 引入全局实例
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
        questionInfo: {
            id: "114514",
            name: "A+B Problem",
            difficulty: "easy",
            tot_cnt: 10,
            ac_cnt: 5,
            time_limit: 1,
            memory_limit: 1000,
            tags: ["入门", "算法", "FFT", "线段树", "IOI2020"]
        },
        //value: ``,
        description: `<h2><a id="python_0"></a>python数据预处理</h2>
<p>姓名：孙梓涵<br />
班级：2018211301<br />
学号：2018211239</p>
<h3><a id="_4"></a>作业一</h3>
<h4><a id="_5"></a>思路</h4>
<p>爬取数据过程不再赘述，只描述处理过程</p>
<ul>
<li>去掉空格：<code>.str.strip()</code>方法即可</li>
<li>面积保存为整数：根据<code>-</code>拆分成两段，第一段中去掉<code>建面 </code>转化为整数即可</li>
<li>根据总价、均价之一推算出另一个：根据字段中是否含有<code>均价</code>判断为总价或均价，根据空格分割出数字部分即可计算出另一个</li>
<li>找出房价统计信息：<code>.describe()</code>即可</li>
</ul>
<h4><a id="_11"></a>代码</h4>
<p>爬虫</p>
<pre><div class="hljs"><code class="lang-python"><span class="hljs-keyword">import</span> scrapy


<span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">ls2InfoItem</span><span class="hljs-params">(scrapy.Item)</span>:</span>
    name = scrapy.Field()
    location1 = scrapy.Field()
    location2 = scrapy.Field()
    location3 = scrapy.Field()
    room = scrapy.Field()
    area = scrapy.Field()
    price = scrapy.Field()


<span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Lj2Spider</span><span class="hljs-params">(scrapy.Spider)</span>:</span>
    name = <span class="hljs-string">'lj2'</span>

    <span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">start_requests</span><span class="hljs-params">(self)</span>:</span>
        <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> range(<span class="hljs-number">1</span>, <span class="hljs-number">20</span>):
            <span class="hljs-keyword">yield</span> scrapy.Request(url=<span class="hljs-string">'https://bj.fang.lianjia.com/loupan/pg'</span>+str(i), callback=self.parse)

    <span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">parse</span><span class="hljs-params">(self, response)</span>:</span>
        <span class="hljs-comment"># '//ul[@class=\'resblock-list-wrapper\']/li</span>
        sb = response.xpath(<span class="hljs-string">'//div[@class=\'resblock-desc-wrapper\']'</span>)
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sb:
            ans_item = ls2InfoItem()
            name = item.xpath(
                <span class="hljs-string">'./div[@class=\'resblock-name\']/a/text()'</span>).extract()
            ans_item[<span class="hljs-string">'name'</span>] = name[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> len(name) &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-string">""</span>
            location1 = item.xpath(
                <span class="hljs-string">'./div[@class=\'resblock-location\']/span/text()'</span>).extract()
            ans_item[<span class="hljs-string">'location1'</span>] = location1[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> len(location1) &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-string">""</span>
            ans_item[<span class="hljs-string">'location2'</span>] = location1[<span class="hljs-number">1</span>]<span class="hljs-keyword">if</span> len(location1) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">""</span>
            location2 = item.xpath(
                <span class="hljs-string">'./div[@class=\'resblock-location\']/a/text()'</span>).extract()
            ans_item[<span class="hljs-string">'location3'</span>] = location2[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> len(location2) &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-string">""</span>
            room = item.xpath(
                <span class="hljs-string">'./a[@class=\'resblock-room\']/span/text()'</span>).extract()
            ans_item[<span class="hljs-string">'room'</span>] = room[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> len(room) &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-string">""</span>
            area = item.xpath(
                <span class="hljs-string">'./div[@class=\'resblock-area\']/span/text()'</span>).extract()
            ans_item[<span class="hljs-string">'area'</span>] = area[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> len(area) &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-string">""</span>
            price = item.xpath(
                <span class="hljs-string">'./div[@class=\'resblock-price\']/div[@class=\'main-price\']/span/text()'</span>).extract()
            ans_item[<span class="hljs-string">'price'</span>] = price[<span class="hljs-number">0</span>]+<span class="hljs-string">" "</span> + \
                price[<span class="hljs-number">1</span>][<span class="hljs-number">1</span>:] <span class="hljs-keyword">if</span> len(price) &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-string">""</span>
            <span class="hljs-keyword">yield</span> ans_item

        <span class="hljs-comment"># print(sb.xpath('./a/text()').extract())</span>

</code></div></pre>
<p>预处理</p>`,
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
    },
    mounted: function () {
        let event = new CustomEvent('changeState', {
            detail: {
                state: -1
            },
            cancelable: true
        });
        document.dispatchEvent(event);
        console.log(this.$route.params.id)
        this.initCodeMirror()
    }
}
</script>

<style scoped>
</style>
