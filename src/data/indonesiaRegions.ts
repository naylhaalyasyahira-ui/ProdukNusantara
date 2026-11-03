export interface DesaItem {
  name: string;
  postalCode?: string;
}

export interface KecamatanItem {
  name: string;
  desa: string[];
}

export interface KabupatenItem {
  name: string;
  type: 'Kabupaten' | 'Kota';
  kecamatan: KecamatanItem[];
}

export interface ProvinsiItem {
  name: string;
  island: string;
  kabupaten: KabupatenItem[];
}

export const INDONESIA_REGIONS: ProvinsiItem[] = [
  {
    name: 'Sulawesi Tenggara',
    island: 'Sulawesi',
    kabupaten: [
      {
        name: 'Kota Kendari',
        type: 'Kota',
        kecamatan: [
          {
            name: 'Kendari Barat',
            desa: ['Benu-Benua', 'Dapu-Dapura', 'Kemaraya', 'Lahundape', 'Punggaloba', 'Sodohoa', 'Watu-Watu', 'Tipulu']
          },
          {
            name: 'Mandonga',
            desa: ['Korumba', 'Mandonga', 'Wawonbalata', 'Anggilowu', 'Alolama']
          },
          {
            name: 'Kadia',
            desa: ['Kadia', 'Bende', 'Pondambea', 'Wawowanggu', 'Anaiwoi']
          },
          {
            name: 'Kambu',
            desa: ['Kambu', 'Lalolara', 'Mokoau', 'Padaleu']
          },
          {
            name: 'Baruga',
            desa: ['Baruga', 'Lepo-Lepo', 'Wundudopi', 'Watubangga']
          },
          {
            name: 'Poasia',
            desa: ['Anduonohu', 'Anggoeya', 'Matabubu', 'Rahandouna']
          },
          {
            name: 'Abeli',
            desa: ['Abeli', 'Benuanirae', 'Lapulu', 'Poasia', 'Talia']
          },
          {
            name: 'Nambo',
            desa: ['Nambo', 'Bungkutoko', 'Petoaha', 'Sambuli', 'Tobimeita']
          }
        ]
      },
      {
        name: 'Kota Baubau',
        type: 'Kota',
        kecamatan: [
          {
            name: 'Wolio',
            desa: ['Batulo', 'Bataraguru', 'Tomba', 'Wale', 'Wameo', 'Wangkanapi']
          },
          {
            name: 'Betoambari',
            desa: ['Katobengke', 'Lipu', 'Labalawa', 'Sulaa', 'Waborobo']
          },
          {
            name: 'Murhum',
            desa: ['Baadia', 'Melai', 'Wajo', 'Tanganapada', 'Lamangga']
          },
          {
            name: 'Bungi',
            desa: ['Liabuku', 'Kalialia', 'Ngkaring-Karing', 'Kampeonaho']
          },
          {
            name: 'Kokalukuna',
            desa: ['Kadolomoko', 'Waruruma', 'Liwuto', 'Lakologou']
          }
        ]
      },
      {
        name: 'Kabupaten Muna',
        type: 'Kabupaten',
        kecamatan: [
          {
            name: 'Katobu',
            desa: ['Raha I', 'Raha II', 'Raha III', 'Lahende', 'Watonea']
          },
          {
            name: 'Lohia',
            desa: ['Masalili (Sentra Tenun)', 'Lohia', 'Waara', 'Mantobua', 'Korihi']
          },
          {
            name: 'Batalaiworu',
            desa: ['Laiworu', 'Sidodadi', 'Watuputih', 'Wakadia']
          },
          {
            name: 'Duruka',
            desa: ['Wapunto', 'Ghonebalano', 'Banggai', 'Lasunapa']
          },
          {
            name: 'Tongkuno',
            desa: ['Wakuru', 'Kotano Wuna', 'Laano Sandana', 'Fongkaniwa']
          }
        ]
      },
      {
        name: 'Kabupaten Buton',
        type: 'Kabupaten',
        kecamatan: [
          {
            name: 'Pasarwajo',
            desa: ['Kombeli', 'Saragi', 'Banabungi', 'Dongkala', 'Takimpo', 'Wabula']
          },
          {
            name: 'Kapontori',
            desa: ['Watumotobe', 'Barangka', 'Boneatiro', 'Wakalambe']
          },
          {
            name: 'Lasalimu',
            desa: ['Kamaru', 'Bonelalo', 'Lasembangi', 'Kakenauwe']
          },
          {
            name: 'Wolowa',
            desa: ['Wolowa', 'Kaumbu', 'Matawia', 'Bungi']
          }
        ]
      },
      {
        name: 'Kabupaten Wakatobi',
        type: 'Kabupaten',
        kecamatan: [
          {
            name: 'Wangi-Wangi',
            desa: ['Wanci', 'Pongo', 'Waha', 'Patuno', 'Koroe Onowa', 'Longa']
          },
          {
            name: 'Wangi-Wangi Selatan',
            desa: ['Mola Bahari', 'Liya Togo', 'Liya Bahari', 'Kapota', 'Numana']
          },
          {
            name: 'Kaledupa',
            desa: ['Ambeua', 'Buranga', 'Ollo', 'Horuo', 'Sombano']
          },
          {
            name: 'Tomia',
            desa: ['Waha', 'Waitii', 'Kololo', 'Patipelong', 'Rongrano']
          },
          {
            name: 'Binongko',
            desa: ['Rukuwa', 'Taipabu', 'Oeli', 'Makki']
          }
        ]
      },
      {
        name: 'Kabupaten Kolaka',
        type: 'Kabupaten',
        kecamatan: [
          {
            name: 'Kolaka',
            desa: ['Lamokato', 'Laloeha', 'Watuliandu', 'Tahoa']
          },
          {
            name: 'Latambaga',
            desa: ['Kolakaasi', 'Mangatara', 'Ulunggolaka', 'Sakuli']
          },
          {
            name: 'Pomalaa',
            desa: ['Dawi-Dawi', 'Kumoro', 'Huko-Huko', 'Pelambua', 'Oko-Oko']
          },
          {
            name: 'Wundulako',
            desa: ['Wundulako', 'Kowioha', '19 Nopember', 'Unamendaa']
          }
        ]
      },
      {
        name: 'Kabupaten Konawe',
        type: 'Kabupaten',
        kecamatan: [
          {
            name: 'Unaaha',
            desa: ['Tuoy', 'Asinua', 'Tumpas', 'Arombu', 'Puunaaha']
          },
          {
            name: 'Wawotobi',
            desa: ['Inalahi', 'Kasupute', 'Bose-Bose', 'Palapu']
          },
          {
            name: 'Sampara',
            desa: ['Sampara', 'Andadowi', 'Baetowe', 'Pohorua']
          },
          {
            name: 'Pondidaha',
            desa: ['Pondidaha', 'Lalosabila', 'Wonua Mandara', 'Wawolemo']
          }
        ]
      },
      {
        name: 'Kabupaten Bombana',
        type: 'Kabupaten',
        kecamatan: [
          {
            name: 'Rumbia',
            desa: ['Kasipute', 'Doule', 'Lameroro', 'Lampopi']
          },
          {
            name: 'Poleang',
            desa: ['Boepinang', 'Kastapu', 'Pokorumba', 'Salosa']
          },
          {
            name: 'Rarowatu',
            desa: ['Taubonto', 'Ladumpi', 'Watu-Watu', 'Pangkuri']
          }
        ]
      },
      {
        name: 'Kabupaten Konawe Selatan',
        type: 'Kabupaten',
        kecamatan: [
          {
            name: 'Andoolo',
            desa: ['Andoolo', 'Potoro', 'Alengge', 'Punggaluku']
          },
          {
            name: 'Konda',
            desa: ['Konda', 'Ranowila', 'Lepo-Lepo Indah', 'Ambololi']
          },
          {
            name: 'Ranomeeto',
            desa: ['Ranomeeto', 'Onewila', 'Kota Bangun', 'Boro-Boro']
          },
          {
            name: 'Moramo',
            desa: ['Lapuko', 'Moramo', 'Tambosupa', 'Sumber Sari']
          }
        ]
      },
      {
        name: 'Kabupaten Buton Selatan',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Batauga', desa: ['Busoa', 'Laompo', 'Majapahit', 'Masiri'] },
          { name: 'Sampolawa', desa: ['Mambulu', 'Katilombu', 'Lipumangau'] },
          { name: 'Siompu', desa: ['Biwinapada', 'Karae', 'Tongali'] }
        ]
      },
      {
        name: 'Kabupaten Buton Tengah',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Lakudo', desa: ['Gu Timur', 'Lakudo', 'Madongka'] },
          { name: 'Mawasangka', desa: ['Mawasangka', 'Kancebungi', 'Kanapa-Napa'] }
        ]
      },
      {
        name: 'Kabupaten Buton Utara',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Kulisusu', desa: ['Bonegunu', 'Lipu', 'Wangkanapi'] }
        ]
      },
      {
        name: 'Kabupaten Kolaka Utara',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Lasusua', desa: ['Lasusua', 'Patowanua', 'Batu Putih'] }
        ]
      },
      {
        name: 'Kabupaten Kolaka Timur',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Tirawuta', desa: ['Rate-Rate', 'Lalingato', 'Mowewe'] }
        ]
      },
      {
        name: 'Kabupaten Konawe Kepulauan',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Wawonii Barat', desa: ['Langara Laut', 'Lampeapi', 'Munse'] }
        ]
      },
      {
        name: 'Kabupaten Konawe Utara',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Asera', desa: ['Wanggudu', 'Asera', 'Andowia'] }
        ]
      },
      {
        name: 'Kabupaten Muna Barat',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Sawerigadi', desa: ['Ondoke', 'Guali', 'Lawa'] }
        ]
      }
    ]
  },
  {
    name: 'Jawa Barat',
    island: 'Jawa',
    kabupaten: [
      {
        name: 'Kota Bandung',
        type: 'Kota',
        kecamatan: [
          { name: 'Coblong', desa: ['Dago', 'Lebak Siliwangi', 'Sekeloa', 'Sadang Serang'] },
          { name: 'Lengkong', desa: ['Malabar', 'Burangrang', 'Cijagra', 'Turangga'] },
          { name: 'Sumur Bandung', desa: ['Braga', 'Kebon Pisang', 'Merdeka', 'Babakan Ciamis'] }
        ]
      },
      {
        name: 'Kabupaten Tasikmalaya',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Rajapolah (Sentra Anyaman)', desa: ['Rajapolah', 'Manggungjaya', 'Sukaraja'] },
          { name: 'Singaparna', desa: ['Singaparna', 'Cikunten', 'Sukaasih'] }
        ]
      },
      {
        name: 'Kabupaten Garut',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Tarogong Kidul', desa: ['Sukagalih', 'Haurpanggung', 'Tarogong'] },
          { name: 'Sukaregang (Sentra Kulit)', desa: ['Kota Wetan', 'Regol', 'Muara Sanding'] }
        ]
      }
    ]
  },
  {
    name: 'DI Yogyakarta',
    island: 'Jawa',
    kabupaten: [
      {
        name: 'Kota Yogyakarta',
        type: 'Kota',
        kecamatan: [
          { name: 'Kraton', desa: ['Patehan', 'Kadipaten', 'Panembahan'] },
          { name: 'Kotagede (Sentra Perak)', desa: ['Purbayan', 'Prenggan', 'Rejowinangun'] },
          { name: 'Ngampilan (Sentra Bakpia)', desa: ['Notoprajan', 'Ngampilan'] }
        ]
      },
      {
        name: 'Kabupaten Bantul',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Kasihan (Sentra Gerabah)', desa: ['Kasongan', 'Bangunjiwo', 'Tirtonirmolo'] },
          { name: 'Imogiri (Sentra Batik)', desa: ['Girirejo', 'Wukirsari', 'Karangtalun'] }
        ]
      }
    ]
  },
  {
    name: 'Jawa Tengah',
    island: 'Jawa',
    kabupaten: [
      {
        name: 'Kota Surakarta (Solo)',
        type: 'Kota',
        kecamatan: [
          { name: 'Laweyan (Kampung Batik)', desa: ['Laweyan', 'Bumi', 'Sondakan'] },
          { name: 'Pasar Kliwon', desa: ['Kauman', 'Pasar Kliwon', 'Kedung Lumbu'] }
        ]
      },
      {
        name: 'Kabupaten Jepara',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Tahunan (Sentra Ukir Kayu)', desa: ['Tahunan', 'Sukodono', 'Seninan'] },
          { name: 'Jepara', desa: ['Pengkol', 'Bulungan', 'Kauman'] }
        ]
      }
    ]
  },
  {
    name: 'Jawa Timur',
    island: 'Jawa',
    kabupaten: [
      {
        name: 'Kota Surabaya',
        type: 'Kota',
        kecamatan: [
          { name: 'Genteng', desa: ['Embong Kaliasin', 'Genteng', 'Kapasari'] },
          { name: 'Gubeng', desa: ['Airlangga', 'Baratajaya', 'Gubeng'] }
        ]
      },
      {
        name: 'Kabupaten Malang',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Batu (Sentra Apel)', desa: ['Sisir', 'Temas', 'Oro-Oro Ombo'] }
        ]
      }
    ]
  },
  {
    name: 'DKI Jakarta',
    island: 'Jawa',
    kabupaten: [
      {
        name: 'Kota Jakarta Selatan',
        type: 'Kota',
        kecamatan: [
          { name: 'Kebayoran Baru', desa: ['Senayan', 'Melawai', 'Gunung', 'Pulo'] },
          { name: 'Tebet', desa: ['Tebet Barat', 'Tebet Timur', 'Menteng Dalam'] }
        ]
      }
    ]
  },
  {
    name: 'Bali',
    island: 'Bali & Nusa Tenggara',
    kabupaten: [
      {
        name: 'Kabupaten Gianyar',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Ubud (Sentra Kesenian)', desa: ['Ubud', 'Peliatan', 'Kedewatan', 'Mas'] },
          { name: 'Sukawati (Pasar Seni)', desa: ['Sukawati', 'Batuan', 'Celuk (Perak)'] }
        ]
      },
      {
        name: 'Kota Denpasar',
        type: 'Kota',
        kecamatan: [
          { name: 'Denpasar Selatan', desa: ['Sanur', 'Renon', 'Panjer', 'Sesetan'] }
        ]
      }
    ]
  },
  {
    name: 'Sumatera Barat',
    island: 'Sumatera',
    kabupaten: [
      {
        name: 'Kota Bukittinggi',
        type: 'Kota',
        kecamatan: [
          { name: 'Guguk Panjang', desa: ['Benteng Pasar Atas', 'Aur Tajungkang', 'Campago'] }
        ]
      },
      {
        name: 'Kota Padang',
        type: 'Kota',
        kecamatan: [
          { name: 'Padang Barat', desa: ['Belakang Tangsi', 'Kampung Pondok', 'Purus'] }
        ]
      }
    ]
  },
  {
    name: 'Aceh',
    island: 'Sumatera',
    kabupaten: [
      {
        name: 'Kabupaten Aceh Tengah',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Bebesen (Kopi Gayo)', desa: ['Takengon Barat', 'Blang Kolak', 'Mongal'] }
        ]
      }
    ]
  },
  {
    name: 'Sulawesi Selatan',
    island: 'Sulawesi',
    kabupaten: [
      {
        name: 'Kota Makassar',
        type: 'Kota',
        kecamatan: [
          { name: 'Ujung Pandang', desa: ['Losari', 'Bulo Gading', 'Lajangiru'] }
        ]
      },
      {
        name: 'Kabupaten Tana Toraja',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Makale (Kopi & Ukir Toraja)', desa: ['Tondon Mamullu', 'Bombongan', 'Pantun'] }
        ]
      }
    ]
  },
  {
    name: 'Nusa Tenggara Timur',
    island: 'Bali & Nusa Tenggara',
    kabupaten: [
      {
        name: 'Kabupaten Sikka (Maumere)',
        type: 'Kabupaten',
        kecamatan: [
          { name: 'Alok (Sentra Tenun Ikat)', desa: ['Kota Uneng', 'Koting', 'Wairotang'] }
        ]
      }
    ]
  },
  {
    name: 'Papua',
    island: 'Papua',
    kabupaten: [
      {
        name: 'Kota Jayapura',
        type: 'Kota',
        kecamatan: [
          { name: 'Jayapura Utara', desa: ['Gurabesi', 'Tanjung Ria', 'Imbi'] }
        ]
      }
    ]
  },
  {
    name: 'Kalimantan Timur',
    island: 'Kalimantan',
    kabupaten: [
      {
        name: 'Kota Samarinda',
        type: 'Kota',
        kecamatan: [
          { name: 'Samarinda Seberang (Sarung Tenun)', desa: ['Mesjid', 'Baqa', 'Gunung Panjang'] }
        ]
      }
    ]
  }
];

// Helper functions for quick location lookups
export function getAllProvinces(): string[] {
  return INDONESIA_REGIONS.map((r) => r.name);
}

export function getKabupatenByProvince(provinceName: string): KabupatenItem[] {
  const prov = INDONESIA_REGIONS.find((p) => p.name.toLowerCase() === provinceName.toLowerCase());
  return prov ? prov.kabupaten : [];
}

export function getKecamatanByKabupaten(provinceName: string, kabupatenName: string): KecamatanItem[] {
  const kabList = getKabupatenByProvince(provinceName);
  const kab = kabList.find((k) => k.name.toLowerCase() === kabupatenName.toLowerCase());
  return kab ? kab.kecamatan : [];
}

export function getDesaByKecamatan(
  provinceName: string,
  kabupatenName: string,
  kecamatanName: string
): string[] {
  const kecList = getKecamatanByKabupaten(provinceName, kabupatenName);
  const kec = kecList.find((k) => k.name.toLowerCase() === kecamatanName.toLowerCase());
  return kec ? kec.desa : [];
}
