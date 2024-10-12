# Order Management With Redis
This project implements order flow management using Redis

<h2>🛠️ Installation Steps:</h2>

<p>1. Install packages</p>

```
npm i
```

<p>2. Run project</p>

```
npm run build
```

<p>3. Go to start the order retrieval process.</p>

```
http://localhost:3000/order/fetchOrders
```

Env Example

```
REDIS_HOST=
REDIS_PORT=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
REDIS_ACTIVE=true
```

<h2>⚔️ Test Results:</h2>
Order writing operations have been optimized for performance using Redis, significantly improving the speed and efficiency of data handling within the project.

Process complete time with Sequelize ORM <b> (NO REDIS) </b> : ``` ~36s ```

Process complete time with  <b> Redis </b> : ``` ~4s ```