import React, { useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Detail = ({ detailData, visible, onHide }) => {
  const toastRef = useRef(null);

  const initialValues = {
    id: detailData?.id,
    id_user: detailData?.nama_petugas,
    jenis_transaksi: detailData?.jenis_transaksi,
    tgl_transaksi: detailData?.tgl_transaksi,
    keterangan: detailData?.keterangan,
    jumlah: detailData?.jumlah,
  };

  const jenisTransaksiData = [
    { value: 'PEMASUKAN', label: 'Pemasukan' },
    { value: 'PENGELUARAN', label: 'Pengeluaran' },
  ];

  return (
    <>
      <Sidebar visible={visible} position="right" onHide={onHide} showCloseIcon={true} className="w-full md:w-20rem lg:w-30rem">
        <Formik initialValues={initialValues} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Detail Data Kas</h4>
              </div>

              <div className="mb-3">
                <label>Nama Petugas</label>
                <div className="row p-1 m-1">
                  <Field as={InputText} id="id_user" name="id_user" className={errors.id_user && touched.id_user ? 'p-invalid' : ''} placeholder="Contoh: Detail Data" disabled />
                </div>
                <ErrorMessage name="id_user" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Jenis Transaksi</label>
                <div className="row p-1 m-1">
                  <Field as={Dropdown} id="jenis_transaksi" name="jenis_transaksi" options={jenisTransaksiData} className={errors.jenis_transaksi && touched.jenis_transaksi ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
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
                    value={detailData?.tgl_transaksi ? new Date(detailData.tgl_transaksi) : null}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const formattedDate = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                      setFieldValue('tgl_transaksi', formattedDate);
                    }}
                    view="month"
                    dateFormat="mm/yy"
                    touchUI
                    placeholder="Masukan Bulan Pembayaran Kas"
                    disabled
                  />
                </div>
                <ErrorMessage name="tgl_transaksi" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label>Keterangan</label>
                <div className="row p-1 m-1">
                  <Field as={InputTextarea} id="keterangan" name="keterangan" className={errors.keterangan && touched.keterangan ? 'p-invalid' : ''} placeholder="Harap isi keterangan Pemasukan ataupun Pengeluaran dengan detail" rows={5} cols={30} disabled />
                </div>
                <ErrorMessage name="keterangan" component="div" className="p-error" />
              </div>

              <div className="mb-3">
                <label htmlFor="jumlah">jumlah</label>
                <div className="row p-1 m-1">
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">Rp.</span>
                    <InputNumber locale="id-ID" id="jumlah" name="jumlah" className={errors.jumlah && touched.jumlah ? 'p-invalid' : ''} value={values.jumlah} placeholder="Contoh: 500.000" onValueChange={(e) => setFieldValue('jumlah', e.value)} disabled />
                  </div>
                </div>
                <ErrorMessage name="jumlah" component="div" className="p-error" />
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
