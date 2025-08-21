import React, { useState } from "react";
import Layout from "../../Layout";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! (This is just a demo)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-rose-600 mb-4">Contact Us</h1>
          <p className="text-gray-700 text-lg lg:text-xl max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions, suggestions, or just want to say
            hello, our team is ready to respond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-rose-600 w-6 h-6" />
              <span className="text-gray-700">support@ipsumstore.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-rose-600 w-6 h-6" />
              <span className="text-gray-700">+965 1234 5678</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-rose-600 w-6 h-6" />
              <span className="text-gray-700">Kuwait City, Kuwait</span>
            </div>
            <p className="text-gray-600 mt-4">
              Our support team is available Monday to Friday from 9:00 AM to 6:00 PM.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
