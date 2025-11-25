import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Starting TaskFlow with Spring Boot backend...\n');

const springBoot = spawn('mvn', ['spring-boot:run'], {
  cwd: join(projectRoot, 'server-java'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  env: { ...process.env }
});

springBoot.stdout?.on('data', (data) => {
  process.stdout.write(`[spring-boot] ${data}`);
});

springBoot.stderr?.on('data', (data) => {
  process.stderr.write(`[spring-boot] ${data}`);
});

console.log('⚡ Starting Vite dev server for frontend...\n');

const vite = spawn('npx', ['vite', '--port', '5000', '--host', '0.0.0.0'], {
  cwd: projectRoot,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  env: {
    ...process.env,
    VITE_API_BASE_URL: 'http://localhost:8080'
  }
});

vite.stdout?.on('data', (data) => {
  process.stdout.write(`[vite] ${data}`);
});

vite.stderr?.on('data', (data) => {
  process.stderr.write(`[vite] ${data}`);
});

springBoot.on('error', (err) => {
  console.error('❌ Failed to start Spring Boot:', err);
  vite.kill('SIGTERM');
  process.exit(1);
});

vite.on('error', (err) => {
  console.error('❌ Failed to start Vite:', err);
  springBoot.kill('SIGTERM');
  process.exit(1);
});

springBoot.on('exit', (code) => {
  console.log(`\n⏹️  Spring Boot exited with code ${code}`);
  vite.kill('SIGTERM');
  setTimeout(() => process.exit(code || 0), 1000);
});

vite.on('exit', (code) => {
  console.log(`\n⏹️  Vite exited with code ${code}`);
  springBoot.kill('SIGTERM');
  setTimeout(() => process.exit(code || 0), 1000);
});

const shutdown = () => {
  console.log('\n⏹️  Shutting down services...');
  springBoot.kill('SIGTERM');
  vite.kill('SIGTERM');
  
  setTimeout(() => {
    springBoot.kill('SIGKILL');
    vite.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('\n✓ Dev environment starting...');
console.log('  - Spring Boot API will be on http://localhost:8080');
console.log('  - Vite frontend will be on http://localhost:5000\n');
