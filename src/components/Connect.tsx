// app/components/Connect.tsx
'use client';

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser"; // using emailjs to send mail
import { FaLinkedin, FaInstagram, FaDiscord, FaEnvelope } from 'react-icons/fa'; // import icons

const Connect = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service id", // Replace with service id
        "template id", // Replace with template id
        {
          from_name: form.name,
          to_name: "ACM",
          from_email: form.email,
          to_email: "acm mail", // Replace with ACM mail
          message: form.message,
        },
        "public key" // Replace with public key
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 p-8">
      {/* Social Links Box */}
      <div className="backdrop-blur-sm bg-white/20 rounded-tl-none rounded-tr-3xl rounded-bl-3xl rounded-br-none p-8 flex flex-col items-start text-white w-full md:w-1/3 md:ml-0 md:relative md:left-0 md:h-full">
        <h3 className="text-lg font-bold mb-4">Connect with us!</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-2">
            <FaLinkedin className="h-6 w-6" />
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FaInstagram className="h-6 w-6" />
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FaDiscord className="h-6 w-6" />
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FaEnvelope className="h-6 w-6" />
            <a href="mailto:contact@acmutd.co">contact@acmutd.co</a>
          </li>
        </ul>
      </div>

      {/* Contact Form */}
      <div className="p-8 rounded-2xl flex-1">
        <h3>Connect with Us</h3>
        <p>Feel free to drop me a message.</p>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          <label className="flex flex-col">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name:"
              className="bg-white py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email:"
              className="bg-white py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <textarea
              rows={7}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message:"
              className="bg-white py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium"
            />
          </label>

          <button
            type="submit"
            className="bg-white py-3 px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md shadow-primary"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connect;
