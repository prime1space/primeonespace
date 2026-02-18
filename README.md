# PrimeOne Coworking Space - Project Documentation

## 🏢 Project Overview

**PrimeOne Coworking Space** is a full-stack web application for managing coworking space bookings, events, and user memberships. The platform provides a seamless experience for users to browse spaces, make bookings, register for events, and manage their profiles.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15.3.5 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React, Heroicons
- **Charts**: Recharts
- **3D Graphics**: Three.js, React Three Fiber

### **Backend**
- **Language**: PHP 8.4
- **Database**: MySQL/MariaDB
- **Authentication**: Custom JWT-like token system with Better-Auth
- **Email Service**: Resend API
- **Password Hashing**: bcrypt
- **API Architecture**: RESTful

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint
- **Version Control**: Git

---

## 📁 Project Structure

```
coworking-space-website-project/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js app router pages
│   │   │   ├── (auth)/        # Authentication pages
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── bookings/      # Booking management
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── events/        # Events listing
│   │   │   ├── offers/        # Special offers
│   │   │   ├── spaces/        # Space listings
│   │   │   └── page.tsx       # Homepage
│   │   ├── components/        # Reusable React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── admin/        # Admin-specific components
│   │   │   ├── auth/         # Authentication components
│   │   │   └── bookings/     # Booking components
│   │   └── lib/              # Utility functions and configs
│   │       ├── auth-client.ts    # Authentication client
│   │       ├── countries.ts      # Country data
│   │       └── utils.ts          # Helper functions
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
│
├── backend/                     # PHP backend
│   └── php/
│       ├── api/                # API endpoints
│       │   ├── auth.php           # Authentication
│       │   ├── bookings.php       # Booking management
│       │   ├── events.php         # Event management
│       │   ├── offers.php         # Offers management
│       │   ├── spaces.php         # Space management
│       │   ├── user_profile.php   # User profile
│       │   └── uploads/           # File uploads
│       ├── db.php              # Database connection
│       └── vendor/             # PHP dependencies
│
├── PRODUCTION_READINESS_CHECKLIST.md  # Pre-launch checklist
├── COMPLETE_DEPLOYMENT_GUIDE.md       # Deployment instructions
└── README.md                           # This file
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20+ and npm
- PHP 8.4+
- MySQL/MariaDB
- MAMP/XAMPP (for local development) or production server

### **Local Development Setup**

#### **1. Clone the Repository**
```bash
git clone <repository-url>
cd coworking-space-website-project
```

#### **2. Frontend Setup**
```bash
cd frontend
npm install --legacy-peer-deps
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```

Start development server:
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

#### **3. Backend Setup**

**Database Configuration:**
1. Start MAMP/XAMPP
2. Create database: `primeonelk_user_coworking`
3. Import schema: `backend/php/primeonelk_user_coworking.sql`

**Update Database Credentials** in `backend/php/db.php`:
```php
// Local MAMP credentials
$host = '127.0.0.1';
$port = '8889';  // 3306 for XAMPP
$db_name = 'primeonelk_user_coworking';
$username = 'root';
$password = 'root';  // '' for XAMPP
```

**Start PHP Server:**
```bash
cd backend/php/api
php -S 127.0.0.1:8001 router.php
```
Backend will run on `http://127.0.0.1:8001`

#### **4. Email Configuration (Optional)**

Add to `backend/.env`:
```env
RESEND_API_KEY=your_resend_api_key_here
```

---

## 🔑 Key Features

### **User Features**
- ✅ User registration and authentication
- ✅ Profile management with country selection
- ✅ Browse available coworking spaces
- ✅ Real-time seat availability checking
- ✅ Book spaces with seat selection
- ✅ Add refreshments to bookings
- ✅ View booking history
- ✅ Register for events
- ✅ View special offers
- ✅ International phone number validation
- ✅ Password reset functionality

### **Admin Features**
- ✅ Admin dashboard with analytics
- ✅ Manage spaces (create, edit, delete)
- ✅ Manage pricing tiers
- ✅ Manage events
- ✅ Manage offers
- ✅ View and manage bookings
- ✅ View event registrations
- ✅ Manage announcements
- ✅ Upload images for spaces/events

### **Technical Features**
- ✅ Responsive design (mobile-first)
- ✅ Real-time seat conflict detection
- ✅ Image upload and management
- ✅ Email notifications (welcome, password reset)
- ✅ Session management with tokens
- ✅ CORS-enabled API
- ✅ SQL injection protection (prepared statements)
- ✅ Password hashing with bcrypt
- ✅ Country-based validation
- ✅ Dark mode support

---

## 📊 Database Schema

### **Core Tables**
- `user` - User accounts and profiles
- `account` - Authentication credentials
- `session` - Active user sessions
- `bookings` - Space bookings
- `spaces` - Available coworking spaces
- `pricing` - Pricing tiers
- `events` - Events and workshops
- `event_registrations` - Event sign-ups
- `offers` - Special offers and promotions
- `announcements` - Site-wide announcements
- `refreshments` - Available refreshments
- `booking_refreshments` - Refreshments per booking
- `testimonials` - User testimonials
- `settings` - Site configuration
- `payments` - Payment records
- `verification` - Email/password reset tokens

---

## 🔐 Authentication Flow

1. **Registration**: User signs up → Account created → Auto-login → Welcome email sent
2. **Login**: User enters credentials → Token generated → Session created → Redirect to dashboard
3. **Session**: Token stored in localStorage → Sent with each API request → Validated server-side
4. **Logout**: Token deleted from localStorage → Session removed from database

---

## 🌍 Internationalization

The platform supports international users with:
- **Country Selection**: 14 countries with dial codes
- **Phone Validation**: Country-specific validation rules
  - Sri Lanka: 9+ digits
  - International: 7-15 digits
- **Flexible ID Validation**: Accepts various national ID formats (5+ characters)
- **Supported Countries**: Australia, Canada, China, France, Germany, India, Japan, Malaysia, Russia, Singapore, Sri Lanka, UAE, UK, USA

---

## 📧 Email Templates

### **Welcome Email**
Sent on registration with:
- Personalized greeting
- Quick links to browse spaces and events
- Contact information

### **Password Reset Email**
Sent on password reset request with:
- Secure reset link (30-minute expiration)
- Instructions
- Security notice

---

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface with gradient accents
- **Smooth Animations**: Framer Motion for delightful interactions
- **Accessible**: Keyboard navigation, ARIA labels, semantic HTML
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback with Sonner
- **Responsive Tables**: Mobile-optimized data displays
- **Interactive Seat Maps**: Visual seat selection for bookings

---

## 🧪 Testing Checklist

### **Manual Testing**
- [ ] User registration flow
- [ ] Login/logout flow
- [ ] Password reset flow
- [ ] Booking creation (with and without seats)
- [ ] Event registration
- [ ] Profile updates
- [ ] Admin CRUD operations
- [ ] Image uploads
- [ ] Email delivery
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

### **Edge Cases to Test**
- [ ] Concurrent booking attempts
- [ ] Expired sessions
- [ ] Invalid file uploads
- [ ] SQL injection attempts
- [ ] XSS attempts
- [ ] Long form inputs
- [ ] Special characters in inputs

---

## 🚀 Deployment

See `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

### **Quick Deployment Steps**
1. Build frontend: `npm run build`
2. Upload `frontend/out/` to server
3. Upload `backend/php/` to server
4. Import database schema
5. Configure environment variables
6. Set file permissions
7. Test all endpoints

---

## 🔧 Environment Variables

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/backend/php/api
```

### **Backend (.env)**
```env
RESEND_API_KEY=your_resend_api_key
```

---

## 📝 API Endpoints

### **Authentication**
- `POST /auth/sign-up/email` - Register new user
- `POST /auth/sign-in/email` - Login
- `POST /auth/sign-out` - Logout
- `GET /auth/get-session` - Get current session
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### **Bookings**
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create booking
- `PUT /bookings/{id}` - Update booking
- `DELETE /bookings/{id}` - Cancel booking
- `GET /occupied-seats` - Get occupied seats

### **Spaces**
- `GET /spaces` - Get all spaces
- `POST /spaces` - Create space (admin)
- `PUT /spaces/{id}` - Update space (admin)
- `DELETE /spaces/{id}` - Delete space (admin)

### **Events**
- `GET /events` - Get all events
- `POST /events` - Create event (admin)
- `POST /event-register` - Register for event
- `GET /event-registrations` - Get registrations (admin)

### **Others**
- `GET /offers` - Get active offers
- `GET /announcements` - Get announcements
- `GET /pricing` - Get pricing tiers
- `GET /refreshments` - Get available refreshments
- `GET /user_profile.php` - Get user profile
- `PUT /user_profile.php` - Update user profile

---

## 🐛 Common Issues & Solutions

### **Build Errors**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps
npm run build
```

### **Database Connection Failed**
- Check credentials in `db.php`
- Verify database exists
- Ensure MySQL is running

### **CORS Errors**
- Check `.htaccess` files are uploaded
- Verify CORS headers in `db.php`

### **Images Not Loading**
- Check file permissions (755 for folders, 644 for files)
- Verify `uploads/` folder exists
- Check image paths use `fixImageUrl()` helper

---

## 📞 Support & Maintenance

### **Admin Account**
- Email: `prime1@gmail.com`
- Access: `/admin` route

### **Database Backups**
- Recommended: Daily automated backups
- Store backups in separate location
- Test restore process regularly

### **Monitoring**
- Set up uptime monitoring
- Configure error tracking
- Monitor server logs

---

## 🎯 Roadmap

### **Upcoming Features**
- [ ] Payment integration (Stripe)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Automated testing
- [ ] CI/CD pipeline
- [ ] Live chat support
- [ ] Loyalty program
- [ ] API rate limiting
- [ ] Two-factor authentication

---

## 📄 License

[Add your license information here]

---

## 👥 Contributors

[Add contributor information here]

---

## 📞 Contact

- **Website**: https://primeone.space
- **Email**: info@primeone.space
- **Phone**: +94 70 623 3612
- **Address**: 146B, Goodshed Road, Thonikkal, Vavuniya, Sri Lanka

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- shadcn for beautiful UI components
- Resend for email infrastructure
- All open-source contributors

---

**Last Updated**: February 16, 2026  
**Version**: 1.0.0  
**Status**: Pre-Production
