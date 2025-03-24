import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('.', import.meta.url)); 

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': `${root}/src`,
      '@components': `${root}/src/components`,
      '@ui': `${root}/src/components/ui`,
      '@lib': `${root}/src/lib`,
      '@hooks': `${root}/src/hooks`,
      '@api': `${root}/src/api`,
      '@pages': `${root}/src/pages`
    }
  }
});
