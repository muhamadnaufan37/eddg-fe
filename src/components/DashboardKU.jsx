import React, { useEffect, useRef } from 'react';
import { fetchClient } from '../utils/axios';
import { deleteUserInfo } from '../store';
import { signal } from '@preact/signals-react';
import Chart from 'react-apexcharts';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

import '../assets/css/dashboard.css';

const dataNew = signal([]);
const dataSensusCek = signal([]);
const getDataperTahun = signal([]);
const dataTahunRincian = signal('');

const DashboardKU = () => {
  const toastRef = useRef(null);
  const storedUserData = JSON.parse(localStorage.getItem('user'));
  if (storedUserData) {
    dataNew.value = storedUserData;
  }

  const fetchData = async () => {
    try {
      const response = await fetchClient().get(`/api/wallet_kas/totalSaldoPemasukan?tahun=${dataTahunRincian.value}`);
      dataSensusCek.value = response.data.data_perkembangan;
      console.log(dataSensusCek.value);
      const responseDatamessage = response.data;
      if (responseDatamessage.success === true) {
        toastRef.current.show({
          severity: 'success',
          summary: 'Sukses',
          detail: responseDatamessage.message,
          life: 3000,
        });
      } else if (responseDatamessage.success === false) {
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: responseDatamessage.message,
          life: 3000,
        });
      } else {
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: responseDatamessage.message,
          life: 3000,
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Penanganan status HTTP 401 (Unauthorized)
          try {
            deleteUserInfo();
            window.location.href = '/';
          } catch (logoutError) {
            toastRef.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Oops.. ada kesalahan sistem, silahkan coba lagi.',
              life: 3000,
            });
          }
        } else if (error.response.status === 403) {
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Akses ditolak: Anda tidak memiliki izin untuk mengakses resource ini.',
            life: 3000,
          });
        } else if (error.response.status === 500) {
          // Penanganan status HTTP 500 (Internal Server Error)
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Oops.. ada kesalahan sistem, silahkan coba secara berkala.',
            life: 3000,
          });
        } else {
          // Penanganan status HTTP lainnya
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
        }
      }
    }
  };

  const fetchDataTahun = async () => {
    try {
      const response = await fetchClient().get(`/api/wallet_kas/getDataTahun`);
      getDataperTahun.value = response.data.data_wallet_kas.map((option) => ({
        value: option.tahun,
        label: option.tahun,
      }));
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Penanganan status HTTP 401 (Unauthorized)
          try {
            deleteUserInfo();
            window.location.href = '/';
          } catch (logoutError) {
            toastRef.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Oops.. ada kesalahan sistem, silahkan coba lagi.',
              life: 3000,
            });
          }
        } else if (error.response.status === 403) {
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Akses ditolak: Anda tidak memiliki izin untuk mengakses resource ini.',
            life: 3000,
          });
        } else if (error.response.status === 500) {
          // Penanganan status HTTP 500 (Internal Server Error)
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Oops.. ada kesalahan sistem, silahkan coba secara berkala.',
            life: 3000,
          });
        } else {
          // Penanganan status HTTP lainnya
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
        }
      }
    }
  };

  useEffect(() => {
    fetchDataTahun();
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
    total_jumlah_pemasukan: parseInt(entry.total_jumlah_pemasukan) || 0,
    total_jumlah_pengeluaran: parseInt(entry.total_jumlah_pengeluaran) || 0,
  }));

  // Format total_nilai dengan menggunakan Intl.NumberFormat
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];
  const dataValues = allMonths.map((month) => {
    const entry = formattedData.find((item) => item.bulan === month);
    return entry
      ? {
          bulan: month,
          total_jumlah_pemasukan: parseInt(entry.total_jumlah_pemasukan) || 0,
          total_jumlah_pengeluaran: parseInt(entry.total_jumlah_pengeluaran) || 0,
        }
      : {
          bulan: month,
          total_jumlah_pemasukan: 0,
          total_jumlah_pengeluaran: 0,
        };
  });

  // Batasi nilai maksimum hingga 5 miliar
  const maxValue = Math.ceil(10000000 / 1000000) * 1000000;

  // Fungsi untuk menambahkan separator Rp.
  const formatCurrency = (value) => {
    const formattedValue = new Intl.NumberFormat('id-ID').format(value);
    return `Rp. ${formattedValue}`;
  };

  const dataChartSeries = {
    series: [
      { name: 'Pemasukan', data: dataValues.map((entry) => entry.total_jumlah_pemasukan) },
      { name: 'Pengeluaran', data: dataValues.map((entry) => entry.total_jumlah_pengeluaran) },
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
        formatter: formatCurrency,
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins',
          fontWeight: 'light',
        },
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
        labels: {
          formatter: formatCurrency,
        },
        max: maxValue,
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
            return formatCurrency(val);
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
      <Toast ref={toastRef} />
      <div className="card card-main-content">
        <div className="card-body">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="row">
              <div className="mb-3">
                <div className="font-dashboard uppercase align-self-center">DASHBOARD BENDAHARA</div>
                {/* <font>Update Terakhir: {dataTanggalSemua.value}</font> */}
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-3 align-self-center">
                <label>Data Tahun Kas</label>
                <Dropdown
                  filter
                  options={getDataperTahun.value}
                  value={dataNew.value?.role_id === 999 ? dataNew.value?.unit_id : dataTahunRincian.value}
                  onChange={(e) => {
                    dataTahunRincian.value = e.target.value;
                    fetchData();
                  }}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Pilih Salah Satu"
                  className="w-100"
                />
              </div>
            </div>
          </div>
          <div className="row mt-5 mb-5 justify-content-center">
            <div className="col-sm-12 mt-3 mb-3">
              <div className="font-semibold text-center">Dashboard Perkembangan Tahun {dataTahunRincian.value}</div>
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

export default DashboardKU;
