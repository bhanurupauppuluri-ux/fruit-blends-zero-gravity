export const FLAVOR_PROFILES = [
  {
    id: 'dragonfruit-blast',
    name: 'Dragonfruit Blast',
    tagline: 'Electric Vitality & Cosmic Antidote',
    description: 'An exhilarating blend of wild pitaya, deep purple acai, and silver birch water infused with organic lychee essence.',
    colors: {
      start: '#FF007A',
      end: '#7928CA',
      glow: 'rgba(255, 0, 122, 0.4)',
      accent: '#FF007A',
      liquid: '#E5006D'
    },
    gradientClass: 'from-[#FF007A] to-[#7928CA]',
    bgGradient: 'radial-gradient(circle at 50% 30%, rgba(255, 0, 122, 0.25) 0%, rgba(121, 40, 202, 0.15) 50%, rgba(8, 8, 12, 0) 80%)',
    notes: ['Electric', 'Exotic', 'Antioxidant-Packed', 'Velvety'],
    nutrition: {
      antioxidants: 98,
      sugars: 12,
      hydration: 94,
      vitaminC: 120
    },
    intensity: {
      sweetness: 72,
      acidity: 45,
      richness: 88,
      aroma: 95
    },
    ingredients: [
      { id: 'dragonfruit', name: 'Pitaya Slice', color: '#FF007A', type: 'fruit' },
      { id: 'acai', name: 'Acai Extract', color: '#4A0E4E', type: 'extract' },
      { id: 'mint', name: 'Fresh Mint', color: '#00F5A0', type: 'herb' },
      { id: 'ice', name: 'Zero-G Crystal Ice', color: '#A0E7E5', type: 'ice' }
    ]
  },
  {
    id: 'citrus-burst',
    name: 'Citrus Burst',
    tagline: 'Solar Fusion & Bio-Kinetic Surge',
    description: 'Crisp blood orange, ruby red grapefruit, and cold-pressed yuzu with micro-bubbles of sparkling Alpine spring water.',
    colors: {
      start: '#FF9900',
      end: '#FF0055',
      glow: 'rgba(255, 153, 0, 0.4)',
      accent: '#FF9900',
      liquid: '#FF6600'
    },
    gradientClass: 'from-[#FF9900] to-[#FF0055]',
    bgGradient: 'radial-gradient(circle at 50% 30%, rgba(255, 153, 0, 0.25) 0%, rgba(255, 0, 85, 0.15) 50%, rgba(8, 8, 12, 0) 80%)',
    notes: ['Tangy', 'Zesty', 'Electrolyte-Rich', 'Vibrant'],
    nutrition: {
      antioxidants: 85,
      sugars: 14,
      hydration: 99,
      vitaminC: 180
    },
    intensity: {
      sweetness: 60,
      acidity: 92,
      richness: 40,
      aroma: 90
    },
    ingredients: [
      { id: 'orange', name: 'Blood Orange', color: '#FF5500', type: 'fruit' },
      { id: 'yuzu', name: 'Yuzu Press', color: '#FFEE00', type: 'extract' },
      { id: 'lemon', name: 'Meyer Lemon', color: '#FFF066', type: 'fruit' },
      { id: 'ice', name: 'Zero-G Crystal Ice', color: '#A0E7E5', type: 'ice' }
    ]
  },
  {
    id: 'matcha-mint',
    name: 'Matcha Mint',
    tagline: 'Zen Clarity & Botanical Euphoria',
    description: 'Ceremonial grade Kyoto matcha harmonized with crisp spearmint, crushed lime, and coconut water droplets.',
    colors: {
      start: '#00F5A0',
      end: '#00D9F6',
      glow: 'rgba(0, 245, 160, 0.4)',
      accent: '#00F5A0',
      liquid: '#00C883'
    },
    gradientClass: 'from-[#00F5A0] to-[#00D9F6]',
    bgGradient: 'radial-gradient(circle at 50% 30%, rgba(0, 245, 160, 0.25) 0%, rgba(0, 217, 246, 0.15) 50%, rgba(8, 8, 12, 0) 80%)',
    notes: ['Zen', 'Refreshing', 'L-Theanine Boosting', 'Herbal'],
    nutrition: {
      antioxidants: 95,
      sugars: 8,
      hydration: 96,
      vitaminC: 90
    },
    intensity: {
      sweetness: 45,
      acidity: 35,
      richness: 75,
      aroma: 88
    },
    ingredients: [
      { id: 'matcha', name: 'Kyoto Matcha', color: '#00D06C', type: 'extract' },
      { id: 'mint', name: 'Spearmint Leaf', color: '#00F5A0', type: 'herb' },
      { id: 'lime', name: 'Key Lime', color: '#A2E048', type: 'fruit' },
      { id: 'ice', name: 'Zero-G Crystal Ice', color: '#A0E7E5', type: 'ice' }
    ]
  },
  {
    id: 'berry-galaxy',
    name: 'Berry Galaxy',
    tagline: 'Deep Cosmic Antioxidant Elixir',
    description: 'Wild blueberry, black raspberry, and elderberry cold infusion elevated with purple orchid petals.',
    colors: {
      start: '#9D00FF',
      end: '#FF007A',
      glow: 'rgba(157, 0, 255, 0.4)',
      accent: '#9D00FF',
      liquid: '#7A00B8'
    },
    gradientClass: 'from-[#9D00FF] to-[#FF007A]',
    bgGradient: 'radial-gradient(circle at 50% 30%, rgba(157, 0, 255, 0.25) 0%, rgba(255, 0, 122, 0.15) 50%, rgba(8, 8, 12, 0) 80%)',
    notes: ['Lush', 'Deep Berry', 'Polyphenol Rich', 'Smooth'],
    nutrition: {
      antioxidants: 100,
      sugars: 11,
      hydration: 92,
      vitaminC: 115
    },
    intensity: {
      sweetness: 78,
      acidity: 50,
      richness: 82,
      aroma: 92
    },
    ingredients: [
      { id: 'blueberry', name: 'Wild Blueberry', color: '#4130A8', type: 'fruit' },
      { id: 'blackberry', name: 'Black Raspberry', color: '#6A097D', type: 'fruit' },
      { id: 'elderberry', name: 'Elderberry Nectar', color: '#2B0B3F', type: 'extract' },
      { id: 'ice', name: 'Zero-G Crystal Ice', color: '#A0E7E5', type: 'ice' }
    ]
  }
];

export const INGREDIENT_ITEMS = [
  { id: 'dragonfruit', name: 'Pitaya Slice', color: '#FF007A', icon: '🌸', antioxidants: 25, sugars: 3, hydration: 22, vitaminC: 30 },
  { id: 'orange', name: 'Blood Orange', color: '#FF5500', icon: '🍊', antioxidants: 20, sugars: 4, hydration: 25, vitaminC: 45 },
  { id: 'mint', name: 'Spearmint Leaf', color: '#00F5A0', icon: '🍃', antioxidants: 15, sugars: 0, hydration: 10, vitaminC: 15 },
  { id: 'blueberry', name: 'Wild Blueberry', color: '#4130A8', icon: '🫐', antioxidants: 35, sugars: 2, hydration: 18, vitaminC: 25 },
  { id: 'kiwi', name: 'Sun Gold Kiwi', color: '#88D000', icon: '🥝', antioxidants: 22, sugars: 3, hydration: 20, vitaminC: 40 },
  { id: 'strawberry', name: 'Alpine Strawberry', color: '#FF2A4B', icon: '🍓', antioxidants: 18, sugars: 2, hydration: 20, vitaminC: 35 },
  { id: 'ice', name: 'Zero-G Crystal Ice', color: '#A0E7E5', icon: '🧊', antioxidants: 0, sugars: 0, hydration: 30, vitaminC: 0 }
];
