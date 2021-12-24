import * as THREE from "./node_modules/three/build/three.module.js"
var fragment = require("./shader/fragment.glsl")
var vertex = require("./shader/vertex.glsl")
// import * as gsap from "./node_modules/gsap/gsap-core"
import * as dat from "dat.gui"

import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from './node_modules/three/examples/jsm/postprocessing/ShaderPass.js'
import { CustomPass } from "./CustomPass.js"

import { RGBShiftShader } from './node_modules/three/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from './node_modules/three/examples/jsm/shaders/DotScreenShader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'


import t1 from './assets/v.jpeg'
import t2 from './assets/r.jpg'
import t3 from './assets/t.jpg'
//import t4 from './assets/asset4.jpg'
//import t5 from './assets/asset5.jpg'
//import t6 from './assets/asset6.jpg'
 
const Z_START = 2
export default class Workspace
{
    constructor(container)
    {
        this.container = container
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.time = 0
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0xffffff, 1)
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )

        this.container.appendChild( this.renderer.domElement )
        this.urls = [t2, t3]//, t4, t5, t6]
        this.textures = this.urls.map(url => new THREE.TextureLoader().load(url) )
        console.log(this.textures)
        this.camera.position.z = Z_START
        this.initPost()
        this.addObjects()
        this.renderer.render(this.scene, this.camera)
        this.render()
        this.settings()
        this.resize()
        this.setupResize()
    }
    initPost()
    {
        this.composer = new EffectComposer( this.renderer )
        this.composer.addPass( new RenderPass( this.scene, this.camera ) )
        
        this.effect1 = new ShaderPass( CustomPass )
        this.composer.addPass( this.effect1 )
        
        /*
        const effect2 = new ShaderPass( RGBShiftShader )
        effect2.uniforms[ 'amount' ].value = .0015
        this.composer.addPass( effect2 )*/
    }
    render() {
        this.time += .01
        this.material.uniforms.time.value = this.time
        this.effect1.uniforms[ 'time' ].value = this.time
        this.effect1.uniforms[ 'progress' ].value = this.settings.progress
        this.effect1.uniforms[ 'scale' ].value = this.settings.scale
        this.camera.position.z = this.settings.position
        requestAnimationFrame(this.render.bind(this))
        //this.renderer.render(this.scene, this.camera)
        this.composer.render()

        this.meshes.forEach((m,i)=> {
            m.position.y = -this.settings.progress
            m.rotation.z = this.settings.progress*Math.PI/2
        })
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.render.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height

        this.camera.updateProjectionMatrix()
    }

    settings() {
        this.settings = {
            progress: 0,
            scale: 1,
            position: Z_START -0.6
        }
        this.gui = new dat.GUI()
        this.gui.add(this.settings, "progress", 0, 1, .01)
        this.gui.add(this.settings, "scale", .5, 15, .1)
        this.gui.add(this.settings, "position", 0, 15, .1)
    }

    addObjects() {
        
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                uTexture: { value: this.textures[0] },
                resolution: { value: new THREE.Vector4() }
            },
            vertexShader: vertex,
            fragmentShader: fragment
        })

        this.geometry = new THREE.PlaneGeometry(3/2, 1.7/2, 1, 1)

        this.meshes = []

        this.textures.forEach( (texture, index) => {
            let m = this.material.clone()
            m.uniforms.uTexture.value = texture
            let obj = new THREE.Mesh(this.geometry, m)
            this.scene.add(obj)
            this.meshes.push(obj)
            //obj.position.y = Math.round((7 - index) / 3) * .8 - Math.round((index - 1) / 3) - .8
            obj.position.x = index - 1  //(index % 3) * 3 - 3
            obj.position.x =  (index % 2) * 2 - 0.9
            // obj.rotation.z = Math.PI/2
        })
    }
}
new Workspace(document.getElementById('container'))