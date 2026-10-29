# Attempt04 harness validity correction

Attempt04 does **not** validate the candidate track through normal `stepMatch`. Its capture script registered the Playwright route for `/src/core/animation.js` after `page.goto()` and after `window.jamverse` had loaded. That module was already cached, so the in-memory track injection never ran. The `report.json` track field describes the intended candidate vector, not the vector used by the normal gameplay runs. The pass/release/catch trace is only a successful generic simulation fallback check and must not be cited as candidate-driven validation.

Attempt04's actual release screenshots still show a visible ball-to-fingertip gap, but because the wrong track was sampled they are not a definitive candidate-track calibration result. The independent review remains preserved as an observation of those captures. Attempt05 moves the route before initial page load and asserts the runtime sample values before starting the gameplay trial.
