📄 Product Requirements Document (PRD)
🎵 Church Lyrics Auto-Slide Generator Web App
1. Project Overview

Goal:
Build a web-based application that automatically generates presentation slides (like PowerPoint) for congregational singing by simply inputting song lyrics.

Core Value:
Eliminate manual slide creation and speed up worship preparation by transforming raw lyrics into structured, ready-to-present slides.

2. Objectives
Automatically convert lyrics into slide-ready format
Store and manage song lyrics and presentations
Enable fast search and filtering of songs
Provide a clean, responsive UI for church use (desktop-first)
Allow real-time or pre-generated presentation viewing
3. Target Users
Church worship leaders
Media team / projection operators
Volunteers handling slides during services
4. Tech Stack
Frontend
Framework: Next.js
Styling: Tailwind CSS + HTML
Rendering: SSR/CSR hybrid (Next.js)
Backend
API: Next.js API routes
Database: MongoDB (via Mongoose or native driver)
Deployment
Vercel (Frontend + API)
MongoDB Atlas (Cloud database)
5. Core Features
5.1 Lyrics Input & Auto Slide Generator

Description:
Users input lyrics → system automatically splits into slides.

Functional Behavior:

Input: Plain text lyrics
Logic:
Split by line breaks or stanza
Group lines (e.g., 2–4 lines per slide)
Output: Slide deck (carousel/presentation mode)

Example Transformation:

Input:
Amazing grace how sweet the sound
That saved a wretch like me

Output:
Slide 1:
Amazing grace how sweet the sound  

Slide 2:
That saved a wretch like me
5.2 Presentation Viewer

Description:
Displays generated slides in full-screen mode.

Features:

Next/Previous navigation
Keyboard controls (← → keys)
Auto-play option (optional)
Clean, distraction-free UI
5.3 Lyrics & Presentation Storage

Description:
Save songs and generated slides in MongoDB.

Collections:

Songs Collection
{
  "_id": ObjectId,
  "title": "Amazing Grace",
  "lyrics": "Full lyrics text",
  "createdAt": Date,
  "updatedAt": Date
}
Presentations Collection
{
  "_id": ObjectId,
  "songId": ObjectId,
  "slides": ["Slide 1 text", "Slide 2 text"],
  "createdAt": Date
}
5.4 Song Library

Description:
View all uploaded songs.

Features:

Grid/List display
Click to open presentation
Edit/Delete song
5.5 Filtering & Sorting

Description:
Filter songs by title.

Filters:

Alphabetical: A–Z
Numeric: 0–9
Search bar (optional enhancement)
5.6 Upload Lyrics

Description:
Add new songs manually.

Fields:

Title
Lyrics (textarea)
6. User Flow
6.1 Create Presentation
User enters song title + lyrics
Click Generate Slides
System processes text
Slides preview appears
User saves presentation
6.2 Present Song
User selects song from library
Click Present
Fullscreen slide viewer opens
Navigate slides manually or auto
7. UI/UX Requirements
Design Theme
Dark mode (recommended for churches)
High contrast text (white on dark background)
Large readable fonts
Key Pages
Dashboard / Song Library
Add Song Page
Presentation Viewer
Slide Preview Editor
8. Non-Functional Requirements
Performance
Fast slide rendering (<1s load)
Optimized database queries
Scalability
MongoDB indexing on title
Pagination for large song lists
Accessibility
Large fonts for readability
Keyboard navigation
9. Future Enhancements
🎨 Slide themes (backgrounds, fonts)
🎤 Live presentation sync (multi-device)
📱 Mobile remote control
🔊 Auto-scroll with music timing
📂 Import/export (PowerPoint/PDF)
☁️ Cloud sync for multiple churches
10. Risks & Challenges
Poor slide splitting logic (needs tuning)
Performance with large lyrics
UI clarity during live presentations
11. Success Metrics
Time saved vs manual slide creation
Number of songs stored
Presentation usage frequency
User satisfaction (ease of use)
12. Sample Folder Structure (Next.js)
/app
  /songs
  /present/[id]
/components
  SlideViewer.tsx
  LyricsForm.tsx
/lib
  mongodb.ts
/pages/api
  /songs
  /presentations
/models
  Song.js
  Presentation.js