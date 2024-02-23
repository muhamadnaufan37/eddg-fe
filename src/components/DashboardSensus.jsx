import React, { useEffect } from 'react';
import { fetchClient } from '../utils/axios';
import { signal } from '@preact/signals-react';
import Chart from 'react-apexcharts';

import '../assets/css/dashboard.css';

const dataNew = signal([]);
const dataSensusCek = signal([]);

const DashboardSensus = () => {
  const storedUserData = JSON.parse(localStorage.getItem('user'));
  if (storedUserData) {
    dataNew.value = storedUserData;
  }

  const fetchData = async () => {
    try {
      const response = await fetchClient().get('/api/sensus/dashboard_sensus');
      dataSensusCek.value = response.data.data_sensus_thl;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copiedDataNilai = [...dataSensusCek.value];

  // Hapus elemen ke-13 dari salinan
  copiedDataNilai.splice(12, 1);

  const convertToMonthText = (monthNumber) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];
    return monthNames[monthNumber - 1] || '';
  };

  const formattedData = copiedDataNilai.map((entry) => ({
    bulan: convertToMonthText(parseInt(entry.bulan)),
    total_data: parseInt(entry.total_data) || 0,
    total_pra_remaja: parseInt(entry.total_pra_remaja) || 0,
    total_remaja: parseInt(entry.total_remaja) || 0,
    total_muda_mudi_usia_nikah: parseInt(entry.total_muda_mudi_usia_nikah) || 0,
    total_laki: parseInt(entry.total_laki) || 0,
    total_perempuan: parseInt(entry.total_perempuan) || 0,
  }));

  // Format total_nilai dengan menggunakan Intl.NumberFormat
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];
  const dataValues = allMonths.map((month) => {
    const entry = formattedData.find((item) => item.bulan === month);
    return entry
      ? {
          bulan: month,
          total_pra_remaja: parseInt(entry.total_pra_remaja) || 0,
          total_remaja: parseInt(entry.total_remaja) || 0,
          total_muda_mudi_usia_nikah: parseInt(entry.total_muda_mudi_usia_nikah) || 0,
          total_laki: parseInt(entry.total_laki) || 0,
          total_perempuan: parseInt(entry.total_perempuan) || 0,
        }
      : {
          bulan: month,
          total_pra_remaja: 0,
          total_remaja: 0,
          total_muda_mudi_usia_nikah: 0,
          total_laki: 0,
          total_perempuan: 0,
        };
  });

  const dataChartSeries = {
    series: [
      { name: 'Pra Remaja', data: dataValues.map((entry) => entry.total_pra_remaja) },
      { name: 'Remaja', data: dataValues.map((entry) => entry.total_remaja) },
      { name: 'Muda Mudi Usia Nikah', data: dataValues.map((entry) => entry.total_muda_mudi_usia_nikah) },
      { name: 'Laki-laki', data: dataValues.map((entry) => entry.total_laki) },
      { name: 'Perempuan', data: dataValues.map((entry) => entry.total_perempuan) },
    ],
  };

  const dataChartOption = {
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: allMonths,
      },
      yaxis: {
        title: {
          text: 'E - Digital Data Generus',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return 'Total ' + val + ' Orang';
          },
        },
      },
      responsive: [
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 550,
              width: 1800,
            },
          },
        },
        {
          breakpoint: 758,
          options: {
            chart: {
              height: 550,
              width: 1800,
            },
          },
        },
      ],
    },
  };

  return (
    <>
      <div className="card card-main-content">
        <div className="card-body">
          <div className="row mt-5 mb-5 justify-content-center">
            <div className="col-sm-12 mt-3 mb-3">
              <div className="font-semibold text-center">Dashboard Perkembangan Tahun 2024</div>
              <div className="chartResponsive">
                <Chart options={dataChartOption.options} series={dataChartSeries.series} type="bar" height={550} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSensus;
