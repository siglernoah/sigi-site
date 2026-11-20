"""Laptop for the Signet Works home hero — v001 (built from scratch, headless).

    blender --background --factory-startup --python laptop_v001.py -- --out laptop_v001.blend

Space-black aluminium, MacBook-like proportions, no logos. 1 unit = 10 cm.
Names are the contract with js/laptop3d.js:
  Laptop      root empty (the site positions/rotates this)
  Lid_Pivot   empty at the hinge (lid opening angle)
  Screen      UV 0..1 quad; the site swaps its material for a scrolling screenshot
"""
import bpy, bmesh, json, math, sys, argparse
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True); ap.add_argument("--open-deg", type=float, default=112)
args = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

W, D = 3.04, 2.15            # footprint
BASE_H, LID_T = 0.105, 0.052  # thicknesses
R_PLAN = 0.11                # corner radius seen from above

# ---------------- materials ----------------
def mat(name, color, rough, metal=0.0, coat=0.0, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if coat:
        b.inputs["Coat Weight"].default_value = coat; b.inputs["Coat Roughness"].default_value = 0.05
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = 1.0
    return m
ALU = mat("Aluminium_SpaceBlack", (0.030, 0.031, 0.035), 0.36, metal=1.0)
KEY = mat("Keycap", (0.010, 0.010, 0.011), 0.55)
WELL = mat("KeyWell", (0.004, 0.004, 0.005), 0.7)
PAD = mat("Trackpad_Glass", (0.036, 0.037, 0.041), 0.24, metal=0.6)
GLASS = mat("Bezel_Glass", (0.003, 0.003, 0.004), 0.06, coat=1.0)
SCREEN = mat("Screen", (0.9, 0.9, 0.9), 0.3, emit=(0.9, 0.9, 0.9))
HINGE = mat("Hinge", (0.018, 0.018, 0.02), 0.42, metal=0.9)
RUBBER = mat("Rubber", (0.01, 0.01, 0.01), 0.9)

# ---------------- helpers ----------------
def link(ob, parent=None):
    scene.collection.objects.link(ob)
    if parent: ob.parent = parent
    return ob

def rrect_slab(name, w, d, h, r, edge=0.012, seg=14, material=None, parent=None, z0=0.0):
    """Rounded-rectangle plate (plan corner radius r) extruded to height h, edges softened by a bevel."""
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    r = min(r, w / 2 - 1e-4, d / 2 - 1e-4); pts = []
    for cx, cy, a0 in ((w/2 - r, d/2 - r, 0), (-w/2 + r, d/2 - r, 90), (-w/2 + r, -d/2 + r, 180), (w/2 - r, -d/2 + r, 270)):
        for i in range(seg + 1):
            a = math.radians(a0 + 90 * i / seg); pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    verts = [bm.verts.new((x, y, z0)) for x, y in pts]
    face = bm.faces.new(verts)
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    for v in [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]: v.co.z += h
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    ob = link(bpy.data.objects.new(name, me), parent)
    if material: me.materials.append(material)
    if edge > 0:
        bev = ob.modifiers.new("Bevel", "BEVEL"); bev.width = edge; bev.segments = 3; bev.limit_method = "ANGLE"; bev.angle_limit = math.radians(50)
        bev.harden_normals = True
    for p in me.polygons: p.use_smooth = True
    me.set_sharp_from_angle(angle=math.radians(40))
    return ob

def empty(name, loc=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None); e.empty_display_size = 0.3; e.location = loc
    return link(e, parent)

def join(objs, name):
    """Apply modifiers and merge several meshes into one (fewer draw calls)."""
    dg = bpy.context.evaluated_depsgraph_get(); bm = bmesh.new()
    mats = []
    for o in objs:
        me = bpy.data.meshes.new_from_object(o.evaluated_get(dg)); me.transform(o.matrix_basis)
        for m in me.materials:
            if m not in mats: mats.append(m)
        tmp = bmesh.new(); tmp.from_mesh(me)
        remap = {i: mats.index(m) for i, m in enumerate(me.materials)}
        for f in tmp.faces: f.material_index = remap.get(f.material_index, 0)
        tmp.to_mesh(me); tmp.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)
    out = bpy.data.meshes.new(name); bm.to_mesh(out); bm.free()
    for m in mats: out.materials.append(m)
    parent = objs[0].parent
    for o in objs: bpy.data.objects.remove(o)
    ob = link(bpy.data.objects.new(name, out), parent)
    return ob

# ---------------- base ----------------
root = empty("Laptop")
base = rrect_slab("Base", W, D, BASE_H, R_PLAN, edge=0.016, material=ALU, parent=root)
# keyboard well: a near-black plate the keys sit in
KB_W, KB_D, KB_Y = 2.64, 1.06, 0.33
well = rrect_slab("KeyWell", KB_W + 0.05, KB_D + 0.05, 0.002, 0.03, edge=0, material=WELL, parent=root, z0=BASE_H - 0.0015)

# keys: rows of rounded caps, widths normalised to fill the row
rows = [([1] * 14, 0.105), ([1] * 13 + [1.5], 0.165), ([1.5] + [1] * 13, 0.165), ([1.8] + [1] * 11 + [1.8], 0.165),
        ([2.35] + [1] * 10 + [2.35], 0.165), ([1, 1, 1, 1.25, 5.6, 1.25, 1, 1, 1, 1], 0.165)]
GAP = 0.024; keys = []
y = KB_Y + KB_D / 2 - 0.02
for widths, kd in rows:
    unit = (KB_W - GAP * (len(widths) - 1)) / sum(widths); x = -KB_W / 2
    for i, u in enumerate(widths):
        kw = unit * u
        k = rrect_slab(f"Key_{len(keys)}", kw, kd, 0.02, 0.016, edge=0.006, seg=4, material=KEY, parent=root, z0=BASE_H - 0.008)
        k.location = (x + kw / 2, y - kd / 2, 0); keys.append(k); x += kw + GAP
    y -= kd + GAP
keys_ob = join(keys, "Keys")

# trackpad: a large glass plate, a hair below the deck
PAD_W, PAD_D = 1.32, 0.80
pad = rrect_slab("Trackpad", PAD_W, PAD_D, 0.004, 0.05, edge=0.002, seg=8, material=PAD, parent=root, z0=BASE_H - 0.0035)
pad.location.y = -D / 2 + 0.12 + PAD_D / 2
# front thumb scoop and rubber feet
for sx in (-1, 1):
    for sy in (-1, 1):
        f = bpy.data.objects.new(f"Foot", bpy.data.meshes.new("Foot"))
        bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=0.09, radius2=0.08, depth=0.012); bm.to_mesh(f.data); bm.free()
        f.data.materials.append(RUBBER); f.location = (sx * (W / 2 - 0.32), sy * (D / 2 - 0.28), -0.005); link(f, root)
# hinge barrel along the back edge
hb = bpy.data.objects.new("Hinge", bpy.data.meshes.new("Hinge")); bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=32, radius1=0.045, radius2=0.045, depth=W - 0.7); bm.to_mesh(hb.data); bm.free()
hb.data.materials.append(HINGE); hb.rotation_euler = (0, math.radians(90), 0); hb.location = (0, D / 2 - 0.035, BASE_H + 0.01); link(hb, root)
for p in hb.data.polygons: p.use_smooth = True

# ---------------- lid ----------------
LID_H = 2.12
pivot = empty("Lid_Pivot", (0, D / 2 - 0.035, BASE_H + 0.012), root)
lid = rrect_slab("Lid", W, LID_H, LID_T, R_PLAN, edge=0.014, material=ALU, parent=pivot)
lid.rotation_euler = (math.radians(90), 0, 0)            # stand it up: plan y -> world z
lid.location = (0, LID_T / 2, LID_H / 2)                 # lid's back face sits on the hinge line
# inner face: glossy black glass with the display set into it
inner_y = -0.0005                                        # just in front of the lid's front face (local to pivot)
glass = rrect_slab("Bezel", W - 0.03, LID_H - 0.03, 0.002, R_PLAN - 0.015, edge=0, material=GLASS, parent=pivot)
glass.rotation_euler = (math.radians(90), 0, 0); glass.location = (0, inner_y + 0.002, LID_H / 2)
SCR_W, SCR_TOP, SCR_BOT, SCR_SIDE = W - 2 * 0.075, 0.085, 0.15, 0.075
SCR_H = LID_H - SCR_TOP - SCR_BOT
bpy.ops.mesh.primitive_plane_add(size=1)
scr = bpy.context.object; scr.name = "Screen"; scr.data.name = "Screen"
scene.collection.objects.unlink(scr) if scr.name in scene.collection.objects else None
for c in list(scr.users_collection): c.objects.unlink(scr)
link(scr, pivot)
scr.scale = (SCR_W, SCR_H, 1); scr.rotation_euler = (math.radians(90), 0, 0)
scr.location = (0, inner_y - 0.0015, SCR_BOT + SCR_H / 2)
scr.data.materials.append(SCREEN)
# camera notch, cut into the top of the display
notch = rrect_slab("Notch", 0.30, 0.075, 0.002, 0.03, edge=0, seg=6, material=GLASS, parent=pivot)
notch.rotation_euler = (math.radians(90), 0, 0); notch.location = (0, inner_y - 0.0025, LID_H - SCR_TOP - 0.075 / 2 + 0.002)
pivot.rotation_euler = (math.radians(args.open_deg - 90) * -1, 0, 0)   # lean the lid back

# ---------------- validate + save ----------------
dg = bpy.context.evaluated_depsgraph_get()
def bbox(o):
    ev = o.evaluated_get(dg); pts = [ev.matrix_world @ Vector(c) for c in ev.bound_box]
    return [round(min(p[i] for p in pts), 3) for i in range(3)], [round(max(p[i] for p in pts), 3) for i in range(3)]
report = {"status": "ok", "objects": len(scene.objects), "keys_faces": len(keys_ob.data.polygons),
          "screen_bbox": bbox(scr), "base_bbox": bbox(base), "lid_bbox": bbox(lid), "materials": [m.name for m in bpy.data.materials]}
for o in scene.objects:
    if o.type == "MESH" and o.name != "Hinge" and o.name != "Foot" and not o.name.startswith("Foot"):
        if not o.data.materials: report["status"] = "missing material: " + o.name
bpy.ops.wm.save_as_mainfile(filepath=args.out)
print(json.dumps(report, indent=1))
