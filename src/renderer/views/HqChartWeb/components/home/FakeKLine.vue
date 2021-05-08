<template>
    <section class="fake-card">
        <div id="fakekLine" ref='fakekLine' style="position: relative;"></div>
    </section>
</template>

<script>
    import '../../../../vendor/jscommon/umychart.resource/css/tools.css'
    import '../../../../vendor/jscommon/umychart.resource/font/iconfont.css'
    import jsChart from '../../../../vendor/jscommon/umychart.vue/umychart.vue.js'
    import $ from 'jquery'

    jsChart.JSConsole.Chart.Log = () => {}
    jsChart.JSConsole.Complier.Log = () => {}

    export default {
        name: 'FakeKLine',
        data() {
            return {
                // k线属性
                leftChart: null,
                leftOption: null,
                Symbol: 'btcusdt.BIT'
            }
        },
        mounted() {
            this.LoadEnvironment()
            this.$nextTick(() => {
                this.createLeftChart()
            })
        },
        methods: {
            LoadEnvironment() {
                // K线图配置
                this.leftOption =
                    {
                        Type: '历史K线图',

                        DragDownload:
                            {
                                Minute: {Enable: true}, // 开启分钟数据拖拽下载
                                Day: {Enable: true} // 开启日线数据拖拽下载
                            },

                        Windows: // 窗口指标
                            [
                                {Index: 'MA', Modify: true, Change: true},
                                {Index: 'VOL', Modify: true, Change: true}
                            ],
                        Symbol: this.Symbol,
                        IsAutoUpdate: false, // 是自动更新数据(不自动更新由外部更新)
                        IsApiPeriod: true, // 使用Api计算周期
                        IsShowRightMenu: false, // 右键菜单

                        KLine: // K线设置
                            {
                                DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                                Right: 0, // 复权 0 不复权 1 前复权 2 后复权
                                Period: 4, // 周期 0 日线 1 周线 2 月线 3 年线
                                MaxReqeustDataCount: 500, // 数据个数
                                MaxRequestMinuteDayCount: 15, // 分钟数据取5天
                                PageSize: 120, // 一屏显示多少数据
                                IsShowTooltip: true, // 是否显示 div K线提示信息 (手机端要填false)
                                DrawType: 0, // K线类型 0=实心K线柱子 1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积图
                                RightSpaceCount: 3
                            },

                        KLineTitle: // 标题设置
                            {
                                IsShowName: true, // 不显示股票名称
                                IsShowSettingInfo: true // 不显示周期/复权
                            },

                        Border: // 边框
                            {
                                Left: 10, // 左边间距
                                Right: 60, // 右边间距
                                Top: -26
                            },

                        Frame: // 子框架设置
                            [
                                {
                                    SplitCount: 7,
                                    StringFormat: 0,
                                    IsShowLeftText: true,
                                    IsShowRightText: true,
                                    Custom: [{Type: 0, Position: 'right'}]
                                }
                            ]
                    }
            },

            createLeftChart() {
                if (!$('#fakekLine')) return
                // 黑色风格
                var blackStyle = jsChart.HQChartStyle.GetStyleConfig(jsChart.STYLE_TYPE_ID.BLACK_ID)
                jsChart.JSChart.SetStyle(blackStyle)

                // 更新k线图
                $('#fakekLine').width(Number(1))
                $('#fakekLine').height(Number(1))

                if (this.leftChart == null) {
                    this.leftChart = jsChart.jsChartInit(this.$refs.fakekLine) // 初始化K线图
                    this.leftOption.KLine.Period = 0 // 日线
                    this.leftChart.SetOption(this.leftOption)
                    this.leftChart.OnSize()
                }
            }
        },
        destroyed() {
            // 页面关闭的时候 销毁hqchart实例
            if (this.leftChart) this.leftChart.StopAutoUpdate()
        }
    }
</script>
<style lang="scss">

</style>