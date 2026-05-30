// Design system color schemes for simulations
const COLORS = {
  accentPurple: '#8b5cf6',
  accentCyan: '#06b6d4',
  accentPink: '#ec4899',
  bgCard: '#0f172a',
  textPrimary: '#f3f4f6',
  textMuted: '#6b7280'
};

// Obfuscated contact links to prevent scrapers from harvesting phone numbers
const getWaLink = () => {
  const parts = ["https://", "wa.me", "/91", "922", "074", "8426"];
  return parts.join("");
};

const getTgLink = () => {
  const parts = ["https://", "t.me", "/+", "w4GC", "Deif", "6c5j", "NDFl"];
  return parts.join("");
};

// Global application state
const state = {
  activeTab: 'dashboard-tab',
  videos: [],
  notes: [],
  activeNoteId: null,
  activeVideoUrl: null,
  isAdmin: false, // Security constraint: regular visitors are read-only
  github: {
    repo: '',
    branch: 'main',
    token: '',
    notesPath: 'notes',
    videosPath: 'videos.json',
    syncEnabled: false,
    status: 'disconnected'
  },
  pong: {
    textMode: 0,
    words: ["PROMPTING", "IS ALL YOU NEED"],
    ballSpeedMultiplier: 1.0,
    trackingSpeed: 0.15,
    animationId: null,
    isRunning: false
  },
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

  const ghConfigStr = localStorage.getItem('narentech_github_config');
  if (ghConfigStr) {
    try {
      const parsed = JSON.parse(ghConfigStr);
      state.github = { ...state.github, ...parsed };
    } catch (e) {
      console.error("Failed to parse GitHub config:", e);
    }
  }
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
    initPongSimulator();
  } else {
    stopPongSimulator();
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
  
  if (state.github.repo && state.github.token && state.github.syncEnabled) {
    updateGitHubStatus('syncing');
    commitVideosToGitHub(state.videos)
      .then(() => updateGitHubStatus('connected'))
      .catch(err => {
        console.error("Failed to update videos catalog on GitHub:", err);
        updateGitHubStatus('error');
      });
  }
  
  renderVideos();
}

async function deleteNote(noteId) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  
  const noteToDelete = state.notes.find(n => n.id === noteId);
  state.notes = state.notes.filter(n => n.id !== noteId);
  localStorage.setItem('narentech_notes', JSON.stringify(state.notes));
  
  if (state.github.repo && state.github.token && state.github.syncEnabled && noteToDelete && noteToDelete.id.startsWith('gh-')) {
    updateGitHubStatus('syncing');
    const url = `https://api.github.com/repos/${state.github.repo}/contents/${noteToDelete.path}`;
    try {
      const body = {
        message: `Delete study note "${noteToDelete.title}" via admin portal`,
        sha: noteToDelete.sha,
        branch: state.github.branch
      };
      await gitHubApiRequest(url, 'DELETE', body);
      updateGitHubStatus('connected');
    } catch (err) {
      console.error("Failed to delete note from GitHub:", err);
      updateGitHubStatus('error');
      alert(`Note deleted locally, but failed to delete from GitHub: ${err.message}`);
    }
  }
  
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
    const isCustom = (note.id.startsWith('note-') || note.id.startsWith('gh-')) && note.id !== 'note-1' && note.id !== 'note-2' && note.id !== 'note-3';
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
  
  if (note.content === null || note.content === undefined) {
    readerBody.innerHTML = '<div style="text-align: center; padding: 4rem; color: var(--text-secondary);"><span class="status-dot syncing" style="margin-right: 0.5rem;"></span>Loading note content from GitHub repository...</div>';
    fetchGitHubNoteContent(note)
      .then(content => {
        note.content = content;
        if (state.activeNoteId === noteId) {
          readerBody.innerHTML = parseMarkdown(content);
        }
      })
      .catch(err => {
        readerBody.innerHTML = `<div style="text-align: center; padding: 4rem; color: var(--status-error);">Failed to load note content: ${err.message}</div>`;
      });
  } else {
    readerBody.innerHTML = parseMarkdown(note.content);
  }
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
  const interval = setInterval(async () => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Completion Logic
      let videoSrc = '';
      if (state.github.repo && state.github.token && state.github.syncEnabled) {
        statusText.textContent = "Committing video file to GitHub repository...";
        updateGitHubStatus('syncing');
        try {
          videoSrc = await commitVideoFileToGitHub(file);
        } catch (err) {
          console.error("Failed to commit video file to GitHub, using blob URL:", err);
          videoSrc = URL.createObjectURL(file);
        }
      } else {
        videoSrc = URL.createObjectURL(file);
      }

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

      if (state.github.repo && state.github.token && state.github.syncEnabled) {
        statusText.textContent = "Updating videos catalog on GitHub...";
        try {
          await commitVideosToGitHub(state.videos);
          updateGitHubStatus('connected');
        } catch (err) {
          console.error("Failed to sync videos catalog:", err);
          updateGitHubStatus('error');
          alert(`Video uploaded, but failed to update catalog on GitHub: ${err.message}`);
        }
      }

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
      reader.onload = async (e) => {
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

        if (state.github.repo && state.github.token && state.github.syncEnabled) {
          updateGitHubStatus('syncing');
          try {
            await commitNoteToGitHub(file.name, text);
            await fetchGitHubNotes();
          } catch (err) {
            console.error("Failed to upload note to GitHub:", err);
            updateGitHubStatus('error');
            alert(`Note saved locally, but failed to sync to GitHub: ${err.message}`);
          }
        } else {
          renderNotesList();
          selectNote(newNote.id);
        }
        
        container.style.display = 'none';
      };
      reader.readAsText(file);
    }
    percentText.textContent = `${progress}%`;
    fill.style.width = `${progress}%`;
  }, 80);
}

// ----------------------------------------------------
// PONG TEXT BREAKER INTERACTIVE ENGINE (21ST.DEV)
// ----------------------------------------------------

const PIXEL_MAP = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
};

const PONG_COLOR_BG = "#030712"; // dark theme background
const PONG_COLOR_PADDLE = "#06b6d4"; // glowing teal
const PONG_COLOR_BALL = "#ec4899"; // glowing pink
const PONG_LETTER_SPACING = 1;
const PONG_WORD_SPACING = 3;

// Global Pong variables
let pongCanvas = null;
let pongCtx = null;
let pongPixels = [];
let pongBall = { x: 0, y: 0, dx: 0, dy: 0, radius: 0 };
let pongPaddles = [];
let pongScale = 1.0;

function initPongSimulator() {
  pongCanvas = document.getElementById('pongCanvas');
  if (!pongCanvas) return;
  pongCtx = pongCanvas.getContext('2d');
  if (!pongCtx) return;

  state.pong.isRunning = true;
  
  // Set words in state
  state.pong.words = state.pong.textMode === 0 
    ? ["PROMPTING", "IS ALL YOU NEED"] 
    : ["NARENTECH AI", "IS ALL YOU NEED"];

  resizePongCanvas();
  
  // Start loop
  if (state.pong.animationId) cancelAnimationFrame(state.pong.animationId);
  state.pong.animationId = requestAnimationFrame(pongGameLoop);
}

function stopPongSimulator() {
  state.pong.isRunning = false;
  if (state.pong.animationId) {
    cancelAnimationFrame(state.pong.animationId);
    state.pong.animationId = null;
  }
}

function resizePongCanvas() {
  if (!pongCanvas) return;
  
  const wrap = document.getElementById('pong-canvas-wrap');
  if (wrap.classList.contains('fullscreen-mode')) {
    pongCanvas.width = window.innerWidth;
    pongCanvas.height = window.innerHeight;
  } else {
    // Fits container aspect ratio
    pongCanvas.width = wrap.clientWidth;
    pongCanvas.height = wrap.clientHeight;
  }
  
  pongScale = Math.min(pongCanvas.width / 1000, pongCanvas.height / 560);
  initializePongGame();
}

function initializePongGame() {
  if (!pongCanvas) return;
  
  const scale = pongScale;
  const LARGE_PIXEL_SIZE = 8 * scale;
  const SMALL_PIXEL_SIZE = 4 * scale;
  const BASE_BALL_SPEED = 6 * scale;

  pongPixels = [];
  const words = state.pong.words;

  // Calculate word pixel size
  const calculateWordWidth = (word, pixelSize) => {
    return word.split("").reduce((width, letter) => {
      const letterMap = PIXEL_MAP[letter];
      const actualLetterWidth = letterMap ? letterMap[0].length : 4;
      return width + actualLetterWidth * pixelSize + PONG_LETTER_SPACING * pixelSize;
    }, 0) - PONG_LETTER_SPACING * pixelSize;
  };

  const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE);
  const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
    return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? PONG_WORD_SPACING * SMALL_PIXEL_SIZE : 0);
  }, 0);
  const totalWidth = Math.max(totalWidthLarge, totalWidthSmall);
  
  // Fit text to canvas width bounds
  const scaleFactor = (pongCanvas.width * 0.75) / totalWidth;
  const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
  const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

  const largeTextHeight = 5 * adjustedLargePixelSize;
  const smallTextHeight = 5 * adjustedSmallPixelSize;
  const spaceBetweenLines = 5 * adjustedLargePixelSize;
  const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight;

  let startY = (pongCanvas.height - totalTextHeight) / 2;

  words.forEach((word, wordIndex) => {
    const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize;
    const currentTextWidth = wordIndex === 0
      ? calculateWordWidth(word, adjustedLargePixelSize)
      : words[1].split(" ").reduce((width, w, index) => {
          return width + calculateWordWidth(w, adjustedSmallPixelSize) + (index > 0 ? PONG_WORD_SPACING * adjustedSmallPixelSize : 0);
        }, 0);

    let startX = (pongCanvas.width - currentTextWidth) / 2;

    if (wordIndex === 1) {
      word.split(" ").forEach((subWord) => {
        subWord.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter];
          if (!pixelMap) return;

          for (let i = 0; i < pixelMap.length; i++) {
            for (let j = 0; j < pixelMap[i].length; j++) {
              if (pixelMap[i][j]) {
                const x = startX + j * pixelSize;
                const y = startY + i * pixelSize;
                pongPixels.push({ x, y, size: pixelSize, hit: false, char: letter });
              }
            }
          }
          startX += (pixelMap[0].length + PONG_LETTER_SPACING) * pixelSize;
        });
        startX += PONG_WORD_SPACING * adjustedSmallPixelSize;
      });
    } else {
      word.split("").forEach((letter) => {
        const pixelMap = PIXEL_MAP[letter];
        if (!pixelMap) return;

        for (let i = 0; i < pixelMap.length; i++) {
          for (let j = 0; j < pixelMap[i].length; j++) {
            if (pixelMap[i][j]) {
              const x = startX + j * pixelSize;
              const y = startY + i * pixelSize;
              pongPixels.push({ x, y, size: pixelSize, hit: false, char: letter });
            }
          }
        }
        startX += (pixelMap[0].length + PONG_LETTER_SPACING) * pixelSize;
      });
    }
    startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0;
  });

  // Ball parameters
  const ballStartX = pongCanvas.width * 0.85;
  const ballStartY = pongCanvas.height * 0.15;
  
  pongBall = {
    x: ballStartX,
    y: ballStartY,
    dx: -BASE_BALL_SPEED,
    dy: BASE_BALL_SPEED,
    radius: adjustedLargePixelSize / 1.7,
  };

  const paddleWidth = adjustedLargePixelSize;
  const paddleLength = 9 * adjustedLargePixelSize;

  // 4 Paddles: Left, Right, Top, Bottom
  pongPaddles = [
    {
      x: 0,
      y: pongCanvas.height / 2 - paddleLength / 2,
      width: paddleWidth,
      height: paddleLength,
      targetY: pongCanvas.height / 2 - paddleLength / 2,
      isVertical: true,
    },
    {
      x: pongCanvas.width - paddleWidth,
      y: pongCanvas.height / 2 - paddleLength / 2,
      width: paddleWidth,
      height: paddleLength,
      targetY: pongCanvas.height / 2 - paddleLength / 2,
      isVertical: true,
    },
    {
      x: pongCanvas.width / 2 - paddleLength / 2,
      y: 0,
      width: paddleLength,
      height: paddleWidth,
      targetY: pongCanvas.width / 2 - paddleLength / 2,
      isVertical: false,
    },
    {
      x: pongCanvas.width / 2 - paddleLength / 2,
      y: pongCanvas.height - paddleWidth,
      width: paddleLength,
      height: paddleWidth,
      targetY: pongCanvas.width / 2 - paddleLength / 2,
      isVertical: false,
    },
  ];
}

function updatePongGame() {
  if (!pongCanvas) return;

  const ball = pongBall;
  const paddles = pongPaddles;
  const speedMult = state.pong.ballSpeedMultiplier;

  // Move ball
  ball.x += ball.dx * speedMult;
  ball.y += ball.dy * speedMult;

  // Keep inside screen borders (fail-safe)
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.dy = -ball.dy;
  }
  if (ball.y + ball.radius > pongCanvas.height) {
    ball.y = pongCanvas.height - ball.radius;
    ball.dy = -ball.dy;
  }
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.dx = -ball.dx;
  }
  if (ball.x + ball.radius > pongCanvas.width) {
    ball.x = pongCanvas.width - ball.radius;
    ball.dx = -ball.dx;
  }

  // Intercept paddles collision
  paddles.forEach((paddle) => {
    if (paddle.isVertical) {
      if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
      ) {
        ball.dx = -ball.dx;
        // prevent clipping
        if (paddle.x === 0) {
          ball.x = paddle.x + paddle.width + ball.radius;
        } else {
          ball.x = paddle.x - ball.radius;
        }
      }
    } else {
      if (
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy = -ball.dy;
        // prevent clipping
        if (paddle.y === 0) {
          ball.y = paddle.y + paddle.height + ball.radius;
        } else {
          ball.y = paddle.y - ball.radius;
        }
      }
    }
  });

  // AI agent movement (ease tracking of the ball)
  paddles.forEach((paddle) => {
    if (paddle.isVertical) {
      paddle.targetY = ball.y - paddle.height / 2;
      paddle.targetY = Math.max(0, Math.min(pongCanvas.height - paddle.height, paddle.targetY));
      paddle.y += (paddle.targetY - paddle.y) * state.pong.trackingSpeed;
    } else {
      paddle.targetY = ball.x - paddle.width / 2;
      paddle.targetY = Math.max(0, Math.min(pongCanvas.width - paddle.width, paddle.targetY));
      paddle.x += (paddle.targetY - paddle.x) * state.pong.trackingSpeed;
    }
  });

  // Text pixels collision breaking
  pongPixels.forEach((pixel) => {
    if (
      !pixel.hit &&
      ball.x + ball.radius > pixel.x &&
      ball.x - ball.radius < pixel.x + pixel.size &&
      ball.y + ball.radius > pixel.y &&
      ball.y - ball.radius < pixel.y + pixel.size
    ) {
      pixel.hit = true;
      const centerX = pixel.x + pixel.size / 2;
      const centerY = pixel.y + pixel.size / 2;
      
      // Reflect ball velocity vector
      if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
        ball.dx = -ball.dx;
      } else {
        ball.dy = -ball.dy;
      }
    }
  });
}

function drawPongGame() {
  if (!pongCtx || !pongCanvas) return;

  const isLight = document.body.classList.contains('light-mode');
  const colorBg = isLight ? "#f8fafc" : "#030712";
  const colorGrid = isLight ? "rgba(15, 23, 42, 0.02)" : "rgba(255, 255, 255, 0.015)";
  const colorBall = isLight ? "#be185d" : "#ec4899";
  const colorPaddle = isLight ? "#0e7490" : "#06b6d4";

  // Fill canvas theme background
  pongCtx.fillStyle = colorBg;
  pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

  // Draw grid background overlay
  pongCtx.strokeStyle = colorGrid;
  pongCtx.lineWidth = 1;
  const cellSize = 30;
  for (let x = 0; x < pongCanvas.width; x += cellSize) {
    pongCtx.beginPath();
    pongCtx.moveTo(x, 0);
    pongCtx.lineTo(x, pongCanvas.height);
    pongCtx.stroke();
  }
  for (let y = 0; y < pongCanvas.height; y += cellSize) {
    pongCtx.beginPath();
    pongCtx.moveTo(0, y);
    pongCtx.lineTo(pongCanvas.width, y);
    pongCtx.stroke();
  }

  // Draw text pixels: gradient color for unhit, light gray/dark slate for hit
  pongPixels.forEach((pixel) => {
    if (pixel.hit) {
      pongCtx.fillStyle = isLight ? "#cbd5e1" : "#1e293b";
    } else {
      const yRel = pixel.y / pongCanvas.height;
      if (yRel < 0.45) {
        pongCtx.fillStyle = isLight ? "#6d28d9" : COLORS.accentPurple;
      } else if (yRel < 0.65) {
        pongCtx.fillStyle = isLight ? "#be185d" : COLORS.accentPink;
      } else {
        pongCtx.fillStyle = isLight ? "#0e7490" : COLORS.accentCyan;
      }
    }
    pongCtx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
  });

  // Draw ball (vibrant accent with shadow glow)
  pongCtx.shadowColor = colorBall;
  pongCtx.shadowBlur = isLight ? 4 : 10;
  pongCtx.fillStyle = colorBall;
  pongCtx.beginPath();
  pongCtx.arc(pongBall.x, pongBall.y, pongBall.radius, 0, Math.PI * 2);
  pongCtx.fill();
  pongCtx.shadowBlur = 0; // reset shadow

  // Draw paddles (vibrant accent with shadow glow)
  pongCtx.shadowColor = colorPaddle;
  pongCtx.shadowBlur = isLight ? 4 : 8;
  pongCtx.fillStyle = colorPaddle;
  pongPaddles.forEach((paddle) => {
    pongCtx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  });
  pongCtx.shadowBlur = 0; // reset shadow
}

function pongGameLoop() {
  if (!state.pong.isRunning) return;

  updatePongGame();
  drawPongGame();
  
  state.pong.animationId = requestAnimationFrame(pongGameLoop);
}

function enterFullscreenMode() {
  const wrap = document.getElementById('pong-canvas-wrap');
  if (!wrap) return;

  if (wrap.requestFullscreen) {
    wrap.requestFullscreen().catch(err => {
      manuallyToggleFullscreen(true);
    });
  } else if (wrap.webkitRequestFullscreen) {
    wrap.webkitRequestFullscreen();
  } else if (wrap.msRequestFullscreen) {
    wrap.msRequestFullscreen();
  } else {
    manuallyToggleFullscreen(true);
  }
}

function exitFullscreenMode() {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.log(err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    manuallyToggleFullscreen(false);
  }
}

function manuallyToggleFullscreen(activate) {
  const wrap = document.getElementById('pong-canvas-wrap');
  const badge = document.getElementById('fullscreen-exit-badge');
  const exitBtn = document.getElementById('btn-exit-fullscreen');
  if (!wrap) return;

  if (activate) {
    wrap.classList.add('fullscreen-mode');
    if (badge) badge.style.display = 'block';
    if (exitBtn) exitBtn.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } else {
    wrap.classList.remove('fullscreen-mode');
    if (badge) badge.style.display = 'none';
    if (exitBtn) exitBtn.style.display = 'none';
    document.body.style.overflow = '';
  }
  resizePongCanvas();
}

function handleFullscreenChange() {
  const wrap = document.getElementById('pong-canvas-wrap');
  const badge = document.getElementById('fullscreen-exit-badge');
  const exitBtn = document.getElementById('btn-exit-fullscreen');
  if (!wrap) return;

  const isCurrentlyFullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  if (isCurrentlyFullscreen) {
    wrap.classList.add('fullscreen-mode');
    if (badge) badge.style.display = 'block';
    if (exitBtn) exitBtn.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } else {
    wrap.classList.remove('fullscreen-mode');
    if (badge) badge.style.display = 'none';
    if (exitBtn) exitBtn.style.display = 'none';
    document.body.style.overflow = '';
  }
  resizePongCanvas();
}

// Bind native fullscreen change listeners
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

// ----------------------------------------------------
// GITHUB INTEGRATION ENGINE
// ----------------------------------------------------

const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
const fromBase64 = (str) => decodeURIComponent(escape(atob(str)));

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

// Generic request to GitHub API
async function gitHubApiRequest(url, method = 'GET', body = null) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  if (state.github.token) {
    headers['Authorization'] = `token ${state.github.token}`;
  }
  
  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || `GitHub API error: ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return response.json();
}

// Fetch notes list from GitHub
async function fetchGitHubNotes() {
  if (!state.github.repo) return;
  const url = `https://api.github.com/repos/${state.github.repo}/contents/${state.github.notesPath}?ref=${state.github.branch}`;
  try {
    const data = await gitHubApiRequest(url);
    if (Array.isArray(data)) {
      const notes = data
        .filter(f => f.type === 'file' && (f.name.endsWith('.md') || f.name.endsWith('.txt')))
        .map(f => ({
          id: `gh-${f.sha}`,
          title: f.name,
          date: 'Synced',
          author: state.github.repo.split('/')[0],
          content: null, // lazy load
          path: f.path,
          sha: f.sha
        }));
      state.notes = notes;
      renderNotesList();
      if (notes.length > 0 && !state.activeNoteId) {
        selectNote(notes[0].id);
      }
      updateGitHubStatus('connected');
    }
  } catch (e) {
    console.error("Error fetching notes from GitHub:", e);
    updateGitHubStatus('error');
    throw e;
  }
}

// Fetch content for a specific lazy-loaded note
async function fetchGitHubNoteContent(note) {
  const url = `https://api.github.com/repos/${state.github.repo}/contents/${note.path}?ref=${state.github.branch}`;
  const data = await gitHubApiRequest(url);
  const content = fromBase64(data.content.replace(/\s/g, ''));
  return content;
}

// Fetch videos array from GitHub videos.json
async function fetchGitHubVideos() {
  if (!state.github.repo) return;
  const url = `https://api.github.com/repos/${state.github.repo}/contents/${state.github.videosPath}?ref=${state.github.branch}`;
  try {
    const data = await gitHubApiRequest(url);
    const content = fromBase64(data.content.replace(/\s/g, ''));
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      state.videos = parsed;
      renderVideos();
      updateGitHubStatus('connected');
    } else {
      throw new Error("videos.json is not a valid JSON array");
    }
  } catch (e) {
    if (e.status === 404 && state.github.token) {
      // videos.json does not exist yet. Initialize it on GitHub!
      console.log("videos.json not found. Initializing repository with default content...");
      await commitVideosToGitHub(DEFAULT_VIDEOS);
      state.videos = DEFAULT_VIDEOS;
      renderVideos();
      updateGitHubStatus('connected');
    } else {
      console.error("Error fetching videos from GitHub:", e);
      updateGitHubStatus('error');
      throw e;
    }
  }
}

// Commit full videos list back to GitHub videos.json
async function commitVideosToGitHub(videosArray) {
  if (!state.github.repo) throw new Error("No repository configured.");
  const url = `https://api.github.com/repos/${state.github.repo}/contents/${state.github.videosPath}`;
  
  // Need to get SHA first if updating
  let sha = null;
  try {
    const data = await gitHubApiRequest(`${url}?ref=${state.github.branch}`);
    sha = data.sha;
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  
  const contentStr = JSON.stringify(videosArray, null, 2);
  const body = {
    message: "Sync videos catalog via admin portal",
    content: toBase64(contentStr),
    branch: state.github.branch
  };
  if (sha) body.sha = sha;
  
  await gitHubApiRequest(url, 'PUT', body);
}

// Push a single new note file to GitHub notes/
async function commitNoteToGitHub(title, content) {
  if (!state.github.repo) throw new Error("No repository configured.");
  const url = `https://api.github.com/repos/${state.github.repo}/contents/${state.github.notesPath}/${encodeURIComponent(title)}`;
  
  let sha = null;
  try {
    const data = await gitHubApiRequest(`${url}?ref=${state.github.branch}`);
    sha = data.sha;
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  
  const body = {
    message: `Upload study note "${title}" via admin portal`,
    content: toBase64(content),
    branch: state.github.branch
  };
  if (sha) body.sha = sha;
  
  await gitHubApiRequest(url, 'PUT', body);
}

// Push a raw video file to GitHub videos/ and return raw source URL
async function commitVideoFileToGitHub(file) {
  if (!state.github.repo) throw new Error("No repository configured.");
  const folder = 'videos';
  const url = `https://api.github.com/repos/${state.github.repo}/contents/${folder}/${encodeURIComponent(file.name)}`;
  
  let sha = null;
  try {
    const data = await gitHubApiRequest(`${url}?ref=${state.github.branch}`);
    sha = data.sha;
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  
  const b64 = await fileToBase64(file);
  const body = {
    message: `Upload video file "${file.name}" via admin portal`,
    content: b64,
    branch: state.github.branch
  };
  if (sha) body.sha = sha;
  
  const result = await gitHubApiRequest(url, 'PUT', body);
  // Return raw source URL
  return `https://raw.githubusercontent.com/${state.github.repo}/${state.github.branch}/${folder}/${encodeURIComponent(file.name)}`;
}

// Sync GitHub state to UI
function updateGitHubStatus(status) {
  state.github.status = status;
  
  const elements = [
    { dot: 'video-gh-status-dot', text: 'video-gh-status-text' },
    { dot: 'notes-gh-status-dot', text: 'notes-gh-status-text' }
  ];
  
  let statusText = 'GitHub Sync Off';
  let dotClass = '';
  
  if (state.github.repo) {
    if (status === 'connected') {
      statusText = 'GitHub Synced';
      dotClass = 'connected';
    } else if (status === 'error') {
      statusText = 'GitHub Error';
      dotClass = 'error';
    } else if (status === 'syncing') {
      statusText = 'GitHub Syncing...';
      dotClass = 'syncing';
    } else {
      statusText = 'GitHub Configured';
      dotClass = '';
    }
  }
  
  elements.forEach(el => {
    const dot = document.getElementById(el.dot);
    const txt = document.getElementById(el.text);
    if (dot) {
      dot.className = `status-dot ${dotClass}`;
    }
    if (txt) {
      txt.textContent = statusText;
    }
  });
}

// Open / Close GitHub Settings Modal
function toggleGitHubSettingsModal(open) {
  const modal = document.getElementById('github-settings-modal');
  if (!modal) return;
  modal.style.display = open ? 'flex' : 'none';
  if (open) {
    // Populate form inputs from state
    document.getElementById('gh-repo').value = state.github.repo || '';
    document.getElementById('gh-branch').value = state.github.branch || 'main';
    document.getElementById('gh-token').value = state.github.token || '';
    document.getElementById('gh-notes-path').value = state.github.notesPath || 'notes';
    document.getElementById('gh-videos-path').value = state.github.videosPath || 'videos.json';
    document.getElementById('gh-sync-enabled').checked = state.github.syncEnabled;
    
    const msg = document.getElementById('gh-status-message');
    if (msg) msg.style.display = 'none';
  }
}

// Sync Notes and Videos from GitHub
async function triggerGitHubSync() {
  if (!state.github.repo) {
    updateGitHubStatus('disconnected');
    return;
  }
  updateGitHubStatus('syncing');
  try {
    await Promise.all([
      fetchGitHubNotes(),
      fetchGitHubVideos()
    ]);
    updateGitHubStatus('connected');
  } catch (err) {
    console.error("Sync error:", err);
    updateGitHubStatus('error');
    throw err;
  }
}

// ----------------------------------------------------
// DOM EVENT BINDINGS & INIT
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Local storage
  initializeStorage();
  
  // Initialize Theme preference
  const savedTheme = localStorage.getItem('narentech_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThemeToggleIcon(true);
  } else {
    document.body.classList.remove('light-mode');
    updateThemeToggleIcon(false);
  }
  
  // Set dynamic contact links & texts to hide raw numbers from source code
  document.querySelectorAll('.wa-dynamic-link').forEach(el => {
    el.href = getWaLink();
  });
  document.querySelectorAll('.tg-dynamic-link').forEach(el => {
    el.href = getTgLink();
  });
  document.querySelectorAll('.wa-dynamic-text').forEach(el => {
    el.textContent = "Chat Support";
  });
  document.querySelectorAll('.tg-dynamic-text').forEach(el => {
    el.textContent = "Join Channel";
  });
  
  // Initialize Admin Mode status from sessionStorage
  if (sessionStorage.getItem('narentech_is_admin') === 'true') {
    state.isAdmin = true;
    document.body.classList.add('admin-mode');
  }
  
  // Sync GitHub status dot on load
  updateGitHubStatus(state.github.status);
  
  // Initial renders
  renderVideos();
  renderNotesList();
  
  // Select first note by default
  if (state.notes.length > 0) {
    selectNote(state.notes[0].id);
  }

  // Trigger sync if enabled
  if (state.github.repo && state.github.syncEnabled) {
    triggerGitHubSync()
      .then(() => console.log("Initial GitHub sync successful."))
      .catch(err => console.error("Initial GitHub sync failed:", err));
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
    const urlInput = document.getElementById('video-url-input');
    const title = document.getElementById('video-title').value.trim();
    const desc = document.getElementById('video-desc').value.trim();
    const duration = document.getElementById('video-duration-input').value.trim();

    if (fileInput.files.length > 0) {
      handleDropUpload('video', fileInput.files[0]);
    } else if (urlInput && urlInput.value.trim() !== '') {
      // Direct external video URL logic
      const vUrl = urlInput.value.trim();
      const vTitle = title || 'Custom Course Module';
      const vDesc = desc || 'Video tutorial loaded from custom link.';
      const vDur = duration || '05:00';
      
      const newVideo = {
        id: `vid-${Date.now()}`,
        title: vTitle,
        desc: vDesc,
        duration: vDur,
        category: 'Course Link',
        views: '1',
        date: 'Just now',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
        src: vUrl
      };

      state.videos.unshift(newVideo);
      localStorage.setItem('narentech_videos', JSON.stringify(state.videos));

      if (state.github.repo && state.github.token && state.github.syncEnabled) {
        updateGitHubStatus('syncing');
        commitVideosToGitHub(state.videos)
          .then(() => {
            updateGitHubStatus('connected');
            alert(`Success! Video "${vTitle}" synced directly to GitHub catalog.`);
          })
          .catch(err => {
            console.error("Failed to commit videos catalog:", err);
            updateGitHubStatus('error');
            alert(`Video added locally, but failed to sync to GitHub: ${err.message}`);
          });
      } else {
        alert(`Success! Video "${vTitle}" added locally.`);
      }

      renderVideos();
      if (urlInput) urlInput.value = '';
      document.getElementById('video-title').value = '';
      document.getElementById('video-desc').value = '';
    } else {
      // Mock File Upload (If user didn't select any file, we simulate uploading a mock file)
      const mockFile = {
        name: title || 'New Lesson Concept',
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
      const interval = setInterval(async () => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          const vTitle = title || 'Custom Sandbox Tuning';
          const vDesc = desc || 'Educational tutorial explaining network parameter layers.';
          const vDur = duration || '08:45';
          
          const newVideo = {
            id: `vid-${Date.now()}`,
            title: vTitle,
            desc: vDesc,
            duration: vDur,
            category: 'Course Module',
            views: '1',
            date: 'Just now',
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' // Public stock MP4
          };

          state.videos.unshift(newVideo);
          localStorage.setItem('narentech_videos', JSON.stringify(state.videos));

          if (state.github.repo && state.github.token && state.github.syncEnabled) {
            updateGitHubStatus('syncing');
            try {
              await commitVideosToGitHub(state.videos);
              updateGitHubStatus('connected');
            } catch (err) {
              console.error("Failed to commit videos catalog:", err);
              updateGitHubStatus('error');
            }
          }

          renderVideos();

          statusText.textContent = "Complete!";
          setTimeout(() => {
            container.style.display = 'none';
            document.getElementById('start-upload-btn').disabled = false;
            document.getElementById('video-title').value = '';
            document.getElementById('video-desc').value = '';
            alert(`Success! Simulated Course Video "${vTitle}" added to Hub!`);
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

  // 7. Pong Simulator controls bindings
  const btnPongReset = document.getElementById('btn-pong-reset');
  if (btnPongReset) {
    btnPongReset.addEventListener('click', () => {
      initializePongGame();
    });
  }

  const btnPongText = document.getElementById('btn-pong-text');
  if (btnPongText) {
    btnPongText.addEventListener('click', () => {
      state.pong.textMode = state.pong.textMode === 0 ? 1 : 0;
      state.pong.words = state.pong.textMode === 0 
        ? ["PROMPTING", "IS ALL YOU NEED"] 
        : ["NARENTECH AI", "IS ALL YOU NEED"];
      initializePongGame();
    });
  }

  const btnPongFullscreen = document.getElementById('btn-pong-fullscreen');
  if (btnPongFullscreen) {
    btnPongFullscreen.addEventListener('click', () => {
      enterFullscreenMode();
    });
  }

  const btnExitFullscreen = document.getElementById('btn-exit-fullscreen');
  if (btnExitFullscreen) {
    btnExitFullscreen.addEventListener('click', () => {
      exitFullscreenMode();
    });
  }

  // Kids Arcade Fullscreen Controls
  const btnArcadeFullscreen = document.getElementById('btn-arcade-fullscreen');
  if (btnArcadeFullscreen) {
    btnArcadeFullscreen.addEventListener('click', () => {
      const container = document.getElementById('kids-arcade-container');
      if (!container) return;
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    });
  }

  const btnExitArcadeFullscreen = document.getElementById('btn-exit-arcade-fullscreen');
  if (btnExitArcadeFullscreen) {
    btnExitArcadeFullscreen.addEventListener('click', () => {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.log(err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    });
  }

  const handleArcadeFullscreenChange = () => {
    const container = document.getElementById('kids-arcade-container');
    const exitBtn = document.getElementById('btn-exit-arcade-fullscreen');
    if (!container) return;

    const isFullscreen = !!(
      document.fullscreenElement === container ||
      document.webkitFullscreenElement === container ||
      document.mozFullScreenElement === container ||
      document.msFullscreenElement === container
    );

    if (isFullscreen) {
      container.classList.add('fullscreen-mode');
      if (exitBtn) exitBtn.style.display = 'block';
      document.body.style.overflow = 'hidden';
    } else {
      container.classList.remove('fullscreen-mode');
      if (exitBtn) exitBtn.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('fullscreenchange', handleArcadeFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleArcadeFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleArcadeFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleArcadeFullscreenChange);

  // Handle ESC key to exit fullscreen mode
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const wrap = document.getElementById('pong-canvas-wrap');
      if (wrap && wrap.classList.contains('fullscreen-mode')) {
        exitFullscreenMode();
      }
      const arcadeContainer = document.getElementById('kids-arcade-container');
      if (arcadeContainer && arcadeContainer.classList.contains('fullscreen-mode')) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => console.log(err));
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  });

  const sliderPongSpeed = document.getElementById('slider-pong-speed');
  if (sliderPongSpeed) {
    sliderPongSpeed.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.pong.ballSpeedMultiplier = val;
      const speedStr = val.toFixed(1) + 'x';
      const lbl = document.getElementById('lbl-pong-speed');
      if (lbl) lbl.textContent = speedStr;
      const badge = document.getElementById('val-badge-speed');
      if (badge) badge.textContent = speedStr;
    });
  }

  const sliderPongTracking = document.getElementById('slider-pong-tracking');
  if (sliderPongTracking) {
    sliderPongTracking.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.pong.trackingSpeed = val;
      
      let speedDesc = 'Medium';
      if (val < 0.10) {
        speedDesc = 'Slow';
      } else if (val > 0.20) {
        speedDesc = 'Fast';
      }
      const pct = Math.round((val - 0.05) / 0.25 * 100);
      const lbl = document.getElementById('lbl-pong-tracking');
      if (lbl) lbl.textContent = `${speedDesc} (${pct}%)`;
    });
  }

  // Re-adjust drawings on windows resize to prevent simulation aspect layout issues
  window.addEventListener('resize', () => {
    if (state.activeTab === 'sandbox-tab') {
      resizePongCanvas();
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

  // Theme Toggle bind
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      localStorage.setItem('narentech_theme', isLight ? 'light' : 'dark');
      updateThemeToggleIcon(isLight);
      
      // If Pong simulator is running, redraw it instantly with new theme colors
      if (state.pong.isRunning) {
        drawPongGame();
      }
    });
  }

  // 10. GitHub Settings Modal Event Bindings
  const btnVideoGh = document.getElementById('btn-video-gh-config');
  const btnNotesGh = document.getElementById('btn-notes-gh-config');
  const btnGhClose = document.getElementById('github-settings-close');
  const btnGhSave = document.getElementById('btn-gh-save');
  const btnGhTest = document.getElementById('btn-gh-test');

  if (btnVideoGh) btnVideoGh.addEventListener('click', () => toggleGitHubSettingsModal(true));
  if (btnNotesGh) btnNotesGh.addEventListener('click', () => toggleGitHubSettingsModal(true));
  if (btnGhClose) btnGhClose.addEventListener('click', () => toggleGitHubSettingsModal(false));

  const githubModalElement = document.getElementById('github-settings-modal');
  if (githubModalElement) {
    githubModalElement.addEventListener('click', (e) => {
      if (e.target.id === 'github-settings-modal') toggleGitHubSettingsModal(false);
    });
  }

  if (btnGhSave) {
    btnGhSave.addEventListener('click', () => {
      const repo = document.getElementById('gh-repo').value.trim();
      const branch = document.getElementById('gh-branch').value.trim() || 'main';
      const token = document.getElementById('gh-token').value.trim();
      const notesPath = document.getElementById('gh-notes-path').value.trim() || 'notes';
      const videosPath = document.getElementById('gh-videos-path').value.trim() || 'videos.json';
      const syncEnabled = document.getElementById('gh-sync-enabled').checked;

      state.github = {
        repo,
        branch,
        token,
        notesPath,
        videosPath,
        syncEnabled,
        status: repo ? 'connected' : 'disconnected'
      };

      localStorage.setItem('narentech_github_config', JSON.stringify(state.github));
      updateGitHubStatus(state.github.status);
      toggleGitHubSettingsModal(false);
      alert("GitHub settings saved successfully!");

      if (repo && syncEnabled) {
        triggerGitHubSync()
          .then(() => alert("Successfully synced with GitHub repository!"))
          .catch(err => alert(`Failed to sync with repository: ${err.message}`));
      }
    });
  }

  if (btnGhTest) {
    btnGhTest.addEventListener('click', async () => {
      const repo = document.getElementById('gh-repo').value.trim();
      const branch = document.getElementById('gh-branch').value.trim() || 'main';
      const token = document.getElementById('gh-token').value.trim();
      const notesPath = document.getElementById('gh-notes-path').value.trim() || 'notes';
      const videosPath = document.getElementById('gh-videos-path').value.trim() || 'videos.json';
      const syncEnabled = document.getElementById('gh-sync-enabled').checked;

      if (!repo) {
        alert("Please specify a repository name (owner/repo).");
        return;
      }

      const statusMsg = document.getElementById('gh-status-message');
      if (statusMsg) {
        statusMsg.className = 'info';
        statusMsg.textContent = "Connecting to GitHub & loading metadata...";
        statusMsg.style.display = 'block';
      }

      const originalGh = { ...state.github };
      state.github = { repo, branch, token, notesPath, videosPath, syncEnabled, status: 'syncing' };

      try {
        await triggerGitHubSync();
        if (statusMsg) {
          statusMsg.className = 'success';
          statusMsg.textContent = "Connection successful! Study notes and videos list loaded.";
        }
      } catch (err) {
        state.github = originalGh;
        updateGitHubStatus(state.github.status);
        if (statusMsg) {
          statusMsg.className = 'error';
          statusMsg.textContent = `Connection failed: ${err.message}`;
        }
      }
    });
  }

  // 11. Admin Login Modal Bindings
  const loginClose = document.getElementById('admin-login-close');
  if (loginClose) loginClose.addEventListener('click', closeAdminLoginModal);
  
  const loginModal = document.getElementById('admin-login-modal');
  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target.id === 'admin-login-modal') closeAdminLoginModal();
    });
  }

  const loginSubmit = document.getElementById('btn-admin-login-submit');
  const loginInput = document.getElementById('admin-password-input');
  
  const submitAdminLogin = () => {
    const pw = loginInput.value;
    if (pw === 'Naren4035#') {
      state.isAdmin = true;
      sessionStorage.setItem('narentech_is_admin', 'true');
      document.body.classList.add('admin-mode');
      updateAdminPortalIcon();
      renderVideos();
      renderNotesList();
      closeAdminLoginModal();
      alert("Access Granted! Admin uploaders and delete tools have been unlocked.");
    } else {
      const err = document.getElementById('admin-login-error');
      if (err) {
        err.style.display = 'block';
        setTimeout(() => {
          err.style.display = 'none';
        }, 3000);
      }
    }
  };

  if (loginSubmit) loginSubmit.addEventListener('click', submitAdminLogin);
  if (loginInput) {
    loginInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        submitAdminLogin();
      }
    });
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
    openAdminLoginModal();
  }
}

function openAdminLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  const input = document.getElementById('admin-password-input');
  const err = document.getElementById('admin-login-error');
  if (!modal) return;
  
  if (input) input.value = '';
  if (err) err.style.display = 'none';
  
  modal.style.display = 'flex';
  setTimeout(() => { if (input) input.focus(); }, 100);
}

function closeAdminLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.style.display = 'none';
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

  // 1. What is an AI Agent?
  if (q.includes('agent') || q.includes('basic agent') || q.includes('autonomous agent')) {
    return "🤖 An **AI Agent** is an autonomous software entity that observes its environment (perceives), makes decisions, and performs actions to achieve specific goals. In our **AI Simulator**, the four paddles are basic AI agents—they track the ball's coordinate in real-time and position themselves dynamically to keep the ball in play without human intervention.";
  }

  // 2. Prompt Engineering / General Prompts Knowledge for Beginners
  if (q.includes('prompt') || q.includes('engineering') || q.includes('tips') || q.includes('beginner') || q.includes('knowledge')) {
    return "💡 **Prompt Engineering for Beginners:**\n1. **Be Specific**: Clearly state the task, context, and constraints.\n2. **Assign a Role**: Start with 'You are an expert copywriter...' to set the persona.\n3. **Provide Examples (Few-Shot)**: Show the AI a few examples of desired input and output.\n4. **Format the Output**: Ask for bullet points, JSON, or markdown tables.\n*Remember*: **Prompting is all you need** to tap into the power of large language models!";
  }

  // 3. Pong AI Simulator / New Simulator Page
  if (q.includes('sandbox') || q.includes('simulator') || q.includes('pong') || q.includes('play') || q.includes('game') || q.includes('phrase') || q.includes('text')) {
    return "🎮 **New AI Simulator Page Help:**\n* It is a collision physics sandbox where four AI paddle agents track the ball dynamically to break text pixels.\n* You can adjust **Simulation Ball Speed** and **AI Paddle Tracking Speed** using the sliders.\n* Click **Toggle Phrase** to switch phrases or **Reset Simulation** to clear the grid.\n* Try clicking **Go Fullscreen** for an immersive, distraction-free view!";
  }

  // 4. Contact support / WhatsApp / Telegram
  if (q.includes('contact') || q.includes('whatsapp') || q.includes('telegram') || q.includes('phone') || q.includes('number') || q.includes('support') || q.includes('naren')) {
    return `📞 **Official Support Channels:**\n*   **WhatsApp Support:** [Open Chat](${getWaLink()})\n*   **Telegram Support:** [Open Chat](${getTgLink()})\n*   **Twitter / X:** [@narendrakumarx](https://x.com/narendrakumarx)\nFeel free to send a message directly to Naren!`;
  }

  // 5. Notes / PDF
  if (q.includes('note') || q.includes('pdf') || q.includes('study') || q.includes('markdown') || q.includes('document')) {
    return "📚 Learn AI fundamentals in our **Study Notes** tab! Read notes on AI foundations or drag-and-drop your own `.txt` or `.md` files to read them with format parsing and text resizing.";
  }

  // 6. YouTube
  if (q.includes('youtube') || q.includes('channel') || q.includes('video') || q.includes('tutorial') || q.includes('sub')) {
    return "🎥 Subscribe to our YouTube channel **narenTech-ai** for video courses on AI, Machine Learning, and programming. Check out tutorials right under the **Video Hub** tab!";
  }

  // 7. General greetings
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings') || q.includes('welcome') || q.includes('thank')) {
    return "👋 Hello! I am the **narenTech-ai Autonomous AI Assistant**. I can help you learn about **AI Agents**, **Prompt Engineering for Beginners**, use our **Pong AI Simulator**, or connect with Naren. What are you studying today?";
  }

  // Fallbacks
  const fallbacks = [
    "🧠 That's an intriguing AI topic! I recommend checking our **Study Notes** tab to read up on basic AI concepts, or launching our **AI Simulator** to watch autonomous paddle agents react in real-time.",
    "🚀 Want to learn more? Check out our **Study Notes** on AI architecture, or ask me about **Prompt Engineering tips for beginners**!",
    `💡 For direct help or inquiries, feel free to contact Naren on [WhatsApp](${getWaLink()}) or [Telegram](${getTgLink()}).`
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function updateThemeToggleIcon(isLight) {
  const btn = document.getElementById('btn-theme-toggle');
  if (!btn) return;
  if (isLight) {
    // Moon Icon SVG
    btn.innerHTML = `
      <svg id="theme-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    `;
    btn.title = "Switch to Dark Mode";
  } else {
    // Sun Icon SVG
    btn.innerHTML = `
      <svg id="theme-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.22" x2="5.64" y2="17.78"></line><line x1="18.36" y1="5.64" x2="19.78" y2="7.07"></line></svg>
    `;
    btn.title = "Switch to Light Mode";
  }
}
