# Tech Context: Video Speed Controller

## Công nghệ sử dụng

### Core Technologies
- **Chrome Extension API**: Manifest V3
- **JavaScript ES6+**: Classes, async/await, arrow functions
- **HTML5**: Semantic markup, accessibility
- **CSS3**: Grid, Flexbox, custom properties, animations
- **Web APIs**: MutationObserver, DOM manipulation

### Browser APIs
- `chrome.tabs`: Tab management và messaging
- `chrome.runtime`: Extension lifecycle và messaging
- `chrome.scripting`: Content script injection (future use)

### JavaScript Features
- **Classes**: OOP approach cho VideoSpeedController và VideoSpeedManager
- **Async/Await**: Message passing và error handling
- **Event Listeners**: DOM events và user interactions
- **Template Literals**: Dynamic content generation

## Thiết lập phát triển

### File Structure
```
Video Speed Controller/
├── manifest.json          # Extension configuration
├── popup.html             # UI markup
├── popup.css              # Styling
├── popup.js               # UI logic
├── content.js             # Video control logic
├── icons/                 # SVG icons (16, 32, 48, 128)
├── README.md              # User documentation
├── INSTALL.md             # Installation guide
└── memory-bank/           # Development documentation
```

### Development Workflow
1. **Code Changes**: Edit source files
2. **Reload Extension**: Chrome Extensions page → Reload
3. **Test**: Open video page và test functionality
4. **Debug**: Chrome DevTools console

### Browser Compatibility
- **Primary**: Chrome 88+
- **Secondary**: Edge 88+, Opera 74+
- **Requirements**: Manifest V3 support

## Ràng buộc kỹ thuật

### Performance
- **Lightweight**: No external libraries
- **Efficient**: Minimal DOM queries
- **Responsive**: <100ms response time

### Security
- **Content Security Policy**: Inline scripts avoided
- **Permissions**: Minimal required permissions
- **Isolation**: Content script isolation

### Compatibility
- **Video Support**: HTML5 video elements
- **SPA Support**: MutationObserver cho dynamic content
- **Cross-site**: Works on all domains

## Patterns sử dụng công cụ

### Chrome Extension Development
- **Manifest V3**: Service workers thay vì background pages
- **Message Passing**: Structured communication
- **Content Scripts**: Isolated execution context

### CSS Architecture
- **Component-based**: Modular styles
- **CSS Custom Properties**: Consistent theming
- **Progressive Enhancement**: Graceful fallbacks

### JavaScript Patterns
- **Module Pattern**: Class-based organization
- **Observer Pattern**: Event-driven architecture
- **Error-first Callbacks**: Consistent error handling