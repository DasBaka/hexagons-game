// @ts-check

import angular from 'angular-eslint';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
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
    plugins: { jsdoc },
    ignores: ['**/*.spec.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: { FunctionExpression: true, MethodDefinition: true, ClassDeclaration: true },
          contexts: [
            'TSEnumDeclaration',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'FunctionExpression:not([parent.key.name=/^(ngOnInit|ngOnChanges|ngDoCheck|ngAfterContentInit|ngAfterContentChecked|ngAfterViewInit|ngAfterViewChecked|ngOnDestroy)$/])',
            'MethodDefinition:not([key.name=/^(ngOnInit|ngOnChanges|ngDoCheck|ngAfterContentInit|ngAfterContentChecked|ngAfterViewInit|ngAfterViewChecked|ngOnDestroy)$/])',
            'ClassDeclaration',
            'ExportNamedDeclaration',
            'ExportDefaultDeclaration'
          ],
          exemptEmptyFunctions: true,
          checkConstructors: false
        }
      ],
      'lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowBlockStart: true,
          allowArrayStart: true
        }
      ],
      'no-alert': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-expressions': 'off',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app'],
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['app'],
          style: 'camelCase'
        }
      ],
      '@angular-eslint/sort-lifecycle-methods': 'error',
      '@typescript-eslint/adjacent-overload-signatures': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/consistent-generic-constructors': 'off',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'as' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
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
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T']
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          prefix: ['E']
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/prefer-for-of': 'off',
      'sonarjs/cognitive-complexity': ['error', 25],
      'sonarjs/max-switch-cases': ['error', 10],
      'sonarjs/no-angular-bypass-sanitization': 'off',
      'sonarjs/no-clear-text-protocols': 'off',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-commented-code': 'error',
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-hardcoded-passwords': 'off',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-ignored-exceptions': 'off',
      'sonarjs/no-invariant-returns': 'warn',
      'sonarjs/no-nested-assignment': 'off',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/single-char-in-character-classes': 'off',
      'sonarjs/todo-tag': 'off',
      'sonarjs/unused-vars': 'off'
    }
  },
  {
    files: ['**/*.interface.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface']
    }
  },
  {
    files: ['**/*.type.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type']
    }
  }
);
