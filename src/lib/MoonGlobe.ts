import * as THREE from 'three';
import { DAY, HR } from './astro';
import { kep } from './orbits';
import { SAT } from '../data/satellites';
import { satIcon } from './draw/satIcon';
import { moonCanvas, sunCanvas, earthCanvas } from './textures';
import type { Ephemeris, Site, Vec3 } from '../types';

const T3 = (v: Vec3): THREE.Vector3 => new THREE.Vector3(v[0], v[2], -v[1]);

/** Opciones del globo: etiquetas HTML de Sol y Tierra y callbacks de clic. */
export interface MoonGlobeOptions {
  sunLabel: HTMLElement | null;
  earthLabel: HTMLElement | null;
  onSiteClick?: (i: number) => void;
  onSatClick?: (i: number) => void;
}

/** Estado que se dibuja: direcciones al Sol/Tierra, instante, sitios, foco y funciones de color y visibilidad. */
export interface MoonGlobeState {
  e: Ephemeris;
  t: number;
  sites: Site[];
  foc: number;
  colorOf: (i: number) => string;
  visibleOf: (i: number) => boolean;
}

/**
 * Globo lunar 3D (three.js) independiente de React.
 *
 * Uso:
 *   const globe = new MoonGlobe(canvas, { sunLabel, earthLabel, onSiteClick, onSatClick });
 *   globe.update({ e, t, sites, foc, colorOf, visibleOf });
 *   globe.dispose();
 */
export class MoonGlobe {
  private gc: HTMLCanvasElement;
  private lbS: HTMLElement | null;
  private lbE: HTMLElement | null;
  private onSiteClick?: (i: number) => void;
  private onSatClick?: (i: number) => void;

  /** 0: desde la Tierra, 1: sitio elegido, 2: libre (arrastrado). */
  private vm = 0;
  /** Distancia de la cámara. */
  private gd = 10;
  private inited = false;
  /** Satélite seleccionado (-1 = ninguno). */
  private selS = -1;
  private satOn = true;
  private waiting = false;
  private state: MoonGlobeState | null = null;
  private siteMesh = new Map<number, THREE.Mesh>();
  private gm: THREE.Mesh[] = [];
  private _raf: number | undefined;

  private rd: THREE.WebGLRenderer;
  private sc: THREE.Scene;
  private cm: THREE.PerspectiveCamera;
  private moon: THREE.Group;
  private sunL: THREE.DirectionalLight;
  private Z: THREE.Vector3;
  private wv: THREE.Vector3;

  private moonMesh!: THREE.Mesh;
  private sunD!: THREE.Sprite;
  private earD!: THREE.Group;
  private sunLn!: THREE.Line;
  private earLn!: THREE.Line;
  private XA!: THREE.Vector3;
  private satG!: THREE.Group;
  /** Sprite y línea de órbita de cada satélite (mismo orden que SAT). */
  private SM!: THREE.Sprite[];
  private SO!: THREE.Line[];
  /** Grupo de cada satélite de relevo L2, por índice en SAT. */
  private l2Groups = new Map<number, THREE.Group>();

  private _onResize!: () => void;
  private _down!: (e: PointerEvent) => void;
  private _move!: (e: PointerEvent) => void;
  private _up!: (e: PointerEvent) => void;
  private _cancel!: () => void;
  private _wheel!: (e: WheelEvent) => void;

  constructor(canvas: HTMLCanvasElement, { sunLabel, earthLabel, onSiteClick, onSatClick }: MoonGlobeOptions) {
    this.gc = canvas;
    this.lbS = sunLabel;
    this.lbE = earthLabel;
    this.onSiteClick = onSiteClick;
    this.onSatClick = onSatClick;

    const rd = (this.rd = new THREE.WebGLRenderer({ canvas, antialias: true }));
    this.sc = new THREE.Scene();
    this.cm = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    this.moon = new THREE.Group();
    this.sunL = new THREE.DirectionalLight(0xfff3df, 1.9);
    this.Z = new THREE.Vector3(0, 0, 1);
    this.wv = new THREE.Vector3();

    rd.outputEncoding = THREE.sRGBEncoding;
    rd.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rd.setClearColor(0x04060c);
    this.cm.position.z = 10;
    this.sc.add(this.moon, new THREE.AmbientLight(0x8d94ad, 0.12));
    this.moon.add(this.sunL);

    this.buildMoon();
    this.buildSunEarth();
    this.buildSatellites();

    this.resize();
    this._onResize = () => { this.resize(); this.draw(); };
    window.addEventListener('resize', this._onResize);
    this.bindPointer();
  }

  /* ---------- Construcción de la escena ---------- */
  private buildMoon(): void {
    const tx = new THREE.CanvasTexture(moonCanvas());
    tx.encoding = THREE.sRGBEncoding;
    this.moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 48),
      new THREE.MeshStandardMaterial({ map: tx, bumpMap: tx, bumpScale: 0.04, roughness: 1, metalness: 0 }),
    );
    this.moon.add(this.moonMesh);
  }

  private buildSunEarth(): void {
    const sunT = new THREE.CanvasTexture(sunCanvas());
    sunT.encoding = THREE.sRGBEncoding;
    this.sunD = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunT, transparent: true, depthWrite: false }));
    this.moon.add(this.sunD);

    const earT = new THREE.CanvasTexture(earthCanvas());
    earT.encoding = THREE.sRGBEncoding;
    this.earD = new THREE.Group();
    this.earD.add(
      new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), new THREE.MeshStandardMaterial({ map: earT, roughness: 1, metalness: 0 })),
      new THREE.Mesh(new THREE.SphereGeometry(0.225, 32, 24), new THREE.MeshBasicMaterial({ color: 0x6fb7ff, transparent: true, opacity: 0.2, depthWrite: false })),
    );
    this.moon.add(this.earD);

    const mkL = (c: number): THREE.Line => {
      const l = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)]),
        new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.55 }),
      );
      this.moon.add(l);
      return l;
    };
    this.sunLn = mkL(0xffc94d);
    this.earLn = mkL(0x6fb7ff);
    this.XA = new THREE.Vector3(1, 0, 0);
  }

  private buildSatellites(): void {
    this.satG = new THREE.Group();
    this.SM = [];
    this.SO = [];
    this.moon.add(this.satG);
    SAT.forEach((s, idx) => {
      const col = new THREE.Color(s.c);
      const tx2 = new THREE.CanvasTexture(satIcon(s, 128));
      tx2.encoding = THREE.sRGBEncoding;
      const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx2, transparent: true }));
      const pts: THREE.Vector3[] = [];
      if (s.l2) {
        for (let k = 0; k <= 96; k++) {
          const a = (k / 96) * 6.2832;
          pts.push(new THREE.Vector3(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0));
        }
      } else {
        for (let k = 0; k <= 128; k++) pts.push(T3(kep(s, (k / 128) * 6.2832)));
      }
      const ln = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.4 }),
      );
      if (s.l2) {
        const g3 = new THREE.Group();
        g3.add(ln, m);
        this.satG.add(g3);
        this.l2Groups.set(idx, g3);
      } else {
        this.satG.add(ln, m);
      }
      this.SM.push(m);
      this.SO.push(ln);
    });
  }

  /* ---------- Utilidades ---------- */
  /** ¿Está el punto p tapado por la esfera lunar vista desde la cámara? */
  private hidden(p: THREE.Vector3): boolean {
    const o = this.cm.position;
    const d = p.clone().sub(o);
    const L = d.length();
    d.normalize();
    const bq = o.dot(d);
    const ds = bq * bq - (o.lengthSq() - 1);
    if (ds > 0) {
      const t0 = -bq - Math.sqrt(ds);
      return t0 > 0 && t0 < L;
    }
    return false;
  }

  private updateLabels(): void {
    const w = this.gc.clientWidth || 300;
    const labels: [THREE.Object3D, HTMLElement | null, string][] = [
      [this.sunD, this.lbS, 'translate(-50%,-190%)'],
      [this.earD, this.lbE, 'translate(-50%,110%)'],
    ];
    labels.forEach(([o, l, tr]) => {
      if (!l) return;
      o.getWorldPosition(this.wv);
      const on = this.vm > 0 && o.visible && !this.hidden(this.wv);
      l.style.display = on ? '' : 'none';
      if (on) {
        this.wv.project(this.cm);
        l.style.transform = `translate(${(this.wv.x * 0.5 + 0.5) * w}px,${(0.5 - this.wv.y * 0.5) * w}px) ${tr}`;
      }
    });
  }

  private updateSatellites(e: Ephemeris, t: number): void {
    const { cm, satG, SM, SO } = this;
    satG.visible = this.satOn && cm.position.z > 4;
    const z = Math.max(1, cm.position.z / 7);
    SAT.forEach((s, i) => {
      const M = 6.2832 * ((t / (s.per * HR)) % 1) + i;
      if (s.l2) {
        const g3 = this.l2Groups.get(i);
        g3?.position.copy(T3(e.e)).multiplyScalar(-s.sa);
        g3?.lookAt(0, 0, 0);
        SM[i].position.set(Math.cos(M) * 0.3, Math.sin(M) * 0.3, 0);
      } else {
        SM[i].position.copy(T3(kep(s, M)));
      }
      SM[i].scale.setScalar((i === this.selS ? 1.5 : 1) * 0.36 * z);
      (SO[i].material as THREE.LineBasicMaterial).opacity = i === this.selS ? 0.95 : 0.4;
    });
  }

  private pickSat(x: number, y: number, w: number): number {
    if (!this.satOn || this.cm.position.z <= 4) return -1;
    let best = -1;
    let bd = (30 * w) / 360;
    SAT.forEach((_s, i) => {
      const v = this.SM[i].getWorldPosition(new THREE.Vector3());
      if (this.hidden(v)) return;
      v.project(this.cm);
      const dd = Math.hypot((v.x * 0.5 + 0.5) * w - x, (0.5 - v.y * 0.5) * w - y);
      if (dd < bd) { bd = dd; best = i; }
    });
    return best;
  }

  /* ---------- Dibujo ---------- */
  update(state: MoonGlobeState): void {
    this.state = state;
    this.draw();
  }

  private draw(): void {
    const st = this.state;
    if (!st) return;
    const { e, t, sites, foc, colorOf, visibleOf } = st;
    const { cm, moon, Z } = this;
    let done = true;

    if (this.vm < 2) {
      const q = new THREE.Quaternion().setFromUnitVectors(T3(this.vm ? sites[foc].U : e.e), Z);
      if (!this.inited) {
        moon.quaternion.copy(q);
        this.inited = true;
      } else if (moon.quaternion.angleTo(q) > 0.003) {
        moon.quaternion.slerp(q, 0.2);
        done = false;
      } else moon.quaternion.copy(q);
    }
    if (Math.abs(cm.position.z - this.gd) > 0.004) {
      cm.position.z += (this.gd - cm.position.z) * 0.2;
      done = false;
    } else cm.position.z = this.gd;

    const vs = T3(e.s), ve = T3(e.e);
    this.sunL.position.copy(vs).multiplyScalar(5);
    this.sunD.position.copy(vs).multiplyScalar(3);
    this.earD.position.copy(ve).multiplyScalar(2.1);
    this.sunD.visible = this.earD.visible = this.sunLn.visible = this.earLn.visible = this.vm > 0;
    const zf = Math.max(1, cm.position.z / 9);
    this.sunD.scale.setScalar(0.85 * zf);
    this.earD.scale.setScalar(zf);
    this.earD.rotation.y = (t / DAY) * 6.2832;
    this.sunLn.quaternion.setFromUnitVectors(this.XA, vs);
    this.sunLn.scale.x = 3;
    this.earLn.quaternion.setFromUnitVectors(this.XA, ve);
    this.earLn.scale.x = 2.1;

    moon.updateMatrixWorld(true);
    const pairs: [THREE.Object3D, THREE.Line][] = [[this.sunD, this.sunLn], [this.earD, this.earLn]];
    pairs.forEach(([o, l]) => {
      if (o.visible && o.getWorldPosition(this.wv).distanceTo(cm.position) < 1) {
        o.visible = false;
        l.visible = false;
      }
    });

    sites.forEach((s, i) => {
      let m = this.siteMesh.get(i);
      if (!m) {
        m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshBasicMaterial());
        m.position.copy(T3(s.U)).multiplyScalar(1.01);
        m.userData.i = i;
        moon.add(m);
        this.gm.push(m);
        this.siteMesh.set(i, m);
      }
      (m.material as THREE.MeshBasicMaterial).color.set(colorOf(i));
      m.visible = visibleOf(i);
      m.scale.setScalar((i === foc ? 1.8 : 1) * Math.max(1, cm.position.z / 4));
    });

    this.updateSatellites(e, t);
    this.rd.render(this.sc, cm);
    this.updateLabels();

    if (!done && !this.waiting) {
      this.waiting = true;
      this._raf = requestAnimationFrame(() => { this.waiting = false; this.draw(); });
    }
  }

  private resize(): void {
    const w = this.gc.clientWidth || 300;
    this.rd.setSize(w, w, false);
  }

  /* ---------- Interacción ---------- */
  private bindPointer(): void {
    const gc = this.gc;
    let gp: [number, number] | null = null;
    let mv = 0;

    this._down = (e: PointerEvent) => {
      gc.setPointerCapture(e.pointerId);
      gp = [e.clientX, e.clientY];
      mv = 0;
    };
    this._move = (e: PointerEvent) => {
      if (!gp) return;
      const dx = e.clientX - gp[0], dy = e.clientY - gp[1];
      gp = [e.clientX, e.clientY];
      mv += Math.abs(dx) + Math.abs(dy);
      if (mv > 8) {
        this.vm = 2;
        this.moon.quaternion.premultiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(dy * 0.006, dx * 0.006, 0)));
        this.draw();
      }
    };
    this._up = (e: PointerEvent) => {
      if (gp && mv <= 8) {
        const r = gc.getBoundingClientRect();
        const ps = this.pickSat(e.clientX - r.left, e.clientY - r.top, r.width);
        if (ps >= 0) {
          this.onSatClick?.(ps);
          gp = null;
          return;
        }
        const rc = new THREE.Raycaster();
        rc.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, 1 - ((e.clientY - r.top) / r.height) * 2), this.cm);
        const h = rc.intersectObjects([this.moonMesh, ...this.gm])[0];
        if (h && h.object.userData.i != null && h.object.visible) this.onSiteClick?.(h.object.userData.i);
      }
      gp = null;
    };
    this._cancel = () => { gp = null; };
    this._wheel = (e: WheelEvent) => {
      e.preventDefault();
      this.gd = Math.max(1.35, Math.min(14, this.gd * Math.exp(e.deltaY * 0.001)));
      this.draw();
    };

    gc.addEventListener('pointerdown', this._down);
    gc.addEventListener('pointermove', this._move);
    gc.addEventListener('pointerup', this._up);
    gc.addEventListener('pointercancel', this._cancel);
    gc.addEventListener('wheel', this._wheel, { passive: false });
  }

  /* ---------- API pública de controles ---------- */
  /** 'earth' = vista desde la Tierra, 'site' = acercar al sitio en foco. */
  setView(mode: 'earth' | 'site'): void {
    if (mode === 'earth') { this.vm = 0; this.gd = 10; }
    else { this.vm = 1; this.gd = 1.9; }
    this.draw();
  }
  zoomIn(): void { this.gd = Math.max(1.35, this.gd * 0.8); this.draw(); }
  zoomOut(): void { this.gd = Math.min(14, this.gd * 1.25); this.draw(); }
  setSatellitesVisible(on: boolean): void { this.satOn = on; this.draw(); }
  selectSat(i: number): void { this.selS = i; this.gd = Math.max(this.gd, 9); this.draw(); }

  dispose(): void {
    const gc = this.gc;
    if (this._raf !== undefined) cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    gc.removeEventListener('pointerdown', this._down);
    gc.removeEventListener('pointermove', this._move);
    gc.removeEventListener('pointerup', this._up);
    gc.removeEventListener('pointercancel', this._cancel);
    gc.removeEventListener('wheel', this._wheel);
    this.rd.dispose();
  }
}
