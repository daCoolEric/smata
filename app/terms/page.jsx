// app/terms/page.jsx
export default function TermsPage() {
  return (
    <main className="prose prose-sm md:prose-base max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Smata Terms of Service
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          1. Introduction
        </h2>
        <p className="text-gray-600 mb-4">
          Welcome to Smata ("we," "our," or "us"). By accessing or using our
          study companion application ("App"), you agree to be bound by these
          Terms of Service ("Terms").
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          2. Eligibility
        </h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>
            Users must be at least 13 years old (or the minimum age in their
            jurisdiction)
          </li>
          <li>
            Educators and institutions must verify credentials if using premium
            features
          </li>
        </ul>
      </section>

      {/* Add all other sections following the same pattern */}

      <section className="mt-12 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
        <p className="text-gray-600">
          For questions about these Terms, email us at{" "}
          <a
            href="mailto:legal@getsmata.xyz"
            className="text-purple-600 hover:underline"
          >
            legal@getsmata.xyz
          </a>
          .
        </p>
      </section>
    </main>
  );
}
