import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const docsPath = 'docs';
const isDev = process.argv.includes('--dev');
const copyToDocs = process.argv.includes('--docs');

const watchPlugin = {
    name: 'watch-plugin',
    setup(build) {
        build.onEnd(async () => {
            console.log('Ready.');
            doCopyToDocs();
        });
    }
}

const doCopyToDocs = () => {
    if (copyToDocs) fs.cpSync(path.resolve(process.cwd(), './lib'), path.resolve(process.cwd(), `./${docsPath}/assets/js/smol`), { recursive: true, force: true });
}

function build(shouldWatch) {
    return esbuild[!shouldWatch ? 'build' : 'context']({
        entryPoints: ['src/index.ts'],
        outdir: 'lib',
        bundle: true,
        sourcemap: true,
        minify: !isDev,
        splitting: true,
        format: 'esm',
        target: ['esnext'],
        plugins: [watchPlugin]
    }).catch(() => process.exit(1));
}


if (!isDev) {
    console.log('Building...')
    await build();
    doCopyToDocs();
} else {
    const watch = async () => {
        const buildContext = await build(true);
        await buildContext.watch();
        console.log('Watching for file changes...');
    }
    watch();
}