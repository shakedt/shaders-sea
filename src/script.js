import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import fragment from './shaders/water/fragment.glsl'
import vertex from './shaders/water/vertex.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

const debugObject = {
    depthColor: '#186691',
    surfaceColor: '#5985a1', // acbdc8
    fogColor: '#00FF00'
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)


// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    fog: true,
    uniforms:
    {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.5 }, 

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 5 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },

        fogColor: { value: new THREE.Color(debugObject.fogColor) },
        fogNear: { value: 0 },
        fogFar:  { value: 100 },
    }
})

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').name('uBigWavesElevation').min(0).max(1).step(0.001)
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').name('uBigWavesFrequencyX').min(0).max(10).step(0.001)
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').name('uBigWavesFrequencyY').min(0).max(10).step(0.001)
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').name('uBigWaveSpeed').min(0).max(4).step(0.001)
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').name('uSmallWavesElevation').min(0).max(1).step(0.001)
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').name('uSmallWavesFrequencyX').min(0).max(30).step(0.001)
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').name('uSmallWaveSpeed').min(0).max(4).step(0.001)
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').name('uSmallWaveIterations').min(0).max(30).step(1)
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').name('uBigWaveSpeed').min(0).max(4).step(0.001)
gui.add(waterMaterial.uniforms.fogNear, 'value').name('fogNear').min(0).max(100).step(0.001)
gui.add(waterMaterial.uniforms.fogFar, 'value').name('fogFar').min(0).max(100).step(0.001)
console.log('checking build faileLL;;');
gui.addColor(waterMaterial.uniforms.fogColor, 'value').name('fogColor').onChange(() =>
{
    waterMaterial.uniforms.fogColor.value.set(debugObject.fogColor)
})
gui.addColor(debugObject, 'depthColor').onChange(() =>
{
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').onChange(() =>
{
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})
gui.add(waterMaterial.uniforms.uColorOffset, 'value').name('uColorOffset').min(0).max(1).step(0.001)
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').name('uColorMultiplier').min(0).max(10).step(0.001)
// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
// For linear fog:
var fog = new THREE.Fog(debugObject.fogColor, waterMaterial.fogNear, waterMaterial.fogFar); // Color, near distance, far distance
scene.fog = fog;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime    
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()