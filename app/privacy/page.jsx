// app/privacy/page.jsx
export default function PrivacyPage() {
  return (
    <main className="prose prose-sm md:prose-base max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          1. Information We Collect
        </h2>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Examples
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-600">
                  Account Data
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  Email, name (Google Auth)
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  User authentication
                </td>
              </tr>
              {/* Add other rows */}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add all other sections */}

      <section className="mt-12 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Your Rights
        </h2>
        <p className="text-gray-600 mb-4">
          To exercise your privacy rights, contact us at{" "}
          <a
            href="mailto:privacy@getsmata.xyz"
            className="text-purple-600 hover:underline"
          >
            privacy@getsmata.xyz
          </a>
          .
        </p>
      </section>
    </main>
  );
}
