# 3D workflow (Blender → GLB → Three.js)

Everything here is tooling; the website itself still has no build step.

## What's installed

| Piece | Where | Notes |
|---|---|---|
| Blender 5.3.0 (official build, checksum-verified) | `/opt/blender-5.3.0-linux-x64`, `blender` on PATH | Reinstalled by the `sigi-site` cloud environment's setup script |
| Skill pack: cc-blender-skill v1.4.0 (30 skills, RobLe3, MIT) | `.claude/skills/<name>` | Orchestrator: `text-to-blender` |
| Skill: blender-web-3d v2.0 (czlonkowski, MIT) | `.claude/skills/blender-web-3d` | Headless Blender → GLB → Three.js |
| Blender MCP server `mcp-for-blender` 2.3.1 (ahujasid) | `tools/3d/.venv` | Registered in `/.mcp.json` as server `blender`; telemetry off |
| MCP add-on for Blender | `~/.config/blender/5.3/scripts/addons/blender_mcp_addon.py` | Auto-starts a socket on 127.0.0.1:9876 when Blender's UI runs |
| gltf-transform 4.5.1 + meshoptimizer | `tools/3d/node_modules` | GLB optimisation (meshopt, WebP) |
| GLTFLoader + MeshoptDecoder for three r160 | `js/vendor/` | Used by the site to load GLBs |

## Using it

**Live modelling through MCP** (cc-blender-skill): start a new Claude Code session in this repo and
approve the `blender` MCP server when asked. `tools/3d/blender-mcp.sh` starts Blender on a virtual
display if it isn't running, then starts the MCP server. Then ask in plain language, e.g.
"model a laptop and render a hero shot", or invoke `/text-to-blender`.

**Headless scripts** (blender-web-3d): no MCP needed.

```bash
blender --background --factory-startup --python my_model.py -- out/
```

**Optimise a GLB for the web:**

```bash
cd tools/3d && npx gltf-transform optimize in.glb ../../models/out.glb --compress meshopt --texture-compress webp
```

**Load it in the site** (three r160, already vendored):

```js
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {MeshoptDecoder} from './vendor/meshopt_decoder.module.js';
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const gltf = await loader.loadAsync('models/laptop.glb');
```

## Known limits

- No GPU in the cloud container: Cycles renders on CPU (fine for stills); EEVEE works through
  software OpenGL but is slow (~25 s for a small preview).
- The current `mcp-for-blender` renamed some tools that cc-blender-skill's docs mention
  (`get_object_info`, `get_viewport_screenshot` → use `get_scene_info`, `look`, `execute_blender_code`).
- The official Blender Lab MCP isn't set up (its extension host, lab.blender.org, isn't on the network allowlist).
- cc-blender-skill's author lists Claude Code auto-routing as not yet community-tested.
