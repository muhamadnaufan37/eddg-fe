import React, { useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Detail = ({ detailData, visible, onHide }) => {
  const toastRef = useRef(null);

  const statusPengumuman = [
    { value: 1, label: 'Pengumuman' },
    { value: 2, label: 'Penting' },
    { value: 3, label: 'Hanya Perorangan' },
  ];

  const initialValues = {
    id_user: detailData?.id_user,
    judul_broadcast: detailData?.judul_broadcast,
    text_broadcast: detailData?.text_broadcast,
    jenis_broadcast: detailData?.jenis_broadcast,
    nama_petugas: detailData?.nama_petugas,
  };

  return (
    <>
      <Dialog header="Detail Pengumuman" visible={visible} onHide={onHide} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <Formik initialValues={initialValues} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched }) => (
            <Form>
              <div className="mb-3">
                <label>Judul Pengumuman</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="judul_broadcast" name="judul_broadcast" className={errors.judul_broadcast && touched.judul_broadcast ? 'p-invalid' : ''} placeholder="Masukan Judul Pengumuman" disabled />
                </div>
                <ErrorMessage name="judul_broadcast" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Isi Pengumuman</label>
                <div className="row p-1 m-1">
                  <Field as={InputTextarea} id="text_broadcast" name="text_broadcast" className={errors.text_broadcast && touched.text_broadcast ? 'p-invalid' : ''} placeholder="Harap isi pengumuman dengan detail" rows={5} cols={30} disabled />
                </div>
                <ErrorMessage name="text_broadcast" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Status Pengumuman</label>
                <div className="row p-1 m-1">
                  <Field as={Dropdown} id="jenis_broadcast" name="jenis_broadcast" options={statusPengumuman} className={errors.jenis_broadcast && touched.jenis_broadcast ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                </div>
                <ErrorMessage name="jenis_broadcast" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Diinput Oleh</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="nama_petugas" name="nama_petugas" className={errors.nama_petugas && touched.nama_petugas ? 'p-invalid' : ''} disabled />
                </div>
                <ErrorMessage name="nama_petugas" component="div" className="p-error" />
              </div>

              <Toast ref={toastRef} />

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
                <Button type="button" label="Kembali" severity="info" size="small" onClick={onHide} outlined />
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default Detail;
