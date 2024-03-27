import React, { useEffect, useRef } from 'react';
import { signal } from '@preact/signals-react';
import { fetchClient } from '../utils/axios';
import { deleteUserInfo } from '../store';
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
import Tambah from './walletKas/Tambah';
import Detail from './walletKas/Detail';
import Edit from './walletKas/Edit';

const data = signal([]);
const loading = signal(true);
const globalFilter = signal('');
const kolom = signal('');
const jenisDataTransaksi = signal('');
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

const totalWalletKas = signal('');

export default function WalletKasData() {
  const toastRef = useRef(null);

  const storedUserData = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      loading.value = true;
      const response = await fetchClient().get(`/api/wallet_kas/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}&jenis_transaksi=${jenisDataTransaksi.value}`);
      data.value = response.data.data_wallet_kas.data;
      totalRecords.value = response.data.data_wallet_kas.total;
      loading.value = false;
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
    }
  };

  const fetchTotalKas = async () => {
    try {
      const response = await fetchClient().get(`/api/wallet_kas/getDataTotal`);
      totalWalletKas.value = response.data.total_pemasukan;
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
    }
  };

  const debounceSearch = debounce(() => {
    fetchData();
    fetchTotalKas();
  }, 1000);

  const handleOptionChangeJenisTransaksi = (event) => {
    jenisDataTransaksi.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('jenis_transaksi', jenisDataTransaksi.value);
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
    jenisDataTransaksi.value = '';

    if ((globalFilter.value, kolom.value, jenisDataTransaksi.value)) {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('jenis_transaksi');
    } else {
      searchParams.set('kolom', kolom.value);
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('jenis_transaksi', jenisDataTransaksi.value);
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  const handleClearFilter = () => {
    const searchParams = new URLSearchParams(window.location.search);
    jenisDataTransaksi.value = '';

    if (jenisDataTransaksi.value) {
      searchParams.delete('jenis_transaksi');
    } else {
      searchParams.set('jenis_transaksi', jenisDataTransaksi.value);
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

  const jenisInfoTransaksi = [
    { label: 'PEMASUKAN', value: 'PEMASUKAN' },
    { label: 'PENGELUARAN', value: 'PENGELUARAN' },
  ];

  const searchOptions = [
    { label: 'Semua', value: '' },
    { label: 'Nama Petugas', value: 'nama_lengkap' },
    { label: 'Bulan Transaksi', value: 'tgl_transaksi' },
  ];

  const transaksiInfo = {
    PEMASUKAN: {
      className: 'c-pill c-pill--info',
      text: 'PEMASUKAN',
    },
    PENGELUARAN: {
      className: 'c-pill c-pill--warning',
      text: 'PENGELUARAN',
    },
  };

  const transaksiBodyTemplate = (data) => {
    const jnsTransaksi = transaksiInfo[data.jenis_transaksi];
    return (
      <>
        <span className={jnsTransaksi.className}>{jnsTransaksi.text}</span>
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
      const response = await fetchClient().post(`/api/wallet_kas/edit`, { id: dataUserId.value });
      const userDataArray = response.data.data_wallet_kas;
      userData.value = userDataArray;
      if (viewSide.value === 'ubah') {
        visibleRight3.value = true;
      } else {
        visibleRight2.value = true;
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
    }
  };

  const onDeleteData = async () => {
    try {
      const response = await fetchClient().delete(`/api/wallet_kas/delete`, { data: { id: selectedData.value.id } });
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
          severity: 'Error',
          summary: 'error',
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
    debounceSearch();

    const searchParams = new URLSearchParams(window.location.search);
    page.value = 1;
    rows.value = 10;
    globalFilter.value = '';
    kolom.value = '';
    jenisDataTransaksi.value = '';

    if ((globalFilter.value, kolom.value, jenisDataTransaksi.value)) {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
      searchParams.set('jenis_transaksi', jenisDataTransaksi.value);
    } else {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('jenis_transaksi');
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

  const renderDataJumlahWalletKas = (data) => {
    const pokok = parseInt(data?.jumlah);
    return <>Rp. {new Intl.NumberFormat('id-ID').format(pokok)}</>;
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="fw-semibold fs-3 mb-3">Data Keurangan Bendahara / KU</div>
          <Toast ref={toastRef} />
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
                        placeholder="Cari Data Kas"
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
            <DataTable value={data.value} showGridlines stripedRows loading={loading.value} emptyMessage="Belum ada data" className="p-datatable-sm">
              <Column
                field="nomor"
                header="No"
                body={(row, index) => {
                  return <span className="text-center">{index.rowIndex + 1}</span>;
                }}
                bodyClassName="text-center"
              />
              <Column field="nama_petugas" header="Nama Petugas" />
              <Column field="jenis_transaksi" header="Jenis Transaksi" body={transaksiBodyTemplate} bodyClassName="text-center" style={{ width: '15%' }} />
              <Column field="tgl_transaksi" header="Kas Bulan" />
              <Column field="keterangan" header="Keterangan" />
              <Column field="jumlah" body={renderDataJumlahWalletKas} header="Jumlah" />
              <Column field="created_at" header="Tanggal Input" body={(rowData) => <span className="text-center">{formatDate(rowData.created_at || '')}</span>} bodyClassName="text-center" />
              <Column field="Aksi" header="Aksi" body={aksiDropdown} bodyClassName="text-center"></Column>
            </DataTable>
            <Paginator first={first.value} rows={rows.value} totalRecords={totalRecords.value} onPageChange={onPageChange} rowsPerPageOptions={[10, 20, 30, 40, 50]} template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" className="justify-content-end" />

            {/* Dialog Hapus Data Kas */}
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

            {/* Dialog Filter Data Kas */}
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
                <AccordionTab header="Jenis Transaksi">
                  {jenisInfoTransaksi.map((optionStatus) => (
                    <div key={optionStatus.value}>
                      <Checkbox inputId={optionStatus.value} name="optionStatus" value={optionStatus.value} onChange={handleOptionChangeJenisTransaksi} checked={jenisDataTransaksi.value === optionStatus.value} />
                      <label htmlFor={optionStatus.value}>&nbsp;{optionStatus.label}</label>
                    </div>
                  ))}
                </AccordionTab>
              </Accordion>
            </Dialog>
          </div>

          {/* manggil ke component form tambah user */}
          <Tambah totalNominalKas={totalWalletKas.value} balikanLogin={storedUserData} fetchData={fetchData} visible={visibleRight1.value} onHide={handleSidebarCreateHide} />

          {/* manggil ke component form detail user */}
          <Detail detailData={userData.value} visible={visibleRight2.value} onHide={handleSidebarDetailHide} />

          {/* manggil ke component form detail user */}
          <Edit totalNominalKas={totalWalletKas.value} detailData={userData.value} visible={visibleRight3.value} onHide={handleSidebarEditHide} fetchData={fetchData} />
        </div>
      </div>
    </>
  );
}
