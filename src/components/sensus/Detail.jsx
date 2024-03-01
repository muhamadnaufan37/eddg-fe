import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Detail = ({ detailData, visible, onHide, fetchDataDaerah, fetchDataDesa, fetchDataKelompok }) => {
  const toastRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const icon = <i className="pi pi-search"></i>;

  const initialValues = {
    id: detailData?.id,
    kode_cari_data: detailData?.kode_cari_data,
    nama_lengkap: detailData?.nama_lengkap,
    nama_panggilan: detailData?.nama_panggilan,
    tempat_lahir: detailData?.tempat_lahir,
    tanggal_lahir: detailData?.tanggal_lahir,
    alamat: detailData?.alamat,
    usia: detailData?.usia,
    jenis_kelamin: detailData?.jenis_kelamin,
    no_telepon: detailData?.no_telepon,
    nama_ayah: detailData?.nama_ayah,
    nama_ibu: detailData?.nama_ibu,
    hoby: detailData?.hoby,
    pekerjaan: detailData?.pekerjaan,
    usia_menikah: detailData?.usia_menikah,
    kriteria_pasangan: detailData?.kriteria_pasangan,
    tmpt_daerah: detailData?.id_daerah,
    tmpt_desa: detailData?.id_desa,
    tmpt_kelompok: detailData?.id_kelompok,
    status_pernikahan: detailData?.status_pernikahan,
    status_sambung: detailData?.status_sambung,
    status_kelas: detailData?.status_kelas,
    user_petugas: detailData?.user_petugas,
  };

  const jenisKelamin = [
    { value: 'LAKI-LAKI', label: 'LAKI-LAKI' },
    { value: 'PEREMPUAN', label: 'PEREMPUAN' },
  ];

  const statusPernikahan = [
    { value: false, label: 'Belum Menikah' },
    { value: true, label: 'Sudah Menikah' },
  ];

  const statusSambung = [
    { value: 0, label: 'Tidak Sambung' },
    { value: 1, label: 'Sambung' },
    { value: 2, label: 'Pindah Sambung' },
  ];

  const datatglLhari = (date) => {
    const originalDate = date;
    const dateParts = originalDate.split('-');
    const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

    return formattedDate;
  };

  useEffect(() => {
    if (detailData) {
      setDate(datatglLhari(detailData?.tanggal_lahir));
    }
  }, [detailData]);

  return (
    <>
      <Dialog header="Detail Data Sensus" visible={visible} onHide={onHide} modal={true} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <Formik initialValues={initialValues} validateOnChange={true} validateOnBlur={true}>
          {({ errors, touched }) => (
            <Form>
              <Toast ref={toastRef} />
              <div className="row mt-3 mb-3">
                <div className="col-md-12 mb-3">
                  <label>Kode Pencarian Data</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="kode_cari_data" name="kode_cari_data" className={errors.kode_cari_data && touched.kode_cari_data ? 'p-invalid' : ''} placeholder="-" disabled />
                  </div>
                  <ErrorMessage name="kode_cari_data" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Lengkap</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_lengkap" name="nama_lengkap" className={errors.nama_lengkap && touched.nama_lengkap ? 'p-invalid' : ''} placeholder="Contoh: Dina A .K .A" disabled />
                  </div>
                  <ErrorMessage name="nama_lengkap" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Panggilan</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_panggilan" name="nama_panggilan" className={errors.nama_panggilan && touched.nama_panggilan ? 'p-invalid' : ''} placeholder="Contoh: Dina" disabled />
                  </div>
                  <ErrorMessage name="nama_panggilan" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Tempat Lahir</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="tempat_lahir" name="tempat_lahir" className={errors.tempat_lahir && touched.tempat_lahir ? 'p-invalid' : ''} placeholder="Contoh: London" disabled />
                  </div>
                  <ErrorMessage name="tempat_lahir" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Tanggal Lahir</label>
                  <div className="row p-1">
                    <Field as={Calendar} id="tanggal_lahir" name="tanggal_lahir" className={errors.tanggal_lahir && touched.tanggal_lahir ? 'p-invalid' : ''} value={date} onChange={(e) => setDate(e.value)} showButtonBar dateFormat="dd/mm/yy" placeholder="Pilih Tanggal Lahir" touchUI disabled />
                  </div>
                  <ErrorMessage name="tanggal_lahir" component="div" className="p-error" />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Alamat</label>
                  <div className="row p-1 m-1">
                    <Field as={InputTextarea} id="alamat" name="alamat" className={errors.alamat && touched.alamat ? 'p-invalid' : ''} placeholder="Isi Alamat" disabled />
                  </div>
                  <ErrorMessage name="alamat" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Usia Saat Ini</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} keyfilter="int" id="usia" name="usia" className={errors.usia && touched.usia ? 'p-invalid' : ''} placeholder="Contoh: 25" disabled />
                  </div>
                  <ErrorMessage name="usia" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Jenis Kelamin</label>
                  <div className="row p-1 m-1">
                    <Field as={Dropdown} id="jenis_kelamin" name="jenis_kelamin" options={jenisKelamin} className={errors.jenis_kelamin && touched.jenis_kelamin ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                  </div>
                  <ErrorMessage name="jenis_kelamin" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Kontak Hp / WA</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} keyfilter="int" id="no_telepon" name="no_telepon" className={errors.no_telepon && touched.no_telepon ? 'p-invalid' : ''} placeholder="Contoh: 08945XXXX" disabled />
                  </div>
                  <ErrorMessage name="no_telepon" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Bapak</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_ayah" name="nama_ayah" className={errors.nama_ayah && touched.nama_ayah ? 'p-invalid' : ''} placeholder="Contoh Bpk. Erik" disabled />
                  </div>
                  <ErrorMessage name="nama_ayah" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Ibu</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="nama_ibu" name="nama_ibu" className={errors.nama_ibu && touched.nama_ibu ? 'p-invalid' : ''} placeholder="Contoh: Ibu Erika" disabled />
                  </div>
                  <ErrorMessage name="nama_ibu" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Hoby</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="hoby" name="hoby" className={errors.hoby && touched.hoby ? 'p-invalid' : ''} placeholder="Contoh: Menyanyi / Berkebun / DLL" disabled />
                  </div>
                  <ErrorMessage name="hoby" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Pekerjaan</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="pekerjaan" name="pekerjaan" className={errors.pekerjaan && touched.pekerjaan ? 'p-invalid' : ''} placeholder="Contoh: Karyawan / PNS / Perawat / DLL" disabled />
                  </div>
                  <ErrorMessage name="pekerjaan" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Usia Menikanh</label>
                  <span className="fw-semibold">
                    <i>*Tidak Wajib Diisi</i>
                  </span>
                  <div className="row p-1 m-1">
                    <Field as={InputText} keyfilter="int" id="usia_menikah" name="usia_menikah" className={errors.usia_menikah && touched.usia_menikah ? 'p-invalid' : ''} placeholder="Contoh: 25" disabled />
                  </div>
                  <ErrorMessage name="usia_menikah" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Kriteria Pasangan</label>
                  <span className="fw-semibold">
                    <i>*Tidak Wajib Diisi</i>
                  </span>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="kriteria_pasangan" name="kriteria_pasangan" className={errors.kriteria_pasangan && touched.kriteria_pasangan ? 'p-invalid' : ''} placeholder="Contoh: baik / faham / lancar 5 bab / DLL" disabled />
                  </div>
                  <ErrorMessage name="kriteria_pasangan" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Daerah</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="tmpt_daerah" name="tmpt_daerah" options={fetchDataDaerah} className={errors.tmpt_daerah && touched.tmpt_daerah ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                  </div>
                  <ErrorMessage name="tmpt_daerah" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Desa</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="tmpt_desa" name="tmpt_desa" options={fetchDataDesa} className={errors.tmpt_desa && touched.tmpt_desa ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                  </div>
                  <ErrorMessage name="tmpt_desa" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Nama Kelompok</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="tmpt_kelompok" name="tmpt_kelompok" options={fetchDataKelompok} className={errors.tmpt_kelompok && touched.tmpt_kelompok ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                  </div>
                  <ErrorMessage name="tmpt_kelompok" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status Kelas</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="status_kelas" name="status_kelas" className={errors.status_kelas && touched.status_kelas ? 'p-invalid' : ''} disabled />
                  </div>
                  <ErrorMessage name="status_kelas" component="div" className="p-error" />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status Pernikahan</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="status_pernikahan" name="status_pernikahan" options={statusPernikahan} className={errors.status_pernikahan && touched.status_pernikahan ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                  </div>
                  <ErrorMessage name="status_pernikahan" component="div" className="p-error" />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Status Sambung</label>
                  <div className="row p-1 m-1">
                    <Field filter as={Dropdown} id="status_sambung" name="status_sambung" options={statusSambung} className={errors.status_sambung && touched.status_sambung ? 'p-invalid' : ''} optionLabel="label" optionValue="value" placeholder="Pilih salah satu" disabled />
                  </div>
                  <ErrorMessage name="status_sambung" component="div" className="p-error" />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Diinput Oleh</label>
                  <div className="row p-1 m-1">
                    <Field as={InputText} id="user_petugas" name="user_petugas" className={errors.user_petugas && touched.user_petugas ? 'p-invalid' : ''} disabled />
                  </div>
                  <ErrorMessage name="user_petugas" component="div" className="p-error" />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Foto Peserta</label>
                  <div className="row p-1 m-1">
                    {/* {detailData?.image_url && <img src={detailData?.image_url} alt="Sensus Image" />} */}
                    {detailData?.image_url && <Image src={detailData?.image_url} indicatorIcon={icon} alt="Image" preview width="250" />}
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button type="button" label="Kembali" severity="info" size="small" onClick={onHide} outlined />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default Detail;
