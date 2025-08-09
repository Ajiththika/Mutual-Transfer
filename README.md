# Mutual Transfer Project

A full-stack web application for mutual fund transfers with Django backend and React frontend.

## Project Structure

```
mutual-transfer/
├── backend/                 # Django backend
│   ├── mutual_transfer/    # Django project
│   ├── api/               # API app
│   ├── users/             # User management app
│   ├── transfers/         # Transfer management app
│   ├── requirements.txt   # Python dependencies
│   └── manage.py         # Django management script
├── frontend/              # React frontend
│   ├── public/           # Static files
│   ├── src/              # React source code
│   ├── package.json      # Node dependencies
│   └── tailwind.config.js # Tailwind configuration
└── database/              # Database scripts and migrations
```

## Features

- **Backend**: Django REST API with MySQL database
- **Frontend**: React with Tailwind CSS and Bootstrap
- **Authentication**: User registration and login system
- **Transfer Management**: Create, view, and manage mutual fund transfers
- **Responsive Design**: Mobile-first approach with modern UI/UX

## Tech Stack

### Backend
- Python 3.8+
- Django 4.2+
- Django REST Framework
- MySQL Database
- JWT Authentication

### Frontend
- React 18+
- Tailwind CSS
- Bootstrap 5
- Axios for API calls
- React Router for navigation

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup
1. Navigate to backend directory
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Configure MySQL database in settings.py
6. Run migrations: `python manage.py migrate`
7. Create superuser: `python manage.py createsuperuser`
8. Start server: `python manage.py runserver`

### Frontend Setup
1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Start development server: `npm start`

### Database Setup
1. Create MySQL database: `CREATE DATABASE mutual_transfer;`
2. Update database credentials in backend/settings.py
3. Run Django migrations

## API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/transfers/` - List all transfers
- `POST /api/transfers/` - Create new transfer
- `GET /api/transfers/{id}/` - Get transfer details
- `PUT /api/transfers/{id}/` - Update transfer
- `DELETE /api/transfers/{id}/` - Delete transfer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
