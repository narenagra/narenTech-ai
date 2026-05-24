# narenTech-ai Educational Platform

A modern, highly interactive, dark-themed educational web application and interactive AI hub for **narenTech-ai**. Built entirely with vanilla HTML5, CSS3, and JavaScript, it is 100% client-side, lightweight, and fully optimized for hosting directly on **GitHub Pages**.

---

## 🌟 Key Features

1. **Dashboard Overview & Stats:**
   - Visual summary card for the YouTuber channel `narenTech-ai`.
   - Real-time simulated channel counters for subscribers, total views, active sandbox runs, and study note catalogs.
   - Dynamic grid-patterned animated background and radial glowing points.

2. **Simulated Video Hub & Custom Player:**
   - Complete video lesson repository.
   - Interactive drag-and-drop video uploader simulator showing file analysis, HLS packaging, and uploading speeds.
   - **Local Playback Integration:** Drag in a real video file, and it is converted to an object URL so you can play it live inside the styled custom video modal.
   - Real-time catalog search.

3. **Text & Markdown Notes Reader:**
   - Built-in reader supporting distraction-free study mode.
   - Text document uploader: Drag and drop `.txt` or `.md` files to immediately parse and list them in the note sidebar.
   - Lightweight custom markdown parser converting hashes (`#`), bold elements (`**`), blockquotes (`>`), lists, and code sections into high-end typographies.
   - Reader settings: Font enlargement, reduction, and instant clipboard copying of raw notes.

4. **Neural Sandbox (MLP Engine from Scratch):**
   - Fully active **Multi-Layer Perceptron (neural network) classifier** built in raw JS (no Tensorflow or PyTorch dependencies).
   - Generates simulated linear boundaries, circular patterns, or XOR clusters (which require hidden layers).
   - Interactive parameters adjustment: Change Learning Rate, Activation function (Tanh, ReLU, Sigmoid), and modify Hidden Layer structure (add/remove up to 4 layers and 8 nodes per layer).
   - **SVG Weights Visualizer:** Draws synapses and nodes on the fly. Positive weights are colored cyan, negative are purple, and line thickness corresponds to weight magnitude.
   - **Real-Time Convergence:** Animate the training boundary on a canvas while epoch counters, training loss, and test accuracy metrics calculate in real-time.

5. **Community Connections Footer:**
   - Beautiful, glassmorphic contact cards with customized hover animations and official SVG logos.
   - Directly links to the provided configurations:
     - **WhatsApp Helpdesk:** Dynamic Chat Support link (obfuscated to prevent scraping)
     - **Telegram Channel:** Dynamic Channel link (obfuscated to prevent scraping)
     - **Twitter / X:** `@narendrakumarx`
     - **YouTube Channel:** `@narenTech-ai`

---

## 🚀 How to Host on GitHub Pages (Free)

Since this website is built with static assets (`index.html`, `styles.css`, `app.js`), you can host it for free using GitHub Pages. Follow these steps:

### Step 1: Initialize Git and Commit Locally
Open your command terminal (Command Prompt, PowerShell, or Git Bash) in this project folder and run:
```bash
# Initialize a local Git repository
git init

# Add all files (index.html, styles.css, app.js, README.md)
git add .

# Create the initial commit
git commit -m "feat: initial commit of narenTech-ai educational site"
```

### Step 2: Push to GitHub
1. Go to [GitHub](https://github.com/) and sign in.
2. Click **New** to create a new repository.
3. Name your repository (e.g., `narentech-ai-platform`).
4. Keep the repository **Public** (required for free hosting). Do *not* initialize it with a README, `.gitignore`, or license.
5. Copy the remote repository URL under the "Quick setup" section.
6. Run the following commands in your local project terminal (replace `YOUR_REMOTE_URL` with your copied URL):
```bash
# Rename default branch to main
git branch -M main

# Add your GitHub repository as the remote origin
git remote add origin YOUR_REMOTE_URL

# Push files to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. On GitHub, navigate to your repository settings (**Settings** tab).
2. On the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under the **Build and deployment** section, select **Deploy from a branch** as the source.
4. Under **Branch**, select `main` (and `/root` folder) and click **Save**.
5. Wait 1-2 minutes. Refresh the settings page, and GitHub will provide you with your public link (e.g., `https://username.github.io/narentech-ai-platform/`).

---

## 🛠️ Local Development & Testing

To run and preview the site locally:
1. Simply double-click `index.html` to open it in any web browser.
2. For the best experience (e.g., proper handling of local storage and modular video playing), host it using a local dev server:
   - **Using Python:** Run `python -m http.server 8000` in the directory, and navigate to `http://localhost:8000`.
   - **Using Node (npx):** Run `npx serve` and navigate to the port displayed.
