const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Current directory:', __dirname);
console.log('.env path:', path.join(__dirname, '.env'));
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);