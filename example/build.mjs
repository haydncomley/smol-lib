import * as esbuild from 'esbuild';
import fs from 'fs';

fs.rmSync('./docs', { recursive: true, force: true });
fs.cpSync('./example', './docs', { recursive: true, force: true });
fs.rmSync('./docs/assets/js', { recursive: true, force: true });
fs.rmSync('./docs/build.mjs', { force: true });

await esbuild.build({
    entryPoints: ['example/assets/js/index.js'],
    bundle: true,
    minify: true,
    outfile: 'docs/assets/js/index.js'
})