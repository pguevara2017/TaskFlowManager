import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('🏭 Starting TaskFlow in PRODUCTION mode...\n');
  
  const distPath = join(projectRoot, 'dist', 'public', 'index.html');
  if (!existsSync(distPath)) {
    console.log('📦 Building frontend...');
    try {
      execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
      console.log('✅ Frontend build complete!\n');
    } catch (error) {
      console.error('❌ Frontend build failed:', error);
      process.exit(1);
    }
  }
  
  console.log('🚀 Starting Spring Boot on port 5000...\n');
  
  const springBoot = spawn('mvn', ['spring-boot:run', '-Dspring-boot.run.profiles=production'], {
    cwd: join(projectRoot, 'server-java'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });
  
  springBoot.on('error', (err) => {
    console.error('❌ Failed to start Spring Boot:', err);
    process.exit(1);
  });
  
  springBoot.on('exit', (code) => {
    console.log(`\n⏹️  Spring Boot exited with code ${code}`);
    process.exit(code || 0);
  });
  
  const shutdown = () => {
    console.log('\n⏹️  Shutting down...');
    springBoot.kill('SIGTERM');
    setTimeout(() => {
      springBoot.kill('SIGKILL');
      process.exit(0);
    }, 5000);
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  
} else {
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
}
