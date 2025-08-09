import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaRocket, FaUsers, FaMobile, FaGlobe } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: 'Real-time Tracking',
      description: 'Monitor your mutual fund transfers in real-time with detailed status updates and notifications.'
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Bank-grade security with encrypted data transmission and secure authentication protocols.'
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: 'Fast Execution',
      description: 'Execute transfers quickly with our streamlined process and automated workflows.'
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'Multi-user Support',
      description: 'Support for multiple users with role-based access control and permissions.'
    },
    {
      icon: <FaMobile className="w-8 h-8" />,
      title: 'Mobile Responsive',
      description: 'Access your account from any device with our responsive web application.'
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: 'Global Access',
      description: '24/7 access to your mutual fund portfolio from anywhere in the world.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your
              <span className="text-gradient block">Mutual Fund Transfers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Manage, track, and execute mutual fund transfers efficiently with our comprehensive platform. 
              Get real-time updates, secure transactions, and seamless user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mutual Transfer?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to manage your mutual fund transfers efficiently and securely.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Mutual Transfer for their mutual fund management needs.
          </p>
          <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Transfers Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">₹100Cr+</div>
              <div className="text-gray-600">Total Value</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
