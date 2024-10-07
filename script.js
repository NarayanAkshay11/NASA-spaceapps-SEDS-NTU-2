// Global variables for Three.js
let scene, camera, renderer, controls;

// Fetch and parse the Markdown file
async function fetchExoplanetData() {
    try {
        const response = await fetch('exoplanets.md');
        const data = await response.text();
        return parseMarkdown(data);
    } catch (error) {
        console.error('Error fetching exoplanet data:', error);
        return [];
    }
}

// Parse Markdown table into JavaScript objects
function parseMarkdown(markdown) {
    const lines = markdown.split('\n');
    const exoplanets = [];

    // Find the start of the table (skip headers)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col !== '');
            if (columns.length === 5) { // Ensure correct number of columns
                const [planetName, ra, dec, distance, gMagnitude] = columns;
                exoplanets.push({
                    name: planetName,
                    ra: parseFloat(ra),
                    dec: parseFloat(dec),
                    distance: parseFloat(distance),
                    gMagnitude: parseFloat(gMagnitude)
                });
            }
        }
    }

    return exoplanets;
}

// Populate the sidebar with exoplanet names
function populateSidebar(exoplanets) {
    const list = document.getElementById('exoplanet-list');
    exoplanets.forEach(planet => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = planet.name;
        link.addEventListener('click', () => {
            document.getElementById('selected-exoplanet').textContent = planet.name;
            renderStarMap(planet);
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
}

// Initialize Three.js scene
function initThreeJS() {
    const starMap = document.getElementById('star-map');

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        starMap.clientWidth / starMap.clientHeight, 
        0.1, 
        10000
    );
    camera.position.z = 100;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(starMap.clientWidth, starMap.clientHeight);
    starMap.appendChild(renderer.domElement);

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth camera movements
    controls.dampingFactor = 0.05;

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = starMap.clientWidth;
        const height = starMap.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Render star map based on exoplanet data
function renderStarMap(planet) {
    // Clear existing stars
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Re-add orbit controls
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Fetch stars around the exoplanet
    // For demonstration, we'll generate random stars
    // In a real scenario, fetch actual star data based on RA and Dec

    const starCount = 1000; // Number of stars to display
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < starCount; i++) {
        // Randomly distribute stars in a spherical shell around the exoplanet
        const radius = planet.distance * 10; // Scale distance for visualization
        const theta = THREE.MathUtils.degToRad(Math.random() * 360);
        const phi = THREE.MathUtils.degToRad(Math.random() * 180);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(x, y, z);

        // Assign color based on G Magnitude (brighter stars are whiter)
        const magnitudeFactor = THREE.MathUtils.clamp(1.0 - (planet.gMagnitude / 20.0), 0.2, 1.0);
        colors.push(magnitudeFactor, magnitudeFactor, magnitudeFactor);
        
        // Size based on G Magnitude (brighter stars are larger)
        sizes.push(1.0 * magnitudeFactor);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Update camera position
    camera.position.set(0, 0, radius * 1.5);
    controls.update();
}

// Initialize the application
async function init() {
    const exoplanets = await fetchExoplanetData();
    populateSidebar(exoplanets);
    initThreeJS();
}

// Handle sidebar toggle for mobile
document.getElementById('toggle-button').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Start the application
init();
