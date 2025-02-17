import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import {
	EffectComposer,
	DepthOfField,
	Bloom,
	ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import {
	CubeCamera,
	Environment,
	OrbitControls,
	PerspectiveCamera,
	Clone,
	SpriteAnimator,
} from "@react-three/drei";
import "./style.css";
import { Boxes } from "./Boxes";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { FloatingGrid } from "./FloatingGrid";
import { Rings } from "./Rings";
import { Model } from "./Robot";
import { Mech } from "./Mech";
import { Timer } from "./Timer";
function CarShow({ setIsTimerRunning }) {
	return (
		<>
			<OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />

			<PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]} />

			<color args={[0, 0, 0]} attach="background" />

			<CubeCamera resolution={256} frames={Infinity}>
				{(texture) => (
					<>
						<Environment map={texture} />
					</>
				)}
			</CubeCamera>

			<spotLight
				color={[1, 0.25, 0.7]}
				intensity={1.5}
				angle={0.6}
				penumbra={0.5}
				position={[5, 5, 0]}
				castShadow
				shadow-bias={-0.0001}
			/>
			<spotLight
				color={[0.14, 0.5, 1]}
				intensity={2}
				angle={0.6}
				penumbra={0.5}
				position={[-5, 5, 0]}
				castShadow
				shadow-bias={-0.0001}
			/>

			<Ground />
			<FloatingGrid />
			{/* <Boxes /> */}
			<Rings />
			<Suspense fallback={null}>
				<Mech setIsTimerRunning={setIsTimerRunning} />

				{/* <Model
					url="./doggo.glb"
					position={[0, 0, 0]}
					color={[1, 0, 0]}
					speed={3.5}
					animation="RobotDog@Walk"
				/>

				
				<Model
					url="./doggo2.glb"
					position={[0.75, 0, 0]}
					color={[0, 1, 0]}
					speed={1.5}
					animation="RobotDog@Walk"
				/>

			
				<Model
					url="./doggo3.glb"
					position={[-0.75, 0, 0]}
					color={[0, 0, 1]}
					speed={2}
					animation="RobotDog@Walk"
				/>
				<Model
					url="./doggo4.glb"
					position={[1.5, 0, 0]}
					color={[0.5, 0.5, 1]}
					speed={1}
					animation="RobotDog@Walk"
				/> */}
			</Suspense>

			<EffectComposer>
				{/* <DepthOfField focusDistance={0.0035} focalLength={0.01} bokehScale={3} height={480} /> */}
				<Bloom
					blendFunction={BlendFunction.ADD}
					intensity={1.3} // The bloom intensity.
					width={300} // render width
					height={300} // render height
					kernelSize={5} // blur kernel size
					luminanceThreshold={0.15} // luminance threshold. Raise this value to mask out darker elements in the scene.
					luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
				/>
				{/* <ChromaticAberration
					blendFunction={BlendFunction.NORMAL} // blend mode
					offset={[0.0005, 0.0012]} // color offset
				/> */}
			</EffectComposer>
		</>
	);
}

function App() {
	const [isTimerRunning, setIsTimerRunning] = useState(true);
	const videoRef = useRef(null);
	useEffect(() => {
		console.log("isTimerRunning state:", isTimerRunning); // Log current state

		const videoElement = videoRef.current;

		if (!isTimerRunning && videoElement) {
			console.log("Timer stopped, trying to play video");
			videoElement
				.play()
				.then(() => {
					console.log("Video started playing");
				})
				.catch((error) => {
					console.error("Failed to play video", error);
				});
		}
	}, [isTimerRunning]);

	return (
		<Suspense fallback={null}>
			<div>
				<Timer isTimerRunning={isTimerRunning} />
			</div>
			<Canvas shadows>
				<CarShow setIsTimerRunning={setIsTimerRunning} />
			</Canvas>
			<video
				ref={videoRef}
				autoPlay={false} // Set to false initially
				muted={true} // Recommended to avoid browser restrictions
				loop={false} // Loop video
				style={{
					position: "absolute",
					zIndex: 1000,
					width: "100%",
					height: "100%",
					top: 0,
					left: 0,
					mixBlendMode: "screen",
					pointerEvents: "none",
					objectFit: "fill",
				}}
			>
				<source src="/smoke.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</Suspense>
	);
}

export default App;
