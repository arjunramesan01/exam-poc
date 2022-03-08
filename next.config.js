const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none';"
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]


module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  reactStrictMode: true,
  trailingSlash: true,
  assetPrefix: 'https://exam-poc.byjusweb.com',
  images: {
    domains: ['s3-us-west-2.amazonaws.com', 'infinitestudent-migration-images.s3-us-west-2.amazonaws.com', '*.s3-us-west-2.amazonaws.com', 'cdn1.byjus.com', 'search-app.byjusweb.com', 'search-static-stg.byjusweb.com', 'search-static.byjusweb.com'],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    loader: 'akamai',
    path: 'https://search-static.byjusweb.com/assets',
  },

}

