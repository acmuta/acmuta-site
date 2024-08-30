// app/components/Connect.tsx
'use client';

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";             //using emailjs to send mail

const Connect = () => {
    const formRef = useRef<HTMLFormElement>(null); 
    const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        "service id",                  // Replace with service id
        "template id",                  // Replace with template id
        {
          from_name: form.name,
          to_name: "ACM",
          from_email: form.email,
          to_email: "acm mail",            // Replace with ACM mail
          message: form.message,
        },
        "public key"                       // Replace with public key
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
    <div className="flex flex-col gap-10">
      <h1>Connect</h1>
      <p>This is the connect page.</p>

      {/* Contact Form */}
      <div className="p-8 rounded-2xl">
        <h3>Connect with Me</h3>
        <p>Feel free to drop me a message using the form below.</p>
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
