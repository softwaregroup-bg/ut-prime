import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import copy from 'rollup-plugin-copy';

function build() {
    return [{
        input: './src/components/index.ts',
        treeshake: false,
        output: [
            {
                preserveModules: true,
                // sourcemap: true,
                preserveModulesRoot: 'src/components',
                dir: 'core',
                format: 'cjs',
                exports: 'auto'
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript(),
            url(),
            copy({
                targets: [
                    { src: 'src/components/prime/multiselect/*.css', dest: 'core/prime/multiselect' },
                    { src: 'src/components/Theme/*.ttf', dest: 'core/Theme' }
                ]
            })
        ]
    }];
}

export default build();
