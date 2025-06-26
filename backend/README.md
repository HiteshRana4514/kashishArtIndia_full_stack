# Kashish Art India - Backend API

A complete Node.js/Express.js backend API for the Kashish Art India website with MongoDB database, JWT authentication, and file upload capabilities.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for paintings, blog posts, and orders
- **Authentication**: JWT-based authentication with role-based access control
- **File Upload**: Image upload functionality using Multer
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing, input validation, and error handling
- **Admin Panel**: Complete admin functionality for content management

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Copy the config file
   cp config.env.example config.env
   
   # Edit the config file with your values
   ```

3. **Install MongoDB**
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud service)

4. **Run the setup script**
   ```bash
   node setup.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables (`config.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kashish_art_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Admin Default Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 📁 Project Structure

```
backend/
├── controllers/          # Request handlers
│   └── authController.js
├── middleware/           # Custom middleware
│   ├── auth.js          # Authentication middleware
│   ├── errorHandler.js  # Error handling
│   └── upload.js        # File upload middleware
├── models/              # Database models
│   ├── User.js         # User/Admin model
│   ├── Painting.js     # Painting model
│   ├── BlogPost.js     # Blog post model
│   └── Order.js        # Order model
├── routes/              # API routes
│   ├── auth.js         # Authentication routes
│   ├── paintings.js    # Painting routes
│   ├── blog.js         # Blog routes
│   ├── orders.js       # Order routes
│   └── admin.js        # Admin routes
├── uploads/             # Uploaded files
├── config.env           # Environment variables
├── package.json         # Dependencies
├── server.js            # Main server file
├── setup.js             # Database setup script
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `POST /api/auth/setup-admin` - Create admin user

### Paintings
- `GET /api/paintings` - Get all paintings
- `GET /api/paintings/:id` - Get single painting
- `POST /api/paintings` - Create painting (admin only)
- `PUT /api/paintings/:id` - Update painting (admin only)
- `DELETE /api/paintings/:id` - Delete painting (admin only)

### Blog Posts
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create blog post (admin only)
- `PUT /api/blog/:id` - Update blog post (admin only)
- `DELETE /api/blog/:id` - Delete blog post (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get single order (admin only)
- `PUT /api/orders/:id` - Update order (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Admin
- `GET /api/admin/stats` - Get dashboard stats (admin only)
- `GET /api/admin/settings` - Get admin settings (admin only)
- `PUT /api/admin/settings` - Update admin settings (admin only)

## 🔐 Authentication

### JWT Token
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

## 📊 Database Models

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'admin', 'user')
- `isActive`: Boolean
- `lastLogin`: Date

### Painting Model
- `title`: String (required)
- `artist`: String (required)
- `category`: String (enum: Landscape, Portrait, Abstract, etc.)
- `price`: Number (required)
- `description`: String (required)
- `image`: String (required)
- `dimensions`: Object (width, height, unit)
- `medium`: String (enum: Oil, Acrylic, Watercolor, etc.)
- `year`: Number (required)
- `isAvailable`: Boolean
- `isFeatured`: Boolean
- `views`: Number
- `tags`: Array of strings

### BlogPost Model
- `title`: String (required)
- `excerpt`: String (required)
- `content`: String (required)
- `author`: String (required)
- `category`: String (enum: Techniques, Art History, etc.)
- `image`: String (required)
- `tags`: Array of strings
- `isPublished`: Boolean
- `isFeatured`: Boolean
- `views`: Number
- `likes`: Number
- `comments`: Array of comment objects
- `slug`: String (auto-generated)

### Order Model
- `customer`: Object (name, email, phone, address)
- `painting`: ObjectId (reference to Painting)
- `paintingDetails`: Object (title, artist, price, image)
- `status`: String (enum: pending, confirmed, processing, etc.)
- `totalAmount`: Number (required)
- `paymentMethod`: String (enum: cash_on_delivery, bank_transfer, etc.)
- `paymentStatus`: String (enum: pending, paid, failed, etc.)
- `notes`: String
- `estimatedDelivery`: Date
- `actualDelivery`: Date
- `trackingNumber`: String
- `adminNotes`: String

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node setup.js` - Run database setup script

## 🔒 Security Features

- **Password Hashing**: Using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Mongoose schema validation
- **File Upload Security**: File type and size restrictions
- **CORS Configuration**: Cross-origin resource sharing setup
- **Error Handling**: Comprehensive error handling middleware

## 📝 File Upload

### Supported Formats
- Images: JPEG, PNG, GIF, WebP

### File Size Limit
- Maximum: 5MB per file

### Upload Endpoint
```
POST /api/paintings
Content-Type: multipart/form-data

Fields:
- image: File (required)
- title: String (required)
- artist: String (required)
- category: String (required)
- price: Number (required)
- description: String (required)
- dimensions: Object (required)
- medium: String (required)
- year: Number (required)
```

## 🚀 Deployment

### Prerequisites
- Node.js 16+ installed
- MongoDB database (local or cloud)
- Environment variables configured

### Steps
1. **Build the application**
   ```bash
   npm install --production
   ```

2. **Set environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Production Considerations
- Use a process manager like PM2
- Set up reverse proxy (Nginx)
- Configure SSL/TLS certificates
- Set up monitoring and logging
- Use environment-specific configurations

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
sudo systemctl start mongod
```

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### JWT Token Issues
```bash
# Check JWT_SECRET in config.env
# Ensure token is included in Authorization header
Authorization: Bearer <token>
```

#### File Upload Issues
```bash
# Check uploads directory permissions
chmod 755 uploads/

# Check file size and type
# Ensure Content-Type is multipart/form-data
```

## 📞 Support

For technical support or questions:
- **Email**: support@kashishart.com
- **Documentation**: This README file
- **Issues**: GitHub issues

---

**Built with ❤️ for Kashish Art India**

*Featuring Node.js, Express.js, MongoDB, and JWT authentication.* 