import React from 'react';
import { Helmet } from 'react-helmet';

const Personas = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>Page Not Found | StayAfrika</title>
      </Helmet>
      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Page Not Available</h1>
        <p className="text-lg text-gray-600 mb-8">This information is currently not accessible.</p>
      </div>
    </div>
  );
};

export default Personas;