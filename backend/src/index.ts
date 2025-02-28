import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});