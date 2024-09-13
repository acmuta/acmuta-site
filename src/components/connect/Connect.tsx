"use client";

// import React, { useRef, useState } from "react";
// import emailjs from "@emailjs/browser"; // using emailjs to send mail
import { FaLinkedin, FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa"; // import icons
import { motion } from "framer-motion";
import { slideIn } from "@/utils/motion";
import Image from "next/image";

const Connect = () => {
  return (
    <div className="relative flex flex-col md:flex-row gap-10 p-8 overflow-hidden">
    {/* Social Links Box */}
    <div
      className="backdrop-blur-md bg-white/10 border-2 border-white/70 rounded-[30px] p-16 flex flex-col items-start text-white w-full md:w-1/2 z-30"
    >
      <h3 className="text-2xl font-bold mb-8">connect with us!</h3>
      <ul className="space-y-6">
        <li className="flex items-center gap-4 text-xl">
          <FaLinkedin className="h-11 w-11" />
          <a
            href="https://www.linkedin.com/company/acmuta/mycompany/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li className="flex items-center gap-4 text-xl">
          <FaInstagram className="h-11 w-11" />
          <a
            href="https://www.instagram.com/acmuta/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </li>
        <li className="flex items-center gap-4 text-xl">
          <FaDiscord className="h-11 w-11" />
          <a
            href="https://discord.gg/MdyAfWhM"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </li>
        <li className="flex items-center gap-4 text-xl">
          <FaEnvelope className="h-11 w-11" />
          <a href="mailto:acm.uta@gmail.com">acm.uta@gmail.com</a>
        </li>
      </ul>
    </div>

      {/* crystal 2 */}
      <div className="absolute top-[20%] md:top-[-30%] w-[400px] h-[400px] md:w-[680px] md:h-[680px] left-[60%] transform -translate-x-1/2 md:-translate-x-[30%] z-0 animate-float">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal 2"
          layout="fill"
          className="object-contain rotate-[64deg] scale-x-[-1] blur-none md:blur-[3px]"
        />
      </div>

      {/* crystal 2 */}
      <div className="absolute top-[40%] md:top-[0%] w-[280px] h-[280px] md:w-[350px] md:h-[350px] left-[50%] transform -translate-x-1/2 md:-translate-x-[10%] z-0 animate-float">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal 2"
          layout="fill"
          className="object-contain rotate-[38deg] scale-x-[-1] blur-[2px] md:blur-[3px]"
        />
      </div>

      {/* crystal 1 */}
      <div className="absolute top-[35%] md:top-[20%] w-[380px] h-[380px] md:w-[650px] md:h-[650px] left-[40%] transform -translate-x-1/2 md:-translate-x-[50%] z-0 animate-float">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal 1"
          layout="fill"
          className="object-contain scale-x-[-1] rotate-[1deg] blur-[2px] md:blur-sm"
        />
      </div>
    </div>

);
};


export default Connect;
