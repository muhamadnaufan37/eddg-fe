import React, { useRef } from 'react';
import { fetchClient } from '../../utils/axios';
import { deleteUserInfo } from '../../store';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Tambah = ({ totalNominalKas, balikanLogin, fetchData, visible, onHide }) => {
  const toastRef = useRef(null);
  const cekDataTotalKas = parseInt(totalNominalKas);

  const validationSchema = Yup.object().shape({
    jenis_transaksi: Yup.string().required('Jenis Transaksi harus diisi'),
    tgl_transaksi: Yup.string().required('Bulan Transaksi harus diisi'),
    keterangan: Yup.string().required('Keterangan harus diisi'),
    jumlah: Yup.string().required('Jumlah harus diisi'),
  });

  const initialValues = {
    id_user: balikanLogin?.id,
    jenis_transaksi: '',
    tgl_transaksi: '',
    keterangan: '',
    jumlah: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetchClient().post('/api/wallet_kas/create', values);
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
      if (error.response) {
        if (error.response.status === 401) {
          // Penanganan status HTTP 401 (Unauthorized)
          try {
            deleteUserInfo();
            window.location.href = '/';
          } catch (logoutError) {
            toastRef.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Oops.. ada kesalahan sistem, silahkan coba lagi.',
              life: 3000,
            });
          }
        } else if (error.response.status === 500) {
          // Penanganan status HTTP 500 (Internal Server Error)
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Oops.. ada kesalahan sistem, silahkan coba secara berkala.',
            life: 3000,
          });
        } else {
          // Penanganan status HTTP lainnya
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const jenisTransaksiData = [
    { value: 'PEMASUKAN', label: 'Pemasukan' },
    { value: 'PENGELUARAN', label: 'Pengeluaran' },
  ];

  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = nextMonth === 0 ? year + 1 : year;

  let maxDate = new Date();

  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  return (
    <>
      <Sidebar visible={visible} position="right" onHide={onHide} showCloseIcon={true} className="w-full md:w-20rem lg:w-30rem">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Tambah Data Kas</h4>
              </div>

              <div className="mb-3">
                <label>Jenis Transaksi</label>
                <div className="row p-1 m-1">
                  <Field as={Dropdown} id="jenis_transaksi" name="jenis_transaksi" options={jenisTransaksiData} className={errors.jenis_transaksi && touched.jenis_transaksi ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" />
                </div>
                <ErrorMessage name="jenis_transaksi" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Bulan dan Tahun Transaksi</label>
                <div className="row p-1 m-1">
                  <Field
                    as={Calendar}
                    id="tgl_transaksi"
                    name="tgl_transaksi"
                    className={errors.tgl_transaksi && touched.tgl_transaksi ? 'p-invalid' : ''}
                    value={null}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
                      const day = String(selectedDate.getDate()).padStart(2, '0');
                      const formattedDate = `${year}-${month}-${day}`;
                      setFieldValue('tgl_transaksi', formattedDate);
                    }}
                    maxDate={new Date()}
                    view="month"
                    dateFormat="mm/yy"
                    touchUI
                    placeholder="Masukan Bulan Pembayaran Kas"
                  />
                </div>
                <ErrorMessage name="tgl_transaksi" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Keterangan</label>
                <div className="row p-1 m-1">
                  <Field as={InputTextarea} id="keterangan" name="keterangan" className={errors.keterangan && touched.keterangan ? 'p-invalid' : ''} placeholder="Harap isi keterangan Pemasukan ataupun Pengeluaran dengan detail" rows={5} cols={30} />
                </div>
                <ErrorMessage name="keterangan" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="jumlah">jumlah</label>
                <div className="row p-1 m-1">
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">Rp.</span>
                    <InputNumber locale="id-ID" id="jumlah" name="jumlah" className={errors.jumlah && touched.jumlah ? 'p-invalid' : ''} value={values.jumlah} placeholder="Contoh: 500.000" onValueChange={(e) => setFieldValue('jumlah', e.value)} />
                  </div>
                </div>
                <span>Total Pemasukan: {new Intl.NumberFormat('id-ID').format(cekDataTotalKas)}</span>
                {values.jenis_transaksi === 'PENGELUARAN' && values.jumlah > cekDataTotalKas && <div className="p-error">Jumlah Pengeluaran tidak boleh melebihi total pemasukan</div>}
                <ErrorMessage name="jumlah" component="div" className="p-error" />
              </div>

              <Toast ref={toastRef} />

              <div className="mb-3 d-grid gap-2">
                <Button type="submit" label="Simpan" severity="info" size="small" disabled={(values.jenis_transaksi === 'PENGELUARAN' && values.jumlah > cekDataTotalKas) || isSubmitting} />
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
