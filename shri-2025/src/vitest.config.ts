// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts', // опционально
        include: ['**/*.{test,spec}.{ts,tsx}'],
    },
});
