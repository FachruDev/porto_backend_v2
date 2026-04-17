# Dokumentasi API Lengkap (Frontend)

Dokumen ini dibuat dari implementasi aktual route, controller, dan schema validasi pada codebase `porto_backend_v2`.

## 1) Informasi Umum

- **Base URL**: `http://localhost:4000/api` (sesuaikan dengan environment)
- **Content-Type JSON**: `application/json`
- **Content-Type upload file**: `multipart/form-data`
- **Auth**: JWT Bearer Token

Header auth:

```http
Authorization: Bearer <token>
```

## 2) Aturan Auth Akses Endpoint

- **Public**:
  - `GET /health`
  - Semua `GET /landing/*`
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /cms/contact/forms`
  - Semua `GET /cms/*`
- **Perlu token**:
  - Semua endpoint `/users/*`
  - Semua endpoint non-GET pada `/cms/*`
  - `GET /cms/contact/forms`

Jika token tidak ada/invalid:

```json
{ "message": "Unauthorized" }
```

## 3) Format Error

### a) Validasi body (Zod)

HTTP `400`

```json
{
  "message": "Validation failed",
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

### b) Error bisnis

Contoh:
- `400`: `Invalid id`, `File is required`, dll
- `401`: `Unauthorized`, `Invalid email or password`
- `404`: `User not found`, `Project not found`
- `409`: `Email already registered`
- `500`: `Unexpected error, please try again or contact support.`

## 4) Enum yang dipakai

- `Locale`: `EN | ID`
- `SkillLevel`: `BEGINNER | MIDDLE | PROFESSIONAL`
- `PublishStatus`: `DRAFT | PUBLISHED | ARCHIVED`

## 5) Endpoint Auth

### POST `/auth/register` (public)

Body:

```json
{
  "name": "John Doe",
  "email": "john@mail.com",
  "password": "password123",
  "bio": "optional",
  "profile": "https://cdn.com/profile.jpg"
}
```

Validasi:
- `name`: string, min 1
- `email`: format email
- `password`: string, min 6
- `bio`: optional
- `profile`: optional URL

Response `201`:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@mail.com",
    "bio": "optional",
    "profile": "https://cdn.com/profile.jpg",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

### POST `/auth/login` (public)

Body:

```json
{
  "email": "john@mail.com",
  "password": "password123"
}
```

Validasi:
- `email`: email valid
- `password`: string min 1

Response `200`:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@mail.com",
    "bio": null,
    "profile": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

### POST `/auth/logout` (public)

Response `200`:

```json
{ "message": "Logged out" }
```

## 6) Endpoint Health

### GET `/health`

Response:

```json
{ "status": "ok" }
```

## 7) Endpoint Users (semua butuh auth)

### GET `/users`
List user (tanpa field password).

### GET `/users/me`
Detail user login.

### PUT `/users/me`
Update user login.

Body validasi (`all optional`):
- `name`: string min 1
- `email`: email
- `password`: string min 6
- `bio`: string
- `profile`: URL

### POST `/users/me/profile` (multipart)
- field file: `profile`
- max size multer: **5MB**
- wajib image (`image/*`)

### GET `/users/:id`
- `:id` harus angka (jika tidak: `400 Invalid id`)

### POST `/users`
Body validasi sama dengan register.

Response `201`: objek user (tanpa password).

### PUT `/users/:id`
Body validasi sama dengan update user.

### POST `/users/:id/profile` (multipart)
- field file: `profile`
- max size: **5MB**
- wajib image

### DELETE `/users/:id`
Response `204` no content.

Contoh response user:

```json
{
  "id": 2,
  "name": "Jane",
  "email": "jane@mail.com",
  "bio": "Frontend Engineer",
  "profile": "https://cdn.com/users/profile-1.jpg",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-02T00:00:00.000Z"
}
```

## 8) Endpoint CMS (`/cms`)

> Semua `GET` public. Semua non-GET butuh Bearer token (kecuali `POST /cms/contact/forms`).

---

### 8.1 Web Config

- `GET /cms/config/web`
- `PUT /cms/config/web`
- `POST /cms/config/web/upload` (multipart)

Validasi PUT:
- `logo`: URL optional
- `favicon`: URL optional
- `copyright`: string optional
- `metaDescription`: string optional
- `metaTitle`: string optional

Upload field:
- `logo` (max 1)
- `favicon` (max 1)
- limit multer route: **5MB**
- minimal kirim salah satu, jika tidak: `400 logo or favicon file is required`

Contoh response:

```json
{
  "id": 1,
  "logo": "https://cdn.com/logo.png",
  "favicon": "https://cdn.com/favicon.ico",
  "copyright": "© 2026",
  "metaDescription": "Portofolio pribadi",
  "metaTitle": "Fachru Dev",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### 8.2 Hero (singleton)

- `GET /cms/heroes`
- `PUT /cms/heroes`

Validasi PUT:

```json
{
  "translations": [
    { "locale": "EN", "title": "Hi, I am Fachru", "subtitle": "Backend Developer" },
    { "locale": "ID", "title": "Halo, saya Fachru", "subtitle": "Backend Developer" }
  ]
}
```

- `translations` wajib, min 1
- setiap item: `locale EN|ID`, `title` min 1, `subtitle` optional

---

### 8.3 About (singleton)

- `GET /cms/about`
- `PUT /cms/about`
- `POST /cms/about/profile` (multipart)

Validasi PUT:
- `profile`: string optional (url/file path)
- `profileFile`: optional data URL base64 (regex `data:(.+);base64,(.*)`; max 5.000.000 karakter)
- `translations`: min 1
  - `locale`: EN|ID
  - `title`: min 1
  - `content`: min 1

Upload profile:
- field `profile`
- max size: **5MB**
- wajib mimetype image

Response upload:

```json
{
  "url": "https://cdn.com/about/profile-123.jpg",
  "about": {
    "id": 1,
    "profile": "https://cdn.com/about/profile-123.jpg",
    "translations": []
  }
}
```

---

### 8.4 Experiences

- `GET /cms/experiences`
- `POST /cms/experiences`
- `PUT /cms/experiences/:id`
- `DELETE /cms/experiences/:id`

Validasi create:
- `institution`: string min 1
- `years`: string min 1
- `order`: optional integer >= 0 (coerce number)
- `translations`: min 1 (`locale`, `title` min 1, `description` optional)

Validasi update: semua field optional.

---

### 8.5 Skills

- `GET /cms/skills`
- `POST /cms/skills`
- `PUT /cms/skills/:id`
- `DELETE /cms/skills/:id`
- `POST /cms/skills/:id/image` (multipart)

Validasi create:
- `title`: string min 1
- `image`: string optional
- `level`: `BEGINNER|MIDDLE|PROFESSIONAL`
- `order`: optional integer >= 0

Upload image:
- field `image`
- max size: **5MB**
- wajib image

---

### 8.6 Certificates

- `GET /cms/certificates`
- `POST /cms/certificates`
- `PUT /cms/certificates/:id`
- `DELETE /cms/certificates/:id`
- `POST /cms/certificates/:id/files` (multipart)

Validasi create:
- `file`: string min 1
- `previewImg`: string optional
- `issuedBy`: string optional
- `issuedOn`: optional date (coerce)
- `order`: integer optional >= 0
- `translations`: min 1 (`locale`, `title` min 1, `description` optional)

Upload field:
- `file` (max 1)
- `preview_img` (max 1)
- limit multer route: **15MB**

---

### 8.7 Projects

- `GET /cms/projects`
- `GET /cms/projects/:id`
- `POST /cms/projects`
- `PUT /cms/projects/:id`
- `DELETE /cms/projects/:id`
- `POST /cms/projects/:id/images`
- `DELETE /cms/projects/:projectId/images/:imageId`
- `POST /cms/projects/:id/images/upload` (multipart)
- `POST /cms/projects/:projectId/images/:imageId/upload` (multipart)

Validasi create project:
- `slug`: optional, regex `^[a-z0-9-]+$` (controller tetap auto-generate slug dari title EN)
- `order`: optional integer >= 0
- `images`: optional array
  - `url`: min 1
  - `alt`: optional
  - `order`: optional integer >= 0
- `translations`: min 1
  - `locale`: EN|ID
  - `title`: min 1
  - `subtitle`: optional
  - `description`: optional

Validasi update: semua optional.

Upload images:
- `POST /:id/images/upload`: field `images` (array max 10), max file route **8MB**, harus image
- `POST /:projectId/images/:imageId/upload`: field `image`, max **8MB**, harus image

Contoh response project:

```json
{
  "id": 1,
  "slug": "my-awesome-project",
  "sortOrder": 0,
  "images": [
    { "id": 11, "projectId": 1, "url": "https://cdn.com/p1.jpg", "alt": "cover", "sortOrder": 0, "createdAt": "2026-01-01T00:00:00.000Z" }
  ],
  "translations": [
    { "id": 21, "projectId": 1, "locale": "EN", "title": "My Awesome Project", "subtitle": "SaaS", "description": "..." }
  ],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### 8.8 Socials

- `GET /cms/socials`
- `POST /cms/socials`
- `PUT /cms/socials/:id`
- `DELETE /cms/socials/:id`
- `POST /cms/socials/:id/logo` (multipart)

Validasi create:
- `logo`: optional
- `link`: string min 1
- `title`: string min 1
- `order`: optional integer >= 0

Upload logo:
- field `logo`
- max size: **5MB**
- wajib image

---

### 8.9 Contact Forms

- `GET /cms/contact/forms` (**butuh auth**)
- `POST /cms/contact/forms` (**public**)

Validasi POST:
- `name`: min 1
- `email`: email valid
- `subject`: optional
- `description`: min 1

Response create `201`:

```json
{
  "id": 1,
  "name": "Visitor",
  "email": "visitor@mail.com",
  "subject": "Kerja sama",
  "description": "Halo, saya ingin diskusi project.",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

---

### 8.10 Contact Info (singleton)

- `GET /cms/contact/info`
- `PUT /cms/contact/info`
- `POST /cms/contact/info/cv` (multipart)

Validasi PUT:
- `name`: optional
- `email`: optional, email valid
- `phoneNumber`: optional
- `location`: optional
- `cv`: optional

Upload CV:
- field `cv`
- max size route: **15MB**
- tanpa validasi mime khusus (terima berbagai file)

Response upload:

```json
{
  "url": "https://cdn.com/contact/cv.pdf",
  "contact": {
    "id": 1,
    "name": "Fachru",
    "email": "fachru@mail.com",
    "phoneNumber": "08123456789",
    "location": "Indonesia",
    "cv": "https://cdn.com/contact/cv.pdf",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 8.11 Blog Categories

- `GET /cms/blog/categories`
- `POST /cms/blog/categories`
- `PUT /cms/blog/categories/:id`
- `DELETE /cms/blog/categories/:id`

Validasi create:
- `slug`: optional, regex `^[a-z0-9-]+$` (controller auto-generate dari title EN)
- `order`: optional integer >= 0
- `translations`: min 1, item: `locale`, `title` min 1

Validasi update: semua optional.

---

### 8.12 Blog Posts

- `GET /cms/blog/posts`
- `GET /cms/blog/posts/:id`
- `POST /cms/blog/posts`
- `PUT /cms/blog/posts/:id`
- `DELETE /cms/blog/posts/:id`
- `POST /cms/blog/posts/:id/featured-image` (multipart)
- `POST /cms/blog/posts/content-image` (multipart)

Validasi create:
- `blogCategoryId`: integer (coerce)
- `slug`: optional regex slug
- `featuredImage`: optional
- `metaTitle`: optional
- `metaDescription`: optional
- `status`: enum `DRAFT|PUBLISHED|ARCHIVED` (default DRAFT)
- `publishedAt`: optional date
- `createdBy`: optional (di controller otomatis override pakai data auth saat create)
- `translations`: min 1 (`locale`, `title` min 1, `content` min 1)

Validasi update: semua optional.

Upload:
- featured image:
  - endpoint: `POST /cms/blog/posts/:id/featured-image`
  - field: `featured_image`
  - max route: **8MB**
  - harus image
- content image:
  - endpoint: `POST /cms/blog/posts/content-image`
  - field: `image`
  - max route: **8MB**
  - harus image
  - response: `{ "url": "..." }`

Contoh response create blog post:

```json
{
  "id": 1,
  "blogCategoryId": 1,
  "authorId": 1,
  "slug": "my-first-post",
  "featuredImage": null,
  "metaTitle": "My First Post",
  "metaDescription": "SEO description",
  "status": "DRAFT",
  "publishedAt": null,
  "createdBy": "john@mail.com",
  "blogCategory": { "id": 1, "slug": "backend", "sortOrder": 0, "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z" },
  "author": { "id": 1, "name": "John Doe", "email": "john@mail.com", "bio": null, "profile": null, "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z" },
  "translations": [
    { "id": 1, "blogPostId": 1, "locale": "EN", "title": "My First Post", "content": "<p>Hello</p>", "createdAt": "2026-01-01T00:00:00.000Z" }
  ],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

## 9) Endpoint Landing (`/landing`, public read-only)

Semua endpoint berikut public dan read-only:

- `GET /landing/web-config`
- `GET /landing/hero`
- `GET /landing/about`
- `GET /landing/experiences`
- `GET /landing/skills`
- `GET /landing/certificates`
- `GET /landing/projects`
- `GET /landing/socials`
- `GET /landing/contact-info`
- `GET /landing/blog/categories`
- `GET /landing/blog/posts`
- `GET /landing/blog/posts/:slug`

Catatan:
- Untuk singleton (`web-config`, `hero`, `about`, `contact-info`, detail post slug), response bisa `null` jika belum ada data.
- Listing blog posts hanya mengembalikan `status = PUBLISHED`.

### Query `GET /landing/blog/posts`

Query param:
- `categoryId` (number)
- `categorySlug` (string)
- `authorId` (number)
- `page` (default `1`)
- `limit` (default `10`, min `1`, max `50`)
- `sort` (`old` => ascending; selain itu descending terbaru)
- `search` (cari di translation title, case-insensitive)

Contoh response:

```json
{
  "data": [
    {
      "id": 1,
      "slug": "my-first-post",
      "status": "PUBLISHED",
      "publishedAt": "2026-01-01T00:00:00.000Z",
      "translations": [
        { "locale": "EN", "title": "My First Post", "content": "<p>Hello</p>" }
      ],
      "blogCategory": {
        "id": 1,
        "slug": "backend",
        "translations": [{ "locale": "EN", "title": "Backend" }]
      },
      "author": {
        "id": 1,
        "name": "John Doe",
        "email": "john@mail.com",
        "profile": null
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## 10) Ringkasan Field Upload Multipart

| Endpoint | Field | Batas ukuran route | Validasi mime |
|---|---|---:|---|
| `POST /users/me/profile` | `profile` | 5MB | image/* |
| `POST /users/:id/profile` | `profile` | 5MB | image/* |
| `POST /cms/config/web/upload` | `logo`, `favicon` | 5MB | logo image, favicon tanpa regex khusus |
| `POST /cms/about/profile` | `profile` | 5MB | image/* |
| `POST /cms/skills/:id/image` | `image` | 5MB | image/* |
| `POST /cms/certificates/:id/files` | `file`, `preview_img` | 15MB | tidak dibatasi regex mime |
| `POST /cms/projects/:id/images/upload` | `images[]` | 8MB | image/* |
| `POST /cms/projects/:projectId/images/:imageId/upload` | `image` | 8MB | image/* |
| `POST /cms/socials/:id/logo` | `logo` | 5MB | image/* |
| `POST /cms/contact/info/cv` | `cv` | 15MB | tidak dibatasi regex mime |
| `POST /cms/blog/posts/:id/featured-image` | `featured_image` | 8MB | image/* |
| `POST /cms/blog/posts/content-image` | `image` | 8MB | image/* |

## 11) Catatan Integrasi Frontend

- Untuk entity terjemahan (`hero`, `about`, `experience`, `certificate`, `project`, `blog category`, `blog post`), selalu kirim `translations` array.
- Nilai `slug` pada project/blog category/blog post **di-generate dari title EN/first translation** di controller.
- Seluruh `:id` di path harus numerik.
- Endpoint delete mengembalikan `204` tanpa body.
