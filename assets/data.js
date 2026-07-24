/* Data contoh Lantai 3 — Mall Senayan Jaya
   Semua angka di sini adalah ILUSTRASI untuk peragaan, bukan data nyata. */

const SEED_UNITS=[
 {u:'L3-01',c:'1/3',r:'1/4',n:'Sate Taichan Bang Ipul',k:'fnb',kat:'Kuliner',jam:'10.00–21.30',wa:'0812-1100-0101',sejak:'Mar 2021',
  sis:'aktif',sensus:'ada',papan:'Sate Taichan Bang Ipul',tier:'sorotan',qr:'aktif',scan:842,promo:'Beli 2 porsi, gratis es teh',until:'2026-08-31',
  akhir:'2027-02-28',nonaktif:false,views:1840,clicks:412,wa_c:96,kws:[['sate',214],['taichan',151],['makan malam',88]],nb:[null,'L3-02']},
 {u:'L3-02',c:'3/5',r:'1/4',n:'Optik Cahaya Terang',k:'ritel',kat:'Optik & kacamata',jam:'10.00–21.00',wa:'0812-1100-0102',sejak:'Jan 2019',
  sis:'aktif',sensus:'ada',papan:'Optik Cahaya Terang',tier:'aktif',qr:'aktif',scan:214,promo:'',until:'',
  akhir:'2027-01-31',nonaktif:false,views:640,clicks:171,wa_c:44,kws:[['kacamata',203],['optik',118],['lensa',61]],nb:['L3-01','L3-03']},
 {u:'L3-03',c:'5/7',r:'1/4',n:null,sis:'kosong',sejak:'Sep 2025',sensus:'ada',papan:'Kedai Kopi Tuku Senja',nonaktif:false,nb:['L3-02','L3-04']},
 {u:'L3-04',c:'7/9',r:'1/4',n:'Toko Emas Sinar Baru',k:'ritel',kat:'Perhiasan',jam:'10.00–20.00',wa:'0812-1100-0104',sejak:'Agu 2016',
  sis:'aktif',sensus:'ada',papan:'Toko Emas Sinar Baru',tier:'dasar',qr:'aktif',scan:96,promo:'',until:'',
  akhir:'2026-12-31',nonaktif:false,views:298,clicks:74,wa_c:19,kws:[['emas',96],['cincin',44],['kalung',31]],nb:['L3-03','L3-05']},
 {u:'L3-05',c:'9/11',r:'1/4',n:'Klinik Gigi Senyum',k:'jasa',kat:'Kesehatan',jam:'09.00–20.00',wa:'0812-1100-0105',sejak:'Feb 2023',
  sis:'aktif',sensus:'ada',papan:'Klinik Gigi Senyum',tier:'dasar',qr:'aktif',scan:71,promo:'',until:'',
  akhir:'2027-02-28',nonaktif:false,views:352,clicks:98,wa_c:41,kws:[['dokter gigi',124],['behel',67],['scaling',38]],nb:['L3-04','L3-06']},
 {u:'L3-06',c:'11/13',r:'1/4',n:'Bakmi Ayam Karet',k:'fnb',kat:'Kuliner',jam:'10.00–21.30',wa:'0812-1100-0106',sejak:'Nov 2022',
  sis:'aktif',sensus:'ada',papan:'Bakmi Ayam Karet',tier:'aktif',qr:'belum',scan:0,promo:'',until:'',
  akhir:'2027-02-28',nonaktif:false,views:914,clicks:246,wa_c:52,kws:[['bakmi',188],['mie ayam',142],['makan siang',97]],nb:['L3-05',null]},
 {u:'L3-07',c:'1/3',r:'5/8',n:'Jaya Cell Pulsa & Aksesoris',k:'ritel',kat:'Elektronik',jam:'09.30–21.00',wa:'0812-1100-0107',sejak:'Jul 2018',
  sis:'aktif',sensus:'ada',papan:'Jaya Cell',tier:'dasar',qr:'belum',scan:0,promo:'',until:'',
  akhir:'2026-11-30',nonaktif:false,views:410,clicks:88,wa_c:24,kws:[['pulsa',132],['casing hp',71],['charger',48]],nb:[null,'L3-08']},
 {u:'L3-08',c:'3/5',r:'5/8',n:null,sis:'renovasi',sejak:'Sep 2025',sensus:'ada',papan:'Gagah Barbershop',nonaktif:false,nb:['L3-07','L3-09']},
 {u:'L3-09',c:'5/7',r:'5/8',n:'Butik Nayla Hijab',k:'ritel',kat:'Busana muslim',jam:'10.00–21.00',wa:'0812-1100-0109',sejak:'Apr 2024',
  sis:'aktif',sensus:'ada',papan:'Butik Nayla Hijab',tier:'aktif',qr:'aktif',scan:188,promo:'Hijab pashmina mulai Rp 35.000',until:'2026-09-30',
  akhir:'2027-04-30',nonaktif:false,views:722,clicks:203,wa_c:67,kws:[['hijab',241],['gamis',108],['kerudung',74]],nb:['L3-08',null]},
 {u:'L3-10',c:'11/13',r:'5/8',n:'Amanah Service HP',k:'jasa',kat:'Servis elektronik',jam:'10.00–20.30',wa:'0812-1100-0110',sejak:'Mei 2020',
  sis:'aktif',sensus:'ada',papan:'Amanah Service HP',tier:'dasar',qr:'aktif',scan:143,promo:'',until:'',
  akhir:'2027-05-31',nonaktif:false,views:466,clicks:139,wa_c:58,kws:[['servis hp',167],['ganti lcd',82],['baterai',49]],nb:[null,null]},
 {u:'L3-11',c:'1/3',r:'8/11',n:null,sis:'kosong',sejak:'Feb 2026',sensus:'kosong',papan:null,nonaktif:false,nb:[null,'L3-12']},
 {u:'L3-12',c:'3/5',r:'8/11',n:'Roti Bakar 88',k:'fnb',kat:'Kuliner',jam:'11.00–22.00',wa:'0812-1100-0112',sejak:'Okt 2023',
  sis:'aktif',sensus:'ada',papan:'Roti Bakar 88',tier:'aktif',qr:'aktif',scan:276,promo:'',until:'',
  akhir:'2026-10-31',nonaktif:false,views:588,clicks:154,wa_c:33,kws:[['roti bakar',176],['martabak',88],['jajan',51]],nb:['L3-11',null]},
 {u:'L3-K1',c:'9/11',r:'8/11',n:'Zona Aksesoris Ponsel',k:'ritel',kat:'Aksesoris',jam:'10.00–21.00',wa:'0812-1100-0121',sejak:'Jun 2024',
  sis:'aktif',sensus:'ada',papan:'Zona Aksesoris Ponsel',tier:'aktif',qr:'aktif',scan:104,promo:'',until:'',
  akhir:'2027-06-30',nonaktif:false,views:344,clicks:81,wa_c:17,kws:[['casing',102],['tempered glass',58],['powerbank',41]],nb:[null,'L3-K2']},
 {u:'L3-K2',c:'11/13',r:'8/11',n:null,sis:'kosong',sejak:'Jan 2025',sensus:'ada',papan:'Sneaker Lab Wash',nonaktif:false,nb:['L3-K1',null]},
 {u:'L3-13',c:'1/3',r:'12/15',n:'RM Padang Sederhana Jaya',k:'fnb',kat:'Kuliner',jam:'08.00–21.00',wa:'0812-1100-0113',sejak:'Des 2015',
  sis:'aktif',sensus:'ada',papan:'RM Padang Sederhana Jaya',tier:'sorotan',qr:'aktif',scan:1104,promo:'Paket makan siang Rp 25.000',until:'2026-12-31',
  akhir:'2027-12-31',nonaktif:false,views:2110,clicks:498,wa_c:74,kws:[['nasi padang',312],['rendang',188],['makan siang',164]],nb:[null,'L3-14']},
 {u:'L3-14',c:'3/5',r:'12/15',n:'Toko Buku Ilmu Baru',k:'ritel',kat:'Buku & ATK',jam:'10.00–20.00',wa:'0812-1100-0114',sejak:'Mar 2017',
  sis:'aktif',sensus:'ada',papan:'Grosir Tas Melati',tier:'dasar',qr:'belum',scan:0,promo:'',until:'',
  akhir:'2027-03-31',nonaktif:false,views:174,clicks:38,wa_c:8,kws:[['buku',61],['alat tulis',34],['fotokopi',22]],nb:['L3-13','L3-15']},
 {u:'L3-15',c:'5/7',r:'12/15',n:'Laundry Kilat Express',k:'jasa',kat:'Laundry',jam:'08.00–20.00',wa:'0812-1100-0115',sejak:'Sep 2021',
  sis:'aktif',sensus:'ada',papan:'Laundry Kilat Express',tier:'dasar',qr:'aktif',scan:88,promo:'',until:'',
  akhir:'2026-09-30',nonaktif:false,views:262,clicks:71,wa_c:29,kws:[['laundry',118],['cuci sepatu',44],['setrika',27]],nb:['L3-14','L3-16']},
 {u:'L3-16',c:'7/9',r:'12/15',n:null,sis:'kosong',sejak:'Nov 2025',sensus:'kosong',papan:null,nonaktif:false,nb:['L3-15','L3-17']},
 {u:'L3-17',c:'9/11',r:'12/15',n:'Salon Widya',k:'jasa',kat:'Salon & kecantikan',jam:'09.00–19.00',wa:'0812-1100-0117',sejak:'Jan 2020',
  sis:'aktif',sensus:'kosong',papan:null,tier:'dasar',qr:'belum',scan:0,promo:'',until:'',
  akhir:'2027-01-31',nonaktif:false,views:88,clicks:12,wa_c:1,kws:[['salon',52],['potong rambut',31],['creambath',14]],nb:['L3-16','L3-18']},
 {u:'L3-18',c:'11/13',r:'12/15',n:'Es Teler Segar',k:'fnb',kat:'Kuliner',jam:'10.00–21.00',wa:'0812-1100-0118',sejak:'Jul 2025',
  sis:'aktif',sensus:'ada',papan:'Es Teler Segar',tier:'aktif',qr:'aktif',scan:196,promo:'',until:'',
  akhir:'2027-07-31',nonaktif:false,views:512,clicks:128,wa_c:22,kws:[['es teler',144],['minuman dingin',78],['jus',46]],nb:['L3-17',null]},
];

const FIXTURES=[{c:'7/11',r:'5/8',t:'ESKALATOR · ATRIUM'},{c:'5/9',r:'8/11',t:'TOILET · LIFT'}];

const SEED_ZERO=[{q:'apotek',n:214},{q:'atm',n:168},{q:'mainan anak',n:141},{q:'fotokopi',n:97},
 {q:'tukar uang',n:63},{q:'baju bayi',n:58},{q:'kopi',n:44}];

/* bobot sumber: kuat 3 · sedang 2 · lemah 1 */
const SRC={B:['PENDATAAN',3,'k'],C:['STRUK',3,'k'],D:['TETANGGA',2,'s'],E:['SUMBER LUAR',2,'s'],
 F:['UTILITAS',2,'s'],A:['SISTEM',1,''],G:['PENGUNJUNG',1,'']};

const EVIDENCE={
 'L3-03':[['B','Pendataan awal 14 Jul — papan nama "Kedai Kopi Tuku Senja" terpasang'],['C','3 struk pembeli, nama usaha tercetak'],
   ['D','Dikonfirmasi tetangga L3-02 dan L3-04'],['E','Terdaftar di Google Maps & GoFood, alamat unit L3-03'],['F','Listrik jalan, pola harian normal']],
 'L3-08':[['B','Pendataan awal — papan nama "Gagah Barbershop", kios beroperasi'],['D','Dikonfirmasi tetangga L3-07 dan L3-09'],
   ['E','Tag lokasi Instagram menyebut lantai 3'],['F','Listrik jalan meski status renovasi']],
 'L3-K2':[['B','Pendataan awal — papan nama "Sneaker Lab Wash"'],['C','1 struk pembeli'],['E','Terdaftar di Google Maps']],
 'L3-17':[['B','Pendataan awal — rolling door tertutup, papan nama sudah dilepas'],['D','Tidak pernah disebut tetangga kiri maupun kanan'],['F','Konsumsi listrik nol sejak Mei']],
 'L3-14':[['B','Papan nama di lapangan "Grosir Tas Melati", kontrak a.n. Toko Buku Ilmu Baru'],['D','Tetangga L3-13 menyebut nama yang sama'],['E','Akun Shopee mencantumkan unit L3-14']],
 'L3-07':[['A','QR belum diaktivasi setelah 30 hari']],
};

const CASES={
 'L3-03':{nama:'Kedai Kopi Tuku Senja',kat:'Ada toko, tidak ada di sistem',bln:10,sewa:18e6,nilai:180e6,det:'14 Jul 2026',
  w:'Sistem mencatat unit kosong sejak Sep 2025, tetapi lapangan menunjukkan kios beroperasi penuh. Tidak ada kontrak, tidak ada tagihan service charge, dan tidak ada setoran sewa ke rekening perusahaan.'},
 'L3-08':{nama:'Gagah Barbershop',kat:'Ada toko, status renovasi',bln:10,sewa:15e6,nilai:150e6,det:'14 Jul 2026',
  w:'Berstatus renovasi selama sepuluh bulan, tetapi kios beroperasi dan listriknya jalan dengan pola harian normal.'},
 'L3-K2':{nama:'Sneaker Lab Wash',kat:'Ada toko, tidak ada di sistem',bln:18,sewa:8e6,nilai:144e6,det:'14 Jul 2026',
  w:'Kios tengah tercatat kosong sejak Jan 2025, tetapi papan nama terpasang dan usahanya terdaftar di layanan peta publik.'},
 'L3-17':{nama:'Salon Widya',kat:'Tercatat aktif, unit kosong',bln:3,sewa:14e6,nilai:42e6,tel:true,det:'16 Jul 2026',
  w:'Kontrak tercatat aktif dan sewa terus ditagihkan, tetapi unitnya kosong sejak sekitar Mei. Perlu dicek kapan tenant pindah dan ke mana pembayaran selama ini masuk.'},
 'L3-14':{nama:'Grosir Tas Melati',kat:'Nama tidak cocok dengan kontrak',bln:0,sewa:0,nilai:0,det:'18 Jul 2026',
  w:'Kontrak atas nama Toko Buku Ilmu Baru, tetapi yang beroperasi usaha lain. Kemungkinan unit dialihkan tanpa persetujuan pengelola. Nilai selisihnya belum bisa dihitung sebelum dokumen ditelusuri.'},
 'L3-07':{nama:'Jaya Cell Pulsa & Aksesoris',kat:'QR belum diaktivasi',bln:0,sewa:0,nilai:0,det:'22 Jul 2026',
  w:'QR belum diaktivasi setelah 30 hari. Sinyal lemah — kemungkinan besar hanya belum sempat. Cukup ditelepon PIC, bukan alasan untuk mencurigai.'},
};

const TIER_TXT={
 dasar:'TERDAFTAR — halaman toko, denah, dan QR kupon. Gratis, semua tenant resmi dapat ini.',
 aktif:'AKTIF — tambahan pasang promo dan laporan kata kunci bulanan.',
 sorotan:'SOROTAN — muncul di urutan atas hasil pencarian. Slot terbatas per lantai, dapat ditingkatkan lewat pengelola.'};

const CFG_DEFAULT={
 namaMall:'Mall Senayan Jaya', lantai:'LANTAI 3',
 fKupon:true, fPromo:true, fTetangga:true, fLogNihil:true, fRekonsiliasi:true, fPerforma:true, fArah:true,
 kuponNilai:5000, hadiahLaporan:25000, kuponKuotaHari:60, kuponPerNomor:1, kuponTerpakai:0,
 pinSetup:'1234', gateSetup:true
};
