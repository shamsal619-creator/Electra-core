const { initializeFirebase, admin } = require('../lib/firebase');
require('@dotenvx/dotenvx').config({ path: require('path').join(__dirname, '../.env') });

async function createAdminCollection() {
    try {
        console.log('🔧 Initializing Firebase...');
        const db = initializeFirebase();

        const adminEmails = [
            'shamsal619@gmail.com',
            'electracore123@outlook.com',
            'hamdyalbayyomy123@gmail.com'
        ];

        const adminData = adminEmails.map((email, index) => ({
            email: email,
            role: 'admin',
            status: 'active',
            permissions: [
                'products:read',
                'products:write',
                'products:delete',
                'orders:read',
                'orders:write',
                'orders:delete',
                'users:read',
                'users:write',
                'dashboard:access'
            ],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }));

        const adminCollection = db.collection('admins');

        console.log('📝 Adding admins to Firebase...');
        
        for (const admin of adminData) {
            const existingDoc = await adminCollection.where('email', '==', admin.email).get();
            
            if (existingDoc.empty) {
                await adminCollection.add(admin);
                console.log(`✅ Added admin: ${admin.email}`);
            } else {
                console.log(`⚠️ Admin already exists: ${admin.email}`);
            }
        }

        console.log('✅ Admin collection created successfully!');
        console.log('📋 Total admins:', adminData.length);

    } catch (error) {
        console.error('❌ Error creating admin collection:', error);
        process.exit(1);
    }
}

createAdminCollection();
