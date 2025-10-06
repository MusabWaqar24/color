const Quiz = require('../models/Quiz');
const CSSExam = require('../models/CSSExam');

const sampleQuizzes = [
  // Beginner Level Quizzes
  {
    question: "What is the HEX code for pure red?",
    type: "multiple-choice",
    level: "Beginner",
    category: "colors",
    options: [
      { text: "#FF0000", value: "#FF0000", isCorrect: true },
      { text: "#00FF00", value: "#00FF00", isCorrect: false },
      { text: "#0000FF", value: "#0000FF", isCorrect: false },
      { text: "#FFFF00", value: "#FFFF00", isCorrect: false }
    ],
    correctAnswer: "#FF0000",
    explanation: "Pure red in HEX format is #FF0000, where FF represents the maximum red value.",
    points: 10,
    timeLimit: 30,
    difficulty: "Easy",
    tags: ["colors", "hex", "basics"]
  },
  {
    question: "What color does this HEX code represent: #00FF00?",
    type: "multiple-choice",
    level: "Beginner",
    category: "colors",
    options: [
      { text: "Red", value: "Red", isCorrect: false },
      { text: "Green", value: "Green", isCorrect: true },
      { text: "Blue", value: "Blue", isCorrect: false },
      { text: "Yellow", value: "Yellow", isCorrect: false }
    ],
    correctAnswer: "Green",
    explanation: "#00FF00 represents pure green, where the green channel is at maximum (FF) and red and blue are at minimum (00).",
    points: 10,
    timeLimit: 30,
    difficulty: "Easy",
    tags: ["colors", "hex", "basics"]
  },
  {
    question: "Convert RGB(255, 0, 0) to HEX format",
    type: "hex-to-rgb",
    level: "Beginner",
    category: "colors",
    colorData: {
      rgb: { r: 255, g: 0, b: 0 },
      hex: "#FF0000",
      colorName: "Red"
    },
    correctAnswer: "#FF0000",
    explanation: "RGB(255, 0, 0) converts to #FF0000 in HEX format.",
    points: 15,
    timeLimit: 45,
    difficulty: "Easy",
    tags: ["colors", "rgb", "hex", "conversion"]
  },
  {
    question: "What is the CSS property used to change text color?",
    type: "multiple-choice",
    level: "Beginner",
    category: "css-basics",
    options: [
      { text: "text-color", value: "text-color", isCorrect: false },
      { text: "color", value: "color", isCorrect: true },
      { text: "font-color", value: "font-color", isCorrect: false },
      { text: "text-style", value: "text-style", isCorrect: false }
    ],
    correctAnswer: "color",
    explanation: "The 'color' property is used to set the color of text in CSS.",
    points: 10,
    timeLimit: 30,
    difficulty: "Easy",
    tags: ["css", "properties", "text"]
  },

  // Intermediate Level Quizzes
  {
    question: "What CSS property is used to create flexible layouts?",
    type: "multiple-choice",
    level: "Intermediate",
    category: "layout",
    options: [
      { text: "display: grid", value: "display: grid", isCorrect: false },
      { text: "display: flex", value: "display: flex", isCorrect: true },
      { text: "display: block", value: "display: block", isCorrect: false },
      { text: "display: inline", value: "display: inline", isCorrect: false }
    ],
    correctAnswer: "display: flex",
    explanation: "display: flex creates a flexible box layout that allows items to grow and shrink.",
    points: 15,
    timeLimit: 45,
    difficulty: "Medium",
    tags: ["css", "flexbox", "layout"]
  },
  {
    question: "Which CSS property creates a linear gradient background?",
    type: "multiple-choice",
    level: "Intermediate",
    category: "css-basics",
    options: [
      { text: "background-gradient", value: "background-gradient", isCorrect: false },
      { text: "linear-gradient", value: "linear-gradient", isCorrect: false },
      { text: "background: linear-gradient()", value: "background: linear-gradient()", isCorrect: true },
      { text: "gradient: linear", value: "gradient: linear", isCorrect: false }
    ],
    correctAnswer: "background: linear-gradient()",
    explanation: "background: linear-gradient() is the correct CSS property for creating linear gradients.",
    points: 15,
    timeLimit: 45,
    difficulty: "Medium",
    tags: ["css", "gradients", "background"]
  },

  // Pro Level Quizzes
  {
    question: "What CSS property creates smooth transitions between property changes?",
    type: "multiple-choice",
    level: "Pro",
    category: "animations",
    options: [
      { text: "transition", value: "transition", isCorrect: true },
      { text: "transform", value: "transform", isCorrect: false },
      { text: "animation", value: "animation", isCorrect: false },
      { text: "keyframes", value: "keyframes", isCorrect: false }
    ],
    correctAnswer: "transition",
    explanation: "The 'transition' property creates smooth transitions between property changes over time.",
    points: 20,
    timeLimit: 60,
    difficulty: "Hard",
    tags: ["css", "transitions", "animations"]
  },
  {
    question: "Which CSS media query targets mobile devices in portrait orientation?",
    type: "multiple-choice",
    level: "Pro",
    category: "responsive",
    options: [
      { text: "@media (max-width: 768px)", value: "@media (max-width: 768px)", isCorrect: true },
      { text: "@media (orientation: portrait)", value: "@media (orientation: portrait)", isCorrect: false },
      { text: "@media (device-width: mobile)", value: "@media (device-width: mobile)", isCorrect: false },
      { text: "@media (screen: mobile)", value: "@media (screen: mobile)", isCorrect: false }
    ],
    correctAnswer: "@media (max-width: 768px)",
    explanation: "@media (max-width: 768px) targets devices with screen width up to 768px, typically mobile devices.",
    points: 25,
    timeLimit: 60,
    difficulty: "Hard",
    tags: ["css", "media-queries", "responsive"]
  }
];

const sampleCSSExams = [
  // Beginner Level CSS Exams
  {
    title: "Create a Colored Card",
    description: "Create a simple card with a background color and some padding. The card should have rounded corners and a subtle shadow.",
    level: "Beginner",
    category: "styling",
    requirements: [
      {
        type: "selector",
        description: "Create a .card selector",
        selector: ".card",
        points: 10
      },
      {
        type: "property",
        description: "Add background-color property",
        property: "background-color",
        points: 10
      },
      {
        type: "property",
        description: "Add padding property",
        property: "padding",
        points: 10
      },
      {
        type: "property",
        description: "Add border-radius property",
        property: "border-radius",
        points: 10
      },
      {
        type: "property",
        description: "Add box-shadow property",
        property: "box-shadow",
        points: 10
      }
    ],
    starterCode: {
      html: `<div class="card">
  <h3>Sample Card</h3>
  <p>This is a sample card with some content.</p>
</div>`,
      css: `/* Your CSS code here */`
    },
    expectedOutput: "A card with colored background, padding, rounded corners, and shadow",
    hints: [
      "Use a background color like #f0f0f0 or #e0e0e0",
      "Add padding of at least 20px",
      "Use border-radius for rounded corners",
      "Add a subtle box-shadow for depth"
    ],
    difficulty: "Easy",
    timeLimit: 30,
    points: 50,
    tags: ["css", "card", "styling", "basics"]
  },
  {
    title: "Style a Button with Hover Effect",
    description: "Create a button with a hover effect that changes its background color and adds a transition.",
    level: "Beginner",
    category: "styling",
    requirements: [
      {
        type: "selector",
        description: "Create a .button selector",
        selector: ".button",
        points: 10
      },
      {
        type: "selector",
        description: "Create a .button:hover selector",
        selector: ".button:hover",
        points: 15
      },
      {
        type: "property",
        description: "Add background-color property",
        property: "background-color",
        points: 10
      },
      {
        type: "property",
        description: "Add transition property",
        property: "transition",
        points: 15
      }
    ],
    starterCode: {
      html: `<button class="button">Click Me</button>`,
      css: `/* Your CSS code here */`
    },
    expectedOutput: "A button that changes color on hover with smooth transition",
    hints: [
      "Start with a base background color like #007bff",
      "Change the background color on hover",
      "Add transition for smooth color change",
      "Use padding to make the button larger"
    ],
    difficulty: "Easy",
    timeLimit: 25,
    points: 50,
    tags: ["css", "button", "hover", "transition"]
  },

  // Intermediate Level CSS Exams
  {
    title: "Flexbox Navigation Bar",
    description: "Create a horizontal navigation bar using flexbox. The navigation should have evenly spaced items and be responsive.",
    level: "Intermediate",
    category: "layout",
    requirements: [
      {
        type: "selector",
        description: "Create a .nav selector",
        selector: ".nav",
        points: 10
      },
      {
        type: "property",
        description: "Add display: flex",
        property: "display: flex",
        points: 15
      },
      {
        type: "property",
        description: "Add justify-content property",
        property: "justify-content",
        points: 15
      },
      {
        type: "selector",
        description: "Create a .nav-item selector",
        selector: ".nav-item",
        points: 10
      }
    ],
    starterCode: {
      html: `<nav class="nav">
  <a href="#" class="nav-item">Home</a>
  <a href="#" class="nav-item">About</a>
  <a href="#" class="nav-item">Services</a>
  <a href="#" class="nav-item">Contact</a>
</nav>`,
      css: `/* Your CSS code here */`
    },
    expectedOutput: "A horizontal navigation bar with evenly spaced items using flexbox",
    hints: [
      "Use display: flex on the navigation container",
      "Use justify-content: space-between or space-around",
      "Style the navigation items with padding and colors",
      "Add hover effects for better UX"
    ],
    difficulty: "Medium",
    timeLimit: 45,
    points: 50,
    tags: ["css", "flexbox", "navigation", "layout"]
  },

  // Pro Level CSS Exams
  {
    title: "Animated Loading Spinner",
    description: "Create a spinning loading animation using CSS animations and keyframes. The spinner should be centered and rotate continuously.",
    level: "Pro",
    category: "animations",
    requirements: [
      {
        type: "selector",
        description: "Create a .spinner selector",
        selector: ".spinner",
        points: 10
      },
      {
        type: "property",
        description: "Add animation property",
        property: "animation",
        points: 20
      },
      {
        type: "selector",
        description: "Create @keyframes rule",
        selector: "@keyframes",
        points: 20
      },
      {
        type: "property",
        description: "Add transform: rotate() in keyframes",
        property: "transform: rotate",
        points: 20
      }
    ],
    starterCode: {
      html: `<div class="spinner"></div>`,
      css: `/* Your CSS code here */`
    },
    expectedOutput: "A continuously spinning loading animation",
    hints: [
      "Create a circular element using border-radius",
      "Use @keyframes to define the rotation animation",
      "Apply animation: spin 1s linear infinite",
      "Center the spinner using flexbox or absolute positioning"
    ],
    difficulty: "Hard",
    timeLimit: 60,
    points: 70,
    tags: ["css", "animation", "keyframes", "loading"]
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Quiz.deleteMany({});
    await CSSExam.deleteMany({});

    // Insert sample quizzes
    await Quiz.insertMany(sampleQuizzes);
    console.log(`Inserted ${sampleQuizzes.length} quiz questions`);

    // Insert sample CSS exams
    await CSSExam.insertMany(sampleCSSExams);
    console.log(`Inserted ${sampleCSSExams.length} CSS exams`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = {
  sampleQuizzes,
  sampleCSSExams,
  seedDatabase
};
