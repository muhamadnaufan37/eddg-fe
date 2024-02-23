import React, { useEffect, useRef } from 'react';
import { signal } from '@preact/signals-react';
import { fetchClient } from '../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Accordion, AccordionTab } from 'primereact/accordion';
import debounce from 'lodash.debounce';

import '../assets/css/style.css';

// component form
import Tambah from './sensus/Tambah';
import Detail from './sensus/Detail';
import Edit from './sensus/Edit';

const error = signal(null);
const data = signal([]);
const loading = signal(true);
const globalFilter = signal('');
const kolom = signal('');
const visibleRight1 = signal(null);
const visibleRight2 = signal(null);
const visibleRight3 = signal(null);
const first = signal(0);
const rows = signal(10);
const page = signal(1);
const totalRecords = signal(0);
const selectedData = signal(null);
const deleteDialog = signal(false);
const viewSide = signal('ubah');

const userData = signal(null);
const dataUserId = signal(null);
const selectedOption = signal(null);
const filterDialog = signal(null);

const optionDataDaerah = signal('');
const optionDataDesa = signal('');
const optionDataKelompok = signal('');

const dataTempatDaerah = signal([]);
const dataTempatDesa = signal([]);
const dataTempatKelompok = signal([]);

const dataTempatParentDaerah = signal([]);
const dataTempatParentDesa = signal([]);
const dataTempatParentKelompok = signal([]);
const dataNew = signal([]);

export default function DigitalDataGenerus() {
  const toastRef = useRef(null);

  const storedUserData = JSON.parse(localStorage.getItem('user'));
  if (storedUserData) {
    dataNew.value = storedUserData;
  }

  const fetchData = async () => {
    try {
      loading.value = true;
      let response;
      if (dataNew.value?.role_id === 1) {
        response = await fetchClient().get(`/api/sensus/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}&data-daerah=${optionDataDaerah.value}&data-desa=${optionDataDesa.value}&data-kelompok=${optionDataKelompok.value}`);
      } else {
        response = await fetchClient().get(`/api/sensus/listByPtgs?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}`);
      }
      // const response = await fetchClient().get(`/api/sensus/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}&data-daerah=${optionDataDaerah.value}&data-desa=${optionDataDesa.value}&data-kelompok=${optionDataKelompok.value}`);
      data.value = response.data.data_sensus.data;
      totalRecords.value = response.data.data_sensus.total;
      loading.value = false;
    } catch (err) {
      error.value = err;
      loading.value = false;
    }
  };

  const fetchListDataDaerah = async () => {
    try {
      const response = await fetchClient().get(`/api/daerah/list`);
      dataTempatParentDaerah.value = response.data.data_daerah.data.map((items) => ({
        value: items.id,
        label: items.nama_daerah,
      }));
    } catch (error) {
      error.value = error;
    }
  };

  const fetchListDataDesa = async () => {
    try {
      const response = await fetchClient().get(`/api/desa/list`);
      dataTempatParentDesa.value = response.data.data_desa.data.map((items) => ({
        value: items.id,
        label: items.nama_desa,
      }));
    } catch (error) {
      error.value = error;
    }
  };

  const fetchListDataKelompok = async () => {
    try {
      const response = await fetchClient().get(`/api/kelompok/list`);
      dataTempatParentKelompok.value = response.data.data_kelompok.data.map((items) => ({
        value: items.id,
        label: items.nama_kelompok,
      }));
    } catch (error) {
      error.value = error;
    }
  };

  const fetchListDaerah = async () => {
    try {
      const response = await fetchClient().get(`/api/sensus/list_daerah`);
      dataTempatDaerah.value = response.data.data_tempat_sambung.map((items) => ({
        value: items.nama_daerah,
        label: items.nama_daerah,
      }));
    } catch (error) {
      error.value = error;
    }
  };

  const fetchListDesa = async () => {
    try {
      const response = await fetchClient().get(`/api/sensus/list_desa`);
      dataTempatDesa.value = response.data.data_tempat_sambung.map((items) => ({
        value: items.nama_desa,
        label: items.nama_desa,
      }));
    } catch (error) {
      error.value = error;
    }
  };

  const fetchListKelompok = async () => {
    try {
      const response = await fetchClient().get(`/api/sensus/list_kelompok`);
      dataTempatKelompok.value = response.data.data_tempat_sambung.map((items) => ({
        value: items.nama_kelompok,
        label: items.nama_kelompok,
      }));
    } catch (error) {
      error.value = error;
    }
  };

  const debounceSearch = debounce(() => {
    fetchData();
  }, 1000);

  const onSearch = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('keyword', globalFilter.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleSearchByChange = (event) => {
    kolom.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('kolom', kolom.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
  };

  const handleClear = () => {
    const searchParams = new URLSearchParams(window.location.search);
    globalFilter.value = '';
    kolom.value = '';

    if ((globalFilter.value, kolom.value)) {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
    } else {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
  };

  const handleReset = () => {
    const searchParams = new URLSearchParams(window.location.search);
    globalFilter.value = '';
    kolom.value = '';
    optionDataDaerah.value = '';
    optionDataDesa.value = '';
    optionDataKelompok.value = '';

    if ((globalFilter.value, kolom.value, optionDataDaerah.value, optionDataDesa.value, optionDataKelompok.value)) {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
      searchParams.set('data-daerah', optionDataDaerah.value);
      searchParams.set('data-desa', optionDataDesa.value);
      searchParams.set('data-kelompok', optionDataKelompok.value);
    } else {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('data-daerah');
      searchParams.delete('data-desa');
      searchParams.delete('data-kelompok');
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  const onSearchInputChange = (e) => {
    globalFilter.value = e.target.value;
  };

  const searchOptions = [
    { label: 'Semua', value: '' },
    { label: 'Kode Peserta', value: 'kode_cari_data' },
  ];

  const onPageChange = (event) => {
    page.value = event.page + 1;
    first.value = event.first;
    rows.value = event.rows;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', page.value);
    searchParams.set('per-page', rows.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  const onDeleteDialogHide = () => {
    deleteDialog.value = false;
  };

  const DetailDataFetch = async () => {
    try {
      const response = await fetchClient().post(`/api/sensus/edit`, { id: dataUserId.value });
      const userDataArray = response.data.data_sensus;
      userData.value = userDataArray;
      if (viewSide.value === 'ubah') {
        visibleRight3.value = true;
      } else {
        visibleRight2.value = true;
      }
    } catch (err) {
      error.value = err;
    }
  };

  const onDeleteData = async () => {
    try {
      const response = await fetchClient().delete(`/api/sensus/delete/`, { data: { id: selectedData.value.id } });
      const responseDatamessage = response.data;
      fetchData();
      selectedData.value = null;
      deleteDialog.value = false;
      if (responseDatamessage.success === true) {
        toastRef.current.show({
          severity: 'success',
          summary: 'Sukses',
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
      toastRef.current.show({
        severity: 'success',
        summary: 'Sukses',
        detail: 'Data berhasil dihapus',
        life: 3000,
      });
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
    }
  };

  const aksiDropdown = (data) => {
    const options = [
      {
        label: 'Detail',
        icon: 'pi pi-eye',
        action: () => {
          dataUserId.value = data.id;
          viewSide.value = 'detail';
          DetailDataFetch();
        },
      },
      {
        label: 'Ubah',
        icon: 'pi pi-pencil',
        action: () => {
          dataUserId.value = data.id;
          viewSide.value = 'ubah';
          DetailDataFetch();
        },
      },
      {
        label: 'Hapus',
        icon: 'pi pi-trash',
        action: () => {
          selectedData.value = data;
          deleteDialog.value = true;
        },
      },
    ];

    const optionTemplate = (option) => (
      <div className="p-d-flex p-ai-center" onClick={option.action} style={{ cursor: 'pointer' }}>
        <i className={`pi ${option.icon} p-mr-2`} />
        &nbsp;&nbsp;
        {option.label}
      </div>
    );

    return (
      <>
        <Dropdown value={selectedOption.value} options={options} optionLabel="label" itemTemplate={optionTemplate} placeholder="Pilih" />
      </>
    );
  };

  useEffect(() => {
    if (dataNew.value?.role_id === 1) {
      fetchData();
      fetchListDaerah();
      fetchListDesa();
      fetchListKelompok();
      fetchListDataDaerah();
      fetchListDataDesa();
      fetchListDataKelompok();
    } else {
      fetchData();
      fetchListDataDaerah();
      fetchListDataDesa();
      fetchListDataKelompok();
    }

    const searchParams = new URLSearchParams(window.location.search);
    page.value = 1;
    rows.value = 10;

    globalFilter.value = '';
    kolom.value = '';
    optionDataDaerah.value = '';
    optionDataDesa.value = '';
    optionDataKelompok.value = '';

    if ((globalFilter.value, kolom.value, optionDataDaerah.value, optionDataDesa.value, optionDataKelompok.value)) {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
      searchParams.set('data-daerah', optionDataDaerah.value);
      searchParams.set('data-desa', optionDataDesa.value);
      searchParams.set('data-kelompok', optionDataKelompok.value);
    } else {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('data-daerah');
      searchParams.delete('data-desa');
      searchParams.delete('data-kelompok');
    }

    searchParams.set('page', page.value);
    searchParams.set('per-page', rows.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
  }, []);

  const handleSidebarCreateHide = () => {
    visibleRight1.value = false;
  };

  const handleSidebarDetailHide = () => {
    visibleRight2.value = false;
  };

  const handleSidebarEditHide = () => {
    visibleRight3.value = false;
  };

  const statusSambungInfo = {
    2: {
      className: 'c-pill c-pill--secondary',
      text: 'Pindah Sambung',
    },
    1: {
      className: 'c-pill c-pill--success',
      text: 'Sambung',
    },
    0: {
      className: 'c-pill c-pill--danger',
      text: 'Tidak Sambung',
    },
    null: {
      text: 'null',
    },
  };

  const statusPernikahanInfo = {
    true: {
      className: 'c-pill c-pill--info',
      text: 'Sudah Menikah',
    },
    false: {
      className: 'c-pill c-pill--warning',
      text: 'Belum Menikah',
    },
    null: {
      text: 'null',
    },
  };

  const statusSambungBodyTemplate = (data) => {
    const statusSambung = statusSambungInfo[data.status_sambung];
    return (
      <>
        <span className={statusSambung.className}>{statusSambung.text}</span>
      </>
    );
  };

  const statusPernikahanBodyTemplate = (data) => {
    const statusSambung = statusPernikahanInfo[data.status_pernikahan];
    return (
      <>
        <span className={statusSambung.className}>{statusSambung.text}</span>
      </>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const onFilterDialogHide = () => {
    filterDialog.value = false;
  };

  const handleClearFilter = () => {
    const searchParams = new URLSearchParams(window.location.search);
    optionDataDaerah.value = '';
    optionDataDesa.value = '';
    optionDataKelompok.value = '';

    if ((optionDataDaerah.value, optionDataDesa.value, optionDataKelompok.value)) {
      searchParams.delete('data-daerah');
      searchParams.delete('data-desa');
      searchParams.delete('data-kelompok');
    } else {
      searchParams.set('data-daerah', optionDataDaerah.value);
      searchParams.set('data-desa', optionDataDesa.value);
      searchParams.set('data-kelompok', optionDataKelompok.value);
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  const handleOptionFilterDaerah = (event) => {
    optionDataDaerah.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('data-daerah', optionDataDaerah.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleOptionFilterDesa = (event) => {
    optionDataDesa.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('data-desa', optionDataDesa.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleOptionFilterKelompok = (event) => {
    optionDataKelompok.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('data-kelompok', optionDataKelompok.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  return (
    <>
      <div className="card card-main-content">
        <div className="card-body">
          <div className="fw-semibold fs-3 mb-4">Data Digital Generus</div>
          <Toast ref={toastRef} />
          {error.value && <div>{error.value.message}</div>}
          <div className="card card-toolbar-filter mb-5">
            <div className="card-body">
              <div className="row align-items-center">
                {dataNew.value?.role_id === 1 ? (
                  <>
                    <div className="col-12 xl:col-2 lg:col-12 md:col-12 sm:col-12">
                      <Button
                        className="w-100"
                        label="Filter"
                        icon="pi pi-filter"
                        severity="info"
                        size="small"
                        onClick={() => {
                          filterDialog.value = true;
                        }}
                        outlined
                      />
                    </div>
                    <div className="col-12 xl:col-6 lg:col-12 md:col-12 sm:col-12">
                      <div className="row">
                        <div className="col-4 pr-0">
                          <Dropdown className="w-100 search-form-wrapper__dropdown" value={kolom.value} options={searchOptions} onChange={handleSearchByChange} />
                        </div>
                        <div className="col-8 pl-0 search-form-wrapper__input-wrapper">
                          <InputText
                            className="w-100 search-form-wrapper__input-wrapper__input-text"
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                onSearch();
                              }
                            }}
                            value={globalFilter.value}
                            onChange={onSearchInputChange}
                            placeholder="Cari Data Sensus"
                          />
                          <button hidden={globalFilter.value.length > 0 ? false : true} onClick={handleClear} className="search-form-wrapper__input-wrapper__clear-button">
                            <i className="pi pi-times" style={{ fontSize: '0.7rem', color: 'white', fontWeight: '1rem' }}></i>
                          </button>
                          <i className="pi pi-search search-form-wrapper__input-wrapper__magnifier-icon" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-12 xl:col-8 lg:col-12 md:col-12 sm:col-12">
                    <div className="row">
                      <div className="col-4 pr-0">
                        <Dropdown className="w-100 search-form-wrapper__dropdown" value={kolom.value} options={searchOptions} onChange={handleSearchByChange} />
                      </div>
                      <div className="col-8 pl-0 search-form-wrapper__input-wrapper">
                        <InputText
                          className="w-100 search-form-wrapper__input-wrapper__input-text"
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              onSearch();
                            }
                          }}
                          value={globalFilter.value}
                          onChange={onSearchInputChange}
                          placeholder="Cari Data Sensus"
                        />
                        <button hidden={globalFilter.value.length > 0 ? false : true} onClick={handleClear} className="search-form-wrapper__input-wrapper__clear-button">
                          <i className="pi pi-times" style={{ fontSize: '0.7rem', color: 'white', fontWeight: '1rem' }}></i>
                        </button>
                        <i className="pi pi-search search-form-wrapper__input-wrapper__magnifier-icon" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-12 xl:col-2 lg:col-12 md:col-12 sm:col-12 d-flex">
                  <Button
                    className="w-100 my-auto"
                    label="Tambah"
                    icon="pi pi-plus"
                    onClick={() => {
                      visibleRight1.value = true;
                    }}
                    severity="info"
                    size="small"
                  />
                </div>
                <div className="col-12 xl:col-2 lg:col-12 md:col-12 sm:col-12">
                  <Button className="w-100" label="Reset" icon="pi pi-replay" onClick={handleReset} severity="danger" size="small" />
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <DataTable value={data.value} showGridlines stripedRows loading={loading.value} emptyMessage="Belum ada data" className="p-datatable-sm">
              <Column
                field="nomor"
                header="No"
                body={(row, index) => {
                  return <span className="text-center">{index.rowIndex + 1}</span>;
                }}
                bodyClassName="text-center"
              />
              <Column field="kode_cari_data" header="Kode Cari" />
              <Column field="nama_lengkap" header="Nama Lengkap" />
              <Column field="nama_daerah" header="Daerah" />
              <Column field="nama_desa" header="Desa" />
              <Column field="nama_kelompok" header="Kelompok" />
              <Column field="status_kelas" header="Kelas" />
              <Column body={statusSambungBodyTemplate} header="Status Sambung" bodyClassName="text-center" />
              <Column body={statusPernikahanBodyTemplate} header="Status Pernikahan" bodyClassName="text-center" />
              <Column field="user_petugas" header="Diinput Oleh" />
              <Column field="created_at" body={(rowData) => <span className="text-center">{formatDate(rowData.created_at || '')}</span>} bodyClassName="text-center" header="Tanggal Input" />
              <Column field="Aksi" header="Aksi" body={aksiDropdown} bodyClassName="text-center"></Column>
            </DataTable>
            <Paginator first={first.value} rows={rows.value} totalRecords={totalRecords.value} onPageChange={onPageChange} rowsPerPageOptions={[10, 20, 30, 40, 50]} template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" className="justify-content-end" />
          </div>
        </div>
      </div>

      <Dialog
        className="dialog-class mt-3 mb-3"
        visible={filterDialog.value}
        onHide={onFilterDialogHide}
        header="Filter"
        modal={true}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        footer={
          <>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button label="Hapus semua filter" size="small" onClick={handleClearFilter} text />
            </div>
          </>
        }
      >
        <Accordion>
          <AccordionTab header="Nama Daerah">
            {dataTempatDaerah.value?.map((optionDaerah) => (
              <div key={optionDaerah.value}>
                <Checkbox inputId={optionDaerah.value} name="optionDaerah" value={optionDaerah.value} onChange={handleOptionFilterDaerah} checked={optionDataDaerah.value === optionDaerah.value} />
                <label htmlFor={optionDaerah.value}>&nbsp;{optionDaerah.label}</label>
              </div>
            ))}
          </AccordionTab>
          <AccordionTab header="Nama Desa">
            {dataTempatDesa.value?.map((optionDesa) => (
              <div key={optionDesa.value}>
                <Checkbox inputId={optionDesa.value} name="optionDesa" value={optionDesa.value} onChange={handleOptionFilterDesa} checked={optionDataDesa.value === optionDesa.value} />
                <label htmlFor={optionDesa.value}>&nbsp;{optionDesa.label}</label>
              </div>
            ))}
          </AccordionTab>
          <AccordionTab header="Nama Kelompok">
            {dataTempatKelompok.value?.map((optionKelompok) => (
              <div key={optionKelompok.value}>
                <Checkbox inputId={optionKelompok.value} name="optionKelompok" value={optionKelompok.value} onChange={handleOptionFilterKelompok} checked={optionDataKelompok.value === optionKelompok.value} />
                <label htmlFor={optionKelompok.value}>&nbsp;{optionKelompok.label}</label>
              </div>
            ))}
          </AccordionTab>
        </Accordion>
      </Dialog>

      {/* Dialog Hapus Data role */}
      <Dialog
        visible={deleteDialog.value}
        onHide={onDeleteDialogHide}
        header="Konfirmasi Hapus Data"
        modal
        footer={
          <>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button label="Batal" onClick={onDeleteDialogHide} severity="info" size="small" outlined />
              <Button label="Ya, Hapus Sekarang" onClick={onDeleteData} severity="danger" size="small" />
            </div>
          </>
        }
      >
        Apakah Anda yakin ingin <b>Menghapus data tersebut?</b>
      </Dialog>

      {/* manggil ke component form tambah role */}
      <Tambah dataLogin={dataNew.value} visible={visibleRight1.value} onHide={handleSidebarCreateHide} fetchData={fetchData} fetchDataDaerah={dataTempatParentDaerah.value} fetchDataDesa={dataTempatParentDesa.value} fetchDataKelompok={dataTempatParentKelompok.value} />

      {/* manggil ke component form detail role */}
      <Detail detailData={userData.value} visible={visibleRight2.value} onHide={handleSidebarDetailHide} fetchDataDaerah={dataTempatParentDaerah.value} fetchDataDesa={dataTempatParentDesa.value} fetchDataKelompok={dataTempatParentKelompok.value} />

      {/* manggil ke component form detail role */}
      <Edit detailData={userData.value} visible={visibleRight3.value} onHide={handleSidebarEditHide} fetchData={fetchData} fetchDataDaerah={dataTempatParentDaerah.value} fetchDataDesa={dataTempatParentDesa.value} fetchDataKelompok={dataTempatParentKelompok.value} />
    </>
  );
}
