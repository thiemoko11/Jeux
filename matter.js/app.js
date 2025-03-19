const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Events } = Matter;

// Créer un moteur et un monde
const engine = Engine.create();
const world = engine.world;

// Créer un rendu
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,  // Pas de wireframe
    background: '#2c3e50', // Fond sombre mais apaisant
  }
});

// Créer un sol sombre
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 60, {
  isStatic: true,
  render: {
    fillStyle: '#34495e', // Gris foncé pour le sol
    strokeStyle: '#2c3e50',
    lineWidth: 2
  }
});

World.add(world, ground);

// Créer une fonction pour ajouter des cubes tombants avec des couleurs atténuées
const createCube = (x, y) => {
  const cube = Bodies.rectangle(x, y, 60, 60, {
    restitution: 0.8, // Restitution pour les rebonds
    render: {
      fillStyle: getMutedColor(), // Couleur atténuée pour un effet plus doux
      strokeStyle: '#7f8c8d',
      lineWidth: 4,
    }
  });
  World.add(world, cube);

  // L'événement pour changer la couleur une seule fois
  let colorChanged = false;  // Indicateur pour vérifier si la couleur a changé

  Events.on(engine, 'beforeUpdate', () => {
    if (!colorChanged && cube.position.y > window.innerHeight / 2) { // Une seule fois quand le cube atteint le bas
      cube.render.fillStyle = getMutedColor(); // Change la couleur une seule fois
      colorChanged = true; // Marque que la couleur a été changée
    }
  });
};

// Fonction pour obtenir une couleur plus douce et atténuée en HSL
const getMutedColor = () => {
  return `hsl(${Math.random() * 360}, 50%, 60%)`; // Couleur moins saturée et plus pâle
};

// Créer un effet d'étoiles en arrière-plan (fond animé)
const createStars = () => {
  const numStars = 100;
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const star = Bodies.circle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 2, {
      isStatic: true,
      render: {
        fillStyle: 'rgba(255, 255, 255, 0.5)', // Étoiles avec faible opacité pour ne pas être trop lumineuses
        opacity: 0.6
      }
    });
    stars.push(star);
  }
  World.add(world, stars);
};

// Créer un ciel dynamique avec des étoiles
createStars();

// Gérer le clic pour ajouter des cubes
document.body.addEventListener('click', (event) => {
  createCube(event.clientX, event.clientY);  // Ajouter un cube avec une couleur atténuée
});

// Ajouter un "MouseConstraint" pour pouvoir interagir avec les objets
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.1,
    render: { visible: false }
  }
});
World.add(world, mouseConstraint);

// Démarrer le moteur et le rendu
Engine.run(engine);
Render.run(render);

