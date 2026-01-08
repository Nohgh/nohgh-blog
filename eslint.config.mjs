import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-cycle': ['warn', { maxDepth: 1 }],
      'import/no-dynamic-require': 'warn',
      'import/no-commonjs': 'warn',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // fs, path
            'external', // react, next
            'type',
            'parent', // ../
            'sibling', // ./
            'index', // ./
            'internal', // @/components
            'object',
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/prefer-default-export': 'off',
    },
  },
])

export default eslintConfig
