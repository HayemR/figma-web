import apexPredatorImg from '@/assets/pcs/apex-predator-removebg-preview.png'
import apexBronzeImg from '@/assets/pcs/apex-bronze-removebg-preview.png'
import apexXtreme007Img from '@/assets/pcs/apex-xtreme-007-removebg-preview.png'
import quantumReaperImg from '@/assets/pcs/quantum-reaper-removebg-preview.png'

export const products = [
  {
    id: 1,
    name: 'Apex Predator',
    price: 799,
    rating: 4.6,
    tag: 'NEW',
    image: apexPredatorImg,
    overview:
      'Apex Predator is tuned for high-FPS esports with a clean airflow-optimized chassis and punchy 1080p/1440p performance.',
    model: 'Apex Predator',
    specs: {
      cpu: 'Ryzen 5 7600X',
      gpu: 'RTX 4060 Ti',
      ram: '32GB DDR5',
      storage: '1TB NVMe Gen4',
      cooling: '240mm AIO',
      psu: '750W Gold',
    },
  },
  {
    id: 2,
    name: 'Apex Bronze',
    price: 649,
    rating: 4.2,
    tag: 'NEW',
    image: apexBronzeImg,
    overview:
      'Apex Bronze delivers quiet thermals and dependable daily performance—perfect for creators who also game at night.',
    model: 'Apex Bronze',
    specs: {
      cpu: 'Intel i5-14400F',
      gpu: 'RTX 4060',
      ram: '16GB DDR5',
      storage: '1TB NVMe',
      cooling: 'Air tower cooler',
      psu: '650W Bronze',
    },
  },
  {
    id: 3,
    name: 'Apex Xtreme 007',
    price: 1299,
    rating: 4.8,
    tag: 'NEW',
    image: apexXtreme007Img,
    overview:
      'Built for cinematic 4K, Apex Xtreme 007 pairs a powerhouse GPU with tuned memory for relentless rendering and streaming.',
    model: 'Apex Xtreme 007',
    specs: {
      cpu: 'Ryzen 7 7800X3D',
      gpu: 'RTX 4070 Super',
      ram: '32GB DDR5',
      storage: '2TB NVMe Gen4',
      cooling: '360mm AIO',
      psu: '850W Gold',
    },
  },
  {
    id: 4,
    name: 'Quantum Reaper',
    price: 1599,
    rating: 4.9,
    tag: 'NEW',
    image: quantumReaperImg,
    overview:
      'Quantum Reaper is the signature build: neon aesthetics, extreme cooling, and elite performance for competitive dominance.',
    model: 'Quantum Reaper',
    specs: {
      cpu: 'Intel i7-14700K',
      gpu: 'RTX 4080',
      ram: '64GB DDR5',
      storage: '2TB NVMe Gen4 + 4TB SSD',
      cooling: 'Custom loop',
      psu: '1000W Platinum',
    },
  },
]

export const featuredProducts = [
  products.find((p) => p.name === 'Quantum Reaper'),
  products.find((p) => p.name === 'Apex Predator'),
].filter(Boolean)
