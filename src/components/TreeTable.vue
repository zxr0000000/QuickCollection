<template>
    <div ref="wrapperElement" class="wrapperBox" style="
        width: 100%;
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        user-select: none;
      ">
        <div ref="divElement" style="
          box-sizing: border-box;
          width: 100%; 
          height: 100%;
          color: #333;
          overflow-y: scroll;
          overflow-x: scroll;
          display: flex;
          flex-direction: column;
          padding: 40px; 
        ">
            <tree-item v-for="bookmark in bookmarks" :key="bookmark.id" :item="bookmark" :level="1"
                @changeHoveredItem="handleChangeHoveredItem"></tree-item>
        </div>
    </div>
</template>

<script setup>
import TreeItem from './TreeItem.vue';
import { ref, onMounted, provide } from 'vue';

const hoveredItem = ref({
    id: "",
    level: -1,
    parentId: "",
});
provide('hoveredItem', hoveredItem);

const handleChangeHoveredItem = (newItem) => {
    hoveredItem.value = newItem;
};


const divElement = ref();
const bookmarks = [
    {
        "children": [
            {
                "children": [
                    {
                        "dateAdded": 1635569224000,
                        "id": "7",
                        "index": 0,
                        "parentId": "6",
                        "title": "学校比赛",
                        "url": "https://soj.csgrandeur.cn/"
                    },
                    {
                        "dateAdded": 1631434089000,
                        "id": "8",
                        "index": 1,
                        "parentId": "6",
                        "title": "AtCoder",
                        "url": "https://atcoder.jp/contests/archive?ratedType=1&category=0&keyword="
                    },
                    {
                        "dateAdded": 1640751653000,
                        "dateLastUsed": 1697628690532,
                        "id": "9",
                        "index": 2,
                        "parentId": "6",
                        "title": "Codeforces",
                        "url": "https://codeforces.com/"
                    },
                    {
                        "dateAdded": 1646371545000,
                        "id": "10",
                        "index": 3,
                        "parentId": "6",
                        "title": "牛客",
                        "url": "https://ac.nowcoder.com/acm/skill/acm"
                    },
                    {
                        "dateAdded": 1658397725000,
                        "id": "11",
                        "index": 4,
                        "parentId": "6",
                        "title": "杭电",
                        "url": "http://acm.hdu.edu.cn/verify.php"
                    },
                    {
                        "dateAdded": 1644309803000,
                        "id": "12",
                        "index": 5,
                        "parentId": "6",
                        "title": "AcWing",
                        "url": "https://www.acwing.com/about/"
                    },
                    {
                        "dateAdded": 1634949944000,
                        "id": "13",
                        "index": 6,
                        "parentId": "6",
                        "title": "题单",
                        "url": "https://vjudge.net/contest"
                    },
                    {
                        "dateAdded": 1647150967000,
                        "id": "14",
                        "index": 7,
                        "parentId": "6",
                        "title": "洛谷 ",
                        "url": "https://www.luogu.com.cn/"
                    },
                    {
                        "dateAdded": 1659703897000,
                        "id": "15",
                        "index": 8,
                        "parentId": "6",
                        "title": "测试服",
                        "url": "http://10.108.2.168:50091/"
                    },
                    {
                        "dateAdded": 1640906794000,
                        "id": "16",
                        "index": 9,
                        "parentId": "6",
                        "title": "Nautilus",
                        "url": "http://noi-test.zzstep.com/group/SZTU_Nautilus"
                    },
                    {
                        "dateAdded": 1671175211000,
                        "id": "17",
                        "index": 10,
                        "parentId": "6",
                        "title": "Virtual Judge2",
                        "url": "https://vjudge.csgrandeur.cn/group/sztu-novice3?r=ZgKbCLvoLg0M0C6hjvXp"
                    },
                    {
                        "dateAdded": 1650182660000,
                        "dateLastUsed": 1696492687362,
                        "id": "18",
                        "index": 11,
                        "parentId": "6",
                        "title": "榜单",
                        "url": "https://board.xcpcio.com/"
                    }
                ],
                "dateAdded": 1694763431569,
                "dateGroupModified": 1694763431569,
                "id": "6",
                "index": 0,
                "parentId": "5",
                "title": "比赛"
            },
            {
                "dateAdded": 1632101159000,
                "id": "19",
                "index": 1,
                "parentId": "5",
                "title": "深圳技术大学",
                "url": "https://www.sztu.edu.cn/"
            },
            {
                "dateAdded": 1664151688000,
                "id": "20",
                "index": 2,
                "parentId": "5",
                "title": "学工个人中心",
                "url": "https://stu.sztu.edu.cn/#/affairs/copyAllAffairs?id=xgdt&Authorization=eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMDIxMDAyMDIwNzYiLCJhdWQiOiJwYyIsImlzcyI6IkxJQU5ZSSIsImlhdCI6MTY2NDE1MTcwOTY2MCwianRpIjoiZDBmMjRhNmMtZjY1ZS00YzRmLTk0OTQtZWQyYmU1ODgxYmQ2In0.CNa3Qc6uTKkUO3WC0mOY1AWY-NYV_uoLDCjux_AcU0k"
            },
            {
                "dateAdded": 1657095680000,
                "id": "21",
                "index": 3,
                "parentId": "5",
                "title": "学工大厅",
                "url": "https://home.sztu.edu.cn/bmportal/index.portal"
            },
            {
                "dateAdded": 1664369113000,
                "dateLastUsed": 1698314223638,
                "id": "22",
                "index": 4,
                "parentId": "5",
                "title": "头歌",
                "url": "https://www.educoder.net/"
            },
            {
                "dateAdded": 1677680019000,
                "id": "23",
                "index": 5,
                "parentId": "5",
                "title": "CS自学指南",
                "url": "https://csdiy.wiki/"
            },
            {
                "dateAdded": 1695132191860,
                "id": "24",
                "index": 6,
                "parentId": "5",
                "title": "打印",
                "url": "http://10.108.13.22/home/index.html#hashHome"
            }
        ],
        "dateAdded": 1694763431568,
        "dateGroupModified": 1695132191860,
        "id": "5",
        "index": 0,
        "parentId": "1",
        "title": "学校"
    },
    {
        "children": [
            {
                "children": [
                    {
                        "dateAdded": 1654674977000,
                        "id": "27",
                        "index": 0,
                        "parentId": "26",
                        "title": "刘泽驰",
                        "url": "https://www.cnblogs.com/dgsvygd/"
                    },
                    {
                        "dateAdded": 1643429002000,
                        "id": "28",
                        "index": 1,
                        "parentId": "26",
                        "title": "吴泰维",
                        "url": "https://www.nz-666.com/"
                    },
                    {
                        "dateAdded": 1665672777000,
                        "id": "29",
                        "index": 2,
                        "parentId": "26",
                        "title": "曾仲方",
                        "url": "https://blog.mitsuha.space/"
                    }
                ],
                "dateAdded": 1694763431569,
                "dateGroupModified": 1694763431569,
                "id": "26",
                "index": 0,
                "parentId": "25",
                "title": "朋友"
            },
            {
                "children": [
                    {
                        "dateAdded": 1694745866000,
                        "id": "31",
                        "index": 0,
                        "parentId": "30",
                        "title": "程序员的喵",
                        "url": "https://catcoding.me/"
                    }
                ],
                "dateAdded": 1694763431569,
                "dateGroupModified": 1694763431569,
                "id": "30",
                "index": 1,
                "parentId": "25",
                "title": "大佬"
            },
            {
                "dateAdded": 1635077970000,
                "id": "32",
                "index": 2,
                "parentId": "25",
                "title": "语雀",
                "url": "https://www.yuque.com/dashboard"
            },
            {
                "dateAdded": 1636167798000,
                "id": "33",
                "index": 3,
                "parentId": "25",
                "title": "集训队",
                "url": "https://github.com/CSGrandeur/s-1problem1day1ac/discussions"
            }
        ],
        "dateAdded": 1694763431569,
        "dateGroupModified": 1694763431569,
        "id": "25",
        "index": 1,
        "parentId": "1",
        "title": "博客"
    },
    {
        "children": [
            {
                "children": [
                    {
                        "dateAdded": 1678155087000,
                        "id": "36",
                        "index": 0,
                        "parentId": "35",
                        "title": "前端学习路线",
                        "url": "https://gitee.com/liyupi/code-roadmap/blob/main/docs/roadmap/%E5%89%8D%E7%AB%AF%E5%AD%A6%E4%B9%A0%E8%B7%AF%E7%BA%BF.md"
                    },
                    {
                        "dateAdded": 1681137775000,
                        "id": "37",
                        "index": 1,
                        "parentId": "35",
                        "title": "50个样式",
                        "url": "https://github.com/bradtraversy/50projects50days"
                    },
                    {
                        "dateAdded": 1685257039000,
                        "id": "38",
                        "index": 2,
                        "parentId": "35",
                        "title": "js 课程",
                        "url": "https://github.com/jonasschmedtmann/complete-javascript-course"
                    }
                ],
                "dateAdded": 1694763431570,
                "dateGroupModified": 1694763431570,
                "id": "35",
                "index": 0,
                "parentId": "34",
                "title": "课程相关"
            },
            {
                "children": [
                    {
                        "dateAdded": 1672559465000,
                        "id": "40",
                        "index": 0,
                        "parentId": "39",
                        "title": "知识星球",
                        "url": "https://wx.zsxq.com/dweb2/index/group/51122858222824"
                    },
                    {
                        "dateAdded": 1672706302000,
                        "id": "41",
                        "index": 1,
                        "parentId": "39",
                        "title": "编程导航",
                        "url": "https://www.code-nav.cn/"
                    },
                    {
                        "dateAdded": 1688128481000,
                        "id": "42",
                        "index": 2,
                        "parentId": "39",
                        "title": "开发者星球",
                        "url": "https://www.java68.com/"
                    },
                    {
                        "dateAdded": 1684758361000,
                        "id": "43",
                        "index": 3,
                        "parentId": "39",
                        "title": "啥都有前端学习小组 · 语雀",
                        "url": "https://www.yuque.com/shadouyou"
                    }
                ],
                "dateAdded": 1694763431570,
                "dateGroupModified": 1694763431570,
                "id": "39",
                "index": 1,
                "parentId": "34",
                "title": "资料库"
            },
            {
                "children": [
                    {
                        "dateAdded": 1690595755000,
                        "id": "45",
                        "index": 0,
                        "parentId": "44",
                        "title": "Element",
                        "url": "https://element.eleme.cn/#/zh-CN"
                    },
                    {
                        "dateAdded": 1690701930000,
                        "id": "46",
                        "index": 1,
                        "parentId": "44",
                        "title": "Element Plus-v3",
                        "url": "https://element-plus.org/zh-CN/#/zh-CN"
                    },
                    {
                        "dateAdded": 1684328627000,
                        "id": "47",
                        "index": 2,
                        "parentId": "44",
                        "title": "Apache ECharts",
                        "url": "https://echarts.apache.org/zh/index.html"
                    },
                    {
                        "dateAdded": 1682252739000,
                        "id": "48",
                        "index": 3,
                        "parentId": "44",
                        "title": "Bootstrap中文网",
                        "url": "https://www.bootcss.com/"
                    },
                    {
                        "dateAdded": 1682177733000,
                        "id": "49",
                        "index": 4,
                        "parentId": "44",
                        "title": "Swipe",
                        "url": "https://www.swiper.com.cn/"
                    },
                    {
                        "dateAdded": 1689826248000,
                        "id": "50",
                        "index": 5,
                        "parentId": "44",
                        "title": "PostCSS",
                        "url": "https://www.postcss.parts/"
                    },
                    {
                        "dateAdded": 1690474249000,
                        "id": "51",
                        "index": 6,
                        "parentId": "44",
                        "title": "Vant",
                        "url": "https://vant-contrib.gitee.io/vant/v2/#/zh-CN/"
                    },
                    {
                        "dateAdded": 1690819987000,
                        "id": "52",
                        "index": 7,
                        "parentId": "44",
                        "title": "Vant4",
                        "url": "https://vant-contrib.gitee.io/vant/#/zh-CN"
                    },
                    {
                        "dateAdded": 1692622973000,
                        "id": "53",
                        "index": 8,
                        "parentId": "44",
                        "title": "IconPark",
                        "url": "https://iconpark.oceanengine.com/home"
                    },
                    {
                        "dateAdded": 1693054961000,
                        "id": "54",
                        "index": 9,
                        "parentId": "44",
                        "title": "TDesign",
                        "url": "https://tdesign.tencent.com/vue/getting-started"
                    }
                ],
                "dateAdded": 1694763431570,
                "dateGroupModified": 1694763431570,
                "id": "44",
                "index": 2,
                "parentId": "34",
                "title": "样式库"
            },
            {
                "children": [
                    {
                        "dateAdded": 1690556756000,
                        "id": "56",
                        "index": 0,
                        "parentId": "55",
                        "title": "Vuex",
                        "url": "https://vuex.vuejs.org/zh/"
                    },
                    {
                        "dateAdded": 1690199705000,
                        "id": "57",
                        "index": 1,
                        "parentId": "55",
                        "title": "webpack",
                        "url": "https://www.webpackjs.com/"
                    }
                ],
                "dateAdded": 1694763431571,
                "dateGroupModified": 1694763431571,
                "id": "55",
                "index": 3,
                "parentId": "34",
                "title": "官方文档"
            },
            {
                "children": [
                    {
                        "dateAdded": 1690808603000,
                        "id": "59",
                        "index": 0,
                        "parentId": "58",
                        "title": "木易杨前端进阶",
                        "url": "https://muyiy.cn/"
                    },
                    {
                        "dateAdded": 1690808680000,
                        "id": "60",
                        "index": 1,
                        "parentId": "58",
                        "title": "前端精读周刊",
                        "url": "https://github.com/ascoders/weekly"
                    },
                    {
                        "dateAdded": 1690808940000,
                        "id": "61",
                        "index": 2,
                        "parentId": "58",
                        "title": "前端知识每日3+1",
                        "url": "http://www.h-camel.com/category.html"
                    }
                ],
                "dateAdded": 1694763431571,
                "dateGroupModified": 1694763431571,
                "id": "58",
                "index": 4,
                "parentId": "34",
                "title": "博客"
            },
            {
                "children": [
                    {
                        "dateAdded": 1678200568000,
                        "id": "63",
                        "index": 0,
                        "parentId": "62",
                        "title": "小林coding",
                        "url": "https://xiaolincoding.com/"
                    },
                    {
                        "dateAdded": 1690809141000,
                        "id": "64",
                        "index": 1,
                        "parentId": "62",
                        "title": "CavsZhouyou/Front-End-Interview-Notebook: :ant:前端面试复习笔记",
                        "url": "https://github.com/CavsZhouyou/Front-End-Interview-Notebook"
                    },
                    {
                        "dateAdded": 1695217638465,
                        "dateLastUsed": 1695439473079,
                        "id": "65",
                        "index": 2,
                        "parentId": "62",
                        "title": "简历指南",
                        "url": "https://bcdh.yuque.com/staff-wpxfif/resource/yvtiza4dmgumk3dt"
                    }
                ],
                "dateAdded": 1694763431571,
                "dateGroupModified": 1695217638465,
                "id": "62",
                "index": 5,
                "parentId": "34",
                "title": "面试"
            },
            {
                "children": [
                    {
                        "dateAdded": 1682084362000,
                        "id": "67",
                        "index": 0,
                        "parentId": "66",
                        "title": "摹客",
                        "url": "https://app.mockplus.cn/team/uxjkmcgadc"
                    }
                ],
                "dateAdded": 1694763431571,
                "dateGroupModified": 1694763431571,
                "id": "66",
                "index": 6,
                "parentId": "34",
                "title": "工具类"
            }
        ],
        "dateAdded": 1694763431570,
        "dateGroupModified": 1694763431570,
        "id": "34",
        "index": 2,
        "parentId": "1",
        "title": "前端"
    },
];

onMounted(async () => {
    smoothScroll();
    hiddenScroll();
});



const hiddenScroll = () => {
    const scrollbarWidth = divElement.value.offsetWidth - divElement.value.clientWidth;
    const scrollbarHeight = divElement.value.offsetHeight - divElement.value.clientHeight;
    if (scrollbarWidth > 0) {
        divElement.value.style.width = `calc(100% + ${scrollbarWidth}px)`;
    }
    if (scrollbarHeight > 0) {
        divElement.value.style.height = `calc(100% + ${scrollbarWidth}px)`;
    }
}

const smoothScroll = () => {
    let scrolling;

    const startScroll = (direction) => {
        const step = direction === 'down' ? 5 : -5;

        const scroll = () => {
            if ((direction === 'down' && divElement.value.scrollTop < divElement.value.scrollHeight - divElement.value.clientHeight) ||
                (direction === 'up' && divElement.value.scrollTop > 0)) {
                divElement.value.scrollTop += step;
                scrolling = requestAnimationFrame(scroll);
            } else {
                stopScroll();
            }
        };

        stopScroll();
        scroll();
    };

    const stopScroll = () => {
        if (scrolling) {
            cancelAnimationFrame(scrolling);
            scrolling = null;
        }
    };

    divElement.value.addEventListener('mousemove', (event) => {
        const windowHeight = divElement.value.clientHeight;
        const upperBound = windowHeight * 0.1;
        const lowerBound = windowHeight * 0.9;

        const mouseY = event.clientY - divElement.value.getBoundingClientRect().top;

        if (mouseY < upperBound) {
            startScroll('up');
        } else if (mouseY > lowerBound) {
            startScroll('down');
        } else {
            stopScroll();
        }
    });

    divElement.value.addEventListener('mouseleave', stopScroll);
}

</script>
  