import React, { useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from 'primereact/button';

const Tambah = ({ detailData, rolesUser, visible, onHide, fetchdataDearah, fetchdataDesa, fetchDataKelompok }) => {
  const toastRef = useRef(null);

  const statusAkun = [
    { value: 1, label: 'Aktif' },
    { value: 0, label: 'Tidak Aktif' },
  ];

  const initialValues = {
    id: detailData?.id,
    username: detailData?.username,
    email: detailData?.email,
    password: '',
    confirm_password: '',
    nama_lengkap: detailData?.nama_lengkap,
    role_id: detailData?.role_id,
    status: detailData?.status,
    role_daerah: detailData?.role_daerah,
    role_desa: detailData?.role_desa,
    role_kelompok: detailData?.role_kelompok,
  };

  return (
    <>
      <Sidebar visible={visible} position="right" onHide={onHide} showCloseIcon={true} className="w-full md:w-20rem lg:w-30rem">
        <Formik initialValues={initialValues} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Detail User</h4>
              </div>

              <div className="mb-3">
                <label htmlFor="username">Username</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="username" name="username" className={errors.username && touched.username ? 'p-invalid' : ''} placeholder="Contoh: dian_anita" disabled />
                </div>
                <ErrorMessage name="username" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="email" name="email" className={errors.email && touched.email ? 'p-invalid' : ''} placeholder="Contoh: dian.anita@gmail.com" disabled />
                </div>
                <ErrorMessage name="email" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="nama">Nama</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="nama" name="nama" className={errors.nama && touched.nama ? 'p-invalid' : ''} placeholder="Contoh: Dian Anita" disabled />
                </div>
                <ErrorMessage name="nama" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="role_id">Role</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_id" name="role_id" options={rolesUser} className={errors.role_id && touched.role_id ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                </div>
                <ErrorMessage name="role_id" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="status">Status</label>
                <div className="row p-1 m-1">
                  <Field as={Dropdown} id="status" name="status" options={statusAkun} className={errors.status && touched.status ? 'p-invalid' : ''} optionValue="value" optionLabel="label" placeholder="Pilih salah satu" disabled />
                </div>
                <ErrorMessage name="status" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Nama Daerah</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_daerah" name="role_daerah" options={fetchdataDearah} className={errors.role_daerah && touched.role_daerah ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                </div>
                <ErrorMessage name="role_daerah" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Nama Desa</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_desa" name="role_desa" options={fetchdataDesa} className={errors.role_desa && touched.role_desa ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                </div>
                <ErrorMessage name="role_desa" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Nama Kelompok</label>
                <div className="row p-1 m-1">
                  <Field filter as={Dropdown} id="role_kelompok" name="role_kelompok" options={fetchDataKelompok} className={errors.role_kelompok && touched.role_kelompok ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                </div>
                <ErrorMessage name="role_kelompok" component="div" className="p-error" />
              </div>

              <Toast ref={toastRef} />

              <div className="mb-3 d-grid gap-2">
                <Button type="button" label="Kembali" severity="info" size="small" onClick={onHide} outlined />
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  );
};

export default Tambah;
