# ModForge AI 🚀

ModForge AI is an intelligent Minecraft modpack generator that uses AI to create customized modpacks based on user descriptions.


## 🌟 Features

- **AI-Powered Generation**: Describe your desired modpack, and AI will select the perfect mods
- **Version Support**: Compatible with Minecraft versions 1.16.5 through 1.20.1
- **Smart Categorization**: Automatically categorizes and suggests:
  - Mods 🔧
  - Resource Packs 🎨
  - Shaders ✨
- **Compatibility Checking**: Ensures selected mods work well together
- **Multi-language Support**: Available in English and Russian
- **Dark/Light Mode**: Comfortable viewing in any lighting conditions

## 🛠️ Tech Stack

- **Frontend**:
  - React + TypeScript
  - Vite
  - Tailwind CSS
  - Framer Motion
  - ShadcnUI

- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Google Gemini AI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Google AI API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/onlive1337/modforge-ai.git
cd modforge-ai
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up environment variables:

Backend (.env):
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
```

Frontend (.env):
```env
VITE_API_URL=http://localhost:3000/api
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## 📝 Usage

1. Select your Minecraft version
2. Describe your desired modpack in the input field
3. Click "Generate" and wait for the AI to process your request
4. Browse through the suggested mods, resource packs, and shaders
5. Download the ones you like directly from Modrinth

## 🌐 API Endpoints

- `POST /api/generate` - Generate modpack suggestions
  ```typescript
  {
    prompt: string;
    minecraftVersion: string;
  }
  ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Onlive** - *Initial work*

## 🙏 Acknowledgments

- [Modrinth](https://modrinth.com/) for providing the mod database
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- All mod creators and contributors

## 🔗 Links

- [Live Demo](https://onlive.is-a.dev/ModForge-AI/)
- [Bug Report](https://github.com/onlive1337/modforge-ai/issues)

---

Made with ❤️ for the Minecraft community
