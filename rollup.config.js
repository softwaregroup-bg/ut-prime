import babel from '@rollup/plugin-babel';
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
                sourcemap: true,
                preserveModulesRoot: 'src/components',
                dir: 'core',
                format: 'cjs',
                exports: 'auto'
            }
        ],
        plugins: [
            external(),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime'
            }),
            resolve(),
            commonjs(),
            typescript(),
            url(),
            copy({
                targets: [{ src: 'src/assets/*', dest: 'core/assets' }]
            })
        ]
    }];
}

export default build();
