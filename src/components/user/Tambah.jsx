import React, { useRef } from 'react';
import { signal } from '@preact/signals-react';
import { fetchClient } from '../../utils/axios';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from 'primereact/button';
import * as Yup from 'yup';

const Tambah = ({ rolesUser, loadingRolesUser, errorFetchingRolesUser, fetchData, visible, onHide, fetchdataDearah, fetchdataDesa, fetchDataKelompok }) => {
  const toastRef = useRef(null);
  const showPassword = signal(false);
  const showConfirmPassword = signal(false);

  const statusAkun = [
    { value: 1, label: 'Aktif' },
    { value: 0, label: 'Tidak Aktif' },
  ];

  const validationSchema = () => {
    let validation = Yup.object().shape({
      username: Yup.string()
        .max(255, 'Username Max. 255 karakter')
        .matches(/^[^\s]+$/, 'Username tidak boleh mengandung spasi')
        .matches(/^[^.]+$/, 'Username tidak boleh mengandung (.)')
        .required('Username harus diisi'),
      email: Yup.string().email('Email tidak valid').max(255, 'Email Max. 255 karakter').required('Email harus diisi'),
      password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Kata sandi harus memiliki minimal 8 karakter, kombinasi huruf besar, huruf kecil, dan angka')
        .required('Kata sandi harus diisi'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Kata sandi tidak sesuai')
        .required('Konfirmasi kata sandi harus diisi'),
      nama_lengkap: Yup.string().max(255, 'Nama Max. 255 karakter').required('Nama harus diisi'),
      role_id: Yup.string().required('Role harus diisi'),
      status: Yup.string().required('Status harus diisi'),
    });
    return validation;
  };

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    nama_lengkap: '',
    role_id: null,
    status: '',
    role_daerah: '',
    role_desa: '',
    role_kelompok: '',
  };

  const removeEmptyFields = (obj) => {
    if (obj.nip === '') {
      const { nip, jabatan_id, unit_id, ...newObj } = obj;
      return newObj;
    }
    return obj;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const cleanedValues = removeEmptyFields(values);
    try {
      const response = await fetchClient().post('/api/user/create', cleanedValues);
      const responseDatamessage = response.data;
      if (responseDatamessage.success === true) {
        toastRef.current.show({
          severity: 'success',
          summary: 'Sukses',
          detail: responseDatamessage.message,
          life: 3000,
        });
        setTimeout(() => {
          onHide();
          fetchData();
        }, 1000);
      } else {
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: responseDatamessage.message,
          life: 3000,
        });
      }
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

  return (
    <>
      <Sidebar visible={visible} position="right" onHide={onHide} showCloseIcon={true} className="w-full md:w-20rem lg:w-30rem">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Tambah User</h4>
              </div>

              <div className="mb-3">
                <label>Username</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="username" name="username" className={errors.username && touched.username ? 'p-invalid' : ''} placeholder="Contoh: dian_anita" />
                </div>
                <ErrorMessage name="username" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="email" name="email" className={errors.email && touched.email ? 'p-invalid' : ''} placeholder="Contoh: dian.anita@gmail.com" />
                </div>
                <ErrorMessage name="email" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Kata Sandi</label>
                <div className="form-text">Minimal 8 karakter yang terdiri dari huruf besar, huruf kecil dan angka.</div>
                <div className="p-inputgroup p-1">
                  <Field as={showPassword.value ? InputText : Password} id="password" name="password" className={errors.password && touched.password ? 'p-invalid' : ''} footer={footerUserPassword} />
                  <span className="p-inputgroup-addon" onClick={handleTogglePassword}>
                    {showPassword.value ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label>Konfirmasi Kata Sandi</label>
                <div className="p-inputgroup p-1">
                  <Field as={showConfirmPassword.value ? InputText : Password} id="confirm_password" name="confirm_password" className={errors.confirm_password && touched.confirm_password ? 'p-invalid' : ''} footer={footerConfirmPassword} />
                  <span className="p-inputgroup-addon" onClick={handleToggleConfirmPassword}>
                    {showConfirmPassword.value ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label>Nama</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="nama_lengkap" name="nama_lengkap" className={errors.nama_lengkap && touched.nama_lengkap ? 'p-invalid' : ''} placeholder="Contoh: Dian Anita" />
                </div>
                <ErrorMessage name="nama_lengkap" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Role</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_id" name="role_id" options={rolesUser} className={errors.role_id && touched.role_id ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled={loadingRolesUser || errorFetchingRolesUser} />
                </div>
                <ErrorMessage name="role_id" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Status</label>
                <div className="row p-1 m-1">
                  <Field as={Dropdown} id="status" name="status" options={statusAkun} className={errors.status && touched.status ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" />
                </div>
                <ErrorMessage name="status" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Nama Daerah</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_daerah" name="role_daerah" options={fetchdataDearah} className={errors.role_daerah && touched.role_daerah ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" />
                </div>
                <ErrorMessage name="role_daerah" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Nama Desa</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_desa" name="role_desa" options={fetchdataDesa} className={errors.role_desa && touched.role_desa ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" />
                </div>
                <ErrorMessage name="role_desa" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Nama Kelompok</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_kelompok" name="role_kelompok" options={fetchDataKelompok} className={errors.role_kelompok && touched.role_kelompok ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" />
                </div>
                <ErrorMessage name="role_kelompok" component="div" className="p-error" />
              </div>

              <Toast ref={toastRef} />

              <div className="mb-3 d-grid gap-2">
                <Button type="submit" label="Simpan" severity="info" size="small" disabled={isSubmitting} />
                <Button type="button" label="Batal" severity="info" size="small" onClick={onHide} outlined />
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  );
};

export default Tambah;
