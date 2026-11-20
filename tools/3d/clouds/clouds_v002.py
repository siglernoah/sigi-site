"""v002 — Volumetric cumulus sprites for the home hero (Cycles, CPU, transparent PNG).

    blender --background --factory-startup --python clouds_v002.py -- --out DIR [--count 6] [--res 768] [--samples 64]

Each sprite: a lumpy metaball cluster, voxel-remeshed and displaced, filled with a noise-shaped
Principled Volume; lit by a high sun plus a blue sky dome so the shadows read navy-grey.
The site tints them per theme (white on the light theme, moonlit grey on the dark one).
"""
import bpy, math, random, sys, argparse, os, json
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True)
ap.add_argument("--count", type=int, default=6); ap.add_argument("--res", type=int, default=768)
ap.add_argument("--samples", type=int, default=64); ap.add_argument("--only", type=int, default=-1)
a = ap.parse_args(argv); os.makedirs(a.out, exist_ok=True)

def build(seed):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; rnd = random.Random(seed)
    # --- shape: flat-bottomed cumulus from metaballs ---
    mb = bpy.data.metaballs.new("Cloud"); mb.resolution = 0.12; mb.threshold = 0.6
    ob = bpy.data.objects.new("CloudMB", mb); sc.collection.objects.link(ob)
    n = rnd.randint(9, 14)
    for i in range(n):
        x = rnd.uniform(-2.6, 2.6); r = rnd.uniform(0.9, 1.6) * (1.15 - abs(x) / 4.5)
        e = mb.elements.new(); e.co = (x, rnd.uniform(-0.8, 0.8), max(0.0, r * 0.55 + rnd.uniform(-0.2, 0.5))); e.radius = r
    for i in range(4):                                      # a few top billows
        e = mb.elements.new(); e.co = (rnd.uniform(-1.4, 1.4), rnd.uniform(-0.4, 0.4), rnd.uniform(1.1, 1.8)); e.radius = rnd.uniform(0.8, 1.2)
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    bpy.ops.object.convert(target="MESH"); cl = bpy.context.object; cl.name = "Cloud"
    # flatten the base a little, like real cumulus
    for v in cl.data.vertices:
        if v.co.z < 0.2: v.co.z = 0.2 + (v.co.z - 0.2) * 0.35
    rm = cl.modifiers.new("Remesh", "REMESH"); rm.mode = "VOXEL"; rm.voxel_size = 0.07
    tex = bpy.data.textures.new("Billow", "CLOUDS"); tex.noise_scale = 0.5; tex.noise_depth = 4
    d = cl.modifiers.new("Displace", "DISPLACE"); d.texture = tex; d.strength = 0.85; d.mid_level = 0.5
    sm = cl.modifiers.new("Smooth", "SMOOTH"); sm.iterations = 3; sm.factor = 0.5
    # --- volume material: noise-shaped density, soft edges ---
    m = bpy.data.materials.new("CloudVol"); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial"); vol = nt.nodes.new("ShaderNodeVolumePrincipled")
    vol.inputs["Color"].default_value = (1, 1, 1, 1); vol.inputs["Anisotropy"].default_value = 0.35
    noise = nt.nodes.new("ShaderNodeTexNoise"); noise.inputs["Scale"].default_value = 2.4; noise.inputs["Detail"].default_value = 8
    noise.inputs["Roughness"].default_value = 0.62; noise.noise_dimensions = "4D"
    noise.inputs["W"].default_value = seed * 3.7
    ramp = nt.nodes.new("ShaderNodeValToRGB"); ramp.color_ramp.elements[0].position = 0.36; ramp.color_ramp.elements[1].position = 0.5
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; mul.inputs[1].default_value = 30.0
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"]); nt.links.new(ramp.outputs["Color"], mul.inputs[0])
    nt.links.new(mul.outputs[0], vol.inputs["Density"]); nt.links.new(vol.outputs["Volume"], out.inputs["Volume"])
    cl.data.materials.append(m)
    # --- light: high sun + blue sky dome ---
    sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", "SUN")); sun.data.energy = 9.0; sun.data.angle = math.radians(2)
    sun.rotation_euler = (math.radians(28), math.radians(-18), 0); sc.collection.objects.link(sun)
    w = bpy.data.worlds.new("Sky"); sc.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.32, 0.42, 0.66, 1); w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.9
    # --- camera: side-on, framed to the cloud ---
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam")); sc.collection.objects.link(cam); sc.camera = cam
    cam.data.type = "ORTHO"; cam.data.ortho_scale = 8.6; cam.location = (0, -20, 1.0); cam.rotation_euler = (math.radians(90), 0, 0)
    # --- render ---
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = a.samples; sc.cycles.use_denoising = True
    sc.cycles.volume_bounces = 6; sc.cycles.max_bounces = 8; sc.cycles.volume_step_rate = 1.5
    sc.render.film_transparent = True; sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Base Contrast"
    sc.render.resolution_x = a.res; sc.render.resolution_y = int(a.res * 0.62)
    sc.render.image_settings.color_mode = "RGBA"
    return sc

report = []
for i in range(a.count):
    if a.only >= 0 and i != a.only: continue
    sc = build(101 + i * 17)
    sc.render.filepath = os.path.join(a.out, f"cloud-{i + 1}.png")
    bpy.ops.render.render(write_still=True); report.append(sc.render.filepath)
print(json.dumps({"status": "ok", "files": report}))
