import { spawn, ChildProcess, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { createServer, ViteDevServer } from 'vite';
import viteConfig from '../vite.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';

let springBoot: ChildProcess;
let viteServer: ViteDevServer | null = null;

async function startDevelopment() {
  console.log('🚀 Starting TaskFlow with Spring Boot backend...\n');

  springBoot = spawn('mvn', ['spring-boot:run'], {
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

  try {
    viteServer = await createServer({
      ...viteConfig,
      configFile: false,
      server: {
        port: 5000,
        host: '0.0.0.0',
        strictPort: true,
        allowedHosts: true,
        fs: {
          strict: true,
          deny: ['**/.*'],
        },
      },
    });

    await viteServer.listen();
    viteServer.printUrls();
  } catch (err) {
    console.error('❌ Failed to start Vite:', err);
    springBoot.kill('SIGTERM');
    process.exit(1);
  }

  springBoot.on('error', (err) => {
    console.error('❌ Failed to start Spring Boot:', err);
    viteServer?.close();
    process.exit(1);
  });

  springBoot.on('exit', (code) => {
    console.log(`\n⏹️  Spring Boot exited with code ${code}`);
    viteServer?.close();
    setTimeout(() => process.exit(code || 0), 1000);
  });

  const shutdown = () => {
    console.log('\n⏹️  Shutting down services...');
    springBoot.kill('SIGTERM');
    viteServer?.close();

    setTimeout(() => {
      springBoot.kill('SIGKILL');
      process.exit(0);
    }, 5000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  console.log('\n✓ Dev environment starting...');
  console.log('  - Spring Boot API will be on http://localhost:8080');
  console.log('  - Vite frontend will be on http://localhost:5000\n');
}

function startProduction() {
  console.log('🏭 Starting TaskFlow in PRODUCTION mode...\n');

  const jarPath = join(projectRoot, 'server-java', 'target', 'taskflow-api-1.0.0.jar');
  
  if (!existsSync(jarPath)) {
    console.log('📦 Spring Boot JAR not found, building...');
    try {
      execSync('mvn clean package -DskipTests', { 
        cwd: join(projectRoot, 'server-java'), 
        stdio: 'inherit' 
      });
      console.log('✅ Spring Boot JAR built successfully!\n');
    } catch (error) {
      console.error('❌ Failed to build Spring Boot JAR:', error);
      process.exit(1);
    }
  }

  console.log('🚀 Starting Spring Boot JAR on port 5000...\n');

  springBoot = spawn('java', ['-jar', 'target/taskflow-api-1.0.0.jar', '--spring.profiles.active=production'], {
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
    console.log('\n⏹️  Shutting down Spring Boot...');
    springBoot.kill('SIGTERM');

    setTimeout(() => {
      springBoot.kill('SIGKILL');
      process.exit(0);
    }, 5000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (isProduction) {
  startProduction();
} else {
  startDevelopment();
}
