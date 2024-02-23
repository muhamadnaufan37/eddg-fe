import React, { useRef, useEffect } from 'react';
import { signal } from '@preact/signals-react';
import { fetchClient } from '../../utils/axios';
import { saveUserInfo, userInfo } from '../../store';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../../assets/css/login.css';
import '../../assets/css/style.css';

// css primeReact
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const showPassword = signal(false);
const loadingSubmit = signal(false);

const FormLogin = () => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (userInfo()) {
      return (window.location.href = '/');
    }
  }, []);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username tidak boleh kosong'),
    password: Yup.string().required('Password tidak boleh kosong'),
  });

  const handleLogin = async (value) => {
    try {
      loadingSubmit.value = true;
      const response = await fetchClient().post('/api/login', value);
      const responseDatamessage = response.data;
      if (responseDatamessage.success === true) {
        const data = response.data;
        data.user.token = data.token;
        saveUserInfo({ data: data.user });
        window.location.href = '/';
        toastRef.current.show({
          severity: 'success',
          summary: 'Sukses',
          detail: responseDatamessage.message,
          life: 3000,
        });
        setTimeout(() => {
          loadingSubmit.value = false;
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

  const handleTogglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const pageCariDataSensus = () => {
    window.location.href = '/cari-data-sensus';
  };

  const pageCariDataNik = () => {
    window.location.href = '/cari-data-nik';
  };

  return (
    <Formik initialValues={{ username: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin}>
      {({ isSubmitting, errors, touched }) => (
        <div className="content-wrapper">
          <div className="wrapper-login d-flex flex-sm-row">
            <img className="d-none d-xxl-block" src="/assets/eddg/logo-banner.svg" alt="banner-login" />
            <div className="form-login p-3 mx-5">
              <div className="p-3 my-1 align-self-center">
                <div className="text-center">
                  <img className="logo-eddg" src="/assets/eddg/logo-login.svg" alt="logo-login" />
                </div>
                <div className="text-center h4 my-4 fw-bold warna-label">Masuk Ke Akun</div>
                <Form>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-bold warna-label">
                      Username
                    </label>
                    <br />
                    <label className="form-label text-muted">Masukkan username yang sesuai</label>
                    <div className="row m-1">
                      <Field as={InputText} className={errors.username && touched.username ? 'p-invalid' : ''} id="username" name="username" placeholder="contoh: emailku@example.com" />
                    </div>
                    <ErrorMessage name="username" component="div" className="p-error" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold warna-label">Kata Sandi</label>
                    <br />
                    <label className="form-label text-muted">Masukkan kata sandi yang sesuai</label>
                    <div className="p-inputgroup p-1">
                      <Field as={showPassword.value ? InputText : Password} id="password" name="password" className={errors.password && touched.password ? 'p-invalid' : ''} placeholder="Masukkan kata sandi" feedback={false} />
                      <span className="p-inputgroup-addon" onClick={handleTogglePassword}>
                        {showPassword.value ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                      </span>
                    </div>
                    <ErrorMessage name="password" component="div" className="p-error" />
                  </div>
                  <Toast ref={toastRef} />
                  <div className="d-grid mt-4 gap-2 mb-2">
                    <Button type="submit" label="Masuk" severity="info" size="small" disabled={isSubmitting} />
                  </div>
                </Form>
                <div className="text-center">- OR -</div>
                <div className="d-grid mt-2 gap-2 mb-6 mx-auto d-md-flex justify-content-md-center">
                  <Button className="w-full" label="Cari Data Sensus" onClick={pageCariDataSensus} severity="warning" size="small" />
                  <Button className="w-full" label="Cari Data Berdasarkan NIK" onClick={pageCariDataNik} severity="success" size="small" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default FormLogin;
