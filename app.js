// Design system color schemes for simulations
const COLORS = {
  accentPurple: '#8b5cf6',
  accentCyan: '#06b6d4',
  accentPink: '#ec4899',
  bgCard: '#0f172a',
  textPrimary: '#f3f4f6',
  textMuted: '#6b7280'
};

// Global application state
const state = {
  activeTab: 'dashboard-tab',
  videos: [],
  notes: [],
  activeNoteId: null,
  activeVideoUrl: null,
  isAdmin: false, // Security constraint: regular visitors are read-only
  // Neural Network Simulator Config
  nn: {
    dataset: 'circle', // 'circle', 'xor', 'linear'
    lr: 0.03,
    activation: 'tanh',
    hiddenLayers: 2,
    layerSizes: [4, 3], // Neurons per hidden layer (updates dynamically)
    weights: [],        // Network weights
    biases: [],         // Network biases
    trainData: [],      // Training dataset points
    testData: [],       // Testing dataset points
    isTraining: false,
    epoch: 0,
    loss: 0,
    accuracy: 0,
    animationFrameId: null
  }
};

// ----------------------------------------------------
// DEFAULT CORE CONTENT INITS
// ----------------------------------------------------

const DEFAULT_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Deep Learning Foundations: Neural Networks Demystified',
    desc: 'An intuitive, visual introduction to Artificial Neural Networks. Learn what weights, biases, and activation functions really do behind the scenes, and how mathematical nodes stack up to recognize complex features.',
    duration: '12:45',
    category: 'Deep Learning',
    views: '14,284',
    date: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' // Public sample video
  },
  {
    id: 'vid-2',
    title: 'Understanding the Backpropagation Algorithm Step-by-Step',
    desc: 'Demystifying backpropagation using simple chain-rule calculus. We break down the mathematical computations required to propagate error gradients backwards and optimize weights using gradient descent.',
    duration: '18:20',
    category: 'Optimization',
    views: '8,901',
    date: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'vid-3',
    title: 'Interactive Neural Sandbox Walkthrough & Tips',
    desc: 'Watch this tutorial to learn how to configure our interactive neural sandbox. Learn why XOR requires hidden layers, how activation functions shape decision boundaries, and how to debug convergence issues.',
    duration: '08:15',
    category: 'Simulations',
    views: '5,420',
    date: '2 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  }
];

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Introduction to Deep Learning.md',
    date: 'Yesterday',
    author: 'narenTech-ai',
    content: `# Introduction to Deep Learning

Deep Learning is a specialized subset of Machine Learning inspired by the structure and function of the human brain. It uses **Multi-Layer Perceptrons (MLPs)** to model complex patterns in high-dimensional data.

## Why "Deep"?
Traditional Machine Learning algorithms rely on hand-crafted features (feature engineering). In contrast, Deep Learning architectures learn representations of data automatically through layers of abstraction:
1. **Low-level features:** Edges, lines, and textures (in computer vision).
2. **Mid-level features:** Shapes, corners, and object parts.
3. **High-level features:** Complete faces, cars, or textual concepts.

## The Mathematical Node (Neuron)
At the core of every neural network is the mathematical neuron. For a set of inputs $X = [x_1, x_2, ..., x_n]$, the neuron computes:

\`\`\`js
// Mathematical operation of a single artificial neuron
const sum = (inputs, weights, bias) => {
  let z = bias;
  for (let i = 0; i < inputs.length; i++) {
    z += inputs[i] * weights[i];
  }
  return z;
};

// Applying Activation Function
const activation = Math.tanh(z);
\`\`\`

## Key Concepts
* **Weights:** Factors that scale the input features, representing the strength of synapses between nodes.
* **Biases:** Offset thresholds added to the weighted sums, adjusting the activation point.
* **Loss Function:** An objective function measuring how far predictions are from ground truth.`
  },
  {
    id: 'note-2',
    title: 'Backpropagation Algorithm Explained.txt',
    date: '4 days ago',
    author: 'narenTech-ai',
    content: `BACKPROPAGATION ALGORITHM STEP-BY-STEP
========================================

Backpropagation is short for "backward propagation of errors." It is the core algorithm used to train neural networks. It uses the chain rule from calculus to compute the gradient of the loss function with respect to the network weights.

GENERAL PIPELINE:
-----------------
1. Forward Pass:
   Inputs are passed forward through the network.
   Activations are computed for each layer sequentially.
   The output is compared to the target value to compute a Loss (Error).

2. Backward Pass:
   We start at the output layer and compute the gradient of the loss with respect to output activations.
   We propagate this derivative backwards through the weights using the Chain Rule:
   dLoss/dWeight = (dLoss/dActivation) * (dActivation/dPreactivation) * (dPreactivation/dWeight)

3. Update Phase:
   Once gradients are computed for all weights and biases, we update them using Gradient Descent:
   Weight_new = Weight_old - (LearningRate * Gradient)

BENEFITS:
---------
Optimizing backprop allows neural networks to scale to billions of parameters, enabling modern models like GPT and Claude to train efficiently.`
  },
  {
    id: 'note-3',
    title: 'Understanding the XOR Problem.md',
    date: '1 week ago',
    author: 'narenTech-ai',
    content: `# The XOR Classification Dilemma

In the early history of Artificial Intelligence, the **XOR (Exclusive OR)** problem was a famous benchmark that highlighted the limitations of simple linear perceptrons.

## XOR Truth Table
A and B must be different to output a 1:
* Input: \`[0, 0]\` → Output: \`0\`
* Input: \`[0, 1]\` → Output: \`1\`
* Input: \`[1, 0]\` → Output: \`1\`
* Input: \`[1, 1]\` → Output: \`0\`

## The Linear Barrier
A single-layer perceptron computes $y = \sigma(w_1 x_1 + w_2 x_2 + b)$. Graphically, this is represented by a **straight line** dividing a 2D grid.
If you plot the XOR inputs on a grid:
* (0,0) and (1,1) are **Class Red (0)**
* (0,1) and (1,0) are **Class Blue (1)**

It is geometrically impossible to draw a single straight line that isolates red points from blue points. This is known as the **linear separability limitation**.

## The Multi-Layer Solution
By introducing a **hidden layer** with non-linear activation functions (like Tanh, ReLU, or Sigmoid), the network transforms the feature space. It stretches, rotates, and bends the coordinates so that the points *become* linearly separable in the output layer.

> Try running the XOR Dataset in our Neural Sandbox. Notice how a model with 0 hidden layers cannot solve it, but adding a single hidden layer with Tanh activations fits the curve perfectly!`
  }
];

// Initialize LocalStorage Data if not present
function initializeStorage() {
  if (!localStorage.getItem('narentech_videos')) {
    localStorage.setItem('narentech_videos', JSON.stringify(DEFAULT_VIDEOS));
  }
  if (!localStorage.getItem('narentech_notes')) {
    localStorage.setItem('narentech_notes', JSON.stringify(DEFAULT_NOTES));
  }
  state.videos = JSON.parse(localStorage.getItem('narentech_videos'));
  state.notes = JSON.parse(localStorage.getItem('narentech_notes'));
}

// ----------------------------------------------------
// UI UTILITIES & ROUTER
// ----------------------------------------------------

function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update nav buttons active state
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update tabs display
  document.querySelectorAll('.tab-content').forEach(section => {
    if (section.id === tabId) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Tab-specific initializations
  if (tabId === 'sandbox-tab') {
    initNeuralNetworkSimulator();
  } else {
    // If leaving simulator, stop active training loop
    if (state.nn.isTraining) {
      toggleTraining(false);
    }
  }
}

// Render video grids
function renderVideos() {
  const trendingGrid = document.getElementById('trending-video-grid');
  const fullGrid = document.getElementById('full-video-grid');
  
  const createVideoCardHTML = (video) => {
    const isCustom = video.id.startsWith('vid-') && video.id !== 'vid-1' && video.id !== 'vid-2' && video.id !== 'vid-3';
    const deleteBtn = (isCustom && state.isAdmin)
      ? `<button class="delete-btn" onclick="event.stopPropagation(); deleteVideo('${video.id}')" title="Remove video">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
         </button>`
      : '';

    return `
      <div class="glass-card video-card purple-glow" onclick="playVideo('${video.id}')">
        <div class="video-thumb">
          ${deleteBtn}
          <img src="${video.thumbnail}" alt="${video.title}">
          <div class="video-play-btn">
            <div class="play-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
          <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
          <h3 title="${video.title}">${video.title}</h3>
          <p>${video.desc}</p>
          <div class="video-meta">
            <span>${video.category}</span>
            <span>${video.views} views • ${video.date}</span>
          </div>
        </div>
      </div>
    `;
  };

  // Render trending section on dashboard (first 3)
  if (trendingGrid) {
    trendingGrid.innerHTML = state.videos.slice(0, 3).map(createVideoCardHTML).join('');
  }

  // Render full catalog
  if (fullGrid) {
    fullGrid.innerHTML = state.videos.map(createVideoCardHTML).join('');
  }
}

// Play Video Modal Trigger
function playVideo(videoId) {
  const video = state.videos.find(v => v.id === videoId);
  if (!video) return;

  const modal = document.getElementById('player-modal');
  const modalTitle = document.getElementById('modal-video-title');
  const videoPlayer = document.getElementById('main-player');

  modalTitle.textContent = video.title;
  videoPlayer.src = video.src;
  
  modal.style.display = 'flex';
  videoPlayer.play().catch(e => console.log("Auto-play blocked or source invalid:", e));
}

function closeVideoPlayer() {
  const modal = document.getElementById('player-modal');
  const videoPlayer = document.getElementById('main-player');
  videoPlayer.pause();
  videoPlayer.src = '';
  modal.style.display = 'none';
}

function deleteVideo(videoId) {
  if (!confirm("Are you sure you want to remove this video from your collection?")) return;
  state.videos = state.videos.filter(v => v.id !== videoId);
  localStorage.setItem('narentech_videos', JSON.stringify(state.videos));
  renderVideos();
}

function deleteNote(noteId) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  state.notes = state.notes.filter(n => n.id !== noteId);
  localStorage.setItem('narentech_notes', JSON.stringify(state.notes));
  
  if (state.activeNoteId === noteId) {
    state.activeNoteId = state.notes.length > 0 ? state.notes[0].id : null;
  }
  
  renderNotesList();
  if (state.activeNoteId) {
    selectNote(state.activeNoteId);
  } else {
    document.getElementById('reader-title').textContent = 'No Notes Available';
    document.getElementById('reader-meta').textContent = '';
    document.getElementById('reader-body').innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 3rem;">Upload or create notes to display here.</p>';
  }
}

// ----------------------------------------------------
// NOTES HUB CONTROLLERS
// ----------------------------------------------------

// Custom simple markdown parser to render gorgeous formatted documents in Reader Mode
function parseMarkdown(text) {
  let html = text;

  // Clean elements
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Headers (Order is important)
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');

  // Bold text: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Blockquotes: > quote
  html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>');

  // Code Blocks: ```js code ```
  html = html.replace(/```(.*?)\r?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Inline Code: `code`
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/gs, '<ul>$1</ul>');
  
  html = html.replace(/^(?!<h|<ul|<li|<pre|<blockquote|&lt;!--)(.*?)$/gm, function(match) {
    if (match.trim() === '') return '';
    return `<p>${match}</p>`;
  });

  return html;
}

function renderNotesList() {
  const listContainer = document.getElementById('notes-list');
  if (!listContainer) return;

  listContainer.innerHTML = state.notes.map(note => {
    const isCustom = note.id.startsWith('note-') && note.id !== 'note-1' && note.id !== 'note-2' && note.id !== 'note-3';
    const deleteBtn = (isCustom && state.isAdmin)
      ? `<button class="note-delete-btn" onclick="event.stopPropagation(); deleteNote('${note.id}')" title="Delete Note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
         </button>`
      : '';

    return `
      <div class="notes-item ${state.activeNoteId === note.id ? 'active' : ''}" onclick="selectNote('${note.id}')">
        <div style="flex: 1; min-width: 0;">
          <div class="notes-item-title">${note.title}</div>
          <div class="notes-item-date">by ${note.author}</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">${note.date}</div>
          ${deleteBtn}
        </div>
      </div>
    `;
  }).join('');
}

function selectNote(noteId) {
  state.activeNoteId = noteId;
  const note = state.notes.find(n => n.id === noteId);
  if (!note) return;

  renderNotesList();

  const readerTitle = document.getElementById('reader-title');
  const readerMeta = document.getElementById('reader-meta');
  const readerBody = document.getElementById('reader-body');

  readerTitle.textContent = note.title;
  readerMeta.textContent = `Written by ${note.author} • Updated ${note.date}`;
  readerBody.innerHTML = parseMarkdown(note.content);
}

// Adjust Note Font Sizes
let fontScale = 1.05;
function adjustNoteFontSize(action) {
  const readerBody = document.getElementById('reader-body');
  if (!readerBody) return;
  
  if (action === 'increase') fontScale = Math.min(1.4, fontScale + 0.05);
  if (action === 'decrease') fontScale = Math.max(0.85, fontScale - 0.05);

  readerBody.style.fontSize = `${fontScale}rem`;
}

// Copy Raw Text Note
function copyRawNote() {
  const note = state.notes.find(n => n.id === state.activeNoteId);
  if (!note) return;

  navigator.clipboard.writeText(note.content).then(() => {
    const copyBtn = document.getElementById('btn-copy-note');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
      Copied!
    `;
    copyBtn.style.color = 'var(--status-success)';
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.color = '';
    }, 2000);
  });
}

// ----------------------------------------------------
// SIMULATION UPLOADS (VIDEOS & NOTES)
// ----------------------------------------------------

function handleDropUpload(type, file) {
  if (type === 'video') {
    if (!file.type.startsWith('video/')) {
      alert("Invalid file. Please drop a valid video file.");
      return;
    }
    setupVideoUploadProgress(file);
  } else if (type === 'notes') {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'txt' && ext !== 'md') {
      alert("Invalid file. Only text (.txt) and markdown (.md) documents are supported.");
      return;
    }
    setupNotesUploadProgress(file);
  }
}

function setupVideoUploadProgress(file) {
  const container = document.getElementById('video-progress-container');
  const percentText = document.getElementById('video-progress-percent');
  const fill = document.getElementById('video-progress-fill');
  const statusText = document.getElementById('video-progress-status');
  const titleInput = document.getElementById('video-title');
  const descInput = document.getElementById('video-desc');
  const durationInput = document.getElementById('video-duration-input');

  let title = titleInput.value.trim() || file.name.replace(/\.[^/.]+$/, "");
  let desc = descInput.value.trim() || "Simulated uploaded tutorial covering framework properties.";
  let duration = durationInput.value.trim() || "04:15";

  container.style.display = 'block';
  document.getElementById('start-upload-btn').disabled = true;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Completion Logic
      const videoSrc = URL.createObjectURL(file);
      const newVideo = {
        id: `vid-${Date.now()}`,
        title: title,
        desc: desc,
        duration: duration,
        category: 'Uploaded',
        views: '0',
        date: 'Just now',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
        src: videoSrc
      };

      state.videos.unshift(newVideo);
      localStorage.setItem('narentech_videos', JSON.stringify(state.videos));
      renderVideos();

      statusText.textContent = "Complete!";
      setTimeout(() => {
        container.style.display = 'none';
        document.getElementById('start-upload-btn').disabled = false;
        titleInput.value = '';
        descInput.value = '';
        alert(`Success! "${title}" is ready and available in the collection.`);
      }, 800);
    }
    
    // Status message based on progress percentage
    let status = "Uploading blocks...";
    if (progress > 25) status = "Decoding frame stream...";
    if (progress > 55) status = "Optimizing web layouts...";
    if (progress > 85) status = "Indexing CDN cache...";
    
    percentText.textContent = `${progress}%`;
    fill.style.width = `${progress}%`;
    statusText.textContent = `${status} (Simulated speed: ${Math.floor(Math.random()*15 + 30)}MB/s)`;
  }, 120);
}

function setupNotesUploadProgress(file) {
  const container = document.getElementById('notes-progress-container');
  const percentText = document.getElementById('notes-progress-percent');
  const fill = document.getElementById('notes-progress-fill');

  container.style.display = 'block';

  let progress = 0;
  const interval = setInterval(() => {
    progress += 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const newNote = {
          id: `note-${Date.now()}`,
          title: file.name,
          date: 'Just now',
          author: 'Self Upload',
          content: text
        };

        state.notes.unshift(newNote);
        localStorage.setItem('narentech_notes', JSON.stringify(state.notes));
        renderNotesList();
        selectNote(newNote.id);
        
        container.style.display = 'none';
      };
      reader.readAsText(file);
    }
    percentText.textContent = `${progress}%`;
    fill.style.width = `${progress}%`;
  }, 80);
}

// ----------------------------------------------------
// NEURAL NETWORK SIMULATOR ENGINE (MLP FROM SCRATCH)
// ----------------------------------------------------

// Mathematical Kernels
const Activations = {
  tanh: {
    f: x => Math.tanh(x),
    df: fx => 1 - fx * fx
  },
  sigmoid: {
    f: x => 1 / (1 + Math.exp(-x)),
    df: fx => fx * (1 - fx)
  },
  relu: {
    f: x => Math.max(0, x),
    df: fx => fx > 0 ? 1 : 0
  }
};

// Seed dataset patterns
function generateSimulationData(pattern, count) {
  const dataset = [];
  const radius = 0.8;

  for (let i = 0; i < count; i++) {
    // Generate random values in coordinates [-1.5, 1.5]
    const x = (Math.random() * 3) - 1.5;
    const y = (Math.random() * 3) - 1.5;
    let label = 0;

    if (pattern === 'circle') {
      const dist = Math.sqrt(x*x + y*y);
      label = dist < radius ? 1 : 0;
    } else if (pattern === 'xor') {
      label = (x >= 0 && y >= 0) || (x < 0 && y < 0) ? 1 : 0;
    } else if (pattern === 'linear') {
      label = y > (0.3 * x + 0.1) ? 1 : 0;
    }
    // Add noise to make training look authentic
    const noiseLevel = 0.05;
    const finalX = x + (Math.random() * noiseLevel * 2 - noiseLevel);
    const finalY = y + (Math.random() * noiseLevel * 2 - noiseLevel);

    dataset.push({ x: finalX, y: finalY, label: label });
  }
  return dataset;
}

// Setup layers sizes based on DOM input configurations
function computeArchitecture() {
  const count = state.nn.hiddenLayers;
  state.nn.layerSizes = [];
  for (let i = 0; i < count; i++) {
    const inputEl = document.getElementById(`neurons-layer-${i}`);
    const size = inputEl ? parseInt(inputEl.value) : 3;
    state.nn.layerSizes.push(size);
  }
}

// Neural Network object initialization
function initNeuralNetworkWeights() {
  // Configured Architecture: [Inputs, ...HiddenLayers, Output]
  const fullArch = [2, ...state.nn.layerSizes, 1];
  state.nn.weights = [];
  state.nn.biases = [];

  for (let l = 1; l < fullArch.length; l++) {
    const rows = fullArch[l];
    const cols = fullArch[l-1];
    
    // Weight Matrix: W[l] dimensions (rows x cols)
    const weightMatrix = [];
    const biasVector = [];

    for (let i = 0; i < rows; i++) {
      const neuronWeights = [];
      for (let j = 0; j < cols; j++) {
        // Xavier/Glorot Initialization range
        const limit = Math.sqrt(6 / (rows + cols));
        neuronWeights.push(Math.random() * 2 * limit - limit);
      }
      weightMatrix.push(neuronWeights);
      biasVector.push(Math.random() * 0.2 - 0.1);
    }
    state.nn.weights.push(weightMatrix);
    state.nn.biases.push(biasVector);
  }
  state.nn.epoch = 0;
}

// MLP Forward Propagation
function forwardProp(point) {
  const inputs = [point.x, point.y];
  const activations = [inputs];
  const preActivations = [];
  
  const layersCount = state.nn.weights.length;
  const actName = state.nn.activation;

  for (let l = 0; l < layersCount; l++) {
    const w = state.nn.weights[l];
    const b = state.nn.biases[l];
    const prevA = activations[l];
    
    const nextA = [];
    const nextZ = [];

    // Compute dot product and add bias for each node in layer
    for (let i = 0; i < w.length; i++) {
      let sum = b[i];
      for (let j = 0; j < prevA.length; j++) {
        sum += prevA[j] * w[i][j];
      }
      nextZ.push(sum);
      
      // Determine output activation. Last layer is always Sigmoid for binary prediction
      if (l === layersCount - 1) {
        nextA.push(Activations.sigmoid.f(sum));
      } else {
        nextA.push(Activations[actName].f(sum));
      }
    }
    
    preActivations.push(nextZ);
    activations.push(nextA);
  }

  return { activations, preActivations };
}

// Backpropagation algorithm execution
function backPropagate(point) {
  const { activations, preActivations } = forwardProp(point);
  const y = point.label;
  const layersCount = state.nn.weights.length;
  
  const dW = [];
  const db = [];
  
  // Storage for layer error signals
  const delta = new Array(layersCount);
  
  // Output layer error gradient
  const outputA = activations[layersCount][0];
  // Binary Cross-Entropy gradient combined with Sigmoid derivative
  delta[layersCount-1] = [outputA - y];

  // Propagate derivative backwards
  const actName = state.nn.activation;
  for (let l = layersCount - 2; l >= 0; l--) {
    const wNext = state.nn.weights[l+1];
    const dNext = delta[l+1];
    const z = preActivations[l];
    const a = activations[l+1]; // Current layer activation values
    
    const dCurr = [];
    for (let i = 0; i < wNext[0].length; i++) {
      let errSum = 0;
      for (let j = 0; j < wNext.length; j++) {
        errSum += dNext[j] * wNext[j][i];
      }
      dCurr.push(errSum * Activations[actName].df(a[i]));
    }
    delta[l] = dCurr;
  }

  // Calculate gradients
  for (let l = 0; l < layersCount; l++) {
    const dL = delta[l];
    const prevA = activations[l];
    
    const layerDW = [];
    const layerDb = [];

    for (let i = 0; i < dL.length; i++) {
      const neuronDW = [];
      for (let j = 0; j < prevA.length; j++) {
        neuronDW.push(dL[i] * prevA[j]);
      }
      layerDW.push(neuronDW);
      layerDb.push(dL[i]);
    }
    dW.push(layerDW);
    db.push(layerDb);
  }

  return { dW, db };
}

// Train network for a single epoch (batch training update)
function trainEpoch() {
  const lr = state.nn.lr;
  const data = state.nn.trainData;
  const layersCount = state.nn.weights.length;

  // Aggregate weight updates over batch dataset
  const batchDW = [];
  const batchDb = [];

  // Initialize grads structure
  for (let l = 0; l < layersCount; l++) {
    const w = state.nn.weights[l];
    const layerDW = w.map(row => new Array(row.length).fill(0));
    const layerDb = new Array(w.length).fill(0);
    batchDW.push(layerDW);
    batchDb.push(layerDb);
  }

  // Accumulate gradients
  data.forEach(point => {
    const { dW, db } = backPropagate(point);
    for (let l = 0; l < layersCount; l++) {
      for (let i = 0; i < dW[l].length; i++) {
        for (let j = 0; j < dW[l][i].length; j++) {
          batchDW[l][i][j] += dW[l][i][j];
        }
        batchDb[l][i] += db[l][i];
      }
    }
  });

  // Apply gradient update step with average updates
  const n = data.length;
  for (let l = 0; l < layersCount; l++) {
    for (let i = 0; i < state.nn.weights[l].length; i++) {
      for (let j = 0; j < state.nn.weights[l][i].length; j++) {
        state.nn.weights[l][i][j] -= lr * (batchDW[l][i][j] / n);
      }
      state.nn.biases[l][i] -= lr * (batchDb[l][i] / n);
    }
  }

  state.nn.epoch++;
  evaluatePerformance();
}

// Calculate metrics (Loss & Accuracy)
function evaluatePerformance() {
  let lossSum = 0;
  let correct = 0;
  const data = state.nn.testData;

  data.forEach(point => {
    const { activations } = forwardProp(point);
    const yPred = activations[activations.length - 1][0];
    const y = point.label;
    
    // Cross entropy loss
    const term1 = y * Math.log(Math.max(1e-15, yPred));
    const term2 = (1 - y) * Math.log(Math.max(1e-15, 1 - yPred));
    lossSum -= (term1 + term2);

    const classification = yPred > 0.5 ? 1 : 0;
    if (classification === y) correct++;
  });

  state.nn.loss = lossSum / data.length;
  state.nn.accuracy = (correct / data.length) * 100;
}

// ----------------------------------------------------
// SIMULATOR RENDERING & SVGS
// ----------------------------------------------------

// Render decision boundary mapping on 2D Canvas
function drawDecisionBoundary() {
  const canvas = document.getElementById('boundaryCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw prediction boundary pixels (low resolution for performance)
  const step = 4;
  for (let u = 0; u < w; u += step) {
    for (let v = 0; v < h; v += step) {
      // Map pixel coordinates to range [-1.5, 1.5]
      const x = (u / w) * 3 - 1.5;
      const y = 1.5 - (v / h) * 3; // Flip Y for traditional Cartesian coords
      
      const { activations } = forwardProp({ x, y });
      const yPred = activations[activations.length - 1][0];
      
      // Color interpolation: blue (class 1) to red (class 0)
      const r = Math.floor((1 - yPred) * 60) + 15;
      const g = Math.floor(yPred * 35) + 10;
      const b = Math.floor(yPred * 140) + 30;
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(u, v, step, step);
    }
  }

  // 2. Draw actual dataset points
  const drawPoints = (dataset) => {
    dataset.forEach(point => {
      // Map Cartesian coordinates to Canvas coordinates
      const cx = ((point.x + 1.5) / 3) * w;
      const cy = ((1.5 - point.y) / 3) * h;
      
      // Predict class to show correct/incorrect outline indicator
      const { activations } = forwardProp(point);
      const pred = activations[activations.length - 1][0] > 0.5 ? 1 : 0;
      const isCorrect = pred === point.label;
      
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = point.label === 1 ? COLORS.accentPurple : COLORS.accentCyan;
      ctx.fill();
      
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isCorrect ? '#ffffff' : '#ef4444';
      ctx.stroke();
    });
  };

  drawPoints(state.nn.testData);
}

// Draw weights visualizer network SVG graph
function drawNetworkGraph() {
  const svg = document.getElementById('networkSvg');
  if (!svg) return;
  svg.innerHTML = ''; // Clear previous elements
  
  const width = svg.clientWidth || 380;
  const height = svg.clientHeight || 400;

  const fullArch = [2, ...state.nn.layerSizes, 1];
  const layerCount = fullArch.length;
  
  // 1. Calculate node coordinates
  const nodeCoords = [];
  const layerSpacing = width / (layerCount + 0.3);

  for (let l = 0; l < layerCount; l++) {
    const size = fullArch[l];
    const x = (l + 0.65) * layerSpacing;
    const nodeSpacing = height / (size + 1);
    
    const layerCoords = [];
    for (let i = 0; i < size; i++) {
      layerCoords.push({
        x: x,
        y: (i + 1) * nodeSpacing,
        layer: l,
        idx: i
      });
    }
    nodeCoords.push(layerCoords);
  }

  // 2. Draw Synapses (Connections / Weights)
  for (let l = 1; l < layerCount; l++) {
    const prevLayer = nodeCoords[l-1];
    const currLayer = nodeCoords[l];
    const layerWeights = state.nn.weights[l-1];

    for (let i = 0; i < currLayer.length; i++) {
      const cNode = currLayer[i];
      for (let j = 0; j < prevLayer.length; j++) {
        const pNode = prevLayer[j];
        const w = layerWeights[i][j];
        
        // Synapse thickness based on weight magnitude
        const thickness = Math.min(6, Math.max(0.5, Math.abs(w) * 1.8));
        
        // Positive weights are teal, negative are purple
        const color = w > 0 ? COLORS.accentCyan : COLORS.accentPurple;
        const opacity = Math.min(0.85, Math.max(0.1, Math.abs(w) * 0.45));

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", pNode.x);
        line.setAttribute("y1", pNode.y);
        line.setAttribute("x2", cNode.x);
        line.setAttribute("y2", cNode.y);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", thickness);
        line.setAttribute("opacity", opacity);
        line.setAttribute("class", "connection-line");
        svg.appendChild(line);
      }
    }
  }

  // 3. Draw Nodes (Neurons)
  for (let l = 0; l < layerCount; l++) {
    const layer = nodeCoords[l];
    layer.forEach(node => {
      // Determine node active state glow
      let glowColor = 'rgba(255, 255, 255, 0.1)';
      if (l === 0) glowColor = COLORS.accentCyan;
      else if (l === layerCount - 1) glowColor = COLORS.accentPurple;
      else glowColor = 'rgba(255,255,255,0.4)';

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", node.x);
      circle.setAttribute("cy", node.y);
      circle.setAttribute("r", 9);
      circle.setAttribute("fill", COLORS.bgCard);
      circle.setAttribute("stroke", glowColor);
      circle.setAttribute("stroke-width", 2.5);
      circle.setAttribute("class", "neuron-circle");
      
      // Add custom visual drop shadow glow on output/input layer nodes
      if (l === 0 || l === layerCount - 1) {
        circle.setAttribute("style", `filter: drop-shadow(0 0 4px ${glowColor});`);
      }

      svg.appendChild(circle);
    });
  }
}

// Update simulation status metrics in DOM
function updateSimulatorDOMMetrics() {
  document.getElementById('metric-epoch').textContent = String(state.nn.epoch).padStart(4, '0');
  document.getElementById('metric-loss').textContent = state.nn.loss.toFixed(4);
  document.getElementById('metric-accuracy').textContent = `${state.nn.accuracy.toFixed(1)}%`;
}

// Set layout selectors for dynamic hidden layer sizes adjustment
function renderNeuronsControllers() {
  const container = document.getElementById('neurons-controllers-container');
  if (!container) return;

  const count = state.nn.hiddenLayers;
  let html = '';

  for (let i = 0; i < count; i++) {
    const currentVal = state.nn.layerSizes[i] || 3;
    html += `
      <div class="param-slider-wrap" style="padding-left: 0.5rem; border-left: 2px solid rgba(255, 255, 255, 0.05);">
        <div class="slider-label" style="font-size: 0.8rem;">
          <span>Layer ${i + 1} Size</span>
          <span style="font-weight:700; color:var(--accent-cyan);" id="label-layer-size-${i}">${currentVal} nodes</span>
        </div>
        <input type="range" class="neuron-size-slider" data-layer-idx="${i}" id="neurons-layer-${i}" min="1" max="8" value="${currentVal}" step="1" style="width: 100%;">
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind change listeners to node controls
  document.querySelectorAll('.neuron-size-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-layer-idx'));
      const val = parseInt(e.target.value);
      
      document.getElementById(`label-layer-size-${idx}`).textContent = `${val} nodes`;
      
      state.nn.layerSizes[idx] = val;
      
      // Reinitialize weights for modified architecture sizes
      initNeuralNetworkWeights();
      drawNetworkGraph();
      drawDecisionBoundary();
      updateSimulatorDOMMetrics();
    });
  });
}

// Toggle Loop Simulation
function toggleTraining(forceState) {
  const btn = document.getElementById('btn-train-toggle');
  if (!btn) return;

  const nextState = forceState !== undefined ? forceState : !state.nn.isTraining;
  state.nn.isTraining = nextState;

  if (nextState) {
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="4" x2="18" y2="20"></line><line x1="6" y1="4" x2="6" y2="20"></line></svg>
      Pause Sandbox
    `;
    btn.classList.add('btn-secondary');
    btn.classList.remove('btn-primary');
    
    // Start recursion loop
    const stepLoop = () => {
      if (!state.nn.isTraining) return;
      
      // Run 5 training steps per frame for smooth boundaries progression
      for (let i = 0; i < 5; i++) {
        trainEpoch();
      }

      drawDecisionBoundary();
      drawNetworkGraph();
      updateSimulatorDOMMetrics();
      
      state.nn.animationFrameId = requestAnimationFrame(stepLoop);
    };
    state.nn.animationFrameId = requestAnimationFrame(stepLoop);
  } else {
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      Train Model
    `;
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-secondary');
    
    if (state.nn.animationFrameId) {
      cancelAnimationFrame(state.nn.animationFrameId);
    }
  }
}

// Complete Simulation Pipeline initialization
function initNeuralNetworkSimulator() {
  const pattern = state.nn.dataset;
  
  // 1. Generate local dummy patterns
  state.nn.trainData = generateSimulationData(pattern, 100);
  state.nn.testData = generateSimulationData(pattern, 60);

  // 2. Setup Layer Configuration sliders
  computeArchitecture();
  
  // 3. Initialize layers structures
  initNeuralNetworkWeights();

  // 4. Update view components
  renderNeuronsControllers();
  drawNetworkGraph();
  drawDecisionBoundary();
  evaluatePerformance();
  updateSimulatorDOMMetrics();
}

// ----------------------------------------------------
// DOM EVENT BINDINGS & INIT
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Local storage
  initializeStorage();
  
  // Initialize Admin Mode status from sessionStorage
  if (sessionStorage.getItem('narentech_is_admin') === 'true') {
    state.isAdmin = true;
    document.body.classList.add('admin-mode');
  }
  
  // Initial renders
  renderVideos();
  renderNotesList();
  
  // Select first note by default
  if (state.notes.length > 0) {
    selectNote(state.notes[0].id);
  }

  // 1. Tab switching binds
  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // 2. Video Player close bind
  document.getElementById('modal-video-close').addEventListener('click', closeVideoPlayer);
  document.getElementById('player-modal').addEventListener('click', (e) => {
    if (e.target.id === 'player-modal') closeVideoPlayer();
  });

  // 3. Note Reader Font adjust binds
  document.getElementById('btn-font-inc').addEventListener('click', () => adjustNoteFontSize('increase'));
  document.getElementById('btn-font-dec').addEventListener('click', () => adjustNoteFontSize('decrease'));
  document.getElementById('btn-copy-note').addEventListener('click', copyRawNote);

  // 4. Custom Drag & Drop Zones listeners
  const setupDragZone = (zoneId, inputId, type) => {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());
    
    input.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleDropUpload(type, e.target.files[0]);
      }
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleDropUpload(type, e.dataTransfer.files[0]);
      }
    });
  };

  setupDragZone('video-dropzone', 'video-file-input', 'video');
  setupDragZone('notes-dropzone', 'notes-file-input', 'notes');

  // Manual Trigger Video Upload Button
  document.getElementById('start-upload-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('video-file-input');
    if (fileInput.files.length > 0) {
      handleDropUpload('video', fileInput.files[0]);
    } else {
      // Mock File Upload (If user didn't select any file, we simulate uploading a mock file)
      const mockFile = {
        name: document.getElementById('video-title').value.trim() || 'New Lesson Concept',
        type: 'video/mp4'
      };
      
      // Create a mock local file to ensure uploader runs
      const container = document.getElementById('video-progress-container');
      const percentText = document.getElementById('video-progress-percent');
      const fill = document.getElementById('video-progress-fill');
      const statusText = document.getElementById('video-progress-status');
      
      container.style.display = 'block';
      document.getElementById('start-upload-btn').disabled = true;
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          const title = document.getElementById('video-title').value.trim() || 'Custom Sandbox Tuning';
          const desc = document.getElementById('video-desc').value.trim() || 'Educational tutorial explaining network parameter layers.';
          const duration = document.getElementById('video-duration-input').value.trim() || '08:45';
          
          const newVideo = {
            id: `vid-${Date.now()}`,
            title: title,
            desc: desc,
            duration: duration,
            category: 'Course Module',
            views: '1',
            date: 'Just now',
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' // Public stock MP4
          };

          state.videos.unshift(newVideo);
          localStorage.setItem('narentech_videos', JSON.stringify(state.videos));
          renderVideos();

          statusText.textContent = "Complete!";
          setTimeout(() => {
            container.style.display = 'none';
            document.getElementById('start-upload-btn').disabled = false;
            document.getElementById('video-title').value = '';
            document.getElementById('video-desc').value = '';
            alert(`Success! Simulated Course Video "${title}" added to Hub!`);
          }, 800);
        }
        
        let status = "Simulating raw video block parsing...";
        if (progress > 30) status = "Running transcode filters...";
        if (progress > 60) status = "Packaging for HLS stream...";
        if (progress > 85) status = "Buffering CDN regions...";
        
        percentText.textContent = `${progress}%`;
        fill.style.width = `${progress}%`;
        statusText.textContent = `${status} (${progress}%)`;
      }, 100);
    }
  });

  // 5. Video Hub Search
  document.getElementById('video-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const fullGrid = document.getElementById('full-video-grid');
    if (!fullGrid) return;

    const filtered = state.videos.filter(v => v.title.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
    
    if (filtered.length === 0) {
      fullGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No lessons found matching "${q}"</div>`;
    } else {
      fullGrid.innerHTML = filtered.map(video => `
        <div class="glass-card video-card purple-glow" onclick="playVideo('${video.id}')">
          <div class="video-thumb">
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-play-btn">
              <div class="play-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
            <span class="video-duration">${video.duration}</span>
          </div>
          <div class="video-info">
            <h3 title="${video.title}">${video.title}</h3>
            <p>${video.desc}</p>
            <div class="video-meta">
              <span>${video.category}</span>
              <span>${video.views} views • ${video.date}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  });

  // 6. Notes Hub Search
  document.getElementById('notes-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const listContainer = document.getElementById('notes-list');
    if (!listContainer) return;

    const filtered = state.notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    
    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">No notes found</div>`;
    } else {
      listContainer.innerHTML = filtered.map(note => `
        <div class="notes-item ${state.activeNoteId === note.id ? 'active' : ''}" onclick="selectNote('${note.id}')">
          <div>
            <div class="notes-item-title">${note.title}</div>
            <div class="notes-item-date">by ${note.author}</div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${note.date}</div>
        </div>
      `).join('');
    }
  });

  // 7. Simulator controls bindings
  // Dataset Selectors
  document.querySelectorAll('.dataset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.dataset-btn').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      
      state.nn.dataset = target.getAttribute('data-dataset');
      initNeuralNetworkSimulator();
    });
  });

  // Hidden Layers size selector
  const layersSlider = document.getElementById('slider-hidden-layers');
  if (layersSlider) {
    layersSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      document.getElementById('label-hidden-layers').textContent = val;
      state.nn.hiddenLayers = val;
      
      initNeuralNetworkSimulator();
    });
  }

  // Learning Rate and Activation selector binds
  document.getElementById('select-lr').addEventListener('change', (e) => {
    state.nn.lr = parseFloat(e.target.value);
  });

  document.getElementById('select-activation').addEventListener('change', (e) => {
    state.nn.activation = e.target.value;
    initNeuralNetworkWeights();
    drawNetworkGraph();
    drawDecisionBoundary();
    evaluatePerformance();
    updateSimulatorDOMMetrics();
  });

  // Simulation Operations triggers
  document.getElementById('btn-train-toggle').addEventListener('click', () => toggleTraining());
  
  document.getElementById('btn-train-step').addEventListener('click', () => {
    if (state.nn.isTraining) toggleTraining(false);
    trainEpoch();
    drawDecisionBoundary();
    drawNetworkGraph();
    updateSimulatorDOMMetrics();
  });

  document.getElementById('btn-train-reset').addEventListener('click', () => {
    if (state.nn.isTraining) toggleTraining(false);
    initNeuralNetworkWeights();
    drawDecisionBoundary();
    drawNetworkGraph();
    evaluatePerformance();
    updateSimulatorDOMMetrics();
  });

  // Re-adjust drawings on windows resize to prevent SVG layout clipping
  window.addEventListener('resize', () => {
    if (state.activeTab === 'sandbox-tab') {
      drawNetworkGraph();
    }
  });

  // 8. Chatbot Window Toggle listeners
  const chatTrigger = document.getElementById('chat-trigger');
  const chatClose = document.getElementById('close-chat');
  const chatSend = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');
  const headerChatBtn = document.getElementById('btn-header-chat');

  if (chatTrigger) chatTrigger.addEventListener('click', () => toggleChatbot());
  if (chatClose) chatClose.addEventListener('click', () => toggleChatbot(false));
  if (headerChatBtn) headerChatBtn.addEventListener('click', () => toggleChatbot(true));

  if (chatSend) {
    chatSend.addEventListener('click', () => sendChatMessage());
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }

  // Bind Quick Replies pills clicks
  document.querySelectorAll('.quick-reply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const query = e.currentTarget.getAttribute('data-query');
      sendChatMessage(query);
    });
  });

  // 9. Admin Portal trigger bind
  const adminBtn = document.getElementById('btn-admin-portal');
  if (adminBtn) {
    adminBtn.addEventListener('click', toggleAdminMode);
    updateAdminPortalIcon();
  }
});

// Admin Mode Activation Handler
function toggleAdminMode() {
  if (state.isAdmin) {
    if (confirm("Logout from narenTech-ai Admin Portal? Uploaders and delete buttons will be locked.")) {
      state.isAdmin = false;
      sessionStorage.removeItem('narentech_is_admin');
      document.body.classList.remove('admin-mode');
      updateAdminPortalIcon();
      renderVideos();
      renderNotesList();
      alert("Logged out of Admin Portal.");
    }
  } else {
    const pw = prompt("Enter narenTech-ai Admin Password:");
    if (pw === null) return; // Cancelled
    
    if (pw === 'narentechadmin') {
      state.isAdmin = true;
      sessionStorage.setItem('narentech_is_admin', 'true');
      document.body.classList.add('admin-mode');
      updateAdminPortalIcon();
      renderVideos();
      renderNotesList();
      alert("Access Granted! Admin uploaders and delete tools have been unlocked.");
    } else {
      alert("Access Denied! Incorrect Admin password.");
    }
  }
}

function updateAdminPortalIcon() {
  const adminBtn = document.getElementById('btn-admin-portal');
  if (!adminBtn) return;
  
  if (state.isAdmin) {
    // Unlocked Padlock SVG
    adminBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--status-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px var(--status-success));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
    `;
    adminBtn.style.borderColor = 'var(--status-success)';
    adminBtn.title = "Admin Mode Active (Click to Logout)";
  } else {
    // Locked Padlock SVG
    adminBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    `;
    adminBtn.style.borderColor = '';
    adminBtn.title = "Admin Portal (Click to Unlock)";
  }
}

// ----------------------------------------------------
// CHATBOT WIDGET RUNTIME ENGINE
// ----------------------------------------------------

function toggleChatbot(forceState) {
  const container = document.getElementById('chat-container');
  if (!container) return;
  const isCurrentlyOpen = container.style.display === 'flex';
  const nextOpenState = forceState !== undefined ? forceState : !isCurrentlyOpen;
  
  container.style.display = nextOpenState ? 'flex' : 'none';
  if (nextOpenState) {
    document.getElementById('chat-input').focus();
    // Scroll messages to bottom
    const msgs = document.getElementById('chat-messages');
    msgs.scrollTop = msgs.scrollHeight;
  }
}

function sendChatMessage(text) {
  const query = text || document.getElementById('chat-input').value.trim();
  if (!query) return;

  // Clear input
  document.getElementById('chat-input').value = '';

  // Append user bubble
  appendChatBubble(query, 'user');

  // Show typing indicator
  showChatTypingIndicator();

  // Scroll to bottom
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;

  // Simulate thinking delay and response
  setTimeout(() => {
    removeChatTypingIndicator();
    const reply = getAutonomousResponse(query);
    appendChatBubble(reply, 'bot');
    msgs.scrollTop = msgs.scrollHeight;
  }, 800 + Math.random() * 600);
}

function appendChatBubble(text, sender) {
  const msgs = document.getElementById('chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
  
  if (sender === 'user') {
    bubble.textContent = text;
  } else {
    // Parse basic markdown (bold, links) for the bot responses
    let html = text;
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    bubble.innerHTML = html;
  }
  
  msgs.appendChild(bubble);
}

function showChatTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  const indicator = document.createElement('div');
  indicator.className = 'chat-bubble bot-msg typing-indicator-bubble';
  indicator.id = 'chat-typing-indicator';
  indicator.innerHTML = `
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  msgs.appendChild(indicator);
}

function removeChatTypingIndicator() {
  const indicator = document.getElementById('chat-typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function getAutonomousResponse(query) {
  const q = query.toLowerCase();

  // 1. Backpropagation
  if (q.includes('backprop') || q.includes('back propagation') || q.includes('backward pass') || q.includes('chain rule')) {
    return "💡 **Backpropagation** is the algorithm used to calculate weight gradients. It works by calculating the derivative of the **Loss Function** relative to each weight, starting from the output layer and propagating backwards using the calculus **Chain Rule**. W = W - lr * dL/dW. Check our **Study Notes** tab for a math trace!";
  }

  // 2. XOR problem
  if (q.includes('xor') || q.includes('exclusive or')) {
    return "🧩 The **XOR problem** is a non-linear classification puzzle. A single-layer perceptron (straight line) cannot solve it. To solve XOR, we need at least **one hidden layer** with non-linear activation functions (like Tanh). Try it in our **Neural Sandbox** tab to visualize the curved boundary convergence!";
  }

  // 3. Neural Sandbox / Simulator
  if (q.includes('sandbox') || q.includes('simulator') || q.includes('train') || q.includes('epoch') || q.includes('weight')) {
    return "⚙️ **Neural Sandbox Help:**\n1. Select a dataset (Circle, XOR, Linear).\n2. Add hidden layers using the architecture slider.\n3. Click **Train Model** to run. You'll see lines (synapses) adjust thickness/color: **Cyan** indicates positive weights, **Purple** indicates negative weights. The canvas visualizes the decision boundary!";
  }

  // 4. Activation functions (ReLU, Sigmoid, Tanh)
  if (q.includes('activation') || q.includes('relu') || q.includes('sigmoid') || q.includes('tanh')) {
    return "⚡ **Activation Functions** introduce non-linearity into neurons: \n*   **Tanh:** Outputs [-1, 1]. Great for hidden layers.\n*   **ReLU:** Outputs max(0, x). Solves vanishing gradient problems.\n*   **Sigmoid:** Outputs [0, 1]. Excellent for output layer classification probabilities.";
  }

  // 5. Contact support / WhatsApp / Telegram
  if (q.includes('contact') || q.includes('whatsapp') || q.includes('telegram') || q.includes('phone') || q.includes('number') || q.includes('support') || q.includes('naren')) {
    return "📞 **Official Support Channels:**\n*   **WhatsApp Support:** [+91 92207 48426](https://wa.me/919220748426)\n*   **Telegram Support:** [+91 79832 61889](https://t.me/+917983261889)\n*   **Twitter / X:** [@narendrakumarx](https://x.com/narendrakumarx)\nFeel free to send a message directly to Naren!";
  }

  // 6. Notes / PDF
  if (q.includes('note') || q.includes('pdf') || q.includes('study') || q.includes('markdown') || q.includes('document')) {
    return "📚 Master DL concepts in our **Study Notes** tab! You can read preloaded notes or drag-and-drop your own `.txt` or `.md` files to render them dynamically with formatting, text scaling, and clipboard copying.";
  }

  // 7. YouTube
  if (q.includes('youtube') || q.includes('channel') || q.includes('video') || q.includes('tutorial') || q.includes('sub')) {
    return "🎥 Subscribe to our channel **narenTech-ai** on YouTube for deep-dive tutorials on AI and coding. Click the YouTube link in our footer, or browse our local simulated dashboard catalog under the **Video Hub** tab!";
  }

  // 8. General greetings
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings') || q.includes('welcome') || q.includes('thank')) {
    return "👋 Hello! I am the **narenTech-ai Autonomous AI Assistant**. I can help clarify topics like Backpropagation, ReLU/Tanh activations, the XOR problem, and explain how to use our sandbox simulator. What are you studying today?";
  }

  // Fallbacks
  const fallbacks = [
    "🧠 That's an intriguing AI topic! In Deep Learning, we solve complex boundaries by chaining nodes. Try configuring a multi-layer perceptron in our **Neural Sandbox** to train a classification boundary locally, or check our **Study Notes** for details.",
    "🚀 As an autonomous agent, I recommend checking our **Study Notes** tab for in-depth AI theory, or launching our real-time **Neural Sandbox** visualizer to see backpropagation in action!",
    "💡 Interesting question! For AI implementation questions, you can also chat directly with our team on WhatsApp: [+91 92207 48426](https://wa.me/919220748426) or connect via Telegram: [+91 79832 61889](https://t.me/+917983261889)."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
