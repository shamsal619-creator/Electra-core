const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
    size: 'A4',
    margin: 40
});

const output = fs.createWriteStream(path.join(__dirname, 'DATABASE_SCHEMA_ERD.pdf'));
doc.pipe(output);

// Helper functions for styling
const addTitle = (text, size = 24) => {
    doc.fontSize(size).font('Helvetica-Bold').text(text, { align: 'center' });
    doc.moveDown(0.3);
};

const addSubtitle = (text, size = 14) => {
    doc.fontSize(size).font('Helvetica-Bold').text(text, { fill: '#1a5490' });
    doc.moveDown(0.2);
};

const addParagraph = (text, size = 11) => {
    doc.fontSize(size).font('Helvetica').text(text, { align: 'left' });
    doc.moveDown(0.3);
};

const addTable = (data, columns) => {
    const rowHeight = 25;
    const colWidths = columns.map(col => col.width);
    const startX = 40;
    const startY = doc.y;
    
    // Header
    doc.fillColor('#1a5490').rect(startX, startY, 515, rowHeight).fill();
    doc.fillColor('white');
    
    let xPos = startX + 5;
    columns.forEach((col, i) => {
        doc.fontSize(10).font('Helvetica-Bold').text(col.header, xPos, startY + 7, { 
            width: colWidths[i] - 10, 
            height: rowHeight - 14 
        });
        xPos += colWidths[i];
    });
    
    doc.moveDown(2);
    
    // Rows
    data.forEach((row, idx) => {
        const rowY = doc.y;
        const isAlt = idx % 2 === 0;
        
        if (isAlt) {
            doc.fillColor('#f0f0f0').rect(startX, rowY, 515, rowHeight).fill();
        } else {
            doc.fillColor('white').rect(startX, rowY, 515, rowHeight).stroke();
        }
        
        doc.fillColor('black');
        xPos = startX + 5;
        
        columns.forEach((col, i) => {
            const value = row[col.key] || '';
            doc.fontSize(9).font('Helvetica').text(String(value), xPos, rowY + 7, { 
                width: colWidths[i] - 10, 
                height: rowHeight - 14 
            });
            xPos += colWidths[i];
        });
        
        doc.moveDown(2.5);
    });
};

// Title Page
doc.fontSize(32).font('Helvetica-Bold').text('DATABASE SCHEMA', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(32).font('Helvetica-Bold').fillColor('#e74c3c').text('& ERD DOCUMENTATION', { align: 'center' });
doc.fillColor('black');
doc.moveDown(0.8);

doc.fontSize(12).font('Helvetica').text('E-Commerce Platform', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(11).font('Helvetica').fillColor('#666').text('Firebase Firestore Architecture', { align: 'center' });
doc.moveDown(1);

doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });

doc.addPage();

// Table of Contents
addTitle('Table of Contents', 16);
doc.fontSize(11).font('Helvetica');
const toc = [
    '1. Project Overview',
    '2. Database Architecture',
    '3. Entity Relationship Diagram',
    '4. Collections Details',
    '   4.1 Users Collection',
    '   4.2 Products Collection',
    '   4.3 Orders Collection',
    '5. Data Types Reference',
    '6. Relationships & Constraints'
];

toc.forEach(item => {
    doc.moveDown(0.3);
    doc.text(item);
});

doc.addPage();

// 1. Project Overview
addTitle('1. Project Overview', 16);
addParagraph('This document describes the database schema and entity relationships for the E-Commerce Platform built with Firebase Firestore.');
doc.moveDown(0.5);

addSubtitle('Technology Stack');
doc.fontSize(10).font('Helvetica').text('• Database: Firebase Firestore (NoSQL)', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Storage: Cloudinary for image hosting', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Authentication: Firebase Authentication', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Backend: Node.js/Express', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Password Hashing: bcryptjs', { indent: 20 });
doc.moveDown(0.8);

addSubtitle('Project Scope');
addParagraph('The platform manages users, products, and orders with comprehensive tracking of inventory, user profiles, and order management.');

doc.addPage();

// 2. Database Architecture
addTitle('2. Database Architecture', 16);
doc.fontSize(10).font('Helvetica').fillColor('#333');
doc.moveDown(0.3);

doc.text('The system uses a NoSQL document-based approach with Firestore:');
doc.moveDown(0.3);

const archPoints = [
    'Users: Authentication and profile management',
    'Products: Inventory and product catalog',
    'Orders: Transaction records with status tracking'
];

archPoints.forEach(point => {
    doc.text('• ' + point, { indent: 20 });
    doc.moveDown(0.25);
});

doc.moveDown(0.5);

// 3. Entity Relationship Diagram
doc.addPage();
addTitle('3. Entity Relationship Diagram', 16);
doc.moveDown(0.5);

// Draw ERD as text-based diagram
const erdText = `
┌─────────────────────────────────────────────────────────────────────┐
│                          USERS Collection                           │
├─────────────────────────────────────────────────────────────────────┤
│ • id (String, PK)                                                   │
│ • email (String, UNIQUE)                                            │
│ • password (String, Hashed)                                         │
│ • first (String)                                                    │
│ • last (String)                                                     │
│ • phone (String)                                                    │
│ • address (String)                                                  │
│ • city (String)                                                     │
│ • country (String)                                                  │
│ • postalCode (String)                                               │
│ • createdAt (Timestamp)                                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    ├──────────────────────────┐
                                    │                          │
                                    ▼                          ▼
┌──────────────────────────────  ┌────────────────────────────────────┐
│   ORDERS Collection            │   PRODUCTS Collection              │
├──────────────────────────────  ├────────────────────────────────────┤
│ • id (String, PK)              │ • id (String, PK)                  │
│ • userId (String, FK)          │ • name (String)                    │
│ • order_code (String, UNIQUE)  │ • category (String)                │
│ • items (Array<Object>)        │ • price (Number)                   │
│ • totalPrice (Number)          │ • oldPrice (Number)                │
│ • status (String)              │ • description (String)             │
│ • paymentMethod (String)       │ • brand (String)                   │
│ • deliveryAddress (Object)     │ • color (String)                   │
│ • createdAt (Timestamp)        │ • inStock (Boolean)                │
│ • deliveredAt (Timestamp)      │ • images (Array<String>)           │
│ • updatedAt (Timestamp)        │ • createdAt (Timestamp)            │
└──────────────────────────────  └────────────────────────────────────┘
`;

doc.fontSize(8).font('Courier').text(erdText);
doc.moveDown(0.5);

doc.addPage();

// 4. Collections Details
addTitle('4. Collections Details', 16);
doc.moveDown(0.8);

// 4.1 Users Collection
addSubtitle('4.1 Users Collection', 13);
addParagraph('Stores user account information, authentication credentials, and profile details.');
doc.moveDown(0.3);

const usersFields = [
    { field: 'id', type: 'String', description: 'Unique user identifier (UUID)' },
    { field: 'email', type: 'String', description: 'User email (unique, lowercase)' },
    { field: 'password', type: 'String', description: 'Hashed password (bcryptjs)' },
    { field: 'first', type: 'String', description: 'First name' },
    { field: 'last', type: 'String', description: 'Last name' },
    { field: 'phone', type: 'String', description: 'Contact phone number' },
    { field: 'address', type: 'String', description: 'Street address' },
    { field: 'city', type: 'String', description: 'City name' },
    { field: 'country', type: 'String', description: 'Country name' },
    { field: 'postalCode', type: 'String', description: 'Postal code' },
    { field: 'gender', type: 'String', description: 'Gender (male/female)' },
    { field: 'timezone', type: 'String', description: 'User timezone' },
    { field: 'language', type: 'String', description: 'Preferred language' },
    { field: 'googleId', type: 'String', description: 'Google OAuth ID (optional)' },
    { field: 'resetPasswordToken', type: 'String', description: 'Password reset token' },
    { field: 'resetPasswordExpires', type: 'Timestamp', description: 'Token expiration time' },
    { field: 'createdAt', type: 'Timestamp', description: 'Account creation timestamp' },
    { field: 'updatedAt', type: 'Timestamp', description: 'Last update timestamp' }
];

addTable(usersFields, [
    { header: 'Field', key: 'field', width: 160 },
    { header: 'Type', key: 'type', width: 100 },
    { header: 'Description', key: 'description', width: 255 }
]);

doc.addPage();

// 4.2 Products Collection
addSubtitle('4.2 Products Collection', 13);
addParagraph('Manages product catalog with inventory status and pricing information.');
doc.moveDown(0.3);

const productsFields = [
    { field: 'id', type: 'String', description: 'Unique product identifier (UUID)' },
    { field: 'name', type: 'String', description: 'Product name' },
    { field: 'category', type: 'String', description: 'Product category (phone, laptop, etc.)' },
    { field: 'price', type: 'Number', description: 'Current selling price' },
    { field: 'oldPrice', type: 'Number', description: 'Original price (for discounts)' },
    { field: 'description', type: 'String', description: 'Product description' },
    { field: 'brand', type: 'String', description: 'Brand name' },
    { field: 'color', type: 'String', description: 'Product color' },
    { field: 'inStock', type: 'Boolean', description: 'Stock availability status' },
    { field: 'images', type: 'Array<String>', description: 'Cloudinary image URLs' },
    { field: 'createdAt', type: 'Timestamp', description: 'Product creation timestamp' },
    { field: 'updatedAt', type: 'Timestamp', description: 'Last update timestamp' }
];

addTable(productsFields, [
    { header: 'Field', key: 'field', width: 160 },
    { header: 'Type', key: 'type', width: 100 },
    { header: 'Description', key: 'description', width: 255 }
]);

doc.addPage();

// 4.3 Orders Collection
addSubtitle('4.3 Orders Collection', 13);
addParagraph('Tracks customer orders with items, status, and delivery information.');
doc.moveDown(0.3);

const ordersFields = [
    { field: 'id', type: 'String', description: 'Unique order identifier (UUID)' },
    { field: 'order_code', type: 'String', description: 'Human-readable order code' },
    { field: 'userId', type: 'String', description: 'Foreign key to Users collection' },
    { field: 'items', type: 'Array<Object>', description: 'Array of ordered products' },
    { field: 'totalPrice', type: 'Number', description: 'Total order amount' },
    { field: 'status', type: 'String', description: 'Order status (pending, processing, shipped, delivered)' },
    { field: 'paymentMethod', type: 'String', description: 'Payment method used' },
    { field: 'deliveryAddress', type: 'Object', description: 'Delivery address details' },
    { field: 'createdAt', type: 'Timestamp', description: 'Order creation timestamp' },
    { field: 'deliveredAt', type: 'Timestamp', description: 'Delivery completion timestamp' },
    { field: 'updatedAt', type: 'Timestamp', description: 'Last status update timestamp' }
];

addTable(ordersFields, [
    { header: 'Field', key: 'field', width: 160 },
    { header: 'Type', key: 'type', width: 100 },
    { header: 'Description', key: 'description', width: 255 }
]);

doc.addPage();

// 5. Data Types Reference
addTitle('5. Data Types Reference', 16);
doc.moveDown(0.5);

const dataTypes = [
    { type: 'String', description: 'Text data (255 characters typical limit)' },
    { type: 'Number', description: 'Integer or floating-point values' },
    { type: 'Boolean', description: 'True/false values' },
    { type: 'Timestamp', description: 'Date and time values' },
    { type: 'Array', description: 'Ordered collection of values' },
    { type: 'Object', description: 'Key-value pairs (nested documents)' }
];

addTable(dataTypes, [
    { header: 'Data Type', key: 'type', width: 200 },
    { header: 'Description', key: 'description', width: 315 }
]);

doc.moveDown(1);

addSubtitle('Status Values', 13);
const statusValues = [
    { status: 'pending', description: 'Order awaiting processing', collection: 'Orders' },
    { status: 'processing', description: 'Order being prepared', collection: 'Orders' },
    { status: 'shipped', description: 'Order in transit', collection: 'Orders' },
    { status: 'delivered', description: 'Order delivered', collection: 'Orders' }
];

addTable(statusValues, [
    { header: 'Status', key: 'status', width: 140 },
    { header: 'Description', key: 'description', width: 240 },
    { header: 'Collection', key: 'collection', width: 135 }
]);

doc.addPage();

// 6. Relationships & Constraints
addTitle('6. Relationships & Constraints', 16);
doc.moveDown(0.5);

addSubtitle('Primary Keys (PK)');
doc.fontSize(10).text('• Users.id - Unique identifier for each user', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Products.id - Unique identifier for each product', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Orders.id - Unique identifier for each order', { indent: 20 });
doc.moveDown(0.5);

addSubtitle('Foreign Keys (FK)');
doc.fontSize(10).text('• Orders.userId → Users.id', { indent: 20 });
doc.moveDown(0.2);
doc.text('  (One User can have many Orders)', { indent: 20 });
doc.moveDown(0.5);

addSubtitle('Unique Constraints');
doc.fontSize(10).text('• Users.email - Must be unique across the system', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Orders.order_code - Unique order reference code', { indent: 20 });
doc.moveDown(0.5);

addSubtitle('Data Integrity Rules');
doc.fontSize(10).text('• User email addresses are stored in lowercase for consistency', { indent: 20 });
doc.moveDown(0.2);
doc.text('• All timestamps are server-generated (Firestore FieldValue.serverTimestamp)', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Passwords are hashed using bcryptjs (10 salt rounds)', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Product prices are stored as numbers (cents recommended)', { indent: 20 });
doc.moveDown(0.2);
doc.text('• Order status follows a defined workflow: pending → processing → shipped → delivered', { indent: 20 });

doc.addPage();

// Additional Notes
addTitle('Implementation Notes', 16);
doc.moveDown(0.5);

addSubtitle('Authentication');
addParagraph('Users authenticate via email/password or Google OAuth. Passwords are hashed and never stored in plain text. Password reset tokens have expiration timestamps.');
doc.moveDown(0.3);

addSubtitle('Image Storage');
addParagraph('Product images are stored in Cloudinary (external service). The images array contains URLs to these resources.');
doc.moveDown(0.3);

addSubtitle('Order Processing');
addParagraph('Orders track items with product references and pricing snapshots at time of purchase. Order items maintain product details (price at purchase time).');
doc.moveDown(0.3);

addSubtitle('Scalability Considerations');
addParagraph('Firebase Firestore provides real-time synchronization and automatic scaling. Indexes are created on frequently queried fields (userId, status, createdAt).');

// Footer
doc.moveDown(1);
doc.fontSize(9).fillColor('#999').text('End of Document', { align: 'center' });

doc.end();

output.on('finish', () => {
    console.log('✅ PDF generated successfully: DATABASE_SCHEMA_ERD.pdf');
});

output.on('error', (err) => {
    console.error('❌ Error generating PDF:', err);
});
