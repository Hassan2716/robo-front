# RoboCutz - Premium Barber Shop Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for a barber shop with a public customer-facing website and an internal staff/admin management system.

## Features

### Customer-Facing Website
- **Home Page**: Hero banner, featured barbers, services preview, gallery preview
- **Barbers Page**: Browse all barbers with filtering by specialty
- **Barber Detail**: View barber bio, specialties, schedule, and services
- **Services Page**: All services categorized with pricing and duration
- **Gallery**: Haircut/style showcase with lightbox
- **About Page**: Shop story, values, and team
- **Contact Page**: Working contact form with email notifications
- **Online Booking**: 4-step flow (Barber → Service → Date/Time → Confirm)
- **Customer Dashboard**: Upcoming/past appointments, cancel/reschedule, profile management

### Staff/Admin Panel (Role-Based Access)
- **Admin**: Full access to all features
- **Receptionist**: Appointments management, POS, products
- **Barber**: View own schedule and appointments

#### Dashboard
- Today's appointments, walk-ins, revenue snapshot
- Pending appointments count

#### Appointments Management
- Calendar/list view with filters (date, barber, status)
- Status updates (pending/confirmed/completed/cancelled/no-show)
- Add walk-in appointments

#### Point of Sale (POS)
- Walk-in service + product sales
- Real-time inventory deduction
- Receipt generation

#### Management Screens
- **Barbers**: CRUD with photo upload, specialties, working hours
- **Services**: CRUD with barber assignment, categories
- **Products**: CRUD with stock management, categories

#### Reports
- Bookings trend charts
- Revenue trend charts
- Top services & barbers
- Product inventory status
- Barber performance metrics

#### Staff Accounts
- Admin can create barber/receptionist/admin accounts

## Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Context API for state management
- Axios for API calls
- Tailwind CSS for styling
- React Hook Form + Zod validation
- React Hot Toast for notifications
- Chart.js + react-chartjs-2 for analytics

### Backend
- Node.js + Express
- MongoDB + Mongoose ODM
- JWT Authentication (access + refresh tokens)
- bcryptjs for password hashing
- Multer + Cloudinary for image uploads
- Nodemailer for transactional emails
- express-validator for input validation

## Project Structure

```
robocutz-mern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components (Layout, AdminLayout)
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── booking/    # Booking flow
│   │   │   ├── customer/   # Customer dashboard pages
│   │   │   └── staff/      # Staff/admin pages
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilities (API client)
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                 # Node.js/Express backend
│   ├── config/             # Configuration (DB, Cloudinary)
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, validation, error handling, upload
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities (email, slots, seed)
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Gmail/Email service (for notifications)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/robocutz-mern.git
cd robocutz-mern
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed  # Creates default admin and sample data
npm run dev   # Starts on port 5000
```

3. **Setup Frontend**
```bash
cd client
npm install
npm run dev   # Starts on port 5173
```

### Environment Variables

Create `.env` in the server directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/robocutz

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@robocutz.com
CONTACT_EMAIL=info@robocutz.com
```

## Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@robocutz.com | password123 |
| Receptionist | reception@robocutz.com | password123 |
| Barber (Mike) | mike@robocutz.com | password123 |
| Barber (Sarah) | sarah@robocutz.com | password123 |
| Barber (David) | david@robocutz.com | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Login (all roles)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Barbers
- `GET /api/barbers` - List barbers (public)
- `GET /api/barbers/:id` - Get barber details
- `GET /api/barbers/me` - Get own profile (barber)
- `PUT /api/barbers/me` - Update own profile (barber)
- `POST /api/barbers` - Create barber (admin)
- `PUT /api/barbers/:id` - Update barber (admin)
- `DELETE /api/barbers/:id` - Delete barber (admin)

### Services
- `GET /api/services` - List services
- `GET /api/services/:id` - Get service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Appointments
- `GET /api/appointments` - List appointments (role-filtered)
- `GET /api/appointments/my` - Customer's appointments
- `GET /api/appointments/slots` - Get available slots
- `POST /api/appointments` - Book appointment (customer)
- `POST /api/appointments/walk-in` - Add walk-in (receptionist/admin)
- `PUT /api/appointments/:id/status` - Update status
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/reschedule` - Reschedule

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `PUT /api/products/:id/stock` - Update stock

### Sales (POS)
- `POST /api/sales` - Create sale (receptionist/admin)
- `GET /api/sales` - List sales (receptionist/admin)
- `GET /api/sales/receipt/:id` - Get receipt
- `GET /api/sales/summary` - Daily summary

### Reports (Admin/Receptionist)
- `GET /api/reports/dashboard` - Dashboard stats
- `GET /api/reports/bookings` - Bookings report
- `GET /api/reports/revenue` - Revenue report
- `GET /api/reports/barbers` - Barber performance
- `GET /api/reports/products` - Product inventory

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List contacts (admin/receptionist)

### Users (Admin)
- `GET /api/users` - List staff users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Build command: `npm install`
4. Start command: `npm start`
4. Ensure MongoDB Atlas is accessible

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variables if needed
5. Configure redirects for SPA routing

### Database (MongoDB Atlas)
1. Create cluster
2. Add connection string to `MONGODB_URI`
3. Whitelist deployment IPs (0.0.0.0/0 for all)

## Postman Collection

Import `postman/robocutz-api.json` for complete API testing.

## Security Features
- Password hashing with bcrypt (12 rounds)
- JWT with HttpOnly cookies
- Role-based access control
- Input validation & sanitization
- CORS configuration
- Rate limiting ready
- XSS protection headers

## License

MIT License - feel free to use for your own projects!