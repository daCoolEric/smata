"use client";

import { motion } from "framer-motion";

const AuthTransition = ({ children }) => {
  return (
    <div className="min-h-screen m-auto bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-screen-sm mx-auto"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AuthTransition;
