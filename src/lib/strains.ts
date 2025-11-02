const prefixes = [
    'Northern', 'Southern', 'Eastern', 'Western', 'Blue', 'Red', 'Purple', 'Green',
    'Yellow', 'White', 'Golden', 'Silver', 'Bronze', 'Black', 'Pink', 'Orange',
    'Crimson', 'Emerald', 'Sapphire', 'Ruby', 'Amethyst', 'Marigold', 'Lavender',
    'Lemon', 'Lime', 'Cherry', 'Strawberry', 'Grape', 'Pineapple', 'Mango',
    'Apple', 'Banana', 'Peach', 'Watermelon', 'Kiwi', 'Tangerine', 'Plum',
    'Candy', 'Cookie', 'Cake', 'Brownie', 'Muffin', 'Pudding', 'Chocolate',
    'Caramel', 'Toffee', 'Vanilla', 'Mint', 'Cinnamon', 'Coffee', 'Hazelnut',
    'Diesel', 'Sour', 'Sweet', 'Spicy', 'Salty', 'Tangy', 'Zesty', 'Earthy',
    'Super', 'Ultra', 'Mega', 'Giga', 'Nano', 'Atomic', 'Cosmic', 'Galactic',
    'Master', 'Grandmaster', 'Royal', 'Imperial', 'King', 'Queen', 'Prince',
    'Princess', 'Emperor', 'Empress', 'Duke', 'Duchess', 'Count', 'Baron',
    'Grand', 'Giant', 'Mighty', 'Supreme', 'Elite', 'Legendary', 'Mythic',
    'Diamond', 'Crystal', 'Pearl', 'Jade', 'Opal', 'Quartz', 'Garnet', 'Zircon',
    'Frost', 'Ice', 'Snow', 'Glacier', 'Alpine', 'Arctic', 'Polar', 'Chilling',
    'Fire', 'Flame', 'Blaze', 'Volcano', 'Lava', 'Heat', 'Scorching', 'Smoking',
    'Thunder', 'Lightning', 'Static', 'Current', 'Shock', 'Jolt', 'Flash',
    'Star', 'Moon', 'Sun', 'Sky', 'Cloud', 'Mist', 'Fog', 'Haze', 'Astro',
    'Dream', 'Sleep', 'Waking', 'Lucid', 'Deep', 'Heavy', 'Light', 'Whisper',
    'Ghost', 'Phantom', 'Shadow', 'Spirit', 'Mystic', 'Occult', 'Cryptic', 'Voodoo',
    'Electric', 'Atomic', 'Turbo', 'Viper', 'Kryptonite', 'Gamma', 'Quantum',
    'Alien', 'Martian', 'Jedi', 'Sith', 'God', 'Goddess', 'Buddha', 'Zen',
    'Paradise', 'Heaven', 'Utopia', 'Nirvana', 'Elysium', 'Oasis', 'Eden',
    'Sunset', 'Sunrise', 'Midnight', 'Dawn', 'Twilight', 'Noon', 'Dusk',
    'Velvet', 'Silk', 'Satin', 'Linen', 'Denim', 'Leather', 'Suede', 'Plush',
    'Chrome', 'Steel', 'Titanium', 'Iron', 'Copper', 'Brass', 'Alloy', 'Metal',
    'Gorilla', 'Bear', 'Tiger', 'Lion', 'Wolf', 'Shark', 'Serpent', 'Dragon',
    'Joker', 'Wizard', 'Ninja', 'Samurai', 'Pirate', 'Doctor', 'Professor',
    'Grateful', 'Happy', 'Blissful', 'Euphoric', 'Stoney', 'Danky', 'Funky',
    'Holy', 'Sacred', 'Ancient', 'Forbidden', 'Secret', 'Sacrifice', 'Ritual'
];
  
  const suffixes = [
    'Haze', 'Kush', 'Dream', 'Diesel', 'Widow', 'OG', 'Express', 'Train',
    'Glue', 'Punch', 'Choke', 'Slam', 'Knockout', 'Smash', 'Kick', 'Hit',
    'Cookies', 'Cake', 'Pie', 'Sherbet', 'Gelato', 'Ice Cream', 'Poundcake',
    'Brownie', 'Taffy', 'Candy', 'Sugar', 'Spice', 'Syrup', 'Jam', 'Marmalade',
    'Breath', 'Wreck', 'Crack', 'Poison', 'Cough', 'Skunk', 'Cheese', 'Funk',
    'Berry', 'Melon', 'Fruit', 'Grapefruit', 'Cantaloupe', 'Pineapple',
    'Frost', 'Freeze', 'Chill', 'Slush', 'Glace', 'Melt', 'Drip', 'Dew',
    'Thunder', 'Lightning', 'Storm', 'Blizzard', 'Hurricane', 'Typhoon',
    'Tsunami', 'Quake', 'Vortex', 'Surge', 'Wave', 'Tide', 'Current', 'Ripple',
    'Crush', 'Blast', 'Boom', 'Explosion', 'Detonation', 'Eruption', 'Impact',
    'Fire', 'Flame', 'Blaze', 'Inferno', 'Smolder', 'Ember', 'Ash', 'Cinders',
    'Nova', 'Star', 'Galaxy', 'Nebula', 'Comet', 'Meteor', 'Astro', 'Orbit',
    'Eclipse', 'Aurora', 'Dawn', 'Twilight', 'Midnight', 'Sunrise', 'Sunset',
    'Horizon', 'View', 'Scene', 'Vibe', 'Glow', 'Shine', 'Spark', 'Ray',
    'Monster', 'Beast', 'Creature', 'Demon', 'Fiend', 'Phantom', 'Ghost', 'Spirit',
    'Slayer', 'Killer', 'Hunter', 'Destroyer', 'Machine', 'Engine', 'Rocket',
    'Cali', 'Acapulco', 'Maui', 'Afghani', 'Thai', 'Colombian', 'Durban',
    'Bud', 'Nugget', 'Flower', 'Leaf', 'Dank', 'Sticky', 'Resin', 'Terps'
];

const used = new Set<string>();

export function getRandomStrain(): string {
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const strain = `${prefix} ${suffix}`;
    
    if (!used.has(strain)) {
      used.add(strain);
      return strain;
    }
    
    attempts++;
  }
  
  // Fallback: add number suffix if all combinations tried
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const timestamp = Date.now() % 10000;
  return `${prefix} ${suffix} ${timestamp}`;
}

