import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function createScene(canvas,reduced) {
 let renderer;
 try {renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});} catch {canvas.style.display='none';return;}
 canvas.parentElement.classList.add('webgl-ready');
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,1,.1,50);camera.position.z=9;
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();
 const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0xe9654e,3));
 const light=new THREE.DirectionalLight(0xffffff,5);light.position.set(-3,5,4);scene.add(light);
 const group=new THREE.Group();scene.add(group);
 const material=new THREE.MeshPhysicalMaterial({color:0xf8e8d6,metalness:.65,roughness:.18,clearcoat:1,clearcoatRoughness:.12});
 const sculpture=new THREE.Mesh(new THREE.TorusKnotGeometry(1.38,.43,180,24,2,3),material);group.add(sculpture);
 sculpture.rotation.set(.3,.2,.4);
 const satellites=[];
 for(let i=0;i<5;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.12+i*.025,24,16),new THREE.MeshPhysicalMaterial({color:i%2?0x55408b:0xfce68b,metalness:.35,roughness:.23}));const angle=i/5*Math.PI*2;mesh.position.set(Math.cos(angle)*2.5,Math.sin(angle)*2,.5);mesh.userData.baseY=mesh.position.y;group.add(mesh);satellites.push(mesh);}
 const motion={x:0,y:0,z:0,scale:1,turn:0};const pointer={x:0,y:0};
 const resize=()=>{const r=canvas.parentElement.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();};
 const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);resize();
 if(!reduced){gsap.from(motion,{scale:0,duration:1.6,ease:'elastic.out(1,.8)',delay:.15});gsap.to(motion,{turn:Math.PI*1.4,x:1.7,y:-.7,scale:.65,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.3}});window.addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5)*.35;pointer.y=(e.clientY/innerHeight-.5)*.35;},{passive:true});}
 let visible=true;new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(canvas);
 let frame;const render=(time)=>{frame=requestAnimationFrame(render);if(!visible||document.hidden)return;const t=time*.001;group.position.set(motion.x,motion.y,0);group.scale.setScalar(motion.scale);group.rotation.y=motion.turn+pointer.x;group.rotation.x=pointer.y;sculpture.rotation.y=reduced ? .2 : t*.18;sculpture.rotation.z=reduced ? .4 : .4+Math.sin(t*.5)*.12;satellites.forEach((m,i)=>{if(!reduced)m.position.y=m.userData.baseY+Math.sin(t+i)*.12;});renderer.render(scene,camera);};
 frame=requestAnimationFrame(render);
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();environment.dispose();},{once:true});
}
