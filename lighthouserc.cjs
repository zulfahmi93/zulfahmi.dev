module.exports = {
  ci: {
    collect: {
      // Lighthouse runs against the static export; LHCI serves out/ itself.
      // Run `npm run build` before `npm run lhci`.
      staticDistDir: "./out",
      numberOfRuns: 1,
      settings: { preset: "desktop" },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
