# Mongoose Auth — Revision Notes

## 1. Database Connection

Standard Mongoose connection pattern using a Promise.
```javascript
import mongoose from "mongoose";

export const connectmongoDB = async (url) => {
    return mongoose.connect(url);
};
```

---

## 2. User Schema & Model

- **Timestamps:** Adds `createdAt` and `updatedAt` automatically.
- **Pluralization:** `model('user', ...)` creates/uses the `users` collection.
```javascript
const userschema = new Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt:     { type: String, required: true },
}, { timestamps: true });

export const User = model('user', userschema);
```

---

## 3. Password Hashing (HMAC-SHA256)

Using the built-in `crypto` module to hash passwords with a unique salt.
```javascript
const salt = randomBytes(256).toString('hex');
const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');
```

---

## 4. Authentication Middleware

- **`authMiddleware`** — Extracts and verifies JWT; attaches payload to `req.user`.
- **`ensureAuthenticated`** — Acts as a guard for protected routes.
```javascript
const token = tokenHeader.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // Now accessible in routes via req.user
```

---

## 5. Essential Routes Reference

| Method  | Endpoint    | Logic                                                              |
|---------|-------------|--------------------------------------------------------------------|
| `POST`  | `/user/signup` | Check existence → Hash → `User.create()`                       |
| `POST`  | `/user/login`  | Find user → Re-hash input with stored salt → Compare → Sign JWT |
| `PATCH` | `/user/`       | `User.findByIdAndUpdate(req.user._id, { name })`                |

---

## 6. Postman Configuration

| Key           | Value              |
|---------------|--------------------|
| Header Key    | `Authorization`    |
| Header Value  | `Bearer <JWT_TOKEN>` |
