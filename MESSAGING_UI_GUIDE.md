# Messaging UI - Visual Style Guide

## Color Palette

### Primary Colors
- **Purple Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Background**: `#f7fafc` (Light gray)
- **White**: `#ffffff`

### Status Colors
- **Green (Read)**: `#4ade80` ✓✓
- **Gray (Delivered)**: `#a0aec0` ✓✓
- **Light Gray (Sent)**: `#cbd5e0` ✓
- **Red (Disconnected)**: `#f87171` 🔴
- **Green (Connected)**: `#4ade80` 🟢

## Component Styles

### 1. Chat Header
```
┌─────────────────────────────────────────┐
│ [Purple Gradient Background]            │
│ Recipient Name                          │
│ 🟢 Connected / 🔴 Disconnected          │
└─────────────────────────────────────────┘
```
- Background: Purple gradient
- Text: White
- Status indicator: Green/Red circle

### 2. Messages List
```
┌─────────────────────────────────────────┐
│ [Light Gray Background #f7fafc]         │
│                                         │
│  ┌─────────────────┐                   │
│  │ Received Msg    │                   │
│  │ [White bg]      │                   │
│  │ 10:30 AM        │                   │
│  └─────────────────┘                   │
│                                         │
│                   ┌─────────────────┐  │
│                   │ Sent Message    │  │
│                   │ [Purple grad]   │  │
│                   │ 10:31 AM  ✓✓    │  │
│                   └─────────────────┘  │
│                                         │
│  ┌─────────────────┐                   │
│  │ ⚫⚫⚫ typing...  │                   │
│  └─────────────────┘                   │
└─────────────────────────────────────────┘
```

### 3. Message Bubbles

#### Sent Messages (Right-aligned)
- Background: Purple gradient
- Color: White
- Border radius: 18px (top), 4px (bottom-right)
- Max width: 70% of container
- Shadow: None

#### Received Messages (Left-aligned)
- Background: White
- Color: Dark gray (#2d3748)
- Border radius: 18px (top), 4px (bottom-left)
- Max width: 70% of container
- Shadow: Subtle (0 1px 2px rgba(0,0,0,0.1))

### 4. Read Receipt Icons

```
Sent:      ✓     (Light gray #cbd5e0)
Delivered: ✓✓    (Gray #a0aec0)
Read:      ✓✓    (Green #4ade80)
```

### 5. Typing Indicator
```
┌─────────────────┐
│ ⚫ ⚫ ⚫         │  <- Animated bouncing dots
│ User is typing  │
└─────────────────┘
```
- Background: White
- Animation: Bounce (1.4s infinite)
- Dot color: #a0aec0

### 6. Message Input
```
┌─────────────────────────────────────────┐
│ ┌─────────────────────┐  ┌──────────┐  │
│ │ Type a message...   │  │   Send   │  │
│ └─────────────────────┘  └──────────┘  │
└─────────────────────────────────────────┘
```
- Input: Rounded (24px), Border (#e2e8f0)
- Focus: Purple border (#667eea), Glow effect
- Button: Purple gradient, White text, Rounded (24px)
- Hover: Lift effect with shadow

### 7. New Chat Modal
```
┌───────────────────────────────────────┐
│ New Chat                           ✕  │
├───────────────────────────────────────┤
│ [Search users...                  🔍] │
├───────────────────────────────────────┤
│ ┌─────────────────────────────────┐   │
│ │ 👤 John Doe                     │   │
│ │    john@example.com             │   │
│ │    CLIENT                       │   │
│ ├─────────────────────────────────┤   │
│ │ 👤 Jane Smith                   │   │
│ │    jane@example.com             │   │
│ │    DEVELOPER                    │   │
│ └─────────────────────────────────┘   │
└───────────────────────────────────────┘
```
- Modal: White background, Rounded corners (16px)
- Shadow: Large (0 8px 32px)
- Avatar: Purple gradient circle
- Badge: Blue background for role
- Hover: Light gray background (#f9fafb)

## Responsive Design

### Desktop (> 768px)
- Chat container: Max height 800px
- Message bubbles: Max width 70%
- Full sidebar visible

### Mobile (≤ 768px)
- Chat container: Full viewport height
- Message bubbles: Max width 85%
- Larger input font (16px) to prevent zoom
- No border radius on container

## Animations

### fadeIn (Message appearance)
```
From: opacity 0, translateY(10px)
To:   opacity 1, translateY(0)
Duration: 0.3s ease-in
```

### bounce (Typing dots)
```
0%, 80%, 100%: scale(0)
40%:          scale(1)
Duration: 1.4s infinite
Delay: Staggered (-0.32s, -0.16s, 0s)
```

### spin (Loading spinner)
```
From: rotate(0deg)
To:   rotate(360deg)
Duration: 0.8s linear infinite
```

## Interactive States

### Buttons
- **Default**: Purple gradient background
- **Hover**: Lift up 2px, Add shadow
- **Active**: Return to original position
- **Disabled**: 50% opacity, No cursor

### Input Fields
- **Default**: Gray border (#e2e8f0)
- **Focus**: Purple border (#667eea), Glow ring
- **Error**: Red border (if implemented)

## Scrollbar Customization

### Webkit (Chrome, Safari, Edge)
- Width: 6px
- Track: Light gray (#f1f1f1)
- Thumb: Gray (#cbd5e0)
- Thumb Hover: Darker gray (#a0aec0)

## Accessibility Features

✅ **Keyboard Navigation**: Enter to send, Shift+Enter for new line
✅ **Color Contrast**: All text meets WCAG AA standards
✅ **Focus Indicators**: Visible focus rings on interactive elements
✅ **Screen Reader**: Semantic HTML with proper labels
✅ **Responsive**: Works on all screen sizes

## Example Message Timeline

```
10:00 AM  [Received] "Hi, do you have time to discuss the project?"
10:01 AM  [Sent]     "Yes, I'm available now!" ✓
10:02 AM  [Sent]     "What aspects would you like to cover?" ✓✓ (Delivered)
10:03 AM  [Received] "Let's talk about the timeline"
10:03 AM  [Sent]     "Sounds good!" ✓✓ (Read - Green)
          [Typing]   "John is typing..."
```

## CSS Class Reference

### Layout
- `.chat-container` - Main container
- `.chat-header` - Top header section
- `.messages-list` - Scrollable messages area
- `.message-input-container` - Bottom input section

### Messages
- `.message` - Individual message wrapper
- `.message.sent` - User's sent messages
- `.message.received` - Received messages
- `.message-bubble` - Message content bubble
- `.message-text` - Message text content
- `.message-meta` - Timestamp and status

### Status
- `.status` - Status indicator wrapper
- `.status.sent` - Single checkmark (light gray)
- `.status.delivered` - Double checkmarks (gray)
- `.status.read` - Double checkmarks (green)

### Connection
- `.connection-status` - Connection indicator
- `.connection-status.connected` - Green (online)
- `.connection-status.disconnected` - Red (offline)

### Typing
- `.typing-indicator` - Typing indicator container
- `.typing-dots` - Animated dots wrapper
- `.typing-text` - "User is typing..." text

### Modal
- `.modal-overlay` - Dark overlay background
- `.new-chat-modal` - Modal container
- `.modal-header` - Modal header with title
- `.modal-search` - Search input section
- `.modal-content` - User list area
- `.user-item` - Individual user in list
- `.user-avatar` - User avatar circle
- `.user-info` - User details (name, email)
- `.user-role-badge` - Role badge (CLIENT/DEVELOPER)

## Browser Support

✅ **Chrome** 90+
✅ **Firefox** 88+
✅ **Safari** 14+
✅ **Edge** 90+
✅ **Mobile Safari** iOS 14+
✅ **Chrome Mobile** Android 10+

## Performance Optimizations

1. **CSS Transitions**: Hardware-accelerated properties (transform, opacity)
2. **Scroll Behavior**: Smooth scrolling with `scroll-behavior: smooth`
3. **Animation Performance**: Uses `transform` instead of position properties
4. **Custom Scrollbar**: Lightweight webkit scrollbar styling
5. **Lazy Loading**: Messages load on-demand, not all at once

---

**Design System**: Based on Tailwind CSS colors and modern web design principles
**Accessibility**: WCAG 2.1 Level AA compliant
**Mobile-First**: Responsive design with mobile optimizations
