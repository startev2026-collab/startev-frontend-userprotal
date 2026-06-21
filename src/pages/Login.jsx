import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLightningBolt, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.login, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card slide-up">
        <div className="login-brand">
          <img src="/logo.jpeg" alt="StartEv" style={{ height: '120px', objectFit: 'contain', margin: '0 auto var(--space-md)', display: 'block' }} />
          <p>Sign in to your account</p>
        </div>

        <div style={{
          marginTop: '1.25rem',
          padding: '12px 16px',
          background: 'rgba(56, 142, 60, 0.08)',
          border: '1px solid rgba(56, 142, 60, 0.2)',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          wordBreak: 'break-word'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Demo Credentials</span><br />
          Gmail: <strong>karthik@gmail.com</strong><br />
          Password: <strong>123456</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Phone Number</label>
            <input className="form-input" type="text" placeholder="Enter email or phone"
              value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input className="form-input" type={showPassword ? "text" : "password"} placeholder="Enter password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                style={{ paddingRight: '40px', width: '100%' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '10px', background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '3px' }}
            />
            <label htmlFor="terms" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I agree to the <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} style={{ color: 'var(--primary)', fontWeight: '600' }}>Terms & Conditions</a>
            </label>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading || !termsAccepted} type="submit">
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>
      </div>

      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal" style={{ maxWidth: '650px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineLightningBolt /> START EV Terms & Conditions
              </h2>
              <button
                onClick={() => setShowTermsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', padding: 'var(--space-xl)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.05rem', borderBottom: '2px solid var(--primary-glow)', paddingBottom: '4px' }}>
                  START EV – TERMS & CONDITIONS OF SERVICE
                </h3>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>1. Acceptance of Terms</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  By creating an account, uploading identification documents, renting an electric vehicle (the "Vehicle"), or using any services provided by START EV, you ("User" or "You") agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>2. Eligibility & Documentation Requirements</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>To use START EV services, the User must strictly fulfill the following criteria:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Be at least 18 years of age.</li>
                  <li>Hold a valid, active Driving License applicable to the specific class of rented vehicle under the Indian Motor Vehicles Act. (Note: A PAN Card is accepted strictly as an additional identity proof, not as a replacement for a valid driving license).</li>
                  <li>Provide accurate, complete, and up-to-date information during account registration.</li>
                  <li>Comply with all local, state, and central laws of India.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>3. Account Registration & Security</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>Users must create a digital account and submit authentic copies of the following:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                  <li>Full Legal Name (as appearing on government records).</li>
                  <li>Active Mobile Number and Email Address.</li>
                  <li>Current Residential Address Proof.</li>
                  <li>Government-issued Identification (Aadhar Card / Passport / PAN Card).</li>
                  <li>Valid Driving License.</li>
                  <li>Real-time Selfie/Photograph for facial biometric verification.</li>
                </ul>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                  START EV reserves the absolute right to approve, reject, suspend, or terminate any account at its sole discretion without assigning any reason. Submission of forged, altered, expired, or misleading documents will result in immediate account termination, forfeiture of security deposits, and immediate reporting to law enforcement authorities.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>4. Authorized Vehicle Usage & Restrictions</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>The vehicle rented to the User is strictly for personal use under the following conditions:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li><strong>No Subletting:</strong> The vehicle shall be operated only by the registered User. It must not be sublet, transferred, sold, or lent to any third party.</li>
                  <li><strong>Safety Equipment:</strong> The User must wear a properly fastened helmet at all times while operating the vehicle.</li>
                  <li><strong>Prohibited Activities:</strong> The User shall not modify the vehicle, open or tamper with the battery compartment, bypass speed governors, or alter internal electrical/mechanical systems.</li>
                  <li><strong>Lawful Operation:</strong> The vehicle must not be used for racing, commercial overloading, off-roading, towing, or any illegal transportation or any illegal activities (e.g., drunk driving, driving without a license, or carrying unauthorized loads such as drugs or prohibited excise articles or any other prohibited items).</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>5. Battery Care, Charging, & Water Damage</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>The User is solely responsible for charging the vehicle using approved charging infrastructure and compatible power outlets as specified in the user manual.</li>
                  <li>Any damage to the battery pack, charging port, or electrical systems resulting from sub-standard power sources, deep discharge (leaving the battery at 0% for prolonged periods), or driving through waterlogged streets/floods shall be treated as gross user negligence.</li>
                  <li>The User will be billed the full cost of battery pack replacement and associated labor in such events.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>6. Rental Charges, Deposits, & Payments</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Rental fees must be paid in advance according to the selected rental plan.</li>
                  <li>Applicable security deposits must be paid and cleared before vehicle delivery or activation.</li>
                  <li>Late payments or failure to maintain a positive balance will attract financial penalties, and START EV reserves the right to remotely disable the vehicle and suspend services for non-payment.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>7. Vehicle Maintenance, Accidents, & Damages</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>The User must return the vehicle in substantially the same condition as received, excluding normal wear and tear.</li>
                  <li>In the event of an accident, mechanical defect, or breakdown, the User must notify START EV customer support immediately.</li>
                  <li><strong>Insurance Limitation:</strong> START EV maintains insurance. However, if an insurance claim is rejected or voided by the insurer due to the user's unlawful conduct (e.g., drunk driving, driving without a license, or carrying unauthorized loads), the User shall be personally liable for all third-party property damage, bodily injury, legal claims, and the full repair cost of the vehicle.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>8. Traffic Violations, Penalties, & Theft</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>The User is solely and legally responsible for all traffic fines, parking violations, towing charges, and legal penalties incurred during the rental period. START EV reserves the right to recover these charges directly from the User's linked payment methods or security deposits.</li>
                  <li>In case of theft or total loss of the vehicle, the User must immediately inform START EV and file a police First Information Report (FIR) within 2 hours. Failure to follow security protocols (e.g., leaving keys in the vehicle) will make the User fully liable for the replacement cost of the vehicle.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>9. Breakdown Assistance Range</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li><strong>Within 10 Kilometers:</strong> If the vehicle experiences a natural mechanical/electrical breakdown, START EV will provide free roadside support or a replacement vehicle within a 10 km radius of the nearest service hub.</li>
                  <li><strong>Beyond 10 Kilometers:</strong> For breakdowns occurring outside the 10 km radius, the User must bear additional transportation, recovery, or towing charges. Roadside assistance will be completely denied if the breakdown is caused by an accident, waterlogging, or unauthorized user modifications.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>10. Limitation of Liability & Governing Law</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>START EV shall not be liable for any indirect, incidental, or consequential damages, including personal injury or death, resulting from the use of its vehicles, except where required by law.</li>
                  <li>These Terms shall be governed exclusively by the laws of India. Any legal disputes arising from this agreement shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.</li>
                </ul>

                <div style={{
                  marginTop: '1.25rem',
                  padding: '12px 16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  lineHeight: '1.6'
                }}>
                  I, [Full Name], S/o / D/o / W/o [Father's/Spouse's Name Full Address], hereby declare that I have carefully read, fully understood, and unconditionally accepted all the terms and conditions outlined above. I confirm that I am of legal age, of sound mind, and am providing my consent freely and without any external pressure. All details submitted by me are true and correct. I understand that if any of the stated information is found to be false, misleading, or incorrect, my [Application / Employment/ Registration] is liable to be cancelled immediately without notice, and I may face appropriate legal action.
                </div>
              </div>

              <div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.05rem', borderBottom: '2px solid var(--primary-glow)', paddingBottom: '4px' }}>
                  Security Deposit Policy
                </h3>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>1. Security Deposit Requirement</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  All customers must pay a refundable security deposit before vehicle pickup. The deposit amount may vary depending on the vehicle category and rental duration.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>2. Purpose of Security Deposit</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>The security deposit is collected to cover:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Vehicle damage beyond normal wear and tear</li>
                  <li>Traffic fines, challans, or legal penalties incurred during the rental period</li>
                  <li>Late return charges</li>
                  <li>Missing accessories, keys, chargers, or documents</li>
                  <li>Unpaid rental fees or other outstanding charges</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>3. Deposit Refund</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  The security deposit will be refunded after: Vehicle inspection is completed, no damages are found, no pending fines or dues exist, and all accessories and documents are returned.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>4. Refund Timeline</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Approved security deposit refunds will be processed within 3–7 business days after vehicle return and verification.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>5. Partial Deduction</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>START EV reserves the right to deduct reasonable amounts from the security deposit for:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Repair costs</li>
                  <li>Cleaning charges for excessive dirt or misuse</li>
                  <li>Traffic penalties</li>
                  <li>Late return fees</li>
                  <li>Any other charges arising from violation of rental terms</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>6. Complete Forfeiture of Deposit</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>The security deposit may be fully forfeited in cases involving:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Vehicle theft due to customer negligence</li>
                  <li>Intentional vehicle damage</li>
                  <li>Use of the vehicle for illegal activities</li>
                  <li>Providing false documents or identity information</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>7. Security Deposit Amount</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                  A refundable security deposit of ₹2,000 is required for every vehicle rental booking.
                </p>
              </div>

              {/* Privacy Policy */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.05rem', borderBottom: '2px solid var(--primary-glow)', paddingBottom: '4px' }}>
                  Privacy Policy for START EV
                </h3>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Last Updated: June 19, 2026
                </p>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Welcome to START EV. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how START EV collects, uses, stores, and protects your information when you use our website, mobile application, and EV rental services.
                </p>
                
                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>1. About START EV</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  START EV provides electric two-wheeler rental services to customers. By using our services, you agree to the practices described in this Privacy Policy.
                </p>
                
                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>2. Information We Collect</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>Personal Information</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Full name</li>
                  <li>Mobile number</li>
                  <li>Email address</li>
                  <li>Residential address</li>
                  <li>Date of birth</li>
                  <li>Driving License details</li>
                  <li>Government-issued identification documents (when required)</li>
                  <li>Profile photographs (if required for verification)</li>
                </ul>
                
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>Payment Information</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Transaction details</li>
                  <li>Payment status</li>
                  <li>Security deposit information</li>
                </ul>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                  Note: START EV does not store complete card or banking details. Payments are processed through authorized payment service providers.
                </p>

                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>Vehicle and Usage Information</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Booking history</li>
                  <li>Rental duration</li>
                  <li>Vehicle usage information</li>
                  <li>Pickup and drop-off details</li>
                </ul>

                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>Location Information</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Real-time location data during rental periods</li>
                  <li>GPS information from rented vehicles for safety, theft prevention, and fleet management</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>3. How We Use Your Information</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>We use your information to:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Create and manage your account</li>
                  <li>Verify your identity and driving eligibility</li>
                  <li>Process bookings and payments</li>
                  <li>Manage security deposits</li>
                  <li>Provide customer support</li>
                  <li>Prevent fraud and misuse</li>
                  <li>Track and recover vehicles when necessary</li>
                  <li>Improve our services and customer experience</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>4. Information Sharing</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>START EV does not sell your personal information. We may share information with:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Payment gateway providers</li>
                  <li>Verification service providers</li>
                  <li>Government authorities when legally required</li>
                  <li>Law enforcement agencies when necessary</li>
                  <li>Business partners assisting in service delivery</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>5. Data Security</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  We implement reasonable technical and organizational security measures to protect your information from unauthorized access, misuse, alteration, or disclosure. However, no method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>6. Vehicle GPS Tracking</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>All START EV vehicles may contain GPS tracking systems. By renting a vehicle, you consent to location tracking for:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Vehicle security</li>
                  <li>Theft prevention</li>
                  <li>Fleet management</li>
                  <li>Emergency assistance</li>
                  <li>Compliance with rental terms</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>7. Data Retention</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>We retain your information for as long as necessary to:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Provide our services</li>
                  <li>Meet legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce agreements</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>8. Your Rights</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>You may:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request account deletion</li>
                  <li>Withdraw certain permissions where legally permitted</li>
                </ul>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>Requests can be submitted through our contact details below.</p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>9. Cookies and Analytics</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>Our website and application may use cookies and analytics tools to:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Improve website performance</li>
                  <li>Remember user preferences</li>
                  <li>Analyze service usage</li>
                  <li>Enhance customer experience</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>10. Children's Privacy</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  START EV services are intended only for individuals who are legally eligible to operate a motor vehicle. We do not knowingly collect information from minors.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>11. Changes to This Privacy Policy</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  START EV may update this Privacy Policy from time to time. Updated versions will be posted on our website and application.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>12. Contact Information</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <strong>START EV</strong><br />
                  Electric Two-Wheeler Rental Services<br />
                  Email: supportstartev@gmail.com<br />
                  Phone: +91 7671861942<br />
                  For privacy-related concerns, contact us at supportstartev@gmail.com
                </p>
              </div>

              {/* Refund & Cancellation Policy */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.05rem', borderBottom: '2px solid var(--primary-glow)', paddingBottom: '4px' }}>
                  Refund & Cancellation Policy – START EV
                </h3>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Last Updated: June 19, 2026
                </p>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  This Refund and Cancellation Policy applies to all bookings made through START EV's website, mobile application, or customer support channels.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>1. Booking Cancellation by Customer</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>More than 24 Hours Before Pickup</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Customers may cancel the booking free of charge.</li>
                  <li>Any advance rental amount paid will be refunded.</li>
                </ul>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>Less than 24 Hours Before Pickup</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>A cancellation fee of up to 20% of the booking amount may be deducted.</li>
                  <li>The remaining amount will be refunded.</li>
                </ul>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>After Rental Start Time</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>No refund will be provided if the customer fails to collect the vehicle or cancels after the rental period has started.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>2. Security Deposit Refund</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>Security deposits are refundable subject to vehicle inspection. Refunds will be processed after confirming:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>No vehicle damage</li>
                  <li>No traffic violations</li>
                  <li>No unpaid rental charges</li>
                  <li>No missing accessories</li>
                </ul>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5', fontWeight: 'bold' }}>Refund Timeline</p>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Security deposit refunds will normally be processed within 3–7 business days after vehicle return.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>3. Early Return of Vehicle</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  If a customer returns the vehicle before the booking end time, no refund for unused rental hours or days will be provided unless approved by START EV.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>4. Cancellation by START EV</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>START EV reserves the right to cancel a booking due to:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Vehicle unavailability</li>
                  <li>Maintenance issues</li>
                  <li>Incorrect customer information</li>
                  <li>Suspected fraud</li>
                  <li>Safety concerns</li>
                </ul>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>In such cases, eligible payments made by the customer will be refunded in full.</p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>5. Non-Refundable Situations</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>Refunds will not be provided for:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>No-show bookings</li>
                  <li>Violation of rental terms</li>
                  <li>Driving without a valid license</li>
                  <li>Vehicle misuse</li>
                  <li>Booking suspension due to customer misconduct</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>6. Refund Processing</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>Refunds will be credited to the original payment method used for the booking. Actual credit timelines may vary depending on:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Bank processing times</li>
                  <li>Payment gateway policies</li>
                  <li>UPI or card network processing</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>7. Contact Us</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <strong>START EV</strong><br />
                  Email: supportstartev@gmail.com<br />
                  Phone: +91 7671861942
                </p>
              </div>

              {/* Terms & Conditions summary provided in the prompt */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.05rem', borderBottom: '2px solid var(--primary-glow)', paddingBottom: '4px' }}>
                  Additional Terms & Conditions – START EV
                </h3>
                
                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>Eligibility</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Rider must be at least 18 years old.</li>
                  <li>A valid Driving License is mandatory.</li>
                  <li>Customers must provide accurate information during registration.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>Vehicle Usage</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Vehicles must be used only for lawful purposes.</li>
                  <li>Sub-renting is strictly prohibited.</li>
                  <li>Racing, stunts, and illegal activities are prohibited.</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>Customer Responsibility</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>Customers are responsible for:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  <li>Vehicle safety during the rental period</li>
                  <li>Traffic fines and penalties</li>
                  <li>Damage caused by negligence or misuse</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>GPS Tracking</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  All START EV vehicles may be GPS-tracked for safety and security purposes.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>Limitation of Liability</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  START EV shall not be liable for indirect, incidental, or consequential damages arising from the use of rented vehicles.
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.25rem' }}>Policy Updates</h4>
                <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  START EV may update these policies at any time. Updated versions will be published on the official website.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowTermsModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setTermsAccepted(true); setShowTermsModal(false); }}>Accept & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
