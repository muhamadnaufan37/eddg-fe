const superadminMenu = [
  {
    menu: 'Manajeman User',
    icon: '/assets/eddg/user-icon.svg',
    subMenu: [
      {
        menu: 'User',
        link: '/management-user',
      },
      {
        menu: 'Role',
        link: '/management-role',
      },
      {
        menu: 'Log Users',
        link: '/log-users',
      },
    ],
  },
  {
    menu: 'Data Sensus',
    icon: '/assets/eddg/sensus-icon.svg',
    subMenu: [
      {
        menu: 'Data Digital',
        link: '/digital-data-generus',
      },
    ],
  },
  {
    menu: 'Tempat Sambung',
    icon: '/assets/eddg/gedung-icon.svg',
    subMenu: [
      {
        menu: 'Data Tempat Daerah',
        link: '/data-daerah',
      },
      {
        menu: 'Data Tempat Desa',
        link: '/data-desa',
      },
      {
        menu: 'Data Tempat kelompok',
        link: '/data-kelompok',
      },
    ],
  },
  {
    menu: 'Keuangan',
    icon: '/assets/eddg/bendahara-icon.svg',
    subMenu: [
      {
        menu: 'Data Kas Bendahara',
        link: '/data-kas-bendahara',
      },
    ],
  },
];

const ptgsMenu = [
  {
    menu: 'Data Sensus',
    icon: '/assets/eddg/sensus-icon.svg',
    subMenu: [
      {
        menu: 'Data Digital',
        link: '/digital-data-generus',
      },
    ],
  },
];

const bendaharaMenu = [
  {
    menu: 'Keuangan',
    icon: '/assets/eddg/bendahara-icon.svg',
    subMenu: [
      {
        menu: 'Data Kas Bendahara',
        link: '/data-kas-bendahara',
      },
    ],
  },
];

// const adminMenu = [
//   {
//     menu: 'Registrasi Pembayaran',
//     icon: '/assets/sipandu/icons/wallet-icon.svg',
//     subMenu: [
//       {
//         menu: 'Registrasi',
//         link: '/register-pembayaran',
//       },
//       {
//         menu: 'Manual',
//         link: '/register-pembayaran-manual',
//       },
//       {
//         menu: 'Pembatalan',
//         link: '/pembatalan-registrasi-pembayaran',
//       },
//       {
//         menu: 'Rekonsiliasi',
//         link: '/rekonsiliasi-registrasi-pembayaran',
//       },
//     ],
//   },
//   {
//     menu: 'Laporan',
//     icon: '/assets/sipandu/icons/user-icon.svg',
//     subMenu: [
//       {
//         menu: 'Rincian Registrasi Pembayaran',
//         link: '/laporan-rincian-register-pembayaran',
//       },
//       {
//         menu: 'Rincian Penerimaan',
//         link: '/laporan-penerimaan',
//       },
//       {
//         menu: 'Rekonsiliasi Bulanan',
//         // link: '/laporan-rincian-bulanan',
//         link: '',
//       },
//       {
//         menu: 'Realisasi Penerimaan Kas Daerah',
//         link: '/realisasi-penerimaan-kas-daerah',
//       },
//     ],
//   },
// ];

// const mahasiswaMenu = [
//   {
//     menu: 'Registrasi Pembayaran',
//     icon: '/assets/sipandu/icons/wallet-icon.svg',
//     subMenu: [
//       {
//         menu: 'Pembatalan',
//         link: '/pembatalan-registrasi-pembayaran',
//       },
//     ],
//   },
//   {
//     menu: 'Laporan',
//     icon: '/assets/sipandu/icons/user-icon.svg',
//     subMenu: [
//       {
//         menu: 'Rincian Registrasi Pembayaran',
//         link: '/laporan-rincian-register-pembayaran',
//       },

//       {
//         menu: 'Rekonsiliasi Bulanan',
//         // link: '/laporan-rincian-bulanan',
//         link: '',
//       },
//     ],
//   },
// ];

// const siswaMenu = [
//   {
//     menu: 'Registrasi Pembayaran',
//     icon: '/assets/sipandu/icons/wallet-icon.svg',
//     subMenu: [
//       {
//         menu: 'Registrasi',
//         link: '/register-pembayaran',
//       },
//       {
//         menu: 'Pembatalan',
//         link: '/pembatalan-registrasi-pembayaran',
//       },
//     ],
//   },
//   {
//     menu: 'Laporan',
//     icon: '/assets/sipandu/icons/user-icon.svg',
//     subMenu: [
//       {
//         menu: 'Rincian Registrasi Pembayaran',
//         link: '/laporan-rincian-register-pembayaran',
//       },
//       {
//         menu: 'Rekonsiliasi Bulanan',
//         // link: '/laporan-rincian-bulanan',
//         link: '',
//       },
//     ],
//   },
// ];

function generateSidebarMenu(role) {
  switch (role) {
    case 1:
      return superadminMenu;
    case 2:
      return ptgsMenu;
    case 3:
      return bendaharaMenu;
    // case 4:
    //   return siswaMenu;
    default:
      return [];
  }
}

export default generateSidebarMenu;
