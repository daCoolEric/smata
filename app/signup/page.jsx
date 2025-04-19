// // app/signup/page.jsx
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'

// export default function SignupPage() {
//   const [acceptedTerms, setAcceptedTerms] = useState(false)

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
//         {/* Your existing signup form */}

//         <div className="mt-6">
//           <div className="flex items-start">
//             <div className="flex items-center h-5">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 required
//                 checked={acceptedTerms}
//                 onChange={(e) => setAcceptedTerms(e.target.checked)}
//                 className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//               />
//             </div>
//             <div className="ml-3 text-sm">
//               <label htmlFor="terms" className="font-medium text-gray-700">
//                 I agree to the{' '}
//                 <Link href="/terms" className="text-purple-600 hover:underline" target="_blank">
//                   Terms of Service
//                 </Link>{' '}
//                 and{' '}
//                 <Link href="/privacy" className="text-purple-600 hover:underline" target="_blank">
//                   Privacy Policy
//                 </Link>
//               </label>
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={!acceptedTerms}
//           className={`mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//             acceptedTerms ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
//           }`}
//         >
//           Create Account
//         </button>
//       </div>
//     </div>
//   )
// }
