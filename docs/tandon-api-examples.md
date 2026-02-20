# Tandon API – Example requests

## Admin (use admin JWT in `Authorization: Bearer <admin-token>`)

### Create tandon (code and jwt_secret optional; auto-generated if omitted)

```http
POST /tandon
Authorization: Bearer <admin-jwt>
Content-Type: application/json

{
  "max_level_water": 100,
  "min_level_water": 10,
  "current_level_water": 50
}
```

With explicit code and jwt_secret:

```http
POST /tandon
Authorization: Bearer <admin-jwt>
Content-Type: application/json

{
  "code": "1234",
  "jwt_secret": "abcdefgh",
  "max_level_water": 100,
  "min_level_water": 10,
  "current_level_water": 50
}
```

### List tandons

```http
GET /tandon
Authorization: Bearer <admin-jwt>
```

### Get one tandon

```http
GET /tandon/:id
Authorization: Bearer <admin-jwt>
```

### Update tandon

```http
PATCH /tandon/:id
Authorization: Bearer <admin-jwt>
Content-Type: application/json

{
  "current_level_water": 75
}
```

### Delete tandon

```http
DELETE /tandon/:id
Authorization: Bearer <admin-jwt>
```

---

## Device (use JWT signed with that tandon’s `jwt_secret`)

The device must sign a JWT with the tandon’s `jwt_secret` (e.g. with `jsonwebtoken` or any JWT library). Example in Node:

```js
const jwt = require('jsonwebtoken');
const token = jwt.sign({ sub: 'device' }, '12345678', { expiresIn: '7d' });
```

### Update water level

```http
POST /tandon/device/update-water
Authorization: Bearer <device-jwt>
Content-Type: application/json

{
  "code": "1234",
  "current_level_water": 50
}
```

`current_level_water` must be between the tandon’s `min_level_water` and `max_level_water`.
