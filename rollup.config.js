import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import url from '@rollup/plugin-url';
import { terser } from 'rollup-plugin-terser';
import rename from 'rollup-plugin-rename';
import copy from 'rollup-plugin-copy';

const plugins = [
    babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
    }),
    external({
        includeDependencies: true,
    }),
    resolve({
        customResolveOptions: {
            moduleDirectory: 'src',
        },
    }),
    commonjs(),
    postcss({
        modules: true,
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    url(),
    terser(),
    rename({
        include: ['**/*.js', '**/*.ts', '**/*.tsx'],
        map: (name) =>
            name
                .replace('src/', '')
                .replace('components/', '')
                .replace('node_modules/', 'external/')
                .replace('../../external', '../external'),
    }),
    copy({
        targets: [{ src: 'src/assets/*', dest: 'core/assets' }],
    }),
];

function build() {
    const components = ['PieChart'];

    const modules = components.map((comp) => ({
        input: `./src/components/${comp}/index.ts`,
        output: [
            {
                dir: `core/${comp}`,
                format: 'umd',
                exports: 'auto',
                name: comp,
            },
        ],
        plugins,
    }));

    modules.push({
        input: './src/components/index.ts',
        output: [
            {
                dir: 'core',
                format: 'cjs',
                exports: 'auto',
            },
        ],
        plugins,
    });

    return modules;
}

export default build();
