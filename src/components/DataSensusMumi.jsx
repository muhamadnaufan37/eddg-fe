import React, { useRef, useEffect } from 'react';
import { signal } from '@preact/signals-react';
import { fetchClient } from '../utils/axios';
import { userInfo } from '../store';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../assets/css/login.css';
import '../assets/css/style.css';

// css primeReact
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const dataResponse = signal([]);
const dataSensus = signal([]);
const dataSensusDigital = signal([]);
const loadingSubmit = signal(false);
const visibleDataSensus = signal(false);

const DataSensusMumi = () => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (userInfo()) {
      return (window.location.href = '/');
    }
  }, []);

  const CaariDataSensusSchema = Yup.object().shape({
    kode_cari_data: Yup.string().required('Data tidak boleh kosong'),
  });

  const handleDataSensus = async (value) => {
    try {
      loadingSubmit.value = true;
      const response = await fetchClient().post('/api/find_sensus', value);
      dataResponse.value = response.data;
      dataSensus.value = response.data.data_sensus;
      dataSensusDigital.value = response.data.digital;
      const responseDatamessage = response.data;
      if (responseDatamessage.success === true) {
        toastRef.current.show({
          severity: 'success',
          summary: 'Sukses',
          detail: `${responseDatamessage.message}, Mohon tunggu sebentar.`,
          life: 3000,
        });
        setTimeout(() => {
          loadingSubmit.value = false;
          visibleDataSensus.value = true;
        }, 2000);
      } else {
        setTimeout(() => {
          loadingSubmit.value = false;
        }, 2000);
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: responseDatamessage.message,
          life: 3000,
        });
      }
    } catch (error) {
      loadingSubmit.value = false;
      if (error.response && error.response.status === 500) {
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Oops.. ada kesalahan sistem, silahkan coba secara berkala.',
          life: 3000,
        });
      } else {
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
      }
    }
  };

  const pageLogin = () => {
    window.location.href = '/';
  };

  const renderTableRow = (data) => {
    return data.map((item, index) => (
      <tr key={index}>
        <th>{item.label}</th>
        <th>:</th>
        <td className="wrapped-cell">{item.value}</td>
      </tr>
    ));
  };

  const getStatusSambung = (value) => {
    switch (value) {
      case 0:
        return 'Tidak Sambung';
      case 1:
        return 'Sambung';
      case 2:
        return 'Pindah Sambung';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <Formik initialValues={{ kode_cari_data: '' }} validationSchema={CaariDataSensusSchema} onSubmit={handleDataSensus}>
        {({ isSubmitting, errors, touched }) => (
          <div className="content-wrapper">
            <div className="wrapper-login d-flex flex-sm-row">
              <img className="d-none d-xxl-block" src="/assets/eddg/logo-banner.svg" alt="banner-login" />
              <div className="form-login p-3 mx-5">
                <div className="p-3 my-1 align-self-center">
                  <div className="text-center">
                    <img className="logo-eddg" src="/assets/eddg/logo-login.svg" alt="logo-login" />
                  </div>
                  <div className="text-center h4 my-4 fw-bold warna-label">Cari data sensus</div>
                  <Form>
                    <div className="mb-4">
                      <label htmlFor="kode_cari_data" className="form-label fw-bold warna-label">
                        Masukan Kode Data Sensus
                      </label>
                      <br />
                      <div className="row m-1">
                        <Field as={InputText} className={errors.kode_cari_data && touched.kode_cari_data ? 'p-invalid' : ''} id="kode_cari_data" name="kode_cari_data" placeholder="Masukan Kode" />
                      </div>
                      <ErrorMessage name="kode_cari_data" component="div" className="p-error" />
                    </div>
                    <Toast ref={toastRef} />
                    <div className="d-grid mt-4 gap-2">
                      <Button type="submit" label="Cari Data" severity="warning" size="small" disabled={isSubmitting} />
                    </div>
                  </Form>
                  <br />
                  <div className="text-center">
                    <Button label="Kembali Ke Login" icon="pi pi-external-link" onClick={pageLogin} severity="warning" outlined size="small" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
      <Dialog header={`Hasil Pencarian Nama : ${dataSensus.value?.nama_lengkap || ''}`} visible={visibleDataSensus.value} onHide={() => (visibleDataSensus.value = false)} style={{ width: '40vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <div className="p-2">
          Tanggal Pencarian: <b>{dataResponse.value?.tanggal_pencarian}</b>
        </div>
        <div className="table-container">
          <table className="table table-borderless">
            <tbody>
              {/* Data Sensus */}
              <tr>
                <th colSpan="3" className="text-center">
                  Data Sensus
                </th>
              </tr>
              {renderTableRow([
                { label: 'Kode Cari', value: dataSensus.value?.kode_cari_data },
                { label: 'Nama Lengkap', value: dataSensus.value?.nama_lengkap },
                { label: 'Nama Panggilan', value: dataSensus.value?.nama_panggilan },
                { label: 'Tempat Lahir', value: dataSensus.value?.tempat_lahir },
                { label: 'Tanggal Lahir', value: dataSensus.value?.tanggal_lahir },
                { label: 'Usia', value: dataSensus.value?.usia },
                { label: 'Kontak', value: dataSensus.value?.no_telepon },
                { label: 'Nama Ayah', value: dataSensus.value?.nama_ayah },
                { label: 'Nama Ibu', value: dataSensus.value?.nama_ibu },
                { label: 'Hoby', value: dataSensus.value?.hoby },
                { label: 'Pekerjaan', value: dataSensus.value?.pekerjaan },
                { label: 'Nama Daerah', value: dataSensus.value?.nama_daerah },
                { label: 'Nama Desa', value: dataSensus.value?.nama_desa },
                { label: 'Nama Kelompok', value: dataSensus.value?.nama_kelompok },
                { label: 'Usia Menikah', value: dataSensus.value?.usia_menikah },
                { label: 'Kriteria Pasangan', value: dataSensus.value?.kriteria_pasangan },
                { label: 'Status Sambung', value: getStatusSambung(dataSensus.value?.status_sambung) },
                { label: 'Status Pernikahan', value: dataSensus.value?.status_pernikahan ? 'sudah menikah' : 'belum menikah' },
              ])}
              {/* Data Digital */}
              <tr>
                <th colSpan="3" className="text-center">
                  Data Digital
                </th>
              </tr>
              {renderTableRow([
                { label: 'IP Address', value: dataSensusDigital.value?.ip_address },
                { label: 'Aktifitas', value: dataSensusDigital.value?.aktifitas },
                { label: 'Browser', value: dataSensusDigital.value?.browser },
                { label: 'Os', value: dataSensusDigital.value?.os },
                { label: 'Device', value: dataSensusDigital.value?.device },
                // ... tambahkan baris lain sesuai kebutuhan
              ])}
              {/* Logs Pencarian */}
              <tr>
                <th colSpan="3" className="text-center">
                  Logs Pencarian
                </th>
              </tr>
              {renderTableRow([
                { label: 'Negara', value: `${dataSensusDigital.value?.location_info?.countryCode} - ${dataSensusDigital.value?.location_info?.country}` },
                { label: 'Provinsi', value: `${dataSensusDigital.value?.location_info?.region} - ${dataSensusDigital.value?.location_info?.regionName}` },
                { label: 'Kota', value: dataSensusDigital.value?.location_info?.city },
                {
                  label: 'Kode Pos',
                  value: dataSensusDigital.value?.location_info?.zip || <i>*Data tidak ada*</i>,
                },
                { label: 'latitude', value: dataSensusDigital.value?.location_info?.lat },
                { label: 'longitude', value: dataSensusDigital.value?.location_info?.lon },
                { label: 'Timezone', value: dataSensusDigital.value?.location_info?.timezone },
                { label: 'ISP', value: dataSensusDigital.value?.location_info?.isp },
              ])}
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  );
};

export default DataSensusMumi;
