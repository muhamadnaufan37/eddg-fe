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

// component form
import Tambah from './user/Tambah';
import Detail from './user/Detail';
import Edit from './user/Edit';

const error = signal(null);
const data = signal([]);
const loading = signal(true);
const globalFilter = signal('');
const kolom = signal('');
const roleAkun = signal('');
const statusAkun = signal('');
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

const rolesUser = signal([]);
const loadingRolesUser = signal(true);
const errorFetchingRolesUser = signal(false);
const rowsFetchUser = signal(100);
const pageFetchUser = signal(1);
const totalPagesFetchUser = signal(0);
const errorFetchUser = signal(null);

const userData = signal(null);
const dataUserId = signal(null);
const filterDialog = signal(null);
const selectedOption = signal(null);

const fetchDataDaerah = signal([]);
const fetchDataDesa = signal([]);
const fetchDataKelompok = signal([]);

export default function ListUser() {
  const toastRef = useRef(null);
  const fetchData = async () => {
    try {
      loading.value = true;
      const response = await fetchClient().get(`/api/user/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}&role=${roleAkun.value}&status=${statusAkun.value}`);
      data.value = response.data.data_user.data;
      totalRecords.value = response.data.data_user.total;
      loading.value = false;
    } catch (err) {
      error.value = err;
      loading.value = false;
    }
  };

  const fetchRoles = async () => {
    try {
      const resFirstCallRoles = await fetchClient().get(`/api/role/list?page=${pageFetchUser.value}&per-page=${rowsFetchUser.value}`);
      totalPagesFetchUser.value = resFirstCallRoles.data.data_role.last_page;
      rolesUser.value.push(
        ...resFirstCallRoles.data.data_role.data.map((option) => ({
          value: option.id,
          label: option.name,
        }))
      );
      loadingRolesUser.value = false;

      if (totalPagesFetchUser.value > 1) {
        for (let pages = 2; pages <= totalPagesFetchUser.value; pages++) {
          const resApiRoles = await fetchClient().get(`/api/role/list?page=${pages}&per-page=${rowsFetchUser.value}`);
          rolesUser.value.push(
            ...resApiRoles.data.data_role.data.map((option) => ({
              value: option.id,
              label: option.name,
            }))
          );
        }
      }
    } catch (err) {
      errorFetchingRolesUser.value = true;
      errorFetchUser.value = err;
    }
  };

  const fetchDaerah = async () => {
    try {
      const response = await fetchClient().get(`/api/daerah/list`);
      fetchDataDaerah.value = response.data.data_daerah.data.map((option) => ({
        value: option.id,
        label: option.nama_daerah,
      }));
    } catch (err) {
      error.value = err;
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await fetchClient().get(`/api/desa/list`);
      fetchDataDesa.value = response.data.data_desa.data.map((option) => ({
        value: option.id,
        label: option.nama_desa,
      }));
    } catch (err) {
      error.value = err;
    }
  };

  const fetchKelompok = async () => {
    try {
      const response = await fetchClient().get(`/api/kelompok/list`);
      fetchDataKelompok.value = response.data.data_kelompok.data.map((option) => ({
        value: option.id,
        label: option.nama_kelompok,
      }));
    } catch (err) {
      error.value = err;
    }
  };

  const debounceSearch = debounce(() => {
    fetchData();
  }, 1000);

  const handleOptionChangeRoles = (event) => {
    roleAkun.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('role', roleAkun.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleOptionChangeStatus = (event) => {
    statusAkun.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('status', statusAkun.value);
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
    roleAkun.value = '';
    statusAkun.value = '';

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
    if (roleAkun.value) {
      searchParams.delete('role');
    } else {
      searchParams.set('role', roleAkun.value);
    }
    if (statusAkun.value) {
      searchParams.delete('status');
    } else {
      searchParams.set('status', statusAkun.value);
    }
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  const handleClearFilter = () => {
    const searchParams = new URLSearchParams(window.location.search);
    roleAkun.value = '';
    statusAkun.value = '';

    if (roleAkun.value) {
      searchParams.delete('role');
    } else {
      searchParams.set('role', roleAkun.value);
    }
    if (statusAkun.value) {
      searchParams.delete('status');
    } else {
      searchParams.set('status', statusAkun.value);
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

  const statusInfoAkun = [
    { label: 'Aktif', value: 1 },
    { label: 'Tidak Aktif', value: 0 },
    { label: 'Blokir', value: -1 },
  ];

  const searchOptions = [
    { label: 'Semua', value: '' },
    { label: 'Username', value: 'username' },
    { label: 'Email', value: 'email' },
    { label: 'Nama', value: 'nama' },
  ];

  const statusInfo = {
    '-1': {
      className: 'c-pill c-pill--secondary',
      text: 'Blokir',
    },
    1: {
      className: 'c-pill c-pill--success',
      text: 'Aktif',
    },
    0: {
      className: 'c-pill c-pill--danger',
      text: 'Tidak Aktif',
    },
    null: {
      text: 'null',
    },
  };

  const statusBodyTemplate = (data) => {
    const status = statusInfo[data.status];
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
      const response = await fetchClient().post(`/api/user/edit`, { id: dataUserId.value });
      const userDataArray = response.data.data_user;
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
      const response = await fetchClient().delete(`/api/user/delete`, { data: { id: selectedData.value.id } });
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
    fetchRoles();
    fetchDaerah();
    fetchDesa();
    fetchKelompok();

    const searchParams = new URLSearchParams(window.location.search);
    page.value = parseInt(searchParams.get('page') || 1);
    rows.value = parseInt(searchParams.get('per-page') || 10);

    globalFilter.value = '';
    kolom.value = '';
    roleAkun.value = '';
    statusAkun.value = '';

    if ((globalFilter.value, kolom.value, roleAkun.value, statusAkun.value)) {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
      searchParams.set('role', roleAkun.value);
      searchParams.set('status', statusAkun.value);
    } else {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('role');
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
          <div className="fw-semibold fs-3 mb-3">User</div>
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
                        placeholder="Cari User"
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
              <Column field="username" header="Username" />
              <Column field="email" header="Email" />
              <Column field="nama_lengkap" header="Nama" />
              <Column field="role_id" header="Role" bodyClassName="text-center" />
              <Column field="status" header="Status" body={statusBodyTemplate} bodyClassName="text-center" style={{ width: '15%' }} />
              <Column field="login_terakhir" header="Terakhir Login" body={(rowData) => <span className="text-center">{formatDate(rowData.login_terakhir || '')}</span>} bodyClassName="text-center" />
              <Column field="Aksi" header="Aksi" body={aksiDropdown} bodyClassName="text-center"></Column>
            </DataTable>
            <Paginator first={first.value} rows={rows.value} totalRecords={totalRecords.value} onPageChange={onPageChange} rowsPerPageOptions={[10, 20, 30, 40, 50]} template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" className="justify-content-end" />

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
                <AccordionTab header="Role">
                  {rolesUser.value.map((optionRoles) => (
                    <div key={optionRoles.value}>
                      <Checkbox inputId={optionRoles.value} name="optionRoles" value={optionRoles.value} onChange={handleOptionChangeRoles} checked={roleAkun.value === optionRoles.value} />
                      <label htmlFor={optionRoles.value}>&nbsp;{optionRoles.label}</label>
                    </div>
                  ))}
                </AccordionTab>
                <AccordionTab header="Status">
                  {statusInfoAkun.map((optionStatus) => (
                    <div key={optionStatus.value}>
                      <Checkbox inputId={optionStatus.value} name="optionStatus" value={optionStatus.value} onChange={handleOptionChangeStatus} checked={statusAkun.value === optionStatus.value} />
                      <label htmlFor={optionStatus.value}>&nbsp;{optionStatus.label}</label>
                    </div>
                  ))}
                </AccordionTab>
              </Accordion>
            </Dialog>
          </div>

          {/* manggil ke component form tambah user */}
          <Tambah rolesUser={rolesUser.value} loadingRolesUser={loadingRolesUser.value} errorFetchingRolesUser={errorFetchingRolesUser.value} visible={visibleRight1.value} onHide={handleSidebarCreateHide} fetchData={fetchData} fetchdataDearah={fetchDataDaerah.value} fetchdataDesa={fetchDataDesa.value} fetchDataKelompok={fetchDataKelompok.value} />

          {/* manggil ke component form detail user */}
          <Detail rolesUser={rolesUser.value} detailData={userData.value} visible={visibleRight2.value} onHide={handleSidebarDetailHide} fetchdataDearah={fetchDataDaerah.value} fetchdataDesa={fetchDataDesa.value} fetchDataKelompok={fetchDataKelompok.value} />

          {/* manggil ke component form detail user */}
          <Edit rolesUser={rolesUser.value} loadingRolesUser={loadingRolesUser.value} errorFetchingRolesUser={errorFetchingRolesUser.value} detailData={userData.value} visible={visibleRight3.value} onHide={handleSidebarEditHide} fetchData={fetchData} fetchdataDearah={fetchDataDaerah.value} fetchdataDesa={fetchDataDesa.value} fetchDataKelompok={fetchDataKelompok.value} />
        </div>
      </div>
    </>
  );
}
