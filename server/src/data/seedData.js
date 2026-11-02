import bcrypt from 'bcryptjs';

export const getSeedData = () => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Password123!', salt);
  const adminPasswordHash = bcrypt.hashSync('Admin123!', salt);

  const users = [
    {
      _id: 'usr_admin_001',
      name: 'Cinema Admin',
      email: 'admin@imovies.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+1 555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_demo_002',
      name: 'Alex Johnson',
      email: 'user@imovies.com',
      password: passwordHash,
      role: 'user',
      phone: '+1 555-0144',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    }
  ];

  const theaters = [
    {
      _id: 'th_001',
      name: 'IMovies Grand IMAX & 4DX',
      location: 'Metropolis Downtown Plaza, Floor 4',
      city: 'New York',
      screens: ['IMAX Laser Screen 1', 'Dolby Cinema Screen 2', 'VIP Gold Screen 3'],
      facilities: ['Dolby Atmos', '4K Laser Projection', 'VIP Recliners', 'Gourmet Dining', 'Wheelchair Accessible']
    },
    {
      _id: 'th_002',
      name: 'IMovies Cineplex Sunset',
      location: '742 Evergreen Boulevard',
      city: 'Los Angeles',
      screens: ['Prime Screen A', 'Laser 3D Screen B', 'Lounge Screen C'],
      facilities: ['Dolby Atmos', 'Reserved Recliner Seating', 'Cocktail Bar', 'Self-Service Kiosks']
    },
    {
      _id: 'th_003',
      name: 'IMovies Stellar Center',
      location: 'Riverside Avenue, Baywalk',
      city: 'Chicago',
      screens: ['Screen 1', 'Screen 2', 'Screen 3'],
      facilities: ['Standard 2D/3D', 'Stereo Surround', 'Snack Bar']
    }
  ];

  const movies = [
    {
      _id: 'mov_001',
      title: 'Dune: Part Two',
      tagline: 'Long live the fighters.',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
      youtubeId: 'Way9Dexny3w',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      duration: '2h 46m',
      releaseDate: '2024-03-01',
      rating: 8.6,
      votes: '420K',
      language: 'English',
      certificate: 'PG-13',
      featured: true,
      price: 15,
      cast: [
        { name: 'Timothée Chalamet', role: 'Paul Atreides', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Zendaya', role: 'Chani', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { name: 'Rebecca Ferguson', role: 'Lady Jessica', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
        { name: 'Austin Butler', role: 'Feyd-Rautha', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_002',
      title: 'Oppenheimer',
      tagline: 'The world forever changes.',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, probing the moral dilemma and political fallout that followed.',
      poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
      youtubeId: 'uYPbbksJxIg',
      genre: ['Biography', 'Drama', 'History'],
      duration: '3h 00m',
      releaseDate: '2023-07-21',
      rating: 8.9,
      votes: '680K',
      language: 'English',
      certificate: 'R',
      featured: true,
      price: 16,
      cast: [
        { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Emily Blunt', role: 'Katherine Oppenheimer', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
        { name: 'Robert Downey Jr.', role: 'Lewis Strauss', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_003',
      title: 'The Dark Knight',
      tagline: 'Why so serious?',
      description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham City, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
      youtubeId: 'EXeTwQWrcwY',
      genre: ['Action', 'Crime', 'Drama'],
      duration: '2h 32m',
      releaseDate: '2024-08-15',
      rating: 9.0,
      votes: '2.8M',
      language: 'English',
      certificate: 'PG-13',
      featured: true,
      price: 16,
      cast: [
        { name: 'Christian Bale', role: 'Bruce Wayne / Batman', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Heath Ledger', role: 'The Joker', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Gary Oldman', role: 'Jim Gordon', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_004',
      title: 'Inception',
      tagline: 'Your mind is the scene of the crime.',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.',
      poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
      youtubeId: 'YoHD9XEInc0',
      genre: ['Sci-Fi', 'Action', 'Thriller'],
      duration: '2h 28m',
      releaseDate: '2024-09-01',
      rating: 8.8,
      votes: '2.4M',
      language: 'English',
      certificate: 'PG-13',
      featured: true,
      price: 15,
      cast: [
        { name: 'Leonardo DiCaprio', role: 'Dom Cobb', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Joseph Gordon-Levitt', role: 'Arthur', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
        { name: 'Elliot Page', role: 'Ariadne', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_005',
      title: 'Interstellar',
      tagline: 'Mankind was born on Earth. It was never meant to die here.',
      description: 'A team of explorers travel through a newly discovered wormhole near Saturn in an attempt to ensure humanity\'s survival across alternate habitable worlds.',
      poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
      youtubeId: 'zSWdZVtXT7E',
      genre: ['Sci-Fi', 'Adventure', 'Drama'],
      duration: '2h 49m',
      releaseDate: '2024-11-10',
      rating: 8.7,
      votes: '2.1M',
      language: 'English',
      certificate: 'PG-13',
      featured: false,
      price: 15,
      cast: [
        { name: 'Matthew McConaughey', role: 'Cooper', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Anne Hathaway', role: 'Brand', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
        { name: 'Jessica Chastain', role: 'Murph', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_006',
      title: 'Spider-Man: Across the Spider-Verse',
      tagline: 'It\'s how you wear the mask that matters.',
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash, Miles must redefine what it means to be a hero.',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
      youtubeId: 'cqGjhVJWtEg',
      genre: ['Animation', 'Action', 'Adventure'],
      duration: '2h 20m',
      releaseDate: '2024-06-02',
      rating: 8.7,
      votes: '360K',
      language: 'English',
      certificate: 'PG',
      featured: false,
      price: 14,
      cast: [
        { name: 'Shameik Moore', role: 'Miles Morales', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
        { name: 'Hailee Steinfeld', role: 'Gwen Stacy', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
        { name: 'Oscar Isaac', role: 'Miguel O\'Hara', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_007',
      title: 'Gladiator II',
      tagline: 'What we do in life echoes in eternity.',
      description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by tyrannical emperors who lead Rome with an iron fist.',
      poster: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
      youtubeId: '4rgYUipGJNo',
      genre: ['Action', 'Adventure', 'Drama'],
      duration: '2h 28m',
      releaseDate: '2024-11-22',
      rating: 8.3,
      votes: '180K',
      language: 'English',
      certificate: 'R',
      featured: false,
      price: 16,
      cast: [
        { name: 'Paul Mescal', role: 'Lucius', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Pedro Pascal', role: 'General Marcus Acacius', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Denzel Washington', role: 'Macrinus', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_008',
      title: 'Deadpool & Wolverine',
      tagline: 'Come together.',
      description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy and save the multiverse.',
      poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
      youtubeId: '73_1biulkYk',
      genre: ['Action', 'Comedy', 'Sci-Fi'],
      duration: '2h 07m',
      releaseDate: '2024-07-26',
      rating: 8.2,
      votes: '410K',
      language: 'English',
      certificate: 'R',
      featured: false,
      price: 16,
      cast: [
        { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Hugh Jackman', role: 'Logan / Wolverine', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Emma Corrin', role: 'Cassandra Nova', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_009',
      title: 'Avatar: The Way of Water',
      tagline: 'Return to Pandora.',
      description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
      youtubeId: 'd9MyW72ELq0',
      genre: ['Sci-Fi', 'Action', 'Adventure'],
      duration: '3h 12m',
      releaseDate: '2024-05-10',
      rating: 8.1,
      votes: '520K',
      language: 'English',
      certificate: 'PG-13',
      featured: false,
      price: 17,
      cast: [
        { name: 'Sam Worthington', role: 'Jake Sully', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Zoe Saldana', role: 'Neytiri', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { name: 'Sigourney Weaver', role: 'Kiri', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_010',
      title: 'Top Gun: Maverick',
      tagline: 'Feel the need... the need for speed.',
      description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on an impossible mission.',
      poster: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e91f?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/giXco2jaZ_4',
      youtubeId: 'giXco2jaZ_4',
      genre: ['Action', 'Drama'],
      duration: '2h 10m',
      releaseDate: '2024-04-18',
      rating: 8.3,
      votes: '690K',
      language: 'English',
      certificate: 'PG-13',
      featured: false,
      price: 15,
      cast: [
        { name: 'Tom Cruise', role: 'Pete "Maverick" Mitchell', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Miles Teller', role: 'Bradley "Rooster" Bradshaw', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Jennifer Connelly', role: 'Penny Benjamin', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_011',
      title: 'John Wick: Chapter 4',
      tagline: 'Baba Yaga returns.',
      description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.',
      poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/qEVUtrk8_B4',
      youtubeId: 'qEVUtrk8_B4',
      genre: ['Action', 'Thriller', 'Crime'],
      duration: '2h 49m',
      releaseDate: '2024-03-24',
      rating: 8.1,
      votes: '390K',
      language: 'English',
      certificate: 'R',
      featured: false,
      price: 15,
      cast: [
        { name: 'Keanu Reeves', role: 'John Wick', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Donnie Yen', role: 'Caine', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Bill Skarsgård', role: 'Marquis', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_012',
      title: 'Barbie',
      tagline: 'She\'s everything. He\'s just Ken.',
      description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/pBk4NYhWNMM',
      youtubeId: 'pBk4NYhWNMM',
      genre: ['Comedy', 'Adventure', 'Fantasy'],
      duration: '1h 54m',
      releaseDate: '2024-02-14',
      rating: 8.0,
      votes: '550K',
      language: 'English',
      certificate: 'PG-13',
      featured: false,
      price: 14,
      cast: [
        { name: 'Margot Robbie', role: 'Barbie', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { name: 'Ryan Gosling', role: 'Ken', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'America Ferrera', role: 'Gloria', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_013',
      title: 'Blade Runner 2049',
      tagline: 'The key to the future is finally unearthed.',
      description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/gCcx85zbxz4',
      youtubeId: 'gCcx85zbxz4',
      genre: ['Sci-Fi', 'Cyberpunk', 'Mystery'],
      duration: '2h 44m',
      releaseDate: '2024-10-06',
      rating: 8.5,
      votes: '640K',
      language: 'English',
      certificate: 'R',
      featured: false,
      price: 15,
      cast: [
        { name: 'Ryan Gosling', role: 'Officer K', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Harrison Ford', role: 'Rick Deckard', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Ana de Armas', role: 'Joi', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_014',
      title: 'Avengers: Endgame',
      tagline: 'Part of the journey is the end.',
      description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/TcMBFSGVi1c',
      youtubeId: 'TcMBFSGVi1c',
      genre: ['Action', 'Sci-Fi', 'Adventure'],
      duration: '3h 01m',
      releaseDate: '2024-04-26',
      rating: 8.7,
      votes: '1.3M',
      language: 'English',
      certificate: 'PG-13',
      featured: false,
      price: 16,
      cast: [
        { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80' },
        { name: 'Chris Evans', role: 'Steve Rogers / Captain America', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Scarlett Johansson', role: 'Natasha Romanoff', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_015',
      title: 'The Batman',
      tagline: 'Unmask the truth.',
      description: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
      poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4',
      youtubeId: 'mqqft2x_Aa4',
      genre: ['Action', 'Crime', 'Drama'],
      duration: '2h 56m',
      releaseDate: '2024-03-04',
      rating: 8.2,
      votes: '780K',
      language: 'English',
      certificate: 'PG-13',
      featured: false,
      price: 15,
      cast: [
        { name: 'Robert Pattinson', role: 'Bruce Wayne / The Batman', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Zoë Kravitz', role: 'Selina Kyle / Catwoman', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { name: 'Paul Dano', role: 'Edward Nashton / The Riddler', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_016',
      title: 'Joker: Folie à Deux',
      tagline: 'The world is a stage.',
      description: 'Arthur Fleck is institutionalized at Arkham awaiting trial for his crimes as Joker. While struggling with his dual identity, Arthur not only stumbles upon true love, but also finds the music that\'s always been inside him.',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/_OKAwz2MsJs',
      youtubeId: '_OKAwz2MsJs',
      genre: ['Drama', 'Crime', 'Musical'],
      duration: '2h 18m',
      releaseDate: '2024-10-04',
      rating: 8.0,
      votes: '290K',
      language: 'English',
      certificate: 'R',
      featured: false,
      price: 15,
      cast: [
        { name: 'Joaquin Phoenix', role: 'Arthur Fleck / Joker', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Lady Gaga', role: 'Lee Quinzel / Harley Quinn', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { name: 'Brendan Gleeson', role: 'Jackie Sullivan', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_017',
      title: 'Cyberpulse 2099',
      tagline: 'The machine is awake. Humanity is on trial.',
      description: 'In a neon-drenched metropolis under synthetic sky cover, a rogue cyber-detective uncovers a consciousness transfer conspiracy that threatens to replace humanity with artificial souls.',
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/LembwKDo1Dc',
      youtubeId: 'LembwKDo1Dc',
      genre: ['Cyberpunk', 'Action', 'Thriller'],
      duration: '2h 15m',
      releaseDate: '2025-01-15',
      rating: 8.4,
      votes: '190K',
      language: 'English',
      certificate: 'PG-13',
      featured: false,
      price: 14,
      cast: [
        { name: 'Kaelen Vance', role: 'Detective Jax', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
        { name: 'Mira Soren', role: 'Aria-9', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_018',
      title: 'Midnight Jazz & Rain',
      tagline: 'Some melodies never fade away.',
      description: 'A gifted but reclusive jazz pianist in 1950s Paris strikes an unexpected musical romance with an enigmatic singer running from an espionage syndicate.',
      poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
      youtubeId: 'Way9Dexny3w',
      genre: ['Romance', 'Music', 'Drama'],
      duration: '1h 55m',
      releaseDate: '2025-02-14',
      rating: 8.2,
      votes: '89K',
      language: 'French / English',
      certificate: 'PG',
      featured: false,
      price: 12,
      cast: [
        { name: 'Lucas Moreau', role: 'Henri', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Camille Dupuis', role: 'Claire', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_019',
      title: 'Jailer',
      tagline: 'Tiger Muthuvel Pandian arrives to protect his family.',
      description: 'Muthuvel Pandian, a strict yet retired jailer, sets out on a relentless quest to dismantle an eccentric crime syndicate and avenge the alleged murder of his police officer son.',
      poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/xenOE1Tma0A',
      youtubeId: 'xenOE1Tma0A',
      genre: ['Action', 'Crime', 'Thriller'],
      duration: '2h 48m',
      releaseDate: '2023-08-10',
      rating: 8.1,
      votes: '190K',
      language: 'Tamil / Multi',
      certificate: 'PG-13',
      featured: true,
      price: 15,
      cast: [
        { name: 'Rajinikanth', role: 'Tiger Muthuvel Pandian', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Mohanlal', role: 'Mathew', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Shiva Rajkumar', role: 'Narasimha', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Vinayakan', role: 'Varman', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    {
      _id: 'mov_020',
      title: 'Free Guy',
      tagline: 'Life is too short to be a background character.',
      description: 'A bank teller discovers that he is actually an NPC inside a brutal open-world video game called Free City. Taking matters into his own hands, he decides to become the hero of his own story.',
      poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      backdrop: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/X2m-08c50pc',
      youtubeId: 'X2m-08c50pc',
      genre: ['Action', 'Comedy', 'Sci-Fi'],
      duration: '1h 55m',
      releaseDate: '2021-08-13',
      rating: 7.1,
      votes: '410K',
      language: 'English',
      certificate: 'PG-13',
      featured: true,
      price: 14,
      cast: [
        { name: 'Ryan Reynolds', role: 'Guy', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { name: 'Jodie Comer', role: 'Millie / Molotov Girl', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { name: 'Joe Keery', role: 'Keys', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
        { name: 'Taika Waititi', role: 'Antwan', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80' }
      ]
    }
  ];

  // Generate showtimes for today and the next 5 days
  const showtimes = [];
  const times = ['10:30 AM', '01:45 PM', '04:30 PM', '07:15 PM', '10:00 PM'];
  
  const today = new Date();
  for (let d = 0; d < 6; d++) {
    const showDate = new Date(today);
    showDate.setDate(today.getDate() + d);
    const dateStr = showDate.toISOString().split('T')[0];

    movies.forEach((movie, mIndex) => {
      // Pick 2 theaters per movie
      theaters.slice(0, 2).forEach((theater, tIndex) => {
        // Pick 2-3 times
        const selectedTimes = d % 2 === 0 ? [times[0], times[2], times[3]] : [times[1], times[3], times[4]];
        
        selectedTimes.forEach((time, sIdx) => {
          // Pre-book some seats for realism (e.g., C3, C4, D5)
          const prebooked = [];
          if (d === 0) {
            prebooked.push(
              { seatNumber: 'C4', tier: 'Silver', user: 'usr_demo_002', bookingId: 'bk_sample_01' },
              { seatNumber: 'C5', tier: 'Silver', user: 'usr_demo_002', bookingId: 'bk_sample_01' },
              { seatNumber: 'E6', tier: 'Gold', user: 'usr_sample_99', bookingId: 'bk_sample_02' },
              { seatNumber: 'E7', tier: 'Gold', user: 'usr_sample_99', bookingId: 'bk_sample_02' }
            );
          }

          showtimes.push({
            _id: `st_${movie._id}_${theater._id}_d${d}_${sIdx}`,
            movieId: movie._id,
            theaterId: theater._id,
            theaterName: theater.name,
            movieTitle: movie.title,
            screenName: theater.screens[sIdx % theater.screens.length],
            date: dateStr,
            time: time,
            priceTiers: {
              Silver: movie.price,
              Gold: Math.round(movie.price * 1.35),
              VIP: Math.round(movie.price * 1.8)
            },
            bookedSeats: prebooked,
            totalSeats: 64 // 8 rows x 8 cols
          });
        });
      });
    });
  }

  const sampleBookings = [
    {
      _id: 'bk_sample_01',
      userId: 'usr_demo_002',
      showtimeId: showtimes[0]?._id || 'st_sample',
      movieTitle: 'Dune: Part Two',
      moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      theaterName: 'IMovies Grand IMAX & 4DX',
      screenName: 'IMAX Laser Screen 1',
      date: showtimes[0]?.date || new Date().toISOString().split('T')[0],
      time: showtimes[0]?.time || '04:30 PM',
      seats: ['C4', 'C5'],
      tier: 'Silver',
      ticketPrice: 15,
      subtotal: 30,
      tax: 3.6,
      snacks: [
        { item: 'Caramel Popcorn (L)', qty: 1, price: 8 },
        { item: 'Fountain Soda (M)', qty: 2, price: 5 }
      ],
      totalAmount: 51.6,
      paymentMethod: 'Credit Card',
      paymentStatus: 'PAID',
      bookingCode: 'IMV-8942-DUNE',
      createdAt: new Date().toISOString()
    }
  ];

  return { users, theaters, movies, showtimes, sampleBookings };
};
