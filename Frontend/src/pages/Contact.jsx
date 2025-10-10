import React from "react";
import { Phone, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  const whatsappNumber = "+919876543210";
  const callNumber = "+919876543210";
  const email = "fashionhub@example.com";
  const location = "Near City Mall, Lucknow";

  return (
    <div className="font-sans bg-[#fff9fb]">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-pink-500 text-white rounded-xl shadow-lg p-10 text-center mx-4 md:mx-auto mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Contact FashionHub
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl drop-shadow-sm mb-8">
          Have questions or want to place an order? Reach out via WhatsApp, Call, or Email.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-500 hover:text-white hover:bg-green-500 font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <MessageCircle size={20} /> WhatsApp Us
          </a>
          <a
            href={`tel:${callNumber}`}
            className="bg-white text-blue-700 hover:text-white hover:bg-blue-700 font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Phone size={20} /> Call Now
          </a>
          <a
            href={`mailto:${email}`}
            className="bg-white text-pink-500 hover:text-white hover:bg-pink-500 font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            📧 Email Us
          </a>
        </div>

        {/* Store Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-10 text-gray-700 text-left md:text-center">
          <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <MapPin size={24} className="text-blue-700" />
            <p><span className="font-semibold">Location:</span> {location}</p>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <Phone size={24} className="text-blue-700" />
            <p><span className="font-semibold">Phone:</span> {callNumber}</p>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <MessageCircle size={24} className="text-blue-700" />
            <p><span className="font-semibold">Email:</span> {email}</p>
          </div>
        </div>

        {/* Store Hours */}
        <div className="mt-10 text-gray-700 text-center">
          <p className="font-semibold text-lg mb-2">🕒 Store Hours:</p>
          <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-10 rounded-xl overflow-hidden shadow-lg mx-4 md:mx-auto">
        <iframe
          title="FashionHub Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.1234567890!2d80.946166!3d26.846693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd1234567890%3A0xabcdef1234567890!2sCity%20Mall%2C%20Lucknow!5e0!3m2!1sen!2sin!4v1696338721234!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="rounded-xl"
        ></iframe>
      </section>

    </div>
  );
};

export default Contact;
