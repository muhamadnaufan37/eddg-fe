import React, { useRef, useEffect, useState } from 'react';
import { signal } from '@preact/signals-react';
import { fetchClient } from '../utils/axios';
import { userInfo } from '../store';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import * as Yup from 'yup';
import '../assets/css/login.css';
import '../assets/css/style.css';

// css primeReact
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const datafindNikSidalih = signal([]);
const dataParseData = signal([]);
const loadingSubmit = signal(false);
const visibledatafindNikSidalih = signal(false);

const DataApiNik = () => {
  const toastRef = useRef(null);
  const msgs = useRef(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  useMountEffect(() => {
    if (msgs.current) {
      msgs.current.clear();
      msgs.current.show({ id: '1', sticky: true, severity: 'warn', summary: `${''}`, detail: 'Perlu diingat bahwa data ini berasal dari pangkalan pusat, oleh karena itu, diharapkan dapat digunakan dengan bijak dan penuh pertimbangan.', closable: false });
    }
  });

  useEffect(() => {
    if (userInfo()) {
      return (window.location.href = '/');
    }

    if (currentHour < 8 || currentHour >= 19) {
      // Jika di luar rentang waktu yang diizinkan, tampilkan pesan kesalahan
      toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Formulir hanya dapat diakses antara pukul 08.30 - 19.00 WIB' });

      // Nonaktifkan tombol
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, []);

  const CaariDataNikSchema = Yup.object().shape({
    nik: Yup.string()
      .required('Data tidak boleh kosong')
      .matches(/^\d{16}$/, 'NIK harus terdiri dari 16 digit'),
  });

  const handleDataNik = async (values) => {
    // Periksa apakah waktu saat ini berada di dalam rentang waktu yang diizinkan
    if (currentHour < 8 || currentHour >= 19) {
      // Jika di luar rentang waktu yang diizinkan, tampilkan pesan kesalahan
      toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Formulir hanya dapat diakses antara pukul 08.30 - 19.00 WIB' });

      // Nonaktifkan tombol
      setIsButtonDisabled(true);
    } else {
      toastRef.current.show({
        severity: 'info',
        summary: 'Info',
        detail: 'Mohon Tunggu, data sedang diproses',
        life: 5000,
      });
      try {
        loadingSubmit.value = true;
        const nik = values.nik; // Ambil nilai NIK dari input

        const url = `https://indonesian-identification-card-ktp.p.rapidapi.com/api/v3/check?nik=${nik}`;

        const response = await fetchClient().get(url, {
          headers: {
            'X-RapidAPI-Key': '7976149da7msh988404728114ffdp1e8c70jsne094f4048b15',
            'X-RapidAPI-Host': 'indonesian-identification-card-ktp.p.rapidapi.com',
          },
        });
        datafindNikSidalih.value = response.data.results.realtime_data.findNikSidalih;
        dataParseData.value = response.data.results.parse_data;
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
            visibledatafindNikSidalih.value = true;
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
        } else if (error.response && error.response.status === 502) {
          toastRef.current.show({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Request tidak dapat dijangkau, karena data mengalami Masalah Jaringan / Masalah Server / Perubahan pada API / Batasan Akses.',
            life: 3000,
          });
        } else if (error.response && error.response.status === 422) {
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'NIK harus berisi 16 digit',
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
      setIsButtonDisabled(false);
    }
  };

  const pageLogin = () => {
    window.location.href = '/';
  };

  return (
    <>
      <Formik initialValues={{ nik: '' }} validationSchema={CaariDataNikSchema} onSubmit={handleDataNik}>
        {({ isSubmitting, errors, touched }) => (
          <>
            <div className="content-wrapper">
              <div className="wrapper-login d-flex flex-sm-row">
                <img className="d-none d-xxl-block" src="/assets/eddg/logo-banner.svg" alt="banner-login" />
                <div className="form-login p-3 mx-5">
                  <div className="p-3 my-1 align-self-center">
                    <div className="text-center">
                      <img className="logo-eddg" src="/assets/eddg/logo-login.svg" alt="logo-login" />
                    </div>
                    <div className="text-center h4 my-4 fw-bold warna-label">Cari data Nomor Induk Keluarga (NIK)</div>
                    <Messages ref={msgs} />
                    {window.navigator.onLine === true ? (
                      <>
                        <Form>
                          <div className="mb-4">
                            <label htmlFor="nik" className="form-label fw-bold warna-label">
                              Nomor Induk Keluarga
                            </label>
                            <br />
                            <div className="row m-1">
                              <Field as={InputText} keyfilter="int" className={errors.nik && touched.nik ? 'p-invalid' : ''} id="nik" name="nik" placeholder="Masukan Nomor Induk Keluarga (NIK)" />
                            </div>
                            <ErrorMessage name="nik" component="div" className="p-error" />
                          </div>
                          <Toast ref={toastRef} />
                          <div className="d-grid mt-4 gap-2">
                            <Button type="submit" label="Cari Data NIK" severity="success" size="small" disabled={isSubmitting || isButtonDisabled} />
                          </div>
                        </Form>
                        <br />
                        <div className="text-center">
                          <Button label="Kembali Ke Login" icon="pi pi-external-link" onClick={pageLogin} severity="success" outlined size="small" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center">Fitur Tidak bisa digunakan, Anda sedang offline</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
      <Dialog header={`Hasil Pencarian Nama : ${datafindNikSidalih.value?.nama || ''}`} visible={visibledatafindNikSidalih.value} onHide={() => (visibledatafindNikSidalih.value = false)} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <div className="table-responsive">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th colSpan="3" className="text-center">
                  Hasil Data NIK
                </th>
              </tr>
              <tr>
                <th>Nomor Induk Keluarga</th>
                <th>:</th>
                <td>{datafindNikSidalih.value?.nik}</td>
              </tr>
              <tr>
                <th>Nomor Kartu Keluarga</th>
                <th>:</th>
                <td>{datafindNikSidalih.value?.nkk}</td>
              </tr>
              <tr>
                <th>Nama Lengkap</th>
                <th>:</th>
                <td>{datafindNikSidalih.value?.nama}</td>
              </tr>
              <tr>
                <th>Tanggal Lahir</th>
                <th>:</th>
                <td>{dataParseData.value?.tanggal_lahir}</td>
              </tr>
              <tr>
                <th>Umur</th>
                <th>:</th>
                <td>{dataParseData.value?.usiaText}</td>
              </tr>
              <tr>
                <th>Jenis Kelamin</th>
                <th>:</th>
                <td>{dataParseData.value?.jenis_kelamin}</td>
              </tr>
              <tr>
                <th>Alamat</th>
                <th>:</th>
                <td>{datafindNikSidalih.value?.alamat}</td>
              </tr>
              <tr>
                <th>Provinsi</th>
                <th>:</th>
                <td>{dataParseData.value?.provinsi}</td>
              </tr>
              <tr>
                <th>Kota / Kabupaten</th>
                <th>:</th>
                <td>{dataParseData.value?.kota_kabupaten}</td>
              </tr>
              <tr>
                <th>Kecamatan</th>
                <th>:</th>
                <td>{dataParseData.value?.kecamatan}</td>
              </tr>
              <tr>
                <th>Kelurahan</th>
                <th>:</th>
                <td>{dataParseData.value?.kelurahan}</td>
              </tr>
              <tr>
                <th>Kode Pos</th>
                <th>:</th>
                <td>{dataParseData.value?.kodepos}</td>
              </tr>
              <tr>
                <th>latitude</th>
                <th>:</th>
                <td>{datafindNikSidalih.value?.lat}</td>
              </tr>
              <tr>
                <th>longitude</th>
                <th>:</th>
                <td>{datafindNikSidalih.value?.lon}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  );
};

export default DataApiNik;
