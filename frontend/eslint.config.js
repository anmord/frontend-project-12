import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
    },

    settings: {
      react: { version: 'detect' },
    },

    rules: {
      ...js.configs.recommended.rules,

      // react hooks (вручную, без extends)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // react refresh
      'react-refresh/only-export-components': 'warn',

      // react
      'react/react-in-jsx-scope': 'off',

      // stylistic (как у тебя)
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/arrow-parens': ['error', 'always'],

      // JSX (чтобы совпало с CI)
      '@stylistic/jsx-tag-spacing': 'error',
      '@stylistic/jsx-one-expression-per-line': 'error',
      '@stylistic/jsx-closing-bracket-location': 'error',
      '@stylistic/jsx-first-prop-new-line': 'error',
      '@stylistic/jsx-max-props-per-line': 'error',
    },
  },
])
