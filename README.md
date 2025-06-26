# Kashish Art India - Modern Art Website & Admin Panel

A comprehensive, modern React + Tailwind CSS website with an admin panel for showcasing beautiful paintings and artwork from India. Features beautiful animations, toast notifications, and a complete content management system.

## 🎨 Features

### Main Website
- **Modern Design**: Clean, aesthetic design with animated hero section and floating elements
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- **Interactive Components**: 
  - Painting cards with "Buy Now" functionality
  - Blog posts with "Read More" modals
  - Contact forms with Google Maps integration
  - Floating WhatsApp button
  - Toast notification system
- **Multiple Pages**:
  - **Home** - Animated hero section with gradient background
  - **Products** - Paintings with category filtering and purchase modals
  - **About** - Artist background and company information
  - **Contact** - Contact form with embedded Google Maps
  - **Blog** - Posts with reactions and feedback system

### Admin Panel
- **Secure Authentication**: Email/password login system
- **Dashboard Overview**: Statistics and recent activity
- **Content Management**: 
  - Manage Paintings (CRUD operations)
  - Manage Blog Posts
  - Order Management
  - System Settings
- **Route-based Navigation**: Sidebar with active route highlighting
- **Authentication Protection**: Unauthorized access prevention

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations
- **AOS (Animate On Scroll)** - Scroll-triggered animations
- **Toast System** - Custom notification system

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kashishArt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001` (or the port shown in terminal)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Key Features Explained

### Admin Panel Access
- **URL**: `/admin-login`
- **Credentials**: 
  - Email: `admin@example.com`
  - Password: `password`
- **Dashboard**: `/admin-dashboard/*`

### Toast Notification System
- **Types**: Success, Error, Warning, Info
- **Features**: Auto-dismiss, manual close, multiple positions
- **Usage**: Integrated throughout the application for user feedback

### Buy Now Functionality
- Click "Buy Now" on any painting card
- Opens a modal with pre-filled painting information
- Form includes: name, email, mobile number
- Auto-filled message: "I want to buy this painting: [Title]"

### Blog System
- Blog posts with excerpts and full content
- "Read More" modal with reactions and feedback
- Category-based organization

### Responsive Design
- Mobile-first approach
- Responsive navigation with hamburger menu
- Optimized layouts for all screen sizes

## 🎨 Color Palette & Styling

The website uses a custom color palette defined in Tailwind config:
- **Kashish Blue**: `#0070f3`
- **Kashish Red**: `#d00000`
- **Kashish Green**: `#008000`

### Animations
- **Hero Background**: Animated gradient with floating elements
- **Framer Motion**: Component animations and transitions
- **AOS**: Scroll-triggered animations
- **Hover Effects**: Interactive elements with smooth transitions

## 📁 Project Structure

```
kashishArt/
├── public/
│   └── logo.jpeg
├── src/
│   ├── components/
│   │   ├── BlogModal.jsx          # Blog post modal
│   │   ├── BuyModal.jsx           # Purchase modal
│   │   ├── Footer.jsx             # Footer component
│   │   ├── Navbar.jsx             # Navigation component
│   │   ├── PaintingCard.jsx       # Individual painting display
│   │   ├── Toast.jsx              # Toast notification component
│   │   ├── ToastContext.jsx       # Toast context provider
│   │   ├── ToastExample.jsx       # Toast usage examples
│   │   └── WhatsAppButton.jsx     # Floating WhatsApp button
│   ├── data/
│   │   ├── blogPosts.js           # Blog post data
│   │   └── paintings.js           # Painting data
│   ├── pages/
│   │   ├── About.jsx              # About page
│   │   ├── Blog.jsx               # Blog page
│   │   ├── Contact.jsx            # Contact page
│   │   ├── Home.jsx               # Home page
│   │   ├── Products.jsx           # Products page
│   │   └── admin/
│   │       ├── AdminDashboard.jsx # Admin dashboard
│   │       └── AdminLogin.jsx     # Admin login
│   ├── App.jsx                    # Main app component
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔐 Authentication & Security

### Admin Authentication
- **Client-side Protection**: Route guards and localStorage-based sessions
- **Login Flow**: Email/password validation with toast feedback
- **Session Management**: Automatic logout and redirect handling
- **Protected Routes**: Unauthorized access redirects to home page

### Toast System Implementation
```javascript
import { useToast } from '../../components/ToastContext';

const { success, error, warning, info } = useToast();

// Usage examples
success('Operation completed successfully!');
error('Something went wrong!');
warning('Please check your input.');
info('Here is some information.');
```

## 🔧 Customization

### Adding New Paintings
Edit `src/data/paintings.js` to add new paintings:
```javascript
{
  id: 13,
  title: "New Painting",
  category: "Landscape",
  price: 25000,
  image: "image-url",
  description: "Painting description"
}
```

### Adding Blog Posts
Edit `src/data/blogPosts.js` to add new blog posts:
```javascript
{
  id: 7,
  title: "New Blog Post",
  excerpt: "Post excerpt",
  content: "Full post content",
  author: "Author Name",
  date: "2024-01-25",
  image: "image-url",
}
```

## 🌟 Current Features

### ✅ Implemented
- **Complete Website**: All pages with responsive design
- **Admin Panel**: Login, dashboard, and route protection
- **Toast System**: Success, error, warning, info notifications
- **Animations**: Hero animations, scroll effects, hover interactions
- **Contact Integration**: Forms with Google Maps
- **Blog System**: Posts with modals and reactions
- **Purchase Flow**: Buy now modals and forms
- **Authentication**: Admin login with session management

### 🚀 Planned Features
- **Backend Integration**: Connect to a real backend for form submissions
- **Payment Gateway**: Stripe/PayPal integration for purchases
- **User Authentication**: Customer accounts and favorites
- **Image Gallery**: Enhanced gallery with lightbox functionality
- **Search Functionality**: Search for paintings and blog posts
- **Multi-language Support**: Internationalization
- **PWA Features**: Progressive Web App capabilities

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Common Issues

#### Import Path Errors
```bash
# Error: Failed to resolve import
# Solution: Check relative path from current file to target
# Example: From src/pages/admin/ to src/components/
import { useToast } from '../../components/ToastContext';
```

#### Toast Not Working
```bash
# Ensure ToastProvider wraps the app
# Check import paths
# Verify toast function calls
```

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run build -- --force
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please contact:
- Email: info@kashishartindia.com
- Phone: +91 98765 43210

## 📊 Project Status

- **Version**: 1.0.0
- **Last Updated**: January 2024
- **Status**: Production Ready
- **Admin Panel**: ✅ Complete
- **Toast System**: ✅ Complete
- **Responsive Design**: ✅ Complete
- **Animations**: ✅ Complete

---

**Built with ❤️ for Kashish Art India**

*Featuring modern React, beautiful animations, and a complete admin panel for content management.* 
