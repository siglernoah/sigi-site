"""Cycles check/beauty render of the laptop (CPU, AgX, transparent background).

    blender --background laptop_v001.blend --python render_check.py -- --out check.png [--samples 48] [--view hero|close|front] [--screen img.jpg]
"""
import bpy, math, sys, argparse
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True); ap.add_argument("--samples", type=int, default=48)
ap.add_argument("--view", default="hero"); ap.add_argument("--screen"); ap.add_argument("--res", type=int, default=1000)
a = ap.parse_args(argv)
sc = bpy.context.scene

sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = a.samples
sc.cycles.use_denoising = True; sc.render.film_transparent = True
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
sc.render.resolution_x = a.res; sc.render.resolution_y = int(a.res * 0.68)
sc.render.filepath = a.out

# studio world: soft grey dome so metal has something to reflect
w = bpy.data.worlds.new("Studio"); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes["Background"]; bg.inputs["Color"].default_value = (0.42, 0.45, 0.52, 1); bg.inputs["Strength"].default_value = 0.4

def area(name, loc, size, energy, color=(1, 1, 1)):
    l = bpy.data.lights.new(name, "AREA"); l.size = size; l.energy = energy; l.color = color
    o = bpy.data.objects.new(name, l); o.location = loc; sc.collection.objects.link(o)
    o.rotation_euler = (Vector((0, 0, 0.6)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
area("Key", (-4, -5, 6), 5, 900)                       # big soft key from front-left above
area("Rim", (5, 4, 3), 3, 650, (0.75, 0.82, 1.0))      # cool rim from behind-right: catches the edges
area("Fill", (5, -4, 1.5), 4, 120)

if a.screen:
    m = bpy.data.materials["Screen"]; nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = bpy.data.images.load(a.screen)
    mapping = nt.nodes.new("ShaderNodeMapping"); coord = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(coord.outputs["UV"], mapping.inputs["Vector"]); nt.links.new(mapping.outputs["Vector"], tex.inputs["Vector"])
    img = tex.image
    # show the top of a tall page: the screen (w/h ~ 1.54) sees this fraction of the page height
    scr = bpy.data.objects["Screen"]; sw, sh = scr.scale.x, scr.scale.y
    win = (sh / sw) * (img.size[0] / img.size[1])
    mapping.inputs["Scale"].default_value = (1, win, 1); mapping.inputs["Location"].default_value = (0, 1 - win, 0)
    nt.links.new(tex.outputs["Color"], b.inputs["Emission Color"]); nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Emission Strength"].default_value = 1.0

cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam")); sc.collection.objects.link(cam); sc.camera = cam
views = {"hero": ((-5.2, -8.2, 4.2), (0, 0.15, 0.85), 50), "close": ((-1.6, -2.6, 1.3), (-0.4, 0.4, 0.3), 50), "front": ((0, -9.5, 2.6), (0, 0.2, 0.95), 50)}
loc, look, lens = views[a.view]
cam.location = loc; cam.data.lens = lens
cam.rotation_euler = (Vector(look) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
bpy.ops.render.render(write_still=True)
print("RENDERED", a.out)
