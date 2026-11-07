// Frozen post-PR11 source and owner-protection contract for the PR #20 baseline.
// Do not derive the expected paths or branch heads from the mutable baseline JSON.
export const SOURCE_COMMIT = '895ff9c598689ce58980b504876b3b36c027f6a5';
export const SOURCE_TREE = 'd077bcda30b9238bb58af020170b356666e08038';
export const PINNED_SOURCE_PATHS = Object.freeze([
  "public/assets/animation/manifest.json",
  "src/content/animation-assets.js",
  "src/content/animation-ball-tracks.js",
  "src/content/teams.js",
  "src/content/supporting-donor-map.js",
  "src/content/supporting-animation-libraries.js",
  "src/render/animation-sprites.js",
  "src/render/uniform-palette.js",
  "src/core/animation.js",
  "docs/animation-production/ASSET_AUDIT_LATEST.json",
  "docs/animation-production/ASSET_AUDIT_LATEST.md",
  "docs/animation-production/PR17_AUDIT_EXPECTED_SIGNATURES.json",
  "tools/captain-studio/validate-package.mjs",
  "tools/captain-studio/integrate-batch.mjs",
  "tools/captain-studio/export-package.mjs",
  "tools/captain-studio/package-schema.json",
  "tools/captain-studio/profile-baseline.mjs"
]);
export const HISTORICAL_BRANCHES = Object.freeze([
  {
    "name": "codex/captain-studio-architecture",
    "head": "fd61909ce7f51a636805e3023a406eb0c6404f8c"
  },
  {
    "name": "codex/captain-studio-infrastructure",
    "head": "475b63de08cbfb0ed0f6f17daab9a1fa8e55688f"
  },
  {
    "name": "codex/rejected-prompt-exception",
    "head": "690ec780343a164f40bf1d8053d2f55676668fe6"
  }
]);
export const APPROVED_BASELINE_PATHS = Object.freeze([
  ".github/workflows/captain-studio-baseline-verify.yml",
  "docs/animation-production/CAPTAIN_GAP_MATRIX.csv",
  "docs/animation-production/CAPTAIN_STUDIO_BASELINE.json",
  "docs/animation-production/CAPTAIN_STUDIO_BASELINE_2026-11-06.md",
  "tools/captain-studio/verify-baseline.mjs",
  "tools/captain-studio/baseline-contract.mjs",
  "tests/captain-studio-baseline-contract.test.js"
]);

const guard = (ok, message) => {
  if (!ok) throw Error('Captain Studio baseline contract failed: ' + message);
};
const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);

export function assertBaselineContract(baseline) {
  guard(baseline && typeof baseline === 'object' && !Array.isArray(baseline), 'baseline object');
  guard(baseline.schemaVersion === 1, 'schema version');
  guard(baseline.status === 'candidate_requires_fresh_read_only_strict_audit_and_owner_acceptance', 'candidate/review status');
  guard(baseline.source?.ref === 'main', 'source ref');
  guard(baseline.source?.commit === SOURCE_COMMIT && baseline.source?.tree === SOURCE_TREE, 'frozen merged source identity');

  const pins = baseline.source?.blobIds;
  guard(pins && typeof pins === 'object' && !Array.isArray(pins), 'source pin map');
  const paths = Object.keys(pins);
  guard(paths.length === PINNED_SOURCE_PATHS.length && PINNED_SOURCE_PATHS.every(path => Object.hasOwn(pins, path)), 'exact 17 required source pins');
  guard(paths.every(path => sha(pins[path])), 'source pin hash shape');

  const retirement = baseline.branchRetirement;
  guard(retirement?.localWorktreeDependenciesVerified === false, 'local worktree dependencies remain unverified');
  guard(retirement?.remoteBranchesDeleted === false, 'remote branches remain preserved');
  guard(retirement?.manualRecheckRequired === true, 'manual worktree recheck must be required');
  guard(Array.isArray(retirement?.branches) && retirement.branches.length === HISTORICAL_BRANCHES.length, 'historical branch count');
  for (const {name, head} of HISTORICAL_BRANCHES) {
    guard(retirement.branches.filter(item => item?.name === name && item?.head === head).length === 1, 'historical branch pin ' + name);
  }

  const gates = baseline.gates;
  for (const key of [
    'studioPilotAuthorized',
    'additionalCaptainLanesAuthorized',
    'newArtAcceptedByThisSnapshot',
    'mythUnpublishedLocalWorktreeInspected',
    'resourceLimitsMeasuredFromAcceptedBundles'
  ]) guard(gates?.[key] === false, 'owner protection gate ' + key);
  guard(Array.isArray(gates.independentVisualIssuesOpen) &&
    gates.independentVisualIssuesOpen.length === 2 &&
    gates.independentVisualIssuesOpen.includes(18) &&
    gates.independentVisualIssuesOpen.includes(19), 'Marin/Kraken visual holds remain open');
  guard(baseline.strictAudit?.expectations?.strictOk === false, 'strict artwork remains incomplete');
  guard(baseline.gapMatrix?.mythMissing === 21 && baseline.gapMatrix?.krakenMissing === 0, 'Myth/Kraken gap identities');
}

export function assertApprovedChangePaths(changedPaths) {
  guard(Array.isArray(changedPaths) && changedPaths.length > 0, 'candidate change list');
  const approved = new Set(APPROVED_BASELINE_PATHS);
  for (const path of changedPaths) {
    guard(typeof path === 'string' && approved.has(path), 'unapproved change outside baseline files: ' + path);
  }
  return changedPaths.length;
}
