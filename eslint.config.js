// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const sonarjs = require('eslint-plugin-sonarjs');
const jsdoc = require('eslint-plugin-jsdoc');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config({
  files: ['**/*.ts'],
  languageOptions: {
    parser: tseslint.parser
  },
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    sonarjs.configs.recommended,
    ...angular.configs.tsRecommended,
    eslintConfigPrettier
  ],
  plugins: {
    // @ts-ignore
    jsdoc
  },
  ignores: ['**/*.spec.ts'],
  processor: angular.processInlineTemplates,
  rules: {
    'jsdoc/require-jsdoc': ['error', { require: { FunctionExpression: true, ClassDeclaration: true } }],
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-debugger': 'warn',
    '@angular-eslint/sort-lifecycle-methods': 'error',
    // Bedingungen für directives
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: ['app', 'amcs'], // Erlaubte Präfixe
        style: 'camelCase'
      }
    ],
    // Bedingungen für components
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: ['app', 'amcs'], // Erlaubte Präfixe
        style: 'kebab-case'
      }
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/consistent-generic-constructors': 'off',
    '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'as' }],
    '@typescript-eslint/adjacent-overload-signatures': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        ignoredMethodNames: ['ngOnInit', 'ngAfterViewInit', 'ngAfterViewChecked', 'ngAfterContentChecked', 'ngOnDestroy'],
        overrides: {
          accessors: 'explicit',
          constructors: 'no-public',
          methods: 'explicit',
          parameterProperties: 'off',
          properties: 'off'
        }
      }
    ],
    'sonarjs/no-invariant-returns': 'warn',
    'sonarjs/no-redundant-boolean': 'warn',
    'sonarjs/no-nested-assignment': 'off',
    'sonarjs/cognitive-complexity': 'off',
    'sonarjs/no-clear-text-protocols': 'off',
    'sonarjs/todo-tag': 'off',
    'sonarjs/unused-vars': 'off',
    'sonarjs/single-char-in-character-classes': 'off',
    'sonarjs/no-ignored-exceptions': 'off',
    'sonarjs/no-angular-bypass-sanitization': 'off',
    'sonarjs/no-commented-code': 'error',
    'sonarjs/no-hardcoded-passwords': 'off'
  }
});
