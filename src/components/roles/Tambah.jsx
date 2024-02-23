import React, { useRef } from 'react';
import { fetchClient } from '../../utils/axios';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Tambah = ({ fetchData, visible, onHide }) => {
  const toastRef = useRef(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama harus diisi'),
    description: Yup.string().required('Deskripsi harus diisi'),
  });

  const initialValues = {
    name: '',
    description: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetchClient().post('/api/role/create', values);
      const responseDatamessage = response.data;
      if (responseDatamessage.success === true) {
        toastRef.current.show({
          severity: 'success',
          summary: 'Sukses',
          detail: responseDatamessage.message,
          life: 3000,
        });
        setTimeout(() => {
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
      onHide();
      setSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar visible={visible} position="right" onHide={onHide} showCloseIcon={true} className="w-full md:w-20rem lg:w-30rem">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Tambah Role</h4>
              </div>

              <div className="mb-3">
                <label htmlFor="name">Nama</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="name" name="name" className={errors.name && touched.name ? 'p-invalid' : ''} placeholder="Contoh: Detail Data" />
                </div>
                <ErrorMessage name="name" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="description">Deskripsi</label>
                <div className="row p-1 m-1">
                  <Field as={InputTextarea} id="description" name="description" className={errors.description && touched.description ? 'p-invalid' : ''} placeholder="Isi dengan deskripsi role" />
                </div>
                <ErrorMessage name="description" component="div" className="p-error" />
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
