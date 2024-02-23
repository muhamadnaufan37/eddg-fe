import React, { useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Detail = ({ detailData, visible, onHide }) => {
  const toastRef = useRef(null);

  const initialValues = {
    name: detailData?.name,
    description: detailData?.description,
  };

  return (
    <>
      <Sidebar visible={visible} position="right" onHide={onHide} showCloseIcon={true} className="w-full md:w-20rem lg:w-30rem">
        <Formik initialValues={initialValues} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Detail Role</h4>
              </div>

              <div className="mb-3">
                <label htmlFor="name">Nama</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="name" name="name" className={errors.name && touched.name ? 'p-invalid' : ''} placeholder="Contoh: Detail Data" disabled />
                </div>
                <ErrorMessage name="name" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="description">Deskripsi</label>
                <div className="row p-1 m-1">
                  <Field as={InputTextarea} id="description" name="description" className={errors.description && touched.description ? 'p-invalid' : ''} placeholder="Isi dengan deskripsi role" disabled />
                </div>
                <ErrorMessage name="description" component="div" className="p-error" />
              </div>

              <Toast ref={toastRef} />

              <div className="mb-3 d-grid gap-2">
                <Button type="button" label="Batal" severity="info" size="small" onClick={onHide} outlined />
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  );
};

export default Detail;
