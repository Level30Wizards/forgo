/* global THREE */
import { tree, setTree } from './tree'
import { terrain } from './terrain'
import { VRDisplay } from './initialize'

const scene = new THREE.Scene(),
	playerHeight = 1.4,

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
	camBox = new THREE.Group(),
	fadeBoxGeometry = new THREE.BoxGeometry( 1, 1, 1 ),
	fadeBoxMaterial = new THREE.MeshBasicMaterial( {
		color: 0x000000,
		transparent: true,
		opacity: 1,
		wireframe: false,
		side: THREE.BackSide
	} ),
	fadeBox = new THREE.Mesh( fadeBoxGeometry, fadeBoxMaterial ),
	moonPosition = {
		x: 500,
		y: 600,
		z: -600
	}

camera.position.y = playerHeight
camera.position.z = + 2
camBox.name = 'camBox'

fadeBox.name = 'fadeBox'
console.log( fadeBox )

camera.add( fadeBox )
camBox.add( camera )
scene.add( camBox )

const renderer = new THREE.WebGLRenderer( { antialias: true } )

renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setPixelRatio( window.devicePixelRatio )

renderer.shadowMap.enabled = true

document.body.appendChild( renderer.domElement )

// window.addEventListener( 'click', clickOnElement )

const controls = new THREE.OrbitControls( camera, renderer.domElement )
controls.enableZoom = true
// controls.enabled = false

const raycaster = 	new THREE.Raycaster(),
	mouse = 		new THREE.Vector2()

window.addEventListener( 'mousemove', onMouseMove, false )

function onMouseMove( event ) {

	mouse.x = ( ( event.clientX / window.innerWidth ) * 2 ) - 1
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

}

const tempTrees = []
function clickOnElement() {

	raycaster.setFromCamera( mouse, camera )

	const intersects = raycaster.intersectObjects( [ terrain ], true )

	if ( intersects.length !== 0 ) {

		intersects[ 0 ].point.y -= ( 80 - 1.61 )
		intersects[ 0 ].point.z -= 106

		setTree( tree, intersects[ 0 ].point )
		tempTrees.push( intersects[ 0 ].point )
		console.log( JSON.stringify( tempTrees ) )

	}

}

function resize() {

	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize( window.innerWidth, window.innerHeight )
	renderer.setPixelRatio( window.devicePixelRatio )

}

( function() {

	const throttle = function( type, name, obj ) {

		obj = obj || window
		let running = false

		const func = function() {

			if ( running ) return
			running = true
			requestAnimationFrame( () => {

				obj.dispatchEvent( new CustomEvent( name ) )
				running = false

			} )
		}

		obj.addEventListener( type, func )

	}

	/* init - you can init any event */
	throttle( 'resize', 'optimizedResize' )

} )()

window.addEventListener( 'optimizedResize', resize )

window.addEventListener( 'vrdisplaypresentchange', () => {

	if( VRDisplay.isPresenting ) {

		const fadeBoxMaterial = fadeBox.material

		TweenMax.to( fadeBoxMaterial, 2.5, { opacity: 0, delay: 2, ease:Power2.easeInOut } )

	}

} )

export {
	scene,
	camera,
	camBox,
	renderer,
	playerHeight,
	raycaster,
	mouse,
	controls,
	moonPosition,
	fadeBox
}