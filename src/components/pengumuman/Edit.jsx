import React, { useRef } from 'react';
import { fetchClient } from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Edit = ({ detailData, fetchData, visible, onHide }) => {
  const toastRef = useRef(null);

  const statusPengumuman = [
    { value: 1, label: 'Pengumuman' },
    { value: 2, label: 'Penting' },
    { value: 3, label: 'Hanya Perorangan' },
  ];

  const validationSchema = () => {
    let validation = Yup.object().shape({
      judul_broadcast: Yup.string().required('Judul harus diisi'),
      text_broadcast: Yup.string().required('Pengumuman harus diisi'),
      jenis_broadcast: Yup.string().required('Status Pengumuman harus diisi'),
    });
    return validation;
  };

  const initialValues = {
    id: detailData?.id,
    id_user: detailData?.id_user,
    judul_broadcast: detailData?.judul_broadcast,
    text_broadcast: detailData?.text_broadcast,
    jenis_broadcast: detailData?.jenis_broadcast,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetchClient().post('/api/boardcast/update', values);
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

  return (
    <>
      <Dialog header="Ubah Pengumuman" visible={visible} onHide={onHide} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label>Judul Pengumuman</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="judul_broadcast" name="judul_broadcast" className={errors.judul_broadcast && touched.judul_broadcast ? 'p-invalid' : ''} placeholder="Masukan Judul Pengumuman" />
                </div>
                <ErrorMessage name="judul_broadcast" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Isi Pengumuman</label>
                <div className="row p-1 m-1">
                  <Field as={InputTextarea} id="text_broadcast" name="text_broadcast" className={errors.text_broadcast && touched.text_broadcast ? 'p-invalid' : ''} placeholder="Harap isi pengumuman dengan detail" rows={5} cols={30} />
                </div>
                <ErrorMessage name="text_broadcast" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Status Pengumuman</label>
                <div className="row p-1 m-1">
                  <Field as={Dropdown} id="jenis_broadcast" name="jenis_broadcast" options={statusPengumuman} className={errors.jenis_broadcast && touched.jenis_broadcast ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" />
                </div>
                <ErrorMessage name="jenis_broadcast" component="div" className="p-error" />
              </div>

              <Toast ref={toastRef} />

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
                <Button type="button" label="Batal" severity="info" size="small" onClick={onHide} outlined />
                <Button type="submit" label="Ubah" severity="info" size="small" disabled={isSubmitting} />
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default Edit;
