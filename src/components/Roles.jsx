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
import debounce from 'lodash.debounce';

// component form
import Tambah from './roles/Tambah';
import Detail from './roles/Detail';
import Edit from './roles/Edit';

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

export default function Roles() {
  const toastRef = useRef(null);
  const fetchData = async () => {
    try {
      loading.value = true;
      const response = await fetchClient().get(`/api/role/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}`);
      data.value = response.data.data_role.data;
      totalRecords.value = response.data.data_role.total;
      loading.value = false;
    } catch (err) {
      error.value = err;
      loading.value = false;
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

    if (globalFilter.value) {
      searchParams.delete('keyword');
    } else {
      searchParams.set('keyword', globalFilter.value);
    }

    if (kolom.value) {
      searchParams.delete('kolom');
    } else {
      searchParams.set('kolom', kolom.value);
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
  };

  const onSearchInputChange = (e) => {
    globalFilter.value = e.target.value;
  };

  const searchOptions = [
    { label: 'Semua', value: '' },
    { label: 'Nama', value: 'name' },
    { label: 'Deskripsi', value: 'description' },
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
      const response = await fetchClient().post(`/api/role/edit`, { id: dataUserId.value });
      const userDataArray = response.data.data_role;
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
      const response = await fetchClient().delete(`/api/role/delete/`, { data: { id: selectedData.value.id } });
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
    fetchData();

    const searchParams = new URLSearchParams(window.location.search);
    page.value = parseInt(searchParams.get('page') || 1);
    rows.value = parseInt(searchParams.get('per-page') || 10);

    globalFilter.value = '';
    kolom.value = '';

    if ((globalFilter.value, kolom.value)) {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
    } else {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
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

  let counter = 1;

  return (
    <>
      <div className="card card-main-content">
        <div className="card-body">
          <div className="fw-semibold fs-3 mb-4">Role</div>
          <Toast ref={toastRef} />
          {error.value && <div>{error.value.message}</div>}
          <div className="card card-toolbar-filter mb-5">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-12 sm:col-10 lg:col-10">
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
                        placeholder="Cari Role"
                      />
                      <button hidden={globalFilter.value.length > 0 ? false : true} onClick={handleClear} className="search-form-wrapper__input-wrapper__clear-button">
                        <i className="pi pi-times" style={{ fontSize: '0.7rem', color: 'white', fontWeight: '1rem' }}></i>
                      </button>
                      <i className="pi pi-search search-form-wrapper__input-wrapper__magnifier-icon" />
                    </div>
                  </div>
                </div>

                <div className="col-12 sm:col-12 lg:col-2 d-flex">
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
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <DataTable value={data.value} showGridlines stripedRows loading={loading.value} dataKey="id" globalFilterFields={['user_name', 'email', 'status']} emptyMessage="Belum ada data" className="p-datatable-sm">
              <Column field="nomor" header="No" body={() => counter++} bodyClassName="text-center" />
              <Column field="name" header="Nama" />
              <Column field="description" header="Deskripsi" />
              <Column field="users_count" header="Jumlah User" />
              <Column field="Aksi" header="Aksi" body={aksiDropdown} bodyClassName="text-center"></Column>
            </DataTable>
            <Paginator first={first.value} rows={rows.value} totalRecords={totalRecords.value} onPageChange={onPageChange} rowsPerPageOptions={[10, 20, 30, 40, 50]} template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" className="justify-content-end" />

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
            <Tambah visible={visibleRight1.value} onHide={handleSidebarCreateHide} fetchData={fetchData} />

            {/* manggil ke component form detail role */}
            <Detail detailData={userData.value} visible={visibleRight2.value} onHide={handleSidebarDetailHide} />

            {/* manggil ke component form detail role */}
            <Edit detailData={userData.value} visible={visibleRight3.value} onHide={handleSidebarEditHide} fetchData={fetchData} />
          </div>
        </div>
      </div>
    </>
  );
}
