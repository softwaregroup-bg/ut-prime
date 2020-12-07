import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import { terser } from 'rollup-plugin-terser';
import rename from 'rollup-plugin-rename';
import copy from 'rollup-plugin-copy';

const plugins = dir => [
    external(),
    babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime'
    }),
    resolve(),
    commonjs(),
    postcss({extract: true, modules: true}),
    typescript({declarationDir: dir}),
    url(),
    terser(),
    rename({
        include: ['**/*.js', '**/*.ts', '**/*.tsx'],
        map: (name) =>
            name
                .replace('src/', '')
                .replace('components/', '')
                .replace('node_modules/', 'external/')
                .replace('../../external', '../external')
    }),
    copy({
        targets: [{ src: 'src/assets/*', dest: 'core/assets' }]
    })
];

function build() {
    return [{
        input: './src/components/index.ts',
        treeshake: false,
        output: [
            {
                preserveModules: true,
                dir: 'core',
                format: 'cjs',
                exports: 'auto'
            }
        ],
        plugins: plugins('core')
    }];
}

export default build();
