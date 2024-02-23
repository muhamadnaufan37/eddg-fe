import React, { useEffect, useRef } from 'react';
import { fetchClient } from '../utils/axios';
import { signal } from '@preact/signals-react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// css profil
import '../assets/css/proflie.css';

const userData = signal(null);
const error = signal(null);
const dataUser = signal([]);
const showForm = signal(false);

export default function Profile() {
  const toastRef = useRef(null);

  const storedUserData = JSON.parse(localStorage.getItem('user'));
  if (storedUserData) {
    dataUser.value = storedUserData;
  }

  const validationSchema = Yup.object().shape({
    nama_lengkap: Yup.string().required('Nama Lengkap harus diisi'),
    username: Yup.string().required('Username harus diisi'),
    email: Yup.string().required('Email harus diisi'),
  });

  const initialValues = {
    id: dataUser.value.id,
    nama_lengkap: userData.value?.nama_lengkap,
    username: userData.value?.username,
    email: userData.value?.email,
  };

  const showEdit = () => {
    showForm.value = true;
  };

  const hideEdit = () => {
    showForm.value = false;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await fetchClient().post('/api/profile/update', values);
      toastRef.current.show({
        severity: 'success',
        summary: 'Sukses',
        detail: 'Data berhasil disimpan',
        life: 3000,
      });
      hideEdit();
      DetailDataFetch();
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

  const DetailDataFetch = async () => {
    try {
      const response = await fetchClient().post(`/api/profile/edit`, { id: dataUser.value.id });
      userData.value = response.data.data_profile;
    } catch (err) {
      error.value = err;
    }
  };

  useEffect(() => {
    DetailDataFetch();
  }, []);

  return (
    <>
      {userData.value && (
        <>
          <div className="container">
            <div className="row mt-5 mb-5 justify-content-center">
              <div className="xl:col-6 lg:col-6 md:col-6 sm:col-6">
                <Toast ref={toastRef} />
                {error.value && <div>{error.value.message}</div>}
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <div className="card">
                        <div className="card-body">
                          <div className="judul-header fw-semibold fs-3 mb-4">Profil</div>
                          <div className="row mb-3 p-2">
                            <div className="col-6 lg:col-6 md:col-12 sm:col-12 mb-2 mb-sm-0 d-flex align-items-center">
                              <img className="img-profile" src="/assets/eddg/Vector.png" height={50} alt="img-profil" />
                              <div className="ms-3">
                                <font className="data-user">{dataUser.value.nama_lengkap}</font>
                                <br />
                                <font>{dataUser.value?.role_name}</font>
                              </div>
                            </div>
                            <div className="col-12 lg:col-6 md:col-12 sm:col-12 d-flex justify-content-end justify-content-sm-center align-items-center d-grid gap-2">
                              {showForm.value === true && (
                                <>
                                  <Button type="submit" label="Simpan" severity="info" size="small" disabled={isSubmitting} />
                                  <Button type="button" label="Batal" severity="info" size="small" outlined className="ms-2" onClick={hideEdit} />
                                </>
                              )}
                              {showForm.value === false && <Button type="button" icon="pi pi-pencil" label="Edit" severity="info" size="small" outlined className="ms-2" onClick={showEdit} />}
                            </div>
                          </div>
                          <span className="judul-header fw-bold">Informasi Personal</span>
                          <div className="row mt-3">
                            <div className="col-12 sm:col-12 lg:col-6">
                              <label>Nama Lengkap</label>
                              <div className="data-user">
                                {!showForm.value && <>{userData.value?.nama_lengkap}</>}
                                {showForm.value && (
                                  <>
                                    <div className="p-1 m-1">
                                      <Field as={InputText} id="nama_lengkap" name="nama_lengkap" className={errors.nama_lengkap && touched.nama_lengkap ? 'p-invalid' : ''} />
                                    </div>
                                    <ErrorMessage name="nama_lengkap" component="div" className="p-error" />
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="col-12 sm:col-12 lg:col-6">
                              <label>Username</label>
                              <div className="data-user">
                                {!showForm.value && <>{userData.value?.username}</>}
                                {showForm.value && (
                                  <>
                                    <div className="p-1 m-1">
                                      <Field as={InputText} id="username" name="username" className={errors.username && touched.username ? 'p-invalid' : ''} />
                                    </div>
                                    <ErrorMessage name="username" component="div" className="p-error" />
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="col-12 sm:col-12 lg:col-6">
                              <label>Email</label>
                              <div className="data-user">
                                {!showForm.value && <>{dataUser.value?.email}</>}
                                {showForm.value && (
                                  <>
                                    <div className="p-1 m-1">
                                      <Field as={InputText} id="email" name="email" className={errors.email && touched.email ? 'p-invalid' : ''} />
                                    </div>
                                    <ErrorMessage name="email" component="div" className="p-error" />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
