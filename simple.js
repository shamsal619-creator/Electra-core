const path = require('path');
require('@dotenvx/dotenvx').config({ path: path.join(__dirname, '.env') });

console.log('=' .repeat(50));
console.log('🔍 اختبار قراءة ملف .env بـ @dotenvx/dotenvx');
console.log('=' .repeat(50));

console.log('Current directory:', __dirname);
console.log('.env path:', path.join(__dirname, '.env'));
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);