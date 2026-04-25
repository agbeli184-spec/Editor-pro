export interface Sound {
  id: string;
  title: string;
  artist: string;
  duration: string;
  trendFactor: 'Rising' | 'Explosive' | 'Steady';
  category: 'Sad' | 'Actions' | 'Vibe' | 'Cinematic';
  url: string;
  bpm: number;
  beatIntervals: number[]; // timestamps in seconds
  thumbnail: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  vibe: 'Dark' | 'Glow' | 'VHS' | 'Smooth' | 'Retro' | 'Glitch';
  previewUrl: string;
  recommendedCaptionCategory: string;
  steps: string[];
  isTrending?: boolean;
}

export interface Effect {
  id: string;
  name: string;
  category: 'Motion' | 'Visual' | 'Transition' | 'Glitch' | 'Light' | 'Blur';
  previewUrl: string;
  parameters?: {
    label: string;
    min: number;
    max: number;
    defaultValue: number;
  }[];
}

export interface PresetPack {
  id: string;
  name: string;
  description: string;
  effects: string[]; // List of effect IDs
  thumbnail: string;
}

export interface Tutorial {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  steps: { title: string; content: string }[];
  thumbnail: string;
}

export const EFFECTS: Effect[] = [
  // Motion
  { id: 'm1', name: 'Shake', category: 'Motion', previewUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&q=80', parameters: [{ label: 'Intensity', min: 0, max: 100, defaultValue: 50 }, { label: 'Speed', min: 0, max: 100, defaultValue: 40 }] },
  { id: 'm2', name: 'Zoom In', category: 'Motion', previewUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=200&q=80' },
  { id: 'm3', name: 'Spin', category: 'Motion', previewUrl: 'https://images.unsplash.com/photo-1533109721025-d1ae7ee7c1e1?w=200&q=80' },
  { id: 'm4', name: 'Parallax', category: 'Motion', previewUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&q=80' },
  { id: 'm5', name: 'Camera Tilt', category: 'Motion', previewUrl: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=200&q=80' },
  
  // Glitch
  { id: 'g1', name: 'RGB Split', category: 'Glitch', previewUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&q=80', parameters: [{ label: 'Shift', min: 0, max: 100, defaultValue: 30 }] },
  { id: 'g2', name: 'VHS Static', category: 'Glitch', previewUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80' },
  { id: 'g3', name: 'Digital Noise', category: 'Glitch', previewUrl: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=200&q=80' },
  { id: 'g4', name: 'Data Mosh', category: 'Glitch', previewUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80' },
  { id: 'g5', name: 'Sync Leak', category: 'Glitch', previewUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },

  // Light
  { id: 'l1', name: 'Lens Bloom', category: 'Light', previewUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=200&q=80', parameters: [{ label: 'Radius', min: 0, max: 100, defaultValue: 60 }] },
  { id: 'l2', name: 'Neon Edge', category: 'Light', previewUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&q=80' },
  { id: 'l3', name: 'Solar Flare', category: 'Light', previewUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },
  { id: 'l4', name: 'Disco Pulse', category: 'Light', previewUrl: 'https://images.unsplash.com/photo-1533109721025-d1ae7ee7c1e1?w=200&q=80' },
  { id: 'l5', name: 'Shadow Play', category: 'Light', previewUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&q=80' },

  // Blur
  { id: 'b1', name: 'Motion Blur', category: 'Blur', previewUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&q=80', parameters: [{ label: 'Strength', min: 0, max: 100, defaultValue: 40 }] },
  { id: 'b2', name: 'Gaussian Filter', category: 'Blur', previewUrl: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=200&q=80' },
  { id: 'b3', name: 'Tilt Shift', category: 'Blur', previewUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=80' },
];

export const PRESET_PACKS: PresetPack[] = [
  { 
    id: 'pack1', 
    name: 'TikTok Viral', 
    description: 'The most popular effects for trending edits.',
    effects: ['m1', 'g1', 'l1'],
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80'
  },
  { 
    id: 'pack2', 
    name: 'Lo-Fi Aesthetic', 
    description: 'Soft, vintage, and chill vibes.',
    effects: ['g2', 'b1', 'l2'],
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80'
  },
  {
    id: 'pack3',
    name: 'Cyberpunk Redux',
    description: 'Heavy neon and digital distortion.',
    effects: ['g3', 'l2', 'm3'],
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80'
  },
  {
    id: 'pack4',
    name: 'Action Master',
    description: 'Fast-paced transitions and motion effects.',
    effects: ['m2', 'm4', 'b1', 'l4'],
    thumbnail: 'https://images.unsplash.com/photo-1533109721025-d1ae7ee7c1e1?w=400&q=80'
  }
];

export const TUTORIALS: Tutorial[] = [
  {
    id: 't1',
    title: 'The "Ghost" Transition',
    difficulty: 'Beginner',
    duration: '2 min',
    thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    steps: [
      { title: 'Overlap clips', content: 'Place two clips on top of each other for 0.5 seconds.' },
      { title: 'Opacity animation', content: 'The top clip should fade from 0% to 100% while scaling up.' },
    ]
  },
  {
    id: 't2',
    title: 'Neon Portrait Glow',
    difficulty: 'Intermediate',
    duration: '5 min',
    thumbnail: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&q=80',
    steps: [
      { title: 'Select edges', content: 'Use the edge detection mask to isolate subject silhouette.' },
      { title: 'Apply Bloom', content: 'Add Gaussian blur and increase exposure on the mask layer.' },
    ]
  },
  {
    id: 't3',
    title: 'Cyber Glitch Loop',
    difficulty: 'Advanced',
    duration: '8 min',
    thumbnail: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=800&q=80',
    steps: [
      { title: 'Sync to beat', content: 'Mark every major kick in the audio track.' },
      { title: 'Flash RGB', content: 'On each mark, apply a 0.1s RGB split effect.' },
      { title: 'Frame Freeze', content: 'Capture a still frame for the loop point.' },
    ]
  }
];

export const SOUNDS: Sound[] = [
  {
    id: 's1',
    title: 'Night Drive Phonk',
    artist: 'Ghostface Playa',
    duration: '0:15',
    trendFactor: 'Explosive',
    category: 'Vibe',
    url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_502758178a.mp3',
    bpm: 128,
    beatIntervals: [0.5, 1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6, 10.8],
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80'
  },
  {
    id: 's2',
    title: 'Slowed Cinematic',
    artist: 'Lofi Girl',
    duration: '0:30',
    trendFactor: 'Rising',
    category: 'Cinematic',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58ef.mp3',
    bpm: 85,
    beatIntervals: [1.5, 3.0, 4.5, 6.0, 7.5, 9.0, 10.5, 12.0],
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80'
  },
  {
    id: 's3',
    title: 'Savage Energy',
    artist: 'Drill King',
    duration: '0:12',
    trendFactor: 'Steady',
    category: 'Actions',
    url: 'https://cdn.pixabay.com/audio/2023/10/16/audio_9671607f2a.mp3',
    bpm: 140,
    beatIntervals: [0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2],
    thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&q=80'
  },
  {
    id: 's4',
    title: 'Cyberfunk 2077',
    artist: 'Neon Demon',
    duration: '0:20',
    trendFactor: 'Rising',
    category: 'Vibe',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a1b5d5.mp3',
    bpm: 120,
    beatIntervals: [1, 2, 3, 4, 5],
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&q=80'
  },
  {
    id: 's5',
    title: 'Deep Focus Chill',
    artist: 'Study Beats',
    duration: '0:45',
    trendFactor: 'Steady',
    category: 'Sad',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_180293750f.mp3',
    bpm: 70,
    beatIntervals: [2, 4, 6, 8],
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&q=80'
  },
  {
    id: 's6',
    title: 'Hyperpop Blast',
    artist: 'Glitched Reality',
    duration: '0:10',
    trendFactor: 'Explosive',
    category: 'Vibe',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2d836365ad.mp3',
    bpm: 160,
    beatIntervals: [0.2, 0.4, 0.6, 0.8],
    thumbnail: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=200&q=80'
  },
  {
    id: 's7',
    title: 'Midnight Jazz',
    artist: 'Smooth Operator',
    duration: '0:40',
    trendFactor: 'Steady',
    category: 'Vibe',
    url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_d0862086e3.mp3',
    bpm: 90,
    beatIntervals: [1, 2, 3, 4],
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80'
  }
];

export const PRESETS: Preset[] = [
  {
    id: 'p1',
    name: 'Onyx Aesthetic',
    description: 'Deep blacks and high contrast for a mysterious vibe.',
    vibe: 'Dark',
    previewUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    recommendedCaptionCategory: 'Savage',
    steps: ['Exposure: -20', 'Contrast: +30', 'Saturation: -15'],
    isTrending: true
  },
  {
    id: 'p2',
    name: 'Ethereal Glow',
    description: 'Soft lighting and hazy edges for a dreamlike look.',
    vibe: 'Glow',
    previewUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    recommendedCaptionCategory: 'Love',
    steps: ['Exposure: +10', 'Highlights: +20', 'Blur: 5%'],
    isTrending: true
  },
  {
    id: 'p3',
    name: 'Velocity Blur',
    description: 'Perfect for transition edits and action sequence.',
    vibe: 'Smooth',
    previewUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    recommendedCaptionCategory: 'Cinematic',
    steps: ['Motion Blur: 40%', 'Speed: 0.8x -> 1.5x Ramp'],
    isTrending: false
  },
  {
    id: 'p4',
    name: 'Neon Cyber',
    description: 'Blue and pink highlights for that futuristic street look.',
    vibe: 'Glitch',
    previewUrl: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=800&q=80',
    recommendedCaptionCategory: 'Tech',
    steps: ['Hue Shift: +40', 'Bloom: 15%', 'Sharpen: +20'],
    isTrending: true
  },
  {
    id: 'p5',
    name: 'Vintage Film',
    description: 'Warm tones and grainy texture like old 35mm film.',
    vibe: 'Retro',
    previewUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80',
    recommendedCaptionCategory: 'Moments',
    steps: ['Grani: 10%', 'Temperature: +15', 'Faded Film: +25'],
    isTrending: false
  }
];
