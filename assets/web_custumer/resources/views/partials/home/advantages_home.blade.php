<div class="kt-widget12">
    <div class="kt-widget12__content">
        <div class="kt-widget12__item">
            <div class="kt-widget12__info">
                <span class="kt-widget12__desc">Gains de la semaine</span>
                <span class="kt-widget12__value">{{$total_gains}} XAF</span>
            </div>
            <div class="kt-widget12__info">
                <span class="kt-widget12__desc">Semaine du </span>
                <span class="kt-widget12__value">{{$advantages_period["labels"][0]}}</span>

            </div>
        </div>
    </div>
    <div class="kt-widget12__chart" style="height:250px;">
        <canvas id="kt_chart_order_statistics"></canvas>
    </div>
</div>

<script>
    //gestion du graph home
    var labels= [];

    @for ($i=0; $i< count($advantages_period["labels"]); $i++)
    labels.push("{{$advantages_period["labels"][$i]}}");
        @endfor


    var orderStatistics = function() {
            var container = KTUtil.getByID('kt_chart_order_statistics');

            if (!container) {
                return;
            }

            var color = Chart.helpers.color;
            var barChartData = {
                labels:labels ,
                datasets : [
                    {
                        fill: true,
                        //borderWidth: 0,
                        backgroundColor: color(KTApp.getStateColor('brand')).alpha(0.6).rgbString(),
                        borderColor : color(KTApp.getStateColor('brand')).alpha(0).rgbString(),

                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 12,
                        pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                        pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                        pointHoverBackgroundColor: KTApp.getStateColor('brand'),
                        pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),

                        data: JSON.parse("{{json_encode($advantages_period["values"])}}")
                    }
                ]
            };

            var ctx = container.getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: barChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: false,
                    scales: {
                        xAxes: [{
                            categoryPercentage: 0.35,
                            barPercentage: 0.70,
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Month'
                            },
                            gridLines: false,
                            ticks: {
                                display: true,
                                beginAtZero: true,
                                fontColor: KTApp.getBaseColor('shape', 3),
                                fontSize: 13,
                                padding: 10
                            }
                        }],
                        yAxes: [{
                            categoryPercentage: 0.35,
                            barPercentage: 0.70,
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Value'
                            },
                            gridLines: {
                                color: KTApp.getBaseColor('shape', 2),
                                drawBorder: false,
                                offsetGridLines: false,
                                drawTicks: false,
                                borderDash: [3, 4],
                                zeroLineWidth: 1,
                                zeroLineColor: KTApp.getBaseColor('shape', 2),
                                zeroLineBorderDash: [3, 4]
                            },
                            ticks: {
                                max: 70,
                                stepSize: 10,
                                display: true,
                                beginAtZero: true,
                                fontColor: KTApp.getBaseColor('shape', 3),
                                fontSize: 13,
                                padding: 10
                            }
                        }]
                    },
                    title: {
                        display: false
                    },
                    hover: {
                        mode: 'index'
                    },
                    tooltips: {
                        enabled: true,
                        intersect: false,
                        mode: 'nearest',
                        bodySpacing: 5,
                        yPadding: 10,
                        xPadding: 10,
                        caretPadding: 0,
                        displayColors: false,
                        backgroundColor: KTApp.getStateColor('brand'),
                        titleFontColor: '#ffffff',
                        cornerRadius: 4,
                        footerSpacing: 0,
                        titleSpacing: 0
                    },
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 5,
                            bottom: 5
                        }
                    }
                }
            });
        }

    jQuery(document).ready(function() {
        orderStatistics();
    });
</script>
