import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Determinar la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isRender = process.env.RENDER === '1';
let dbPath;

if (isRender) {
  const renderDataPath = '/opt/render/project/data';
  if (!fs.existsSync(renderDataPath)) {
    fs.mkdirSync(renderDataPath, { recursive: true });
  }
  dbPath = path.join(renderDataPath, 'database.sqlite');
  console.log('Running on Render, using persistent disk path:', dbPath);
} else {
  dbPath = path.join(__dirname, 'database.sqlite');
  console.log('Running locally, using local path:', dbPath);
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Desactivamos los logs para producción
});

export default sequelize; 