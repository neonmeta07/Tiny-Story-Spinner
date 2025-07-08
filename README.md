# 🌟 Tiny Story Spinner

A delightful web application that generates magical micro-stories based on user inputs. Built with Next.js 14, featuring kawaii-inspired design, text-to-speech functionality, and smooth animations.

## ✨ Features

- **Story Generation**: Create unique 100-150 word stories with customizable character names, settings, and moods
- **Read Aloud**: Text-to-speech functionality with voice selection
- **Smooth Animations**: Beautiful transitions powered by react-spring
- **Kawaii Design**: Pastel colors, rounded corners, and playful typography
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Accessible**: Full keyboard navigation and screen reader support
- **Fast**: Optimized for performance with Next.js 14

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd tiny-story-spinner
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Usage

1. Enter a character name (2-20 characters)
2. Select a magical setting from the dropdown
3. Choose your character's mood
4. Click "Generate Story" to create your magical tale
5. Use "Read Aloud" to hear your story spoken
6. Enjoy the smooth animations and kawaii design!

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: react-spring
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Comic Neue, Quicksand)
- **Speech**: Web Speech API

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/story/route.js    # Story generation API
│   ├── globals.css           # Global styles
│   └── page.tsx              # Main page
├── components/
│   ├── StoryForm.tsx         # Input form component
│   ├── StoryCard.tsx         # Story display component
│   └── ReadAloudButton.tsx   # Text-to-speech component
├── lib/
│   └── stories.js            # Story templates and data
└── README.md
\`\`\`

## 🎭 Story Templates

The app includes 10 unique story templates featuring:
- Cute characters (marshmallows, bunnies, fireflies, etc.)
- Magical settings (enchanted forests, starry skies, cozy bakeries)
- Whimsical themes and adventures
- Placeholder system for personalization

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast colors
- Screen reader compatibility
- Reduced motion support

## 🎨 Design System

- **Colors**: Pastel pink, purple, and mint green palette
- **Typography**: Comic Neue for headings, Quicksand for body text
- **Spacing**: Consistent 8px grid system
- **Borders**: Rounded corners throughout
- **Shadows**: Soft, layered shadows for depth

## 🔧 Customization

### Adding New Story Templates

Edit `lib/stories.js` to add new templates:

\`\`\`javascript
{
  id: 11,
  template: "Your story template with {name}, {setting}, and {mood} placeholders...",
  illustration: "🎭"
}
\`\`\`

### Modifying Settings/Moods

Update the `settings` and `moods` arrays in `lib/stories.js`.

### Styling Changes

Modify `tailwind.config.js` for theme changes or edit component styles directly.

## 🐛 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 14+
- Edge 79+

**Note**: Text-to-speech feature requires modern browser support for Web Speech API.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💖 Acknowledgments

- Built with love and a sprinkle of magic ✨
- Inspired by kawaii culture and storytelling
- Thanks to the Next.js and React communities

---

Made with ❤️ and a sprinkle of magic
