import { Navigation, Footer } from '@/components/layout'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600">
              <strong>Effective Date:</strong> December 1, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
            <p className="text-lg leading-relaxed">
              This Privacy Policy describes how vayada ("we," "us," or "our"), a transparent marketplace connecting hotels and travel creators (influencers), collects, uses, processes, and shares the personal information of our users ("Hotel" or "Creator") through our platform and related services (collectively, the "Services").
            </p>
            <p className="text-lg leading-relaxed">
              By accessing or using our Services, you agree to the terms of this Privacy Policy.
            </p>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">1. Data Controller</h2>
              <p>
                The Controller (Verantwortlicher) for data processing on our online offering, within the meaning of the General Data Protection Regulation, is:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p className="font-semibold text-gray-900">vayada UG (haftungsbeschränkt)</p>
                <p>Speditionstr. 15A</p>
                <p>40221 Düsseldorf</p>
                <p>Germany</p>
                <p className="mt-3">Represented by: Managing Director: Timo Christian Schreyer</p>
                <p>
                  Contact: E-Mail:{' '}
                  <a 
                    href="mailto:t.schreyer@vayada.com" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    t.schreyer@vayada.com
                  </a>
                </p>
                <p className="mt-3">
                  For full legal details, please refer to our{' '}
                  <a 
                    href="/imprint" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Imprint
                  </a>.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">2. Information We Collect</h2>
              <p>
                We collect information that identifies, relates to, describes, or is capable of being associated with you ("Personal Data").
              </p>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">A. Information You Provide Directly</h3>
                <p className="mb-4">
                  This information is collected when you create a profile, use our Services, or communicate with us.
                </p>
                
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Data Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Examples of Data Collected</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-medium">Account/Profile Data</td>
                        <td className="border border-gray-300 px-4 py-3">Name, email address, password, company name (for Hotels), professional title, physical address, and phone number.</td>
                        <td className="border border-gray-300 px-4 py-3">To create and manage your user account and profile.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Creator Profile Data</td>
                        <td className="border border-gray-300 px-4 py-3">Social media handles, follower count, audience demographics, niche/content categories, portfolio, content samples, and collaboration rate information.</td>
                        <td className="border border-gray-300 px-4 py-3">To showcase your profile to potential Hotel partners.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-medium">Hotel Profile Data</td>
                        <td className="border border-gray-300 px-4 py-3">Property details, unique features, location, brand guidelines, and collaboration preferences.</td>
                        <td className="border border-gray-300 px-4 py-3">To showcase the property and collaboration opportunities to Creators.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Verification Data</td>
                        <td className="border border-gray-300 px-4 py-3">Information required to confirm the identity and legitimacy of the Hotel or Creator (may include business documents or official IDs, solely for verification purposes).</td>
                        <td className="border border-gray-300 px-4 py-3">To maintain a "Verified Community" and ensure quality and trust.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-medium">Communication Data</td>
                        <td className="border border-gray-300 px-4 py-3">Messages, collaboration requests, and contact details exchanged between a Hotel and a Creator via the platform.</td>
                        <td className="border border-gray-300 px-4 py-3">To facilitate direct connection and coordination.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">B. Information Collected Automatically</h3>
                <p className="mb-4">
                  When you access our Services, we automatically collect certain data about your device and activity.
                </p>
                
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Data Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Examples of Data Collected</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-medium">Usage Data</td>
                        <td className="border border-gray-300 px-4 py-3">IP address, browser type, operating system, pages viewed, time spent on pages, and referring URLs.</td>
                        <td className="border border-gray-300 px-4 py-3">To improve platform functionality and troubleshoot errors.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Tracking Data (Cookies)</td>
                        <td className="border border-gray-300 px-4 py-3">Data collected via cookies, web beacons, and similar tracking technologies.</td>
                        <td className="border border-gray-300 px-4 py-3">To remember your preferences, provide personalized experiences, and analyze traffic.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-medium">Performance Data</td>
                        <td className="border border-gray-300 px-4 py-3">Metrics related to collaborations, such as link clicks, booking conversions, engagement rates, and other data used to "Track Real Impact."</td>
                        <td className="border border-gray-300 px-4 py-3">To provide measurable results to Hotels and build a reputation for Creators.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">3. How We Use Your Information</h2>
              <p>We use your personal data for the following purposes:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-4">
                <li><strong>To Operate the Marketplace:</strong> To provide and maintain the Services, including managing accounts and profiles, and processing user verification.</li>
                <li><strong>To Facilitate Connections:</strong> To allow Hotels to browse and filter Creators, and Creators to discover opportunities and apply for campaigns.</li>
                <li><strong>For Direct Collaboration:</strong> To share contact information (name, email, etc.) between the Hotel and Creator only after a collaboration request has been mutually accepted, allowing them to coordinate directly.</li>
                <li><strong>To Measure and Report:</strong> To track and analyze collaboration performance and provide reports to both parties.</li>
                <li><strong>To Communicate:</strong> To send service-related, administrative, or account-specific notifications, and, where permitted, marketing communications about vayada features.</li>
                <li><strong>For Security and Compliance:</strong> To prevent fraud, enforce our Terms, comply with legal obligations, and protect the rights and safety of vayada and its users.</li>
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">4. How We Share and Disclose Your Information</h2>
              <p>We share your information in the following ways:</p>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">A. Sharing Between Users (Core Service Function)</h3>
                <p className="mb-3">
                  The key function of vayada is to enable direct connection. Therefore, certain Personal Data is shared between users:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Public Profile Information:</strong> Your vayada profile information (Hotel property details or Creator portfolio/metrics) is visible to the opposing user type on the platform.</li>
                  <li><strong>Contact Information:</strong> Once a Hotel and Creator have mutually accepted a collaboration request, we will share their direct contact details (Name, Email, Phone Number) to enable direct coordination.</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">B. Sharing with Service Providers</h3>
                <p>
                  We employ third-party companies and individuals to facilitate our Services ("Service Providers"), such as cloud hosting, payment processing, data analytics, and email delivery. These providers have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">C. Legal and Compliance</h3>
                <p>
                  We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend the rights or property of vayada, prevent fraud, or protect the personal safety of users or the public.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">5. Your Privacy Rights and Choices</h2>
              <p className="mb-4">
                Depending on your location, you may have the following rights regarding your Personal Data:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Access:</strong> You have the right to request a copy of the Personal Data we hold about you.</li>
                <li><strong>Correction:</strong> You have the right to request that we correct any inaccurate Personal Data.</li>
                <li><strong>Deletion:</strong> You have the right to request that we delete your Personal Data, subject to certain exceptions (e.g., legal compliance).</li>
                <li><strong>Opt-Out:</strong> You can opt-out of receiving promotional or marketing emails from us by following the unsubscribe link in those emails. You may not opt-out of service-related communications (e.g., account verification, security alerts).</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us using the information in Section 7.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">6. Data Security</h2>
              <p>
                We implement reasonable security measures designed to protect the Personal Data we collect from unauthorized access, use, alteration, or destruction. Please note, however, that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">7. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold text-gray-900">vayada</p>
                <p>
                  Email:{' '}
                  <a 
                    href="mailto:privacy@vayada.com" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    privacy@vayada.com
                  </a>
                </p>
                <p>Mailing Address: Speditionstraße 15A, 40221 Duesseldorf, Germany</p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">8. Contact Form and Communication</h2>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">A. Data Processing via Contact Form</h3>
                <p className="mb-3">
                  We provide an online form on our site to allow you to contact us electronically. When you submit an inquiry, we process the data you provide. The specific fields collected include:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Required Data:</strong> Your Name, Email Address, the User Category ("I am a..."), and your Message.</li>
                  <li><strong>Optional Data:</strong> Your Phone Number, Company Name, and Country.</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">B. Purpose and Legal Basis</h3>
                <p className="mb-3">
                  We process this data solely for the purpose of answering your inquiry and the related technical administration.
                </p>
                <p>
                  <strong>Legal Basis:</strong> Processing of this data is based on Article 6(1) lit. b of the GDPR (General Data Protection Regulation), as the processing is necessary for the performance of a contract or in order to take steps at your request prior to entering into a contract (e.g., establishing a new user account or collaboration agreement).
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">C. Internal Handling and International Transfer</h3>
                <p>
                  Your inquiry is received by our Customer Service department. We do not transfer your inquiries or any associated personal data to third countries or organizations outside the European Union (EU).
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">D. Data Retention and Deletion</h3>
                <p className="mb-3">
                  We delete the data relating to your contact inquiry promptly after the inquiry has been fully handled and resolved.
                </p>
                <p>
                  However, statutory retention periods may prevent immediate deletion. This is particularly true if your inquiry is related to a contract, warranty, or guarantee claim. In such cases, we store your inquiry data only for the purpose of fulfilling legal retention obligations (e.g., commercial and tax law retention periods, typically up to ten years, as per Article 6(1) lit. c of the GDPR). We will delete your data at the latest when these statutory retention periods expire, without requiring a specific request from you.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

