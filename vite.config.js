import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl({
      /*
      // name of certification
      name: 'test',
      // custom trust domains
      domains: ['*.custom.com'],
      // custom certification directory
      certDir: '/Users/.../.devServer/cert'
      */
    }),
  ],
  publicDir: '../../../public',
  resolve: {
    alias: {
      // "@": fileURLToPath (new URL ('./src/js', import.meta.url)),
      //"@": fileURLToPath (new URL ('./node_modules', import.meta.url)),
      "@graceful-language/core": fileURLToPath (new URL ('./index.js', import.meta.url)),
      "~/env": fileURLToPath (new URL ('../_env', import.meta.url)),
      "~/browser": fileURLToPath (new URL ('./src/js/browser', import.meta.url)),
      "~/common": fileURLToPath (new URL ('./src/js/common', import.meta.url)),
    },
  },
  root: 'src/js/browser',
  server: {
    host: true,
    https: true,
    port: 5300,
  }
})
