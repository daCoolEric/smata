"use client";

import { motion } from "framer-motion";

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md m-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="p-8">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-xl p-3 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.0"
              width="60"
              height="60"
              viewBox="0 0 172 132"
              preserveAspectRatio="xMidYMid meet"
              class="w-15 h-15 fill-indigo-600"
            >
              <g
                transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                <path d="M290 785 c0 -234 0 -428 0 -432 0 -5 39 -11 87 -15 118 -10 269 -36 345 -59 35 -10 66 -19 71 -19 4 0 7 188 7 419 l0 418 -72 30 c-122 50 -280 83 -405 83 l-33 0 0 -425z" />
                <path d="M1232 1199 c-94 -11 -180 -33 -269 -71 l-73 -30 0 -420 c0 -395 1 -419 18 -414 115 37 348 76 448 76 l44 0 0 435 0 435 -47 -1 c-27 -1 -81 -5 -121 -10z" />
                <path d="M148 1051 l-48 -15 0 -438 0 -438 58 0 c59 1 177 10 387 32 l120 12 -75 18 c-41 9 -140 23 -220 29 -80 7 -151 16 -157 22 -10 7 -13 104 -15 401 l-3 392 -47 -15z" />
                <path d="M1490 675 c0 -302 -3 -395 -12 -403 -7 -5 -62 -13 -123 -17 -100 -6 -311 -38 -321 -48 -6 -6 291 -36 434 -43 l122 -7 0 440 0 439 -50 16 -50 16 0 -393z" />
              </g>
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </motion.div>
  );
};

export default AuthCard;
