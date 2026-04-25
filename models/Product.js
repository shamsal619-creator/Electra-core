const crypto = require('crypto');
const { initializeFirebase } = require('../lib/firebase');

const COLLECTION = 'products';

function toDate(value) {
    if (!value) return value;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    return value;
}

function normalizeProduct(raw, id) {
    if (!raw) return null;
    return {
        ...raw,
        id,
        _id: id,
        createdAt: toDate(raw.createdAt),
        updatedAt: toDate(raw.updatedAt)
    };
}

class ProductQuery {
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
        const convertOne = (item) => {
            if (!item) return null;
            return this.asLean ? item : new Product(item, { persisted: true, id: item.id });
        };
        if (this.many) return result.map(convertOne);
        return convertOne(result);
    }

    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
}

class Product {
    constructor(data = {}, { persisted = false, id } = {}) {
        this.id = id || data.id || data._id || crypto.randomUUID();
        this._id = this.id;
        this.name = data.name || '';
        this.category = data.category || '';
        this.price = data.price;
        this.oldPrice = data.oldPrice;
        this.description = data.description || '';
        this.brand = data.brand || '';
        this.color = data.color || '';
        this.inStock = data.inStock !== false;
        this.images = Array.isArray(data.images) ? data.images : [];
        this.createdAt = data.createdAt ? toDate(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? toDate(data.updatedAt) : new Date();
        this.__persisted = persisted;
    }

    toObject() {
        return {
            name: String(this.name || '').trim(),
            category: String(this.category || '').trim().toLowerCase(),
            price: Number(this.price),
            oldPrice: this.oldPrice === undefined ? undefined : Number(this.oldPrice),
            description: String(this.description || '').trim(),
            brand: String(this.brand || '').trim(),
            color: String(this.color || '').trim(),
            inStock: this.inStock !== false,
            images: Array.isArray(this.images) ? this.images.filter(Boolean) : [],
            createdAt: this.createdAt || new Date(),
            updatedAt: new Date()
        };
    }

    static collection() {
        return initializeFirebase().collection(COLLECTION);
    }

    static find() {
        return new ProductQuery(async () => {
            const snap = await Product.collection().get();
            return snap.docs.map((doc) => normalizeProduct(doc.data(), doc.id));
        }, { many: true });
    }

    static findById(id) {
        return new ProductQuery(async () => {
            if (!id) return null;
            const doc = await Product.collection().doc(String(id)).get();
            if (!doc.exists) return null;
            return normalizeProduct(doc.data(), doc.id);
        });
    }

    static findOne(query = {}) {
        return new ProductQuery(async () => {
            let ref = Product.collection();
            Object.entries(query).forEach(([key, value]) => {
                ref = ref.where(key, '==', value);
            });
            const snap = await ref.limit(1).get();
            if (snap.empty) return null;
            const doc = snap.docs[0];
            return normalizeProduct(doc.data(), doc.id);
        });
    }

    async save() {
        const payload = this.toObject();
        await Product.collection().doc(this.id).set(payload, { merge: true });
        const fresh = await Product.collection().doc(this.id).get();
        const normalized = normalizeProduct(fresh.data(), fresh.id);
        Object.assign(this, normalized);
        this.__persisted = true;
        return this;
    }
}

module.exports = Product;
