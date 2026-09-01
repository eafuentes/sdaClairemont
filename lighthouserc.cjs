/**
 * Lighthouse CI for the homepage.
 *
 * One run against a production `pnpm start`, on the collected URL. Performance is a
 * warning at 90 rather than a hard fail: GitHub-hosted Chrome over localhost is not a
 * mid-tier phone on 4G, which is the number the exit gate actually cares about. The
 * report still lands in `.lighthouseci` so a regression is visible.
 */
module.exports = {
  ci: {
    collect: {
      url: ['http://127.0.0.1:3010/'],
      numberOfRuns: 1,
      startServerCommand: 'pnpm exec next start --hostname 127.0.0.1 --port 3010',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 60000,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        skipAudits: ['uses-http2', 'redirects-http'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
