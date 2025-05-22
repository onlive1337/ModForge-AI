# Changelog

All notable changes to ModForge AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-01-06

### Added
- Advanced AI intent analysis for precise mod selection
- Mod relevance scoring system
- Support for Minecraft 1.21, 1.21.1
- Example queries for better user guidance
- Mod knowledge base for accurate categorization
- Exclusion feature support (e.g., "without optimization")
- Specific mod count requests support

### Changed
- Complete AI prompt engineering overhaul for accuracy
- Improved mod filtering to match user requests exactly
- Updated Gemini model to 1.5-flash
- Enhanced search algorithm with relevance sorting
- Better handling of specific mod requests
- Reduced AI creativity for more predictable results

### Fixed
- AI adding unnecessary mods to packs
- Incorrect mod suggestions for user queries
- Library and API mods appearing when not requested
- Optimization mods being added without request
- Search result relevance issues

## [1.3.1] - 2024-02-20

### Changed
- Improved Profile UI with smooth animations
- Enhanced modal positioning and responsiveness
- Better mobile support for all dialogs
- Added sticky header in Profile
- Improved scrolling behavior in modals

### Fixed
- Modal centering issues
- Select components recursion errors
- Mobile UI glitches
- Focus management in modal dialogs
- Profile dialog positioning on different screen sizes

## [1.3.0] - 2024-02-20

### Added
- User authentication system with JWT
- User profiles with customizable settings
- Settings synchronization across devices
- MongoDB integration for user data storage
- Default mod loader preferences
- Default Minecraft version preferences
- Theme preferences (light/dark/system)
- Language preferences (EN/RU)

### Changed
- Moved theme and language toggles to user profile settings
- Improved UI layout and accessibility
- Enhanced modal dialogs with backdrop blur
- Updated auth forms with better error handling
- Simplified header navigation

### Fixed
- Theme persistence issues
- Language switching bugs
- Modal dialog closing behavior
- Select components background transparency

## [1.2.0] - 2024-12-24

### Added
- Enhanced Telegram logging with expandable quotes
- Improved error handling in AI generation
- Automatic mod count adjustment
- Default fallback responses for failed searches
- Better rate limiting handling for Modrinth API

### Changed
- Updated Gemini AI integration for better stability
- Improved Modrinth search parameters
- Better error handling and retry logic
- Enhanced log formatting and grouping
- More robust dependency checking

### Fixed
- AI generation error handling
- Modrinth API search issues
- Version compatibility checking
- Mod count validation
- Telegram message formatting

## [1.1.0] - 2024-03-24

### Added
- Generation process logger with animated UI
- Extended version and loader support
- Improved mod compatibility checks
- Better mobile responsiveness
- Support for custom mod count in prompts

### Changed
- Enhanced UI design and animations
- Better error handling and display
- Improved version selector layout
- Optimized API responses

### Fixed
- Version selector display issues
- Mobile layout bugs
- Mod compatibility algorithm improvements

## [1.0.0] - 2024-03-20

### Added
- Initial release
- AI-powered modpack generation
- Multiple Minecraft version support
- Multiple mod loader support
- Resource packs suggestions
- Shader suggestions
- Dark/Light theme
- Multilanguage support (EN/RU)

[1.4.0]: https://github.com/onlive1337/ModForge-AI/releases/tag/v1.4.0
[1.3.1]: https://github.com/onlive1337/ModForge-AI/releases/tag/v1.3.1
[1.3.0]: https://github.com/onlive1337/ModForge-AI/releases/tag/v1.3.0
[1.2.0]: https://github.com/onlive1337/ModForge-AI/releases/tag/v1.2.0
[1.1.0]: https://github.com/onlive1337/ModForge-AI/releases/tag/v1.1.0
[1.0.0]: https://github.com/onlive1337/ModForge-AI/releases/tag/v1.0.0