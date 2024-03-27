import React from 'react';
import { signal } from '@preact/signals-react';
import { Button } from 'primereact/button';

import '../assets/css/dashboard.css';

const dataNew = signal([]);

const Beranda = () => {
  const manajemenUser = () => {
    window.location.href = '/management-user';
  };

  const dataSensus = () => {
    window.location.href = '/digital-data-generus';
  };

  const dataDashboard = () => {
    window.location.href = '/dashboard-sensus';
  };

  const dataDaerah = () => {
    window.location.href = '/data-daerah';
  };

  const dataPengumuman = () => {
    window.location.href = '/pengumuman';
  };

  const dataKasWallet = () => {
    window.location.href = '/dashboard-bendahara';
  };

  const storedUserData = JSON.parse(localStorage.getItem('user'));
  if (storedUserData) {
    dataNew.value = storedUserData;
  }

  return (
    <>
      <div className="row mt-5 mb-5 justify-content-center">
        <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 mb-3">
          <div className="box d-flex justify-content-between flex-column">
            <div className="text-center">
              <img src="../assets/eddg/logo-dashboard-5.svg" className="img-fluid mx-auto d-block mb-3" alt="logo-dashboard-5" />
            </div>
            <div className="p-1">
              <p className="fw-bold fs-3">Pengumuman</p>
              <p className="fs-6">Menu informasi pengumuman terbaru</p>
            </div>
            <div className="flex flex-wrap justify-content-center gap-2">
              <Button label="Mulai" severity="secondary" onClick={dataPengumuman} text size="small" />
            </div>
          </div>
        </div>
        {dataNew.value?.role_id === 1 ? (
          <>
            <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 mb-3">
              <div className="box d-flex justify-content-between flex-column">
                <div>
                  <div className="text-center">
                    <img src="../assets/eddg/logo-dashboard-1.svg" className="img-fluid mx-auto d-block mb-3" alt="logo-dashboard-1" />
                  </div>
                  <div className="p-1">
                    <p className="fw-bold fs-3">User Management</p>
                    <p className="fs-6">Menu untuk mengatur role maupun mengubah data user.</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-content-center gap-2">
                  <Button label="Mulai" severity="secondary" onClick={manajemenUser} text size="small" />
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {dataNew.value?.role_id === 1 || dataNew.value?.role_id === 2 ? (
          <>
            <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 mb-3">
              <div className="box d-flex justify-content-between flex-column">
                <div className="text-center">
                  <img src="../assets/eddg/logo-dashboard-2.svg" className="img-fluid mx-auto d-block mb-3" alt="logo-dashboard-2" />
                </div>
                <div className="p-1">
                  <p className="fw-bold fs-3">Dashboard</p>
                  <p className="fs-6">MMenu untuk melihat informasi data sensus muda / mudi.</p>
                </div>
                <div className="flex flex-wrap justify-content-center gap-2">
                  <Button label="Mulai" severity="secondary" onClick={dataDashboard} text size="small" />
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {dataNew.value?.role_id === 1 ? (
          <>
            <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 mb-3">
              <div className="box d-flex justify-content-between flex-column">
                <div className="text-center">
                  <img src="../assets/eddg/logo-dashboard-3.svg" className="img-fluid mx-auto d-block mb-3" alt="logo-dashboard-3" />
                </div>
                <div className="p-1">
                  <p className="fw-bold fs-3">Tempat Sambung Management</p>
                  <p className="fs-6">Menu untuk mengatur tempat daerah / desa / kelompok</p>
                </div>
                <div className="flex flex-wrap justify-content-center gap-2">
                  <Button label="Mulai" severity="secondary" onClick={dataDaerah} text size="small" />
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {dataNew.value?.role_id === 1 || dataNew.value?.role_id === 2 ? (
          <>
            <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 mb-3">
              <div className="box d-flex justify-content-between flex-column">
                <div className="text-center">
                  <img src="../assets/eddg/logo-dashboard-4.svg" className="img-fluid mx-auto d-block mb-3" alt="logo-dashboard-4" />
                </div>
                <div className="p-1">
                  <p className="fw-bold fs-3">Data Generus Management</p>
                  <p className="fs-6">Menu untuk mengatur data sensus generus</p>
                </div>
                <div className="flex flex-wrap justify-content-center gap-2">
                  <Button label="Mulai" severity="secondary" onClick={dataSensus} text size="small" />
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {dataNew.value?.role_id === 1 || dataNew.value?.role_id === 3 ? (
          <>
            <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 mb-3">
              <div className="box d-flex justify-content-between flex-column">
                <div className="text-center">
                  <img src="../assets/eddg/logo-dashboard-6.svg" className="img-fluid mx-auto d-block mb-3" alt="logo-dashboard-6" />
                </div>
                <div className="p-1">
                  <p className="fw-bold fs-3">Dashboard Data kas</p>
                  <p className="fs-6">Menu untuk mengatur data keuangan Kelompok / Desa / Daerah</p>
                </div>
                <div className="flex flex-wrap justify-content-center gap-2">
                  <Button label="Mulai" severity="secondary" onClick={dataKasWallet} text size="small" />
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default Beranda;
