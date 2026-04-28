const crypto = require('crypto');
const { initializeFirebase, admin } = require('../lib/firebase');

const COLLECTION = 'orders';

function toDate(value) {
    if (!value) return value;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    return value;
}

function normalizeOrder(raw, id) {
    if (!raw) return null;
    return {
        ...raw,
        id,
        _id: id,
        createdAt: toDate(raw.createdAt),
        updatedAt: toDate(raw.updatedAt),
        deliveredAt: toDate(raw.deliveredAt)
    };
}

class OrderQuery {
    constructor(executor, { many = false } = {}) {
        this.executor = executor;
        this.asLean = false;
        this.sorter = null;
        this.many = many;
    }

    sort(sortObject) {
        this.sorter = sortObject;
        return this;
    }

    lean() {
        this.asLean = true;
        return this.exec();
    }

    async exec() {
        let result = await this.executor();
        if (Array.isArray(result) && this.sorter && this.sorter.createdAt === -1) {
            result = result.sort((a, b) => {
                const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bd - ad;
            });
        }
        if (this.asLean) return result;
        if (this.many) return result.map(doc => result instanceof admin.firestore.DocumentSnapshot ? normalizeOrder(doc.data(), doc.id) : normalizeOrder(doc, doc.id));
        return result instanceof admin.firestore.DocumentSnapshot ? normalizeOrder(result.data(), result.id) : (result ? normalizeOrder(result, result.id) : null);
    }
}

class Order {
    static create(data) {
        return new OrderQuery(async () => {
            initializeFirebase();
            // Generate unique order code
            const orderCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            const docRef = await admin.firestore().collection(COLLECTION).add({
                ...data,
                order_code: orderCode,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'pending' // pending, processing, shipped, delivered, cancelled
            });
            const doc = await docRef.get();
            return normalizeOrder(doc.data(), doc.id);
        });
    }

    static findById(id) {
        return new OrderQuery(async () => {
            initializeFirebase();
            const doc = await admin.firestore().collection(COLLECTION).doc(id).get();
            return doc;
        });
    }

    static findByUserId(userId) {
        return new OrderQuery(async () => {
            initializeFirebase();
            const snapshot = await admin.firestore().collection(COLLECTION)
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs;
        }, { many: true });
    }

    static findAll() {
        return new OrderQuery(async () => {
            initializeFirebase();
            const snapshot = await admin.firestore().collection(COLLECTION)
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs;
        }, { many: true });
    }

    static updateStatus(id, status) {
        return new OrderQuery(async () => {
            initializeFirebase();
            await admin.firestore().collection(COLLECTION).doc(id).update({
                status,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            const doc = await admin.firestore().collection(COLLECTION).doc(id).get();
            return doc;
        });
    }

    static findByFilter(filters) {
        return new OrderQuery(async () => {
            initializeFirebase();
            let query = admin.firestore().collection(COLLECTION);
            
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }
            if (filters.paymentMethod) {
                query = query.where('paymentMethod', '==', filters.paymentMethod);
            }
            if (filters.userId) {
                query = query.where('userId', '==', filters.userId);
            }

            const snapshot = await query.orderBy('createdAt', 'desc').get();
            return snapshot.docs;
        }, { many: true });
    }
}

module.exports = Order;
