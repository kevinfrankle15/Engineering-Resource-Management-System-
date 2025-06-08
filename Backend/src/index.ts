import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; 
import projectRoutes from './routes/projectRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import userRoutes from './routes/userRoutes';
import engineerRoutes from './routes/engineerRoutes';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// ✅ use the route
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/engineers', userRoutes);
app.use('/api/engineers', engineerRoutes);
app.get('/', (req, res) => {
  res.send('API Running ');
});
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Server running on http://localhost:5000');
});

