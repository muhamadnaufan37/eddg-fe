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

const error = signal(null);
const data = signal([]);
const loading = signal(true);
const globalFilter = signal('');
const kolom = signal('');
const first = signal(0);
const rows = signal(10);
const page = signal(1);
const totalRecords = signal(0);

const browserLogs = signal('');
const osLogs = signal('');
const deviceLogs = signal('');
const statusLogs = signal('');

const dataLogsBrowser = signal([]);
const dataLogsOs = signal([]);
const dataLogsDevice = signal([]);
const dataLogsStatus = signal([]);
const filterDialog = signal(null);

export default function LogsUsers() {
  const toastRef = useRef(null);
  const fetchData = async () => {
    try {
      loading.value = true;
      const response = await fetchClient().get(`/api/logs/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}&browser=${browserLogs.value}&os=${osLogs.value}&device=${deviceLogs.value}&status=${statusLogs.value}`);
      data.value = response.data.data_logs.data;
      totalRecords.value = response.data.data_logs.total;
      loading.value = false;
    } catch (err) {
      error.value = err;
      loading.value = false;
    }
  };

  const fetchBrowserLogs = async () => {
    try {
      const response = await fetchClient().get(`/api/logs/list_browser`);
      dataLogsBrowser.value = response.data.data_logs.map((option) => ({
        value: option.browser,
        label: option.browser,
      }));
    } catch (err) {
      error.value = err;
    }
  };

  const fetchOsLogs = async () => {
    try {
      const response = await fetchClient().get(`/api/logs/list_os`);
      dataLogsOs.value = response.data.data_logs.map((option) => ({
        value: option.os,
        label: option.os,
      }));
    } catch (err) {
      error.value = err;
    }
  };

  const fetchDeviceLogs = async () => {
    try {
      const response = await fetchClient().get(`/api/logs/list_device`);
      dataLogsDevice.value = response.data.data_logs.map((option) => ({
        value: option.device,
        label: option.device,
      }));
    } catch (err) {
      error.value = err;
    }
  };

  const fetchStatusLogs = async () => {
    try {
      const response = await fetchClient().get(`/api/logs/list_status`);
      dataLogsStatus.value = response.data.data_logs.map((option) => ({
        value: option.status_logs,
        label: option.status_logs,
      }));
    } catch (err) {
      error.value = err;
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
    { label: 'Nama', value: 'nama_lengkap' },
    { label: 'Aktivitas', value: 'aktifitas' },
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

  useEffect(() => {
    fetchData();
    fetchBrowserLogs();
    fetchOsLogs();
    fetchDeviceLogs();
    fetchStatusLogs();

    const searchParams = new URLSearchParams(window.location.search);
    page.value = parseInt(searchParams.get('page') || 1);
    rows.value = parseInt(searchParams.get('per-page') || 10);

    globalFilter.value = '';
    kolom.value = '';
    browserLogs.value = '';
    osLogs.value = '';
    deviceLogs.value = '';
    statusLogs.value = '';

    if ((globalFilter.value, kolom.value, browserLogs.value, osLogs.value, deviceLogs.value, statusLogs.value)) {
      searchParams.set('keyword', globalFilter.value);
      searchParams.set('kolom', kolom.value);
      searchParams.set('browser', browserLogs.value);
      searchParams.set('os', osLogs.value);
      searchParams.set('device', deviceLogs.value);
      searchParams.set('status', statusLogs.value);
    } else {
      searchParams.delete('keyword');
      searchParams.delete('kolom');
      searchParams.delete('browser');
      searchParams.delete('os');
      searchParams.delete('device');
      searchParams.delete('status');
    }

    searchParams.set('page', page.value);
    searchParams.set('per-page', rows.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
  }, []);

  const usersDetail = (data) => {
    const userId = data.user_id;
    const namaUser = data.nama_lengkap;
    return (
      <>
        <span>
          [{userId}] - {namaUser}
        </span>
      </>
    );
  };

  const statusInfo = {
    successfully: {
      className: 'c-pill c-pill--success',
      text: 'Successfully	',
    },
    unsuccessfully: {
      className: 'c-pill c-pill--danger',
      text: 'Unsuccessfully',
    },
  };

  const statusBodyTemplate = (data) => {
    const status = statusInfo[data.status_logs];
    return (
      <>
        <span className={status.className}>{status.text}</span>
      </>
    );
  };

  const onFilterDialogHide = () => {
    filterDialog.value = false;
  };

  const handleOptionFilterBrowser = (event) => {
    browserLogs.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('browser', browserLogs.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleOptionFilterOs = (event) => {
    osLogs.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('os', osLogs.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleOptionFilterDevice = (event) => {
    deviceLogs.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('device', deviceLogs.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleOptionFilterStatus = (event) => {
    statusLogs.value = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('status', statusLogs.value);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    debounceSearch();
  };

  const handleClearFilter = () => {
    const searchParams = new URLSearchParams(window.location.search);
    browserLogs.value = '';
    osLogs.value = '';
    deviceLogs.value = '';
    statusLogs.value = '';

    if (browserLogs.value) {
      searchParams.delete('browser');
    } else {
      searchParams.set('browser', browserLogs.value);
    }

    if (osLogs.value) {
      searchParams.delete('os');
    } else {
      searchParams.set('os', osLogs.value);
    }

    if (deviceLogs.value) {
      searchParams.delete('device');
    } else {
      searchParams.set('device', deviceLogs.value);
    }

    if (statusLogs.value) {
      searchParams.delete('status');
    } else {
      searchParams.set('status', statusLogs.value);
    }

    window.history.pushState(null, '', `?${searchParams.toString()}`);
    fetchData();
  };

  return (
    <>
      <div className="card card-main-content">
        <div className="card-body">
          <div className="fw-semibold fs-3 mb-4">AKtivitas Users</div>
          <Toast ref={toastRef} />
          {error.value && <div>{error.value.message}</div>}
          <div className="card card-toolbar-filter mb-5">
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
                        placeholder="Cari Data Logs"
                      />
                      <button hidden={globalFilter.value.length > 0 ? false : true} onClick={handleClear} className="search-form-wrapper__input-wrapper__clear-button">
                        <i className="pi pi-times" style={{ fontSize: '0.7rem', color: 'white', fontWeight: '1rem' }}></i>
                      </button>
                      <i className="pi pi-search search-form-wrapper__input-wrapper__magnifier-icon" />
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
              <Column header="Nama" body={usersDetail} />
              <Column field="ip_address" header="Ip Address" />
              <Column field="aktifitas" header="Aktivitas Users" style={{ width: '15%' }} />
              <Column field="browser" header="Browser" />
              <Column field="os" header="OS" />
              <Column field="device" header="Device" />
              <Column field="status" header="Status" body={statusBodyTemplate} bodyClassName="text-center" style={{ width: '15%' }} />
              <Column field="latitude" header="Latitude" />
              <Column field="longitude" header="Longitude" />
              <Column field="created_at" header="Tanggal" />
            </DataTable>
            <Paginator first={first.value} rows={rows.value} totalRecords={totalRecords.value} onPageChange={onPageChange} rowsPerPageOptions={[10, 20, 30, 40, 50]} template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" className="justify-content-end" />

            {/* Dialog Filter Data Logs */}
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
                <AccordionTab header="Browser" className="mt-3">
                  {dataLogsBrowser.value?.map((optionsLogsBrowser) => (
                    <div key={optionsLogsBrowser.value}>
                      <Checkbox inputId={optionsLogsBrowser.value} name="optionsLogsBrowser" value={optionsLogsBrowser.value} onChange={handleOptionFilterBrowser} checked={browserLogs.value === optionsLogsBrowser.value} />
                      <label htmlFor={optionsLogsBrowser.value}>&nbsp;{optionsLogsBrowser.label}</label>
                    </div>
                  ))}
                </AccordionTab>
                <AccordionTab header="OS">
                  {dataLogsOs.value?.map((optionsLogsOs) => (
                    <div key={optionsLogsOs.value}>
                      <Checkbox inputId={optionsLogsOs.value} name="optionsLogsOs" value={optionsLogsOs.value} onChange={handleOptionFilterOs} checked={osLogs.value === optionsLogsOs.value} />
                      <label htmlFor={optionsLogsOs.value}>&nbsp;{optionsLogsOs.label}</label>
                    </div>
                  ))}
                </AccordionTab>
                <AccordionTab header="Device">
                  {dataLogsDevice.value?.map((optionsLogsDevice) => (
                    <div key={optionsLogsDevice.value}>
                      <Checkbox inputId={optionsLogsDevice.value} name="optionsLogsDevice" value={optionsLogsDevice.value} onChange={handleOptionFilterDevice} checked={deviceLogs.value === optionsLogsDevice.value} />
                      <label htmlFor={optionsLogsDevice.value}>&nbsp;{optionsLogsDevice.label}</label>
                    </div>
                  ))}
                </AccordionTab>
                <AccordionTab header="Status">
                  {dataLogsStatus.value?.map((optionsLogsStatus) => (
                    <div key={optionsLogsStatus.value}>
                      <Checkbox inputId={optionsLogsStatus.value} name="optionsLogsStatus" value={optionsLogsStatus.value} onChange={handleOptionFilterStatus} checked={statusLogs.value === optionsLogsStatus.value} />
                      <label htmlFor={optionsLogsStatus.value}>&nbsp;{optionsLogsStatus.label}</label>
                    </div>
                  ))}
                </AccordionTab>
              </Accordion>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
