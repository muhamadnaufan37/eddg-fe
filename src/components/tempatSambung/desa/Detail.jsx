import React, { useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Detail = ({ detailData, visible, onHide }) => {
  const toastRef = useRef(null);

  const initialValues = {
    id: detailData?.id,
    nama_desa: detailData?.nama_desa,
  };

  return (
    <>
      <Sidebar visible={visible} position="right" onHide={onHide} showCloseIcon={true} className="w-full md:w-20rem lg:w-30rem">
        <Formik initialValues={initialValues} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Detail Desa</h4>
              </div>

              <div className="mb-3">
                <label>Nama Desa</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="nama_desa" name="nama_desa" className={errors.nama_desa && touched.nama_desa ? 'p-invalid' : ''} placeholder="Contoh: Babakan Kulon" disabled />
                </div>
                <ErrorMessage name="nama_desa" component="div" className="p-error" />
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

export default Detail;
