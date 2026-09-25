# knitting-rack-guide workflow

For every effective change to this project, unless the user explicitly says not to push:

1. Update `version-config.js` for a user-visible release and cache version.
2. Run `node scripts/check.mjs` and relevant browser checks.
3. Inspect `git diff` and `git diff --check`.
4. Commit the changes and push `main` to `origin`.
5. Check the deployment run and verify the live HTTPS site, including the changed feature.

Keep the GitHub repository private unless the user explicitly authorizes making it public. Do not claim a deployment succeeded before checking its run and the live site. The official user entry point is the deployed HTTPS site; the local server is for development and testing.
