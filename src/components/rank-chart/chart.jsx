// components/LineChart.jsx
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import crosshairPlugin from 'chartjs-plugin-crosshair';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    crosshairPlugin
);

const uzMonths = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

const LineChart = ({ year = new Date().getFullYear(), data = [] }) => {
    const labels = uzMonths;

    // Null qiymatlarni alohida ko'rsatish uchun
    const filledData = Array.from({ length: 12 }, (_, i) => data[i] ?? null);
    
    // Null qiymatlar uchun alohida dataset yaratamiz
    const nullData = filledData.map((value, index) => 
        value === null ? 0 : null
    );

    const chartData = {
        labels,
        datasets: [
            {
                // Asosiy ma'lumotlar
                data: filledData,
                borderColor: '#ea641e',
                backgroundColor: '#ffffffb9',
                tension: 0.4,
                borderWidth: 2,
                fill: false,
                stepped: false,
                pointBackgroundColor: filledData.map(val => 
                    val !== null ? '#ea641e' : 'transparent'
                ),
                pointBorderColor: filledData.map(val => 
                    val !== null ? '#ea641e' : 'transparent'
                ),
                pointRadius: filledData.map(val => 
                    val !== null ? 4 : 0
                ),
                pointHoverRadius: filledData.map(val => 
                    val !== null ? 6 : 0
                ),
            },
            {
                // Null qiymatlar uchun ko'rinadigan nuqtalar
                data: nullData,
                borderColor: 'transparent',
                backgroundColor: '#ccc',
                pointBackgroundColor: filledData.map(val => 
                    val === null ? '#ccc' : 'transparent'
                ),
                pointBorderColor: filledData.map(val => 
                    val === null ? '#ccc' : 'transparent'
                ),
                pointRadius: filledData.map(val => 
                    val === null ? 3 : 0
                ),
                pointHoverRadius: filledData.map(val => 
                    val === null ? 5 : 0
                ),
                pointHoverBackgroundColor: '#999',
                showLine: false, // Chiziqni ko'rsatmaslik
            }
        ],
    };
    
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#ffffff',
                borderColor: '#ea641e',
                borderWidth: 1,
                titleColor: '#000000',
                bodyColor: '#000000',
                padding: 10,
                cornerRadius: 5,
                displayColors: false,
                bodyFont: {
                    weight: 'bold'
                },
                callbacks: {
                    title: function (context) {
                        return `${year}-yil, ${uzMonths[context[0].dataIndex]}`;
                    },
                    label: function (context) {
                        if (context.datasetIndex === 0 && context.parsed.y !== null) {
                            return `${context.parsed.y}-o‘rin`;
                        } else if (context.datasetIndex === 1) {
                            return "Ma'lumot mavjud emas";
                        }
                        return null;
                    },
                    afterBody: function(context) {
                        // Faqat null qiymatlar uchun qo'shimcha ma'lumot
                        if (context[0].datasetIndex === 1) {
                            return ["Bu oy uchun reyting ma'lumoti mavjud emas"];
                        }
                        return null;
                    }
                }
            },
            crosshair: {
                line: {
                    color: '#888',
                    width: 1,
                    dashPattern: [0],
                },
                sync: {
                    enabled: false,
                },
                zoom: {
                    enabled: false,
                },
                animation: {
                    duration: 0
                },
                snap: {
                    enabled: true,
                    mode: 'nearest',
                    threshold: 10
                }
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                reverse: true,
                min: 1,
                max: 30,
                ticks: { 
                    stepSize: 5,
                    callback: function(value) {
                        return value === 0 ? '' : value; // 0 ni ko'rsatmaslik
                    }
                },
                grid: {
                    display: true,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            },
        },
        elements: {
            line: {
                tension: 0.4, // Biroz egri chiziq
                cubicInterpolationMode: 'default',
                capBezierPoints: false,
            },
            point: {
                radius: 0,
                hoverRadius: 4,
                hitRadius: 5,
            },
        },
    };
    
    return <Line data={chartData} options={options} />;
};

export default LineChart;