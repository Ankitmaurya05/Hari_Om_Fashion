import React from "react";
import { Link } from "react-router-dom";
import shop from "../assets/free/shop.jpg"
import ownner from "../assets/catagery/kurti.jpg"
const About = () => {
  return (
    <div className="font-sans bg-[#fff9fb]">

      {/* 🌸 Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-pink-500 py-20 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          About FashionHub
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl drop-shadow-sm">
          Stylish Wear — Your one-stop boutique for elegant kurtis, gowns, lehengas, and trendy jeans. We bring you premium fashion with the perfect blend of ethnic and western styles.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block bg-white text-pink-500 hover:text-white hover:bg-pink-500 transition px-6 py-3 rounded-lg font-semibold shadow-lg"
        >
          Shop Now
        </Link>
      </section>

      {/* 🏬 Our Story Section */}
      <section className="py-20 px-4 container mx-auto flex flex-col md:flex-row items-center gap-10">
        <img
          src={shop}
          alt="Shop"
          className="w-full md:w-1/2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[#1565c0] mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            FashionHub started with a dream to bring premium ethnic and western wear to women in Lucknow. Our mission is to provide stylish, comfortable, and high-quality apparel that makes every woman feel confident and beautiful.
          </p>
          <p className="text-gray-700">
            We handpick every collection, ensuring trendy designs, perfect fits, and a delightful shopping experience for all our customers.
          </p>
        </div>
      </section>

      {/* 💎 Why Choose Us */}
      <section className="bg-white py-20 text-center px-4 shadow-inner rounded-lg mx-4 md:mx-auto">
        <h2 className="text-3xl font-bold text-[#1565c0] mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Quality Fabrics", desc: "We use only premium fabrics for lasting comfort and style." },
            { title: "Trendy Designs", desc: "Our collections follow the latest fashion trends every season." },
            { title: "Customer Satisfaction", desc: "We prioritize our customers and ensure a delightful shopping experience." },
            { title: "Affordable Prices", desc: "Premium fashion doesn’t have to break your budget." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl p-6 shadow-md hover:shadow-lg transition hover:-translate-y-1"
            >
              <h3 className="font-bold text-lg mb-2 text-[#1565c0]">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 👩 Meet the Founder */}
      <section className="py-20 px-4 container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#1565c0] mb-8">Meet Our Founder</h2>
        <img
          src={ownner}
          alt="Founder"
          className="w-48 h-48 mx-auto rounded-full mb-4 shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <p className="text-gray-700 max-w-xl mx-auto">
          Anjali Sharma, the heart behind FashionHub, is passionate about bringing the finest ethnic and western fashion to women of all ages. Her vision is to empower women through style.
        </p>
      </section>

      {/* 🛍️ Call-to-Action */}
      <section className="bg-gradient-to-r from-blue-700 to-pink-500 text-white py-16 text-center rounded-xl mx-4 md:mx-auto my-12 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore Our Exclusive Collections</h2>
        <p className="mb-6">Discover the perfect outfit for every occasion.</p>
        <Link
          to="/shop"
          className="bg-white text-pink-500 hover:bg-pink-500 hover:text-white transition px-6 py-3 rounded-lg font-semibold shadow-lg"
        >
          Shop Now
        </Link>
      </section>
    </div>
  );
};

export default About;
