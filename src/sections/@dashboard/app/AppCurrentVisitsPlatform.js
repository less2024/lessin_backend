import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 235;
const LEGEND_HEIGHT = 40;

const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(0),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

AppCurrentVisitsPlatform.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
};

export default function AppCurrentVisitsPlatform({ title, subheader, chartColors, chartData, ...other }) {
  const theme = useTheme();

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = useChart({
    colors: chartColors,
    labels: chartLabels,

    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card {...other}>
      {false &&
      <CardHeader title={title} subheader={subheader} />
      }

      <StyledChartWrapper dir="ltr">
        <ReactApexChart type="radialBar" series={chartSeries} options={chartOptions} height={220} />
      </StyledChartWrapper>
    </Card>
  );
}
