import React from "react";
import Layout from "../../Layout";
import { Globe, Heart, Shield } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-rose-600 mb-4">
            About IPSUM Store
          </h1>
          <p className="text-gray-700 text-lg lg:text-xl max-w-2xl mx-auto">
            At IPSUM Store, we are dedicated to providing the best products and services, making
            your shopping experience smooth, enjoyable, and reliable.
          </p>
        </div>

        {/* Values / Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transform transition duration-300">
            <Globe className="mx-auto text-rose-600 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Global Quality</h3>
            <p className="text-gray-600">
              We carefully select our products to ensure the highest quality and value for our
              customers.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transform transition duration-300">
            <Heart className="mx-auto text-rose-600 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Customer Care</h3>
            <p className="text-gray-600">
              Our team is committed to customer satisfaction and is always ready to help.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transform transition duration-300">
            <Shield className="mx-auto text-rose-600 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Trusted & Secure</h3>
            <p className="text-gray-600">
              We prioritize safety and reliability to make sure your shopping experience is
              worry-free.
            </p>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-gray-700 text-lg">
            Thank you for choosing IPSUM Store. We hope you enjoy your shopping experience with us
            and become part of our growing community of satisfied customers!
          </p>
        </div>
      </div>
    </Layout>
  );
}
