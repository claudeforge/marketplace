const fs = require('fs');
const path = require('path');

console.log('=== Removing Invalid Fields from Plugin.json ===\n');

const dirs = [
  'plugins/commands',
  'plugins/agents',
  'plugins/super'
];

let fixed = 0;
let errors = 0;

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;

  const subdirs = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(dir, d.name));

  subdirs.forEach(subdir => {
    const pluginJsonPath = path.join(subdir, '.claude-plugin', 'plugin.json');

    if (!fs.existsSync(pluginJsonPath)) return;

    try {
      const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));

      let hasChanges = false;

      if (pluginData.category !== undefined) {
        delete pluginData.category;
        hasChanges = true;
        console.log('  Removed \'category\' from', path.basename(subdir));
      }

      if (pluginData.pluginRoot !== undefined) {
        delete pluginData.pluginRoot;
        hasChanges = true;
        console.log('  Removed \'pluginRoot\' from', path.basename(subdir));
      }

      if (hasChanges) {
        fs.writeFileSync(
          pluginJsonPath,
          JSON.stringify(pluginData, null, 2) + '\n',
          'utf8'
        );
        fixed++;
      }
    } catch (e) {
      console.error('❌ Error processing', pluginJsonPath, ':', e.message);
      errors++;
    }
  });
});

console.log('\n=== Summary ===');
console.log('Fixed:', fixed);
console.log('Errors:', errors);
