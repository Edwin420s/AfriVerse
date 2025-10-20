const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// If this script is run directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;