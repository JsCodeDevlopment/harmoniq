import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harmoniq',
    short_name: 'Harmoniq',
    description: 'Plataforma definitiva para músicos de louvor.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#EAB308',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
