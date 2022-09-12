# BTPN BE Test

## API List:

### To generate token (expire in 15 minutes)

| Method | URI             | Notes                 |
| ------ | --------------- | --------------------- |
| GET    | /api/auth/token | To generate new token |

### Token needed to access these API

| Method | URI                                 | Notes                       |
| ------ | ----------------------------------- | --------------------------- |
| GET    | /api                                | Index page                  |
| GET    | /api/users                          | Retrieve users              |
| GET    | /api/users/searchBy?identityNumber= | Retrieve by identity number |
| GET    | /api/users/searchBy?accountNumber=  | Retrieve by account number  |
| POST   | /api/users                          | Create new user             |
| DELETE | /api/users/:userId                  | Delete user                 |
| PUT    | /api/users/:userId                  | Update user                 |

---

## Request body to create and update user

```json
{
    "userName": string,
    "accountNumber": string & unique,
    "emailAddress": string,
    "identityNumber": string & unique
}
```

---

<small>hayepe</smal>
