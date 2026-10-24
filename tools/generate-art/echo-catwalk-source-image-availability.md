# Echo Catwalk source image availability

The current Echo source package contains 29 registered-runtime clip keys and 293 authored frames. The six baseline atlases (`idle`, `idle-ball`, `dribble`, `run`, `dribble-run`, and `shoot`) remain the existing reviewed outputs. Their two original ImageGen source images are not present in this workspace:

- The five locomotion clips refer to generation `exec-8538d53c-4fe7-4248-b35f-6c7fd79d020b`, SHA-256 `b5d0abd28a833f6d26e46975bc8cb44870a1abcfa77d1d0372c1133ebf42c452`.
- `shoot` refers to generation `exec-58f7c856-c3b1-4d2e-9fe6-2e8e06874b9e`, SHA-256 `78273902d2b1936ca820af933559d268e1004db5a2c80b359f823030b349240a`.

The prompts, generation identifiers, recorded source hashes, crop maps, and accepted atlases remain in `tools/generate-art/echo-catwalk-locomotion-layouts.json`, `tools/generate-art/echo-catwalk-shoot10-layouts.json`, and their linked provenance. No replacement source image or pose was generated. The 23 action source sheets and their rejected candidates are present and preserved under `tools/generate-art/sources/`.
