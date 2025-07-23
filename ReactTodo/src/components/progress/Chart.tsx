
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

type ProgressChartProps = {
    label: string;
    percentage: number;
    colorCode: string;
};
export function ProgressChart({ label, percentage, colorCode }: ProgressChartProps) {
    const [size, setSize] = useState(ChartSize());
    const [fontSize, setFontSize] = useState(FontSize());

    const data = {
        labels: [label],
        datasets: [
            {
                label: label,
                data: [percentage, 100 - percentage],
                backgroundColor: [colorCode, "#E5E7EB"],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: false,
        cutout: '70%',
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true, // ✅ Makes legend indicators round
                    pointStyle: 'circle', // or 'rect', 'triangle', etc.
                    boxWidth: 50,         // width of the color box
                    color: '#000',        // color of the label **text**, not the box
                    font: {
                        size: fontSize,
                    },
                },
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart: any) => {
            const { top, bottom, left, right } = chart.chartArea;
            const ctx = chart.ctx;

            const height = bottom - top;
            const textX = (left + right) / 2;
            const textY = (top + bottom) / 2;

            ctx.save();
            ctx.font = `${(height / 5).toFixed(2)}px Poppins`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(`${chart.config.data.datasets[0].data[0]}%`, textX, textY);
            ctx.restore();
        },
    };

    function ChartSize() {
        return window.innerWidth <= 768 ? 80 : 140;
    }

    function FontSize() {
        return window.innerWidth <= 768 ? 10 : 14;
    }

    useEffect(() => {
        const handleResize = () => {
            setSize(ChartSize());
            setFontSize(FontSize());
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);

        }
    }, [])


    return <Doughnut data={data} options={options} plugins={[centerTextPlugin]} width={size} height={size} />;
}
