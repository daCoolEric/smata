// components/AppFooter.jsx
import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function AppFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-6 w-6 text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">Smata</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your intelligent study companion
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            {/* Add other footer columns if needed */}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Smata. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {/* <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a> */}
            {/* Add other social links */}
          </div>
        </div>
      </div>
    </footer>
  );
}
