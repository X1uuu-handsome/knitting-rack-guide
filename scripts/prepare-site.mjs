import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'_site');
if(dirname(output)!==root)throw new Error('Unexpected site output path');
rmSync(output,{recursive:true,force:true});
mkdirSync(resolve(output,'assets','icons'),{recursive:true});
for(const name of ['index.html','styles.css','app.js','data.js','diagrams.js','version-config.js','manifest.json','sw.js']){
  cpSync(resolve(root,name),resolve(output,name));
}
for(const name of readdirSync(resolve(root,'assets','icons'))){
  cpSync(resolve(root,'assets','icons',name),resolve(output,'assets','icons',name));
}
console.log('Prepared static site at _site/');
