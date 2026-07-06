import { motion } from 'framer-motion';

const FAQs = () => {
  const faqs = [
    {
      q: "How does the registration process work?",
      a: "Simply click 'Sign Up', enter your details, and verify your email/phone using the OTP sent to you. Your account will then be marked as 'Pending'. Once our administrators verify your credentials, your account will be approved and you can log in."
    },
    {
      q: "Can I apply to multiple companies?",
      a: "Yes, you can apply to multiple companies as long as their interview slots do not clash and you meet their specific eligibility criteria (like CGPA or required skills)."
    },
    {
      q: "How do I get my Admit Card?",
      a: "Once you successfully book an interview slot with a company, an Admit Card is automatically generated. You can download it as a PDF from your dashboard. It contains a unique QR code for attendance verification."
    },
    {
      q: "What is the AI Resume Analyzer?",
      a: "Our AI tool scans your uploaded resume against industry standards and specific job descriptions to provide an ATS (Applicant Tracking System) score, highlighting missing keywords and suggesting improvements."
    }
  ];

  return (
    <div className="pt-5 mt-5 container mb-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
        <h1 className="fw-bold text-main">Frequently Asked Questions</h1>
        <p className="text-muted lead max-w-2xl mx-auto">Find answers to common questions about the Hirovate platform and placement process.</p>
      </motion.div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item border-0 mb-3 premium-card overflow-hidden" key={index}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button 
                    className={`accordion-button fw-bold text-main ${index !== 0 ? 'collapsed' : ''} bg-white shadow-none`}
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#collapse${index}`} 
                    aria-expanded={index === 0 ? "true" : "false"} 
                    aria-controls={`collapse${index}`}
                  >
                    {faq.q}
                  </button>
                </h2>
                <div 
                  id={`collapse${index}`} 
                  className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
                  aria-labelledby={`heading${index}`} 
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-muted border-top">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
