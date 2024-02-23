import React, { useEffect, useRef } from 'react';
import { fetchClient } from '../utils/axios';
import { signal } from '@preact/signals-react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// css profil
import '../assets/css/proflie.css';

const error = signal(null);
const dataUser = signal([]);

const userDataCekPassword = signal(null);
const showPassword = signal(false);
const showConfirmPassword = signal(false);

export default function Changepassword() {
  const toastRef = useRef(null);
  const msgs = useRef(null);

  const storedUserData = JSON.parse(localStorage.getItem('user'));
  if (storedUserData) {
    dataUser.value = storedUserData;
  }

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Kata sandi harus memiliki minimal 8 karakter, kombinasi huruf besar, huruf kecil, dan angka')
      .required('Kata sandi harus diisi'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Kata sandi tidak sesuai')
      .required('Konfirmasi kata sandi harus diisi'),
  });

  const initialValues = {
    id: dataUser.value.id,
    password: '',
    confirm_password: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await fetchClient().post('/api/profile/update_password', values);
      toastRef.current.show({
        severity: 'success',
        summary: 'Sukses',
        detail: 'Data berhasil disimpan',
        life: 3000,
      });
    } catch (error) {
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
    } finally {
      setSubmitting(false);
    }
  };

  const CekStatusPasswordUser = async () => {
    try {
      const response = await fetchClient().post(`/api/profile/cek_password`, { id: dataUser.value.id });
      userDataCekPassword.value = response.data;
    } catch (err) {
      error.value = err;
    }
  };

  useEffect(() => {
    CekStatusPasswordUser();
  }, []);

  const footerUserPassword = (
    <>
      <Divider />
      <ErrorMessage name="password" component="div" className="p-error" />
    </>
  );

  const footerConfirmPassword = (
    <>
      <Divider />
      <ErrorMessage name="confirm_password" component="div" className="p-error" />
    </>
  );

  const handleTogglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const handleToggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  useMountEffect(() => {
    if (msgs.current) {
      msgs.current.clear();
      msgs.current.show({ id: '1', sticky: true, severity: 'info', detail: 'Kata Sandi minimal 8 karakter dengan kombinasi huruf kapital, angka dan simbol', closable: false });
    }
  });

  return (
    <>
      <Toast ref={toastRef} />
      {error.value && <div>{error.value.message}</div>}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="container">
              <div className="row mt-5 mb-5 justify-content-center">
                <div className="xl:col-6 lg:col-6 md:col-6 sm:col-6">
                  <div className="card mx-auto">
                    <div className="card-body">
                      <span className="judul-header-pswrd fw-bold">Ganti Kata Sandi</span>
                      <div className="row mt-3">
                        <div className="col-12 xl:col-12 lg:col-6 md:col-12 sm:col-12">
                          <label htmlFor="password">Kata Sandi Baru</label>
                          <div className="p-inputgroup p-1">
                            <Field as={showPassword.value ? InputText : Password} id="password" name="password" className={errors.password && touched.password ? 'p-invalid' : ''} footer={footerUserPassword} placeholder="Masukan Kata Sandi Baru disini" />
                            <span className="p-inputgroup-addon" onClick={handleTogglePassword}>
                              {showPassword.value ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                            </span>
                          </div>
                          <ErrorMessage name="password" component="div" className="p-error" />
                        </div>
                        <div className="col-12 xl:col-12 lg:col-6 md:col-12 sm:col-12">
                          <label htmlFor="confirm_password">Konfirmasi Kata Sandi Baru</label>
                          <div className="p-inputgroup p-1">
                            <Field as={showConfirmPassword.value ? InputText : Password} id="confirm_password" name="confirm_password" className={errors.confirm_password && touched.confirm_password ? 'p-invalid' : ''} footer={footerConfirmPassword} placeholder="Masukan Konfirmasi Kata Sandi Baru disini" />
                            <span className="p-inputgroup-addon" onClick={handleToggleConfirmPassword}>
                              {showConfirmPassword.value ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                            </span>
                          </div>
                          <ErrorMessage name="confirm_password" component="div" className="p-error" />
                        </div>
                        <div className="col-12 xl:col-12 lg:col-12 md:col-12 sm:col-12">
                          <Messages ref={msgs} />
                        </div>
                        <div className="col-12 xl:col-12 lg:col-12 md:col-12 sm:col-12">
                          <Button className="w-100" type="submit" label="Simpan" severity="info" size="small" disabled={isSubmitting} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
