import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Center, Environment } from '@react-three/drei';
import * as topojson from 'topojson-client';

// --- CONFIGURATION ---
const MAP_DATA_URL = "/maps/tamilnadu.json";
const CENTER_LAT = 10.8;
const CENTER_LNG = 78.5;
const SCALE = 4.0;

// --- COLORS CONFIG ---
const DISTRICT_CONFIG = {
    "Chennai": { color: "#A52A2A" }, "Thiruvallur": { color: "#0818A8" }, "Chengalpattu": { color: "#023020" },
    "Kancheepuram": { color: "#834333" }, "Ranipet": { color: "#D2042D" }, "Vellore": { color: "#EF476F" },
    "Tirupathur": { color: "#630330" }, "Krishnagiri": { color: "#C04000" }, "Dharmapuri": { color: "#301934" },
    "Tiruvannamalai": { color: "#073B4C" }, "Viluppuram": { color: "#EC5800" }, "Kallakurichi": { color: "#5A189A" },
    "Salem": { color: "#454B1B" }, "Erode": { color: "#023020" }, "Nilgiris": { color: "#9F2B68" },
    "Coimbatore": { color: "#CC5500" }, "Tiruppur": { color: "#355E3B" }, "Namakkal": { color: "#8338EC" },
    "Karur": { color: "#8B0000" }, "Perambalur": { color: "#FB5607" }, "Ariyalur": { color: "#FF006E" },
    "Cuddalore": { color: "#38B000" }, "Mayiladuthurai": { color: "#CCFF33" }, "Nagapattinam": { color: "#0047AB" },
    "Thiruvarur": { color: "#008000" }, "Thanjavur": { color: "#301934" }, "Pudukkottai": { color: "#008000" },
    "Tiruchirappalli": { color: "#0047AB" }, "Dindigul": { color: "#CD7F32" }, "Theni": { color: "#00008B" },
    "Madurai": { color: "#880808" }, "Sivaganga": { color: "#BC4749" }, "Virudhunagar": { color: "#023020" },
    "Ramanathapuram": { color: "#811331" }, "Tenkasi": { color: "#3D405B" }, "Thoothukudi": { color: "#CC5500" },
    "Tirunelveli": { color: "#0818A8" }, "Kanyakumari": { color: "#880808" }
};

function getDistrictInfo(rawName) {
    if (!rawName) return { color: "#000000", name: "Unknown" };
    const normalized = rawName.toLowerCase().replace(/district|dt|\s|_/g, "");
    if (normalized.includes("kanni")) return { ...DISTRICT_CONFIG["Kanniyakumari"], name: "Kanniyakumari" };
    if (normalized.includes("kanch")) return { ...DISTRICT_CONFIG["Kancheepuram"], name: "Kancheepuram" };
    if (normalized.includes("sivaga")) return { ...DISTRICT_CONFIG["Sivaganga"], name: "Sivaganga" };
    if (normalized.includes("thoot")) return { ...DISTRICT_CONFIG["Thoothukudi"], name: "Thoothukudi" };
    if (normalized.includes("nilgir")) return { ...DISTRICT_CONFIG["Nilgiris"], name: "Nilgiris" };
    if (normalized.includes("mayil")) return { ...DISTRICT_CONFIG["Mayiladuthurai"], name: "Mayiladuthurai" };
    const key = Object.keys(DISTRICT_CONFIG).find(k => {
        const configKey = k.toLowerCase().replace(/district|dt|\s/g, "");
        return normalized.includes(configKey) || configKey.includes(normalized);
    });
    return key ? { ...DISTRICT_CONFIG[key], name: key } : { color: "#000000", name: rawName };
}

// --- UTILS ---
function project(lng, lat) { return [(lng - CENTER_LNG) * SCALE, (lat - CENTER_LAT) * SCALE]; }

function calculatePolygonCentroid(points) {
    let x = 0, y = 0, area = 0;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const p1 = points[i]; const p2 = points[j];
        const f = p1[0] * p2[1] - p2[0] * p1[1];
        x += (p1[0] + p2[0]) * f; y += (p1[1] + p2[1]) * f; area += f * 3;
    }
    return Math.abs(area) < 1e-9 ? points[0] : [x / area, y / area];
}

// --- MESH ---
function DistrictMesh({ feature, onSelect, isSelected }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const centerRef = useRef(new THREE.Vector3());
    const rawName = feature.properties.district || feature.properties.dtname;
    const { color, name } = getDistrictInfo(rawName);

    const shape = useMemo(() => {
        const s = new THREE.Shape();
        let projectedPoints = [];
        const processPolygon = (coords) => {
            coords.forEach((p, i) => {
                const [x, y] = project(p[0], p[1]);
                projectedPoints.push([x, y]);
                if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
            });
        };
        if (feature.geometry.type === 'Polygon') processPolygon(feature.geometry.coordinates[0]);
        else if (feature.geometry.type === 'MultiPolygon') {
             let maxArea = 0; let largestPoly = feature.geometry.coordinates[0];
             feature.geometry.coordinates.forEach(poly => { if (poly[0].length > maxArea) { maxArea = poly[0].length; largestPoly = poly; } });
             processPolygon(largestPoly[0]);
        }
        if (projectedPoints.length > 0) {
            const [cx, cy] = calculatePolygonCentroid(projectedPoints);
            centerRef.current.set(cx, cy, 0);
        }
        return s;
    }, [feature]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const targetZ = isSelected ? 0.4 : (hovered ? 0.15 : 0);
            meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 10);
        }
    });

    return (
        <group>
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onSelect(name); }}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={() => setHovered(false)}
            >
                <extrudeGeometry args={[shape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }]} />
                <meshStandardMaterial color={isSelected ? "#FFD700" : (hovered ? "#FFFFFF" : color)} emissive={isSelected ? "#FF8C00" : "#000000"} emissiveIntensity={isSelected ? 0.5 : 0} roughness={0.6} metalness={0.2} />
            </mesh>
            <Html position={[centerRef.current.x, centerRef.current.y, 0.2]} center distanceFactor={10} className="pointer-events-none" style={{ opacity: (hovered || isSelected) ? 1 : 1 }}>
                <div className={`px-2 py-1 rounded text-center font-bold text-[10px] font-body uppercase tracking-wider ${isSelected ? 'bg-yellow-500 text-black shadow-lg scale-125 border border-white' : 'text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0)]'} transition-all duration-200 z-10`}>
                    {name}
                </div>
            </Html>
        </group>
    );
}

// --- SCENE ---
function MapScene({ onDistrictSelect, selectedDistrict }) {
    const [geoData, setGeoData] = useState(null);
    useEffect(() => {
        fetch(MAP_DATA_URL).then(res => res.json()).then(topology => {
            const k = Object.keys(topology.objects)[0];
            setGeoData(topojson.feature(topology, topology.objects[k]).features);
        });
    }, []);

    if (!geoData) return <Html center><div className="text-indigo-600 font-heading tracking-wider uppercase text-center font-bold animate-pulse">Loading 3D Map...</div></Html>;

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            <Center disablex disabley disablez>
                {geoData.map((feature, i) => {
                   const rawName = feature.properties.district || feature.properties.dtname;
                   const { name } = getDistrictInfo(rawName);
                   return <DistrictMesh key={i} feature={feature} onSelect={onDistrictSelect} isSelected={selectedDistrict === name} />;
                })}
            </Center>
        </group>
    );
}

// --- EXPORT ---
export default function DistrictMapPicker({ currentDistrict, onConfirm, onClose }) {
    const [selected, setSelected] = useState(currentDistrict || "");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
            <div className="relative w-full h-[90dvh] max-w-5xl bg-accet/40 border border-accet/10 overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/10">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-shade z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-linear-to-b from-accet/60 to-accet/30 rounded-full"></div>
                        <div><h3 className="text-white font-heading font-bold text-[15px] md:text-lg tracking-wide">SELECT DISTRICT</h3><p className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-widest">Interactive 3D Map</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 flex items-center justify-center transition-all">✕</button>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 relative bg-black ">
                    <Canvas camera={{ position: [0, 50, 0], fov: 45 }} dpr={[1, 2]}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 20, 10]} intensity={1.2}  />
                        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4fd1c5" />
                        
                        <MapScene onDistrictSelect={setSelected} selectedDistrict={selected} />
                        
                        {/* --- UPDATED CONTROLS HERE --- */}
                        <OrbitControls 
                            enableRotate={false} 
                            enableZoom={true} 
                            enablePan={true}
                            minDistance={5}
                            maxDistance={200}
                            screenSpacePanning={true}
                            
                            // ITHU THAAN MUKKIYAM (Button mapping)
                            mouseButtons={{
                                LEFT: THREE.MOUSE.PAN,     // Left Click ippo Pan pannum
                                MIDDLE: THREE.MOUSE.DOLLY, // Scroll wheel zoom pannum
                                RIGHT: THREE.MOUSE.ROTATE  // Right click rotate (blocked by enableRotate=false)
                            }}
                            touches={{
                                ONE: THREE.TOUCH.PAN,      // Mobile la one finger pan pannum
                                TWO: THREE.TOUCH.DOLLY_PAN // Two finger zoom
                            }}
                        />

                        <Environment preset="city" />
                    </Canvas>
                    
                    {/* Instructions */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 pointer-events-none min-w-50">
                        <p className="text-[8px] md:text-[9px] text-indigo-300/80 text-center font-mono tracking-wider">DRAG TO MOVE • CLICK TO SELECT</p>
                    </div>

                    {/* Selected Info */}
                    {selected && (
                        <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6 bg-shade backdrop-blur-xl border border-white/20 rounded p-3 md:p-4 shadow-2xl md:min-w-50 animate-in slide-in-from-bottom-5 z-999">
                            <span className="text-[8px] md:text-[9px] text-indigo-600 font-heading font-bold uppercase tracking-widest block mb-1 z-999">Selected Region</span>
                            <h2 className="text-[15px] md:text-2xl font-black uppercase text-white leading-none z-999">{selected}</h2>
                            <div className="h-0.5 md:h-1 w-12 bg-yellow-500 rounded-full mt-2 md:mt-2 z-999"></div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-shade z-10 flex justify-between md:justify-end items-center gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 md:py-3 text-[10px] md:text-xs font-bold font-heading text-white/50 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider">Cancel</button>
                    <button onClick={() => { if(selected) onConfirm(selected); }} disabled={!selected} className={`px-3 md:px-6 py-2.5 md:py-3 font-bold text-[10px] md:text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 ${selected ? "bg-linear-to-r from-accet/70 to-accet/30 font-heading text-white hover:shadow-indigo-800/30 hover:scale-[1.02]" : "bg-white/10 text-white/40 cursor-not-allowed"}`}>
                        <span>Confirm Selection</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}