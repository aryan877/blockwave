import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function LoginPrompt({ signIn }: { signIn: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sizes, setSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 'rgba(159, 122, 234)',
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 10;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 10;

    const handleResize = () => {
      setSizes({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
      controls.update();
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sizes]);

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <canvas ref={canvasRef} />
      <Flex
        justifyContent="center"
        alignItems="center"
        bg="transparent"
        position="absolute"
        top="50%"
        left="50%"
        maxW="xl"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Box
          p={8}
          borderRadius="lg"
          mx={8}
          textAlign="center"
          style={{
            backgroundColor: 'rgba(159, 122, 234, 0.25)',
            backdropFilter: 'blur(10px) saturate(180%)',
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            // height={200}
            mx="auto"
            mb={8}
          />

          <Button
            onClick={signIn}
            fontSize="lg"
            variant="solid"
            colorScheme="green"
            fontWeight="bold"
            mb={2}
          >
            Sign In With Ethereum
          </Button>
          <Text mt={2} fontSize="lg">
            Ride the Blockwave and connect your decentralized self to the world!
          </Text>
          <Text mt={2} fontSize="lg" color="gray.500">
            To use this app, please ensure that you are connected to either
            Mantle Wadsley, Polygon Mumbai or Shardeum Sphinx blockchain
            networks.
          </Text>
        </Box>
      </Flex>{' '}
    </Box>
  );
}
export default LoginPrompt;
