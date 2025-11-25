import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('📦 Building Spring Boot JAR for production...');
try {
  execSync('mvn clean package -DskipTests', { 
    cwd: join(projectRoot, 'server-java'), 
    stdio: 'inherit' 
  });
  console.log('✅ Spring Boot JAR built successfully!');
} catch (error) {
  console.error('❌ Failed to build Spring Boot JAR:', error.message);
  process.exit(1);
}
