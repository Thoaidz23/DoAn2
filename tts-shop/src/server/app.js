const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Import routes
const productRoutes = require('./customer/Routes/product.routes');
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
