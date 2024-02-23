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

import '../assets/css/badgesPengumuman.scss';

// component form
import Tambah from './pengumuman/Tambah';
import Detail from './pengumuman/Detail';
import Edit from './pengumuman/Edit';

const error = signal(null);
const data = signal([]);
const loading = signal(true);
const globalFilter = signal('');
const kolom = signal('');
const statusPengumumanData = signal('');
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
const filterDialog = signal(null);
const selectedOption = signal(null);

const dataNew = signal([]);

export default function Pengumuman() {
  const toastRef = useRef(null);

  const storedUserData = JSON.parse(localStorage.getItem('user'));
  if (storedUserData) {
    dataNew.value = storedUserData;
  }

  const fetchData = async () => {
    try {
      loading.value = true;
      const response = await fetchClient().get(`/api/boardcast/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}&status=${statusPengumumanData.value}`);
      data.value = response.data.data_boardcast.data;
      totalRecords.value = response.data.data_boardcast.total;
      loading.value = false;
    } catch (err) {
      error.value = err;
      loading.value = false;
    }
  };

  const debounceSearch = debounce(() => {
    fetchData();
  }, 1000);

  const handleOptionChangeStatus = (event) => {
    statusPengumumanData.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('status', statusPengumumanData.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

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
    statusPengumumanData.value = '';

    if ((globalFilter.value, kolom.value, statusPengumumanData.value)) {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('status');
    } else {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
      searchParams.set('status', statusPengumumanData.value);
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  const handleClearFilter = () => {
    const searchParams = new URLSearchParams(window.location.search);
    statusPengumumanData.value = '';

    if (statusPengumumanData.value) {
      searchParams.delete('status');
    } else {
      searchParams.set('status', statusPengumumanData.value);
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  const onSearchInputChange = (e) => {
    globalFilter.value = e.target.value;
  };

  const onClearSearchInput = () => {
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

  const statusInfoAkun = [
    { label: 'Hanya Perorangan', value: 3 },
    { label: 'Penting', value: 2 },
    { label: 'Pengumuman', value: 1 },
  ];

  const searchOptions = [
    { label: 'Semua', value: '' },
    { label: 'Nama Penginput', value: 'nama_lengkap' },
    { label: 'Judul Pengumuman', value: 'judul_broadcast' },
  ];

  const statusInfo = {
    3: {
      className: 'badge badge-purple',
      text: 'Hanya Perorangan',
    },
    2: {
      className: 'badge badge-red',
      text: 'Penting',
    },
    1: {
      className: 'badge badge-yellow',
      text: 'Pengumuman',
    },
    0: {
      className: 'badge badge-default',
      text: 'null',
    },
  };

  const jenisPengumumanBodyTemplate = (data) => {
    const status = statusInfo[data.jenis_broadcast];
    return (
      <>
        <span className={status.className}>{status.text}</span>
      </>
    );
  };

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

  const onFilterDialogHide = () => {
    filterDialog.value = false;
  };

  const onDeleteDialogHide = () => {
    deleteDialog.value = false;
  };

  const DetailDataFetch = async () => {
    try {
      const response = await fetchClient().post(`/api/boardcast/edit`, { id: dataUserId.value });
      const userDataArray = response.data.data_boardcast;
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
      const response = await fetchClient().delete(`/api/boardcast/delete`, { data: { id: selectedData.value.id } });
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

  const handleSidebarCreateHide = () => {
    visibleRight1.value = false;
  };

  const handleSidebarDetailHide = () => {
    visibleRight2.value = false;
  };

  const handleSidebarEditHide = () => {
    visibleRight3.value = false;
  };

  useEffect(() => {
    fetchData();

    const searchParams = new URLSearchParams(window.location.search);
    page.value = 1;
    rows.value = 10;
    globalFilter.value = '';
    kolom.value = '';
    statusPengumumanData.value = '';

    if ((globalFilter.value, kolom.value, statusPengumumanData.value)) {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
      searchParams.set('status', statusPengumumanData.value);
    } else {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('status');
    }

    searchParams.set('page', page.value);
    searchParams.set('per-page', rows.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
  }, []);

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
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="fw-semibold fs-3 mb-3">Pengumuman</div>
          <Toast ref={toastRef} />
          {error.value && <div className="text-danger mb-3">{error.value.message}</div>}
          <div className="card card-toolbar-filter mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-12 sm:col-2 lg:col-2">
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

                <div className="col-12 sm:col-10 lg:col-7">
                  <div className="row search-form-wrapper__input-group">
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
                        placeholder="Cari Pengumuman"
                      />
                      <button hidden={globalFilter.value.length > 0 ? false : true} onClick={() => onClearSearchInput()} className="search-form-wrapper__input-wrapper__clear-button">
                        <i className="pi pi-times" style={{ fontSize: '0.7rem', color: 'white', fontWeight: '1rem' }}></i>
                      </button>
                      <i className="pi pi-search search-form-wrapper__input-wrapper__magnifier-icon" />
                    </div>
                  </div>
                </div>

                <div className="col-12 sm:col-12 lg:col-3">
                  <div className="d-grid gap-2">
                    <div className="row">
                      <div className="col-12 lg:col-6">
                        <Button className="w-100" label="Reset" icon="pi pi-replay" onClick={handleClear} severity="danger" size="small" />
                      </div>
                      <div className="col-12 lg:col-6">
                        <Button
                          className="w-100"
                          label="Tambah"
                          icon="pi pi-plus"
                          onClick={() => {
                            visibleRight1.value = true;
                          }}
                          severity="info"
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <DataTable value={data.value} showGridlines stripedRows loading={loading.value} dataKey="id" globalFilterFields={['user_name', 'email', 'status']} emptyMessage="Belum ada data" className="p-datatable-sm">
              <Column
                field="nomor"
                header="No"
                body={(row, index) => {
                  return <span className="text-center">{index.rowIndex + 1}</span>;
                }}
                bodyClassName="text-center"
              />
              <Column field="nama_petugas" header="Diinput Oleh" />
              <Column field="judul_broadcast" header="Judul Pengumuman" />
              <Column field="jenis_broadcast" header="Status Pengumuman" body={jenisPengumumanBodyTemplate} bodyClassName="text-center" style={{ width: '15%' }} />
              <Column field="created_at" header="Tanggal Dibuat" body={(rowData) => <span className="text-center">{formatDate(rowData.created_at || '')}</span>} bodyClassName="text-center" />
              <Column field="Aksi" header="Aksi" body={aksiDropdown} bodyClassName="text-center"></Column>
            </DataTable>
            <Paginator first={first.value} rows={rows.value} totalRecords={totalRecords.value} onPageChange={onPageChange} rowsPerPageOptions={[10, 20, 30, 40, 50]} template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" className="justify-content-end" />
          </div>

          {/* Dialog Hapus Data User */}
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

          {/* Dialog Filter Data User */}
          <Dialog
            className="dialog-class mt-3 mb-3"
            visible={filterDialog.value}
            onHide={onFilterDialogHide}
            header="Filter"
            modal
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
              <AccordionTab header="Status Pengumuman">
                {statusInfoAkun.map((optionStatus) => (
                  <div key={optionStatus.value}>
                    <Checkbox inputId={optionStatus.value} name="optionStatus" value={optionStatus.value} onChange={handleOptionChangeStatus} checked={statusPengumumanData.value === optionStatus.value} />
                    <label htmlFor={optionStatus.value}>&nbsp;{optionStatus.label}</label>
                  </div>
                ))}
              </AccordionTab>
            </Accordion>
          </Dialog>

          {/* manggil ke component form tambah user */}
          <Tambah balikanLogin={dataNew.value} visible={visibleRight1.value} onHide={handleSidebarCreateHide} fetchData={fetchData} />

          {/* manggil ke component form detail user */}
          <Detail detailData={userData.value} visible={visibleRight2.value} onHide={handleSidebarDetailHide} />

          {/* manggil ke component form detail user */}
          <Edit detailData={userData.value} visible={visibleRight3.value} onHide={handleSidebarEditHide} fetchData={fetchData} />
        </div>
      </div>
    </>
  );
}
