import React, { useRef } from 'react';
import { fetchClient } from '../../utils/axios';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Tambah = ({ dataLogin, fetchData, visible, onHide, fetchDataDaerah, fetchDataDesa, fetchDataKelompok }) => {
  const toastRef = useRef(null);

  const validationSchema = Yup.object().shape({
    nama_lengkap: Yup.string().required('Nama Lengkap harus diisi'),
    nama_panggilan: Yup.string().required('Nama Panggilan harus diisi'),
    tempat_lahir: Yup.string().required('Tampat Lahir harus diisi'),
    tanggal_lahir: Yup.string().required('Tanggal Lahir harus diisi'),
    alamat: Yup.string().required('Alamat harus diisi'),
    jenis_kelamin: Yup.string().required('Jenis Kelamin harus diisi'),
    no_telepon: Yup.string()
      .required('Kontak Hp harus diisi')
      .matches(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka')
      .min(8, 'Nomor telepon harus terdiri dari minimal 8 digit')
      .max(15, 'Nomor telepon harus terdiri dari maksimal 15 digit'),
    nama_ayah: Yup.string().required('Nama Bapak harus diisi'),
    nama_ibu: Yup.string().required('Nama Ibu harus diisi'),
    hoby: Yup.string().required('Hoby harus diisi'),
    pekerjaan: Yup.string().required('Pekerjaan harus diisi'),
    tmpt_daerah: Yup.string().required('Tempat Daerah harus diisi'),
    tmpt_desa: Yup.string().required('Tempat Desa harus diisi'),
    tmpt_kelompok: Yup.string().required('Tempat Kelompok harus diisi'),
  });

  const initialValues = {
    nama_lengkap: '',
    nama_panggilan: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    jenis_kelamin: '',
    no_telepon: '',
    nama_ayah: '',
    nama_ibu: '',
    hoby: '',
    pekerjaan: '',
    usia_menikah: '',
    kriteria_pasangan: '',
    tmpt_daerah: dataLogin?.akses_daerah,
    tmpt_desa: dataLogin?.akses_desa,
    tmpt_kelompok: dataLogin?.akses_kelompok,
    user_id: dataLogin?.id,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetchClient().post('/api/sensus/create', values);
      console.log(response);
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

  const jenisKelamin = [
    { value: 'LAKI-LAKI', label: 'LAKI-LAKI' },
    { value: 'PEREMPUAN', label: 'PEREMPUAN' },
  ];

  return (
    <>
      <Dialog header="Tambah Data Sensus" visible={visible} onHide={onHide} modal={true} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <Toast ref={toastRef} />
              <div className="row mt-3 mb-3">
                <div className="col-md-6 mb-3">
                  <label>Nama Lengkap</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_lengkap" name="nama_lengkap" className={errors.nama_lengkap && touched.nama_lengkap ? 'p-invalid' : ''} placeholder="Contoh: Dina A .K .A" />
                  </div>
                  <ErrorMessage name="nama_lengkap" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Panggilan</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_panggilan" name="nama_panggilan" className={errors.nama_panggilan && touched.nama_panggilan ? 'p-invalid' : ''} placeholder="Contoh: Dina" />
                  </div>
                  <ErrorMessage name="nama_panggilan" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Tempat Lahir</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="tempat_lahir" name="tempat_lahir" className={errors.tempat_lahir && touched.tempat_lahir ? 'p-invalid' : ''} placeholder="Contoh: London" />
                  </div>
                  <ErrorMessage name="tempat_lahir" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Tanggal Lahir</label>
                  <div className="row p-1">
                    <Field
                      as={Calendar}
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      className={errors.tanggal_lahir && touched.tanggal_lahir ? 'p-invalid' : ''}
                      value={null}
                      onChange={(e) => {
                        if (e.target.value) {
                          const selectedDate = new Date(e.target.value);
                          const year = selectedDate.getFullYear();
                          const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
                          const day = String(selectedDate.getDate()).padStart(2, '0');
                          const formattedDate = `${year}-${month}-${day}`;
                          setFieldValue('tanggal_lahir', formattedDate);
                        }
                      }}
                      showButtonBar
                      dateFormat="dd/mm/yy"
                      placeholder="Pilih Tanggal Lahir"
                      touchUI
                    />
                  </div>
                  <ErrorMessage name="tanggal_lahir" component="div" className="p-error" />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Alamat</label>
                  <div className="row p-1 m-1">
                    <Field as={InputTextarea} id="alamat" name="alamat" className={errors.alamat && touched.alamat ? 'p-invalid' : ''} placeholder="Isi Alamat" />
                  </div>
                  <ErrorMessage name="alamat" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Jenis Kelamin</label>
                  <div className="row p-1 m-1">
                    <Field as={Dropdown} id="jenis_kelamin" name="jenis_kelamin" options={jenisKelamin} className={errors.jenis_kelamin && touched.jenis_kelamin ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" />
                  </div>
                  <ErrorMessage name="jenis_kelamin" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Kontak Hp / WA</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} keyfilter="int" id="no_telepon" name="no_telepon" className={errors.no_telepon && touched.no_telepon ? 'p-invalid' : ''} placeholder="Contoh: 08945XXXX" />
                  </div>
                  <ErrorMessage name="no_telepon" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Bapak</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_ayah" name="nama_ayah" className={errors.nama_ayah && touched.nama_ayah ? 'p-invalid' : ''} placeholder="Contoh Bpk. Erik" />
                  </div>
                  <ErrorMessage name="nama_ayah" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Ibu</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_ibu" name="nama_ibu" className={errors.nama_ibu && touched.nama_ibu ? 'p-invalid' : ''} placeholder="Contoh: Ibu Erika" />
                  </div>
                  <ErrorMessage name="nama_ibu" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Hoby</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="hoby" name="hoby" className={errors.hoby && touched.hoby ? 'p-invalid' : ''} placeholder="Contoh: Menyanyi / Berkebun / DLL" />
                  </div>
                  <ErrorMessage name="hoby" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Pekerjaan</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="pekerjaan" name="pekerjaan" className={errors.pekerjaan && touched.pekerjaan ? 'p-invalid' : ''} placeholder="Contoh: Karyawan / PNS / Perawat / DLL" />
                  </div>
                  <ErrorMessage name="pekerjaan" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Usia Menikanh</label>
                  <span className="fw-semibold">
                    <i>*Tidak Wajib Diisi</i>
                  </span>
                  <div className="row p-1 m-1">
                    <Field as={InputText} keyfilter="int" id="usia_menikah" name="usia_menikah" className={errors.usia_menikah && touched.usia_menikah ? 'p-invalid' : ''} placeholder="Contoh: 25" />
                  </div>
                  <ErrorMessage name="usia_menikah" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Kriteria Pasangan</label>
                  <span className="fw-semibold">
                    <i>*Tidak Wajib Diisi</i>
                  </span>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="kriteria_pasangan" name="kriteria_pasangan" className={errors.kriteria_pasangan && touched.kriteria_pasangan ? 'p-invalid' : ''} placeholder="Contoh: baik / faham / lancar 5 bab / DLL" />
                  </div>
                  <ErrorMessage name="kriteria_pasangan" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Daerah</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="tmpt_daerah" name="tmpt_daerah" options={fetchDataDaerah} className={errors.tmpt_daerah && touched.tmpt_daerah ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled={dataLogin?.akses_daerah !== null} />
                  </div>
                  <ErrorMessage name="tmpt_daerah" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Desa</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="tmpt_desa" name="tmpt_desa" options={fetchDataDesa} className={errors.tmpt_desa && touched.tmpt_desa ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled={dataLogin?.akses_desa !== null} />
                  </div>
                  <ErrorMessage name="tmpt_desa" component="div" className="p-error" />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Nama Kelompok</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="tmpt_kelompok" name="tmpt_kelompok" options={fetchDataKelompok} className={errors.tmpt_kelompok && touched.tmpt_kelompok ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled={dataLogin?.akses_kelompok !== null} />
                  </div>
                  <ErrorMessage name="tmpt_kelompok" component="div" className="p-error" />
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button type="button" label="Batal" severity="info" size="small" onClick={onHide} outlined />
                  <Button type="submit" label="Simpan" severity="info" size="small" disabled={isSubmitting} />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default Tambah;
