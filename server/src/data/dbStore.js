import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSeedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'store.json');

class DBStore {
  constructor() {
    this.data = {
      users: [],
      theaters: [],
      movies: [],
      showtimes: [],
      bookings: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(STORE_PATH)) {
      try {
        const fileContent = fs.readFileSync(STORE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure collections exist
        ['users', 'theaters', 'movies', 'showtimes', 'bookings'].forEach(c => {
          if (!this.data[c]) this.data[c] = [];
        });
        if (this.data.movies.length === 0) {
          this.seed();
        }
      } catch (err) {
        console.error('Failed to parse existing store.json, re-seeding:', err.message);
        this.seed();
      }
    } else {
      this.seed();
    }
  }

  seed() {
    const seed = getSeedData();
    this.data = {
      users: seed.users,
      theaters: seed.theaters,
      movies: seed.movies,
      showtimes: seed.showtimes,
      bookings: seed.sampleBookings
    };
    this.save();
    console.log('✅ DBStore successfully initialized with rich seed data!');
  }

  save() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DBStore to file:', err.message);
    }
  }

  // Generic collection helpers
  find(collection, filter = {}) {
    const items = this.data[collection] || [];
    return items.filter(item => {
      for (const key of Object.keys(filter)) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  findOne(collection, filter = {}) {
    const items = this.data[collection] || [];
    return items.find(item => {
      for (const key of Object.keys(filter)) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    }) || null;
  }

  findById(collection, id) {
    const items = this.data[collection] || [];
    return items.find(item => item._id === id || item.id === id) || null;
  }

  create(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    const newItem = {
      _id: item._id || `${collection.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      ...item
    };
    this.data[collection].unshift(newItem);
    this.save();
    return newItem;
  }

  findByIdAndUpdate(collection, id, updates) {
    const index = (this.data[collection] || []).findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data[collection][index];
  }

  findByIdAndDelete(collection, id) {
    const index = (this.data[collection] || []).findIndex(item => item._id === id || item.id === id);
    if (index === -1) return false;
    const deleted = this.data[collection].splice(index, 1)[0];
    this.save();
    return deleted;
  }
}

export const dbStore = new DBStore();
