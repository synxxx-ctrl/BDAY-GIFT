# 💖 Romantic 21st Birthday Website for Your Girlfriend ✨

A deeply romantic, dreamy, and warm single-page scrolling web application crafted with love to celebrate your girlfriend's 21st birthday. Designed with a soft blush & rose-gold aesthetic, elegant typography, smooth scroll animations, interactive scrapbook polaroids, love notes, and a magical cake finale with rose-gold confetti!

---

## 🌟 Key Features Included

1. **Ambient Floating Hearts & Sparkles Canvas**:
   - Soft, delicate hearts and golden shimmering particles float gently upward across the screen in the background.

2. **Hero Section (The Opening)**:
   - Full-screen opening with a Polaroid-style framed portrait of her with subtle rose-gold ambient glow, washi tape detail, and shimmer animation.
   - Glowing typography: *"Happy 21st Birthday, [Her Name]"* with a heartfelt introductory message.
   - Milestone badges (*"21 Years of Radiance"*, *"∞ Love For You"*, *"100% My Favorite Person"*).
   - Floating romantic music player pill in the corner with animated soundwave visualizer.
   - *"Scroll down for your surprises"* call-to-action button.

3. **Our Memories (Scrapbook Gallery & Fullscreen Lightbox)**:
   - Scrapbook-style Polaroid cards with authentic washi tape, pushpins, dates, and handwritten captions.
   - Interactive category filter tabs (*All Memories*, *Date Nights 🍷*, *Adventures ✈️*, *Cute Candids 🧸*).
   - Video card support with play badge preview.
   - Fullscreen Lightbox modal on click with zoom, previous/next controls, keyboard navigation (Arrow keys + Esc), and touch-friendly viewing.

4. **Love Notes & Messages (Two Interactive Modes)**:
   - **Mode 1: "18 Reasons Why I Love You" Flip-Card Carousel**:
     - 18 curated, heart-melting reasons.
     - 3D flip card: tap to reveal a deeper, emotional personal truth on the back!
     - Next/previous controls, counter (`1 / 18`), and quick-jump indicator dots.
   - **Mode 2: "Open When..." Letters**:
     - 3 realistic 3D envelopes with wax seals and peek-a-boo paper (*Open on your 21st birthday morning*, *Open when you miss me*, *Open when you're having a rough day*).
     - Clicking any envelope opens a lovely popup love letter.

5. **Interactive 21st Birthday Cake & Confetti Finale**:
   - Beautifully illustrated layered cake with realistic flickering candlelight flames on numbers "2" and "1".
   - *"Blow Out The Candles"* interactive button (or click directly on the cake):
     - Blows out the flames with realistic extinction animation.
     - Plays a celebratory chime & soft breeze sound effect (via Web Audio API).
     - Fires a magnificent multi-burst rose-gold, blush pink, and golden star confetti explosion!
     - Reveals the *"WISH GRANTED! 💖"* badge and smoothly guides her to the final wax-sealed Love Letter.

6. **Zero-Configuration Romantic Music Player**:
   - Works immediately out-of-the-box! If you haven't added an MP3 yet, it automatically plays a soft, soothing ambient piano chord progression synthesized via Web Audio API.
   - If you place your own `our-song.mp3` in the folder, it plays your real song seamlessly.

7. **100% Mobile Responsive**:
   - Beautifully optimized for iPhones, Android devices, tablets, and desktops so she can view it smoothly on her phone.

---

## 🚀 How to View the Website Right Now

Simply **double-click `index.html`** to open it in Google Chrome, Safari, Edge, or any web browser!

---

## ✏️ How to Easily Personalize the Code

Every single placeholder in `index.html` and `script.js` is clearly marked with `✏️` comments.

### 1. Change Her Name & Opening Message
Open `index.html` in any text editor (like VS Code or Notepad):
- Search for `id="girlfriendName"`:
  ```html
  <span class="glow-text gradient-rose-gold" id="girlfriendName">Her Actual Name</span>
  ```
- Directly below that, edit the `<p class="hero-subtitle">` text with your personal birthday message.

### 2. Replace Photos & Videos
- **Hero Photo**:
  In `index.html` around line 55, replace the `src`:
  ```html
  <img id="heroPortraitImg" src="your-photo.jpg" alt="Birthday Girl">
  ```
- **Scrapbook Gallery**:
  In `index.html` inside `<div class="scrapbook-grid">` (lines 245–380):
  - Replace `src="..."` (thumbnail) and `data-full="..."` (fullscreen image).
  - Update `data-caption="..."` and `data-date="..."`.
  - For videos: set `data-type="video"` and `data-video-src="your-video.mp4"`.

> **Tip:** You can create an `images/` folder inside this directory and drop your photos there (e.g. `images/first-date.jpg`, `images/her-portrait.jpg`).

### 3. Playing the Full Song: "Ruin the Friendship" 🎵
The website is now set to play **"Ruin the Friendship"** in full without any Spotify login prompts or 30-second preview limitations!

#### How to enable your full song in 10 seconds:
1. Obtain an MP3 of **"Ruin the Friendship"**.
2. Rename the file to **`ruin-the-friendship.mp3`** (or **`our-song.mp3`**).
3. Place it directly inside this folder (`c:\Users\User\Documents\Bday gift\`).
4. That's it! When she opens the page, the **entire full song** will play smoothly in the background on loop.

*(Note: As soon as she taps anywhere on the screen or clicks "Scroll down for your surprises", the music will start playing automatically without asking her to sign into Spotify or open any third-party app!)*

### 4. Edit the 18 Reasons Why I Love You
Open `script.js` and look for:
```javascript
const reasonsData = [
  {
    title: "Your Radiant Smile",
    teaser: "The short sweet reason on the front...",
    deep: "The deeper personal memory on the back of the card..."
  },
  // ... all 18 reasons can be personalized here!
];
```

### 5. Edit the "Open When..." Letters
In `script.js`, look for `const openWhenLetters = { ... }` (around line 430). You can edit the text for each of the 3 letters.

### 6. Edit the Final Love Letter
In `index.html` under Section 5 (lines 485–520), edit the paragraphs inside `<div class="letter-body">` and put your name at `<p class="letter-signature">[Your Name] ✍️</p>`.

---

## 🌐 How to Send It to Her Phone (Free Hosting Options)

If you'd like to send her a sweet link she can open on her phone:

1. **Option 1: Netlify Drop (Fastest & Easiest, 30 seconds)**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop).
   - Drag and drop this entire project folder into the browser window.
   - It will give you a live URL (e.g. `https://happy-21st-birthday.netlify.app`) instantly for free!

2. **Option 2: GitHub Pages (Free forever)**
   - Push this folder to a GitHub repository.
   - Go to **Settings > Pages** and select the `main` branch.
   - Your link will be live at `https://yourusername.github.io/reponame/`.

3. **Option 3: Vercel**
   - Drag and drop or deploy via [vercel.com](https://vercel.com).



