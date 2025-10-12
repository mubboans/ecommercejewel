import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
        rules: {
            // 🔥 Turn all rules to warnings
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "react/no-unescaped-entities": "off",
            "react/display-name": "off",
            "react-hooks/exhaustive-deps": "off",
            "@next/next/no-img-element": "off",
            "no-console": "off",
            // Or literally nuke everything:
            "no-undef": "off",
        },
    },
];

export default eslintConfig;
