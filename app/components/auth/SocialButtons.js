"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaMicrosoft } from "react-icons/fa";
import Button from "../ui/Button";

const SocialButtons = ({ onGoogle, onApple, onMicrosoft, isLoading }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            onClick={onGoogle}
            disabled={isLoading}
            className="flex items-center justify-center py-2"
          >
            <FcGoogle className="h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            onClick={onApple}
            disabled={isLoading}
            className="flex items-center justify-center py-2"
          >
            <FaApple className="h-5 w-5 text-gray-800" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            onClick={onMicrosoft}
            disabled={isLoading}
            className="flex items-center justify-center py-2"
          >
            <FaMicrosoft className="h-5 w-5 text-blue-600" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialButtons;
