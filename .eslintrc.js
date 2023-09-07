module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json'
  ],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-debugger': 'off',
    'no-console': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    quotes: [2, 'single'],
    semi: [2, 'never'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-comment': 1,
    eqeqeq: ['off', 'always', { null: 'ignore' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: false,
        allowedNames: ['self']
      }
    ]
  }
}
