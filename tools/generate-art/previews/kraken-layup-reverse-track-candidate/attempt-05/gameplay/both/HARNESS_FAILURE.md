# Attempt05 gameplay fixture failure

The atlas cache and production selector both report the expected candidate source and complete 320px-wide image. However, the one-player fixture used x=175 for right-facing and x=25 for left-facing; those world positions project outside the 480×360 Jam Stage backing canvas. The 52 screenshots therefore do not provide rendered gameplay evidence, despite the state simulation scoring at tick100 in both facings.

Attempt06 keeps the shot target/facing but moves the diagnostic shooter to x=120 (right) / x=80 (left), inside the preview viewport. Preserve attempt04/05 artifacts and use attempt06 for actual visual review.
