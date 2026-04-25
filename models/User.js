const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { initializeFirebase, admin } = require('../lib/firebase');

const COLLECTION = 'users';

function toDate(value) {
    if (!value) return value;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    return value;
}

function normalizeUser(raw, id) {
    if (!raw) return null;
    return {
        ...raw,
        id,
        _id: id,
        created: toDate(raw.created),
        createdAt: toDate(raw.createdAt),
        updatedAt: toDate(raw.updatedAt),
        resetPasswordExpires: toDate(raw.resetPasswordExpires)
    };
}

class UserQuery {
    constructor(executor, { many = false } = {}) {
        this.executor = executor;
        this.includePassword = false;
        this.excludePassword = false;
        this.asLean = false;
        this.many = many;
    }

    select(fields) {
        if (typeof fields === 'string') {
            if (fields.includes('+password')) this.includePassword = true;
            if (fields.includes('-password')) this.excludePassword = true;
        }
        return this;
    }

    lean() {
        this.asLean = true;
        return this.exec();
    }

    async exec() {
        const result = await this.executor();
        const convertOne = (item) => {
            if (!item) return null;
            const payload = { ...item };
            if (!this.includePassword || this.excludePassword) delete payload.password;
            return this.asLean ? payload : new User(payload, { persisted: true, id: payload.id });
        };
        if (this.many) return result.map(convertOne);
        return convertOne(result);
    }

    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
}

class User {
    constructor(data = {}, { persisted = false, id } = {}) {
        this.id = id || data.id || data._id || crypto.randomUUID();
        this._id = this.id;
        this.first = data.first || '';
        this.last = data.last || '';
        this.email = data.email || '';
        this.password = data.password;
        this.googleId = data.googleId || '';
        this.resetPasswordToken = data.resetPasswordToken;
        this.resetPasswordExpires = data.resetPasswordExpires;
        this.nick = data.nick || '';
        this.gender = data.gender || '';
        this.language = data.language || '';
        this.country = data.country || '';
        this.timezone = data.timezone || '';
        this.address = data.address || '';
        this.created = data.created ? toDate(data.created) : new Date();
        this.createdAt = data.createdAt ? toDate(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? toDate(data.updatedAt) : new Date();
        this.__persisted = persisted;
        this.__originalPassword = data.password;
    }

    toObject() {
        return {
            first: this.first ? String(this.first).trim() : '',
            last: this.last ? String(this.last).trim() : '',
            email: this.email ? String(this.email).trim().toLowerCase() : '',
            password: this.password,
            googleId: this.googleId ? String(this.googleId).trim() : '',
            resetPasswordToken: this.resetPasswordToken || null,
            resetPasswordExpires: this.resetPasswordExpires || null,
            nick: this.nick ? String(this.nick).trim() : '',
            gender: this.gender ? String(this.gender).trim() : '',
            language: this.language ? String(this.language).trim() : '',
            country: this.country ? String(this.country).trim() : '',
            timezone: this.timezone ? String(this.timezone).trim() : '',
            address: this.address ? String(this.address).trim() : '',
            created: this.created || new Date(),
            createdAt: this.createdAt || new Date(),
            updatedAt: new Date()
        };
    }

    static collection() {
        return initializeFirebase().collection(COLLECTION);
    }

    static findOne(query = {}) {
        return new UserQuery(async () => {
            let ref = User.collection();
            Object.entries(query).forEach(([key, value]) => {
                ref = ref.where(key, '==', value);
            });
            const snap = await ref.limit(1).get();
            if (snap.empty) return null;
            const doc = snap.docs[0];
            return normalizeUser(doc.data(), doc.id);
        });
    }

    static findById(id) {
        return new UserQuery(async () => {
            if (!id) return null;
            const doc = await User.collection().doc(String(id)).get();
            if (!doc.exists) return null;
            return normalizeUser(doc.data(), doc.id);
        });
    }

    static find() {
        return new UserQuery(async () => {
            const snap = await User.collection().get();
            return snap.docs.map((doc) => normalizeUser(doc.data(), doc.id));
        }, { many: true });
    }

    static findByIdAndUpdate(id, updates = {}, options = {}) {
        return new UserQuery(async () => {
            if (!id) return null;
            const docRef = User.collection().doc(String(id));
            const existing = await docRef.get();
            if (!existing.exists) return null;
            const normalizedUpdates = { ...updates, updatedAt: new Date() };
            await docRef.set(normalizedUpdates, { merge: true });
            if (options.new) {
                const latest = await docRef.get();
                return normalizeUser(latest.data(), latest.id);
            }
            return normalizeUser(existing.data(), existing.id);
        });
    }

    async save() {
        const data = this.toObject();
        const isPasswordChanged = !this.__persisted || this.password !== this.__originalPassword;
        if (isPasswordChanged && data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }
        await User.collection().doc(this.id).set(data, { merge: true });
        const fresh = await User.collection().doc(this.id).get();
        const normalized = normalizeUser(fresh.data(), fresh.id);
        Object.assign(this, normalized);
        this.__persisted = true;
        this.__originalPassword = this.password;
        return this;
    }

    async matchPassword(enteredPassword) {
        if (!this.password) return false;
        return bcrypt.compare(enteredPassword, this.password);
    }
}

module.exports = User;