import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Mech({ setIsTimerRunning, ...props }) {
	const group = useRef();
	const [currentStep, setCurrentStep] = useState(0);

	const animationSequence = [
		{ name: "WalkRun", speed: 1, timeout: 1000 },
		{ name: "Flip", speed: 1, timeout: 2000 },
		{ name: "Running", speed: 1, timeout: 5000 },
		{ name: "Flip", speed: 1, timeout: 2000 },
		{ name: "Running", speed: 2, timeout: 5000 },
		{ name: "Fall", speed: 1, timeout: 500 },
	];

	const { nodes, materials, animations } = useGLTF("/RunningMech8.glb");
	const { actions } = useAnimations(animations, group);

	useEffect(() => {
		// Change the texture map of the material
		if (materials.Default_Pbr instanceof THREE.MeshPhysicalMaterial) {
			const newMaterial = new THREE.MeshStandardMaterial();
			newMaterial.copy(materials.Default_Pbr); // Copy existing material properties
			// newMaterial.map = newTexture; // Set new texture
			materials.Default_Pbr = newMaterial;
		}

		const currentAnimation = animationSequence[currentStep];

		if (actions[currentAnimation.name]) {
			actions[currentAnimation.name].timeScale = currentAnimation.speed;
			actions[currentAnimation.name].reset().fadeIn(0.5).play();

			if (currentAnimation.name === "Fall") {
				actions[currentAnimation.name].setLoop(THREE.LoopOnce, 1);
				setIsTimerRunning(false);
			} else {
				actions[currentAnimation.name].setLoop(THREE.LoopRepeat, Infinity); // Reset to default
			}
		}

		const timeout = setTimeout(() => {
			if (currentStep < animationSequence.length - 1) {
				setCurrentStep(currentStep + 1);
			}
		}, currentAnimation.timeout);

		return () => {
			clearTimeout(timeout);
			if (actions[currentAnimation.name]) {
				actions[currentAnimation.name].fadeOut(0.5);
			}
		};
	}, [currentStep, actions, materials]);

	return (
		<group ref={group} {...props} dispose={null}>
			<group name="Scene">
				<group name="Armature" scale={0.00003}>
					<skinnedMesh
						name="Scene_1"
						geometry={nodes.Scene_1.geometry}
						material={materials.Default_Pbr}
						skeleton={nodes.Scene_1.skeleton}
					/>
					<primitive object={nodes.RL_BoneRoot} />
				</group>
			</group>
		</group>
	);
}

useGLTF.preload("/RunningMech8.glb");
