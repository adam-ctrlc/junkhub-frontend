import {
  Shield,
  FileText,
  Lock,
  User,
  Globe,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import Modal from "./Modal";

export default function TermsModal({ isOpen, onClose, type }) {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100/50 hover:border-indigo-100 transition-colors">
      <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-3">
        <div className="p-2 bg-white rounded-lg border border-gray-200  text-indigo-600">
          <Icon size={20} />
        </div>
        {title}
      </h4>
      <div className="text-gray-600 leading-relaxed text-sm md:text-base pl-[52px]">
        {children}
      </div>
    </div>
  );

  const content = {
    terms: {
      title: "Terms of Use",
      headerIcon: FileText,
      intro:
        "Please read these terms carefully before using our service. These terms govern your use of JunkHub.",
      body: (
        <div className="space-y-6">
          <Section title="Acceptance of Terms" icon={CheckCircle2}>
            By accessing and using JunkHub, you agree to be bound by these Terms
            of Use and all applicable laws and regulations. If you do not agree
            with any of these terms, you are prohibited from using or accessing
            this site.
          </Section>

          <Section title="Use License" icon={FileText}>
            Permission is granted to temporarily download one copy of the
            materials (information or software) on JunkHub's website for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title.
          </Section>

          <Section title="User Accounts" icon={User}>
            When you create an account with us, you must provide us information
            that is accurate, complete, and current at all times. Failure to do
            so constitutes a breach of the Terms, which may result in immediate
            termination of your account on our Service.
          </Section>

          <Section title="Content Liability" icon={AlertCircle}>
            Our Service allows you to post, link, store, share and otherwise
            make available certain information, text, graphics, videos, or other
            material ("Content"). You are responsible for the Content that you
            post to the Service, including its legality, reliability, and
            appropriateness.
          </Section>

          <Section title="Termination" icon={Lock}>
            We may terminate or suspend access to our Service immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms.
          </Section>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      headerIcon: Shield,
      intro:
        "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.",
      body: (
        <div className="space-y-6">
          <Section title="Information Collection" icon={User}>
            We collect several different types of information for various
            purposes to provide and improve our Service to you. Types of Data
            collected include Personal Data (name, email, phone) and Usage Data
            to help us optimize your experience.
          </Section>

          <Section title="Use of Data" icon={Globe}>
            JunkHub uses the collected data for various purposes:
            <ul className="list-disc pl-5 mt-2 space-y-2 marker:text-indigo-500">
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>
                To allow you to participate in interactive features when you
                choose to do so
              </li>
              <li>To provide customer care and support</li>
            </ul>
          </Section>

          <Section title="Data Transfer" icon={Globe}>
            Your information, including Personal Data, may be transferred to —
            and maintained on — computers located outside of your state,
            province, country or other governmental jurisdiction where the data
            protection laws may differ than those from your jurisdiction.
          </Section>

          <Section title="Security of Data" icon={Lock}>
            The security of your data is important to us, but remember that no
            method of transmission over the Internet, or method of electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Data, we cannot guarantee
            its absolute security.
          </Section>
        </div>
      ),
    },
  };

  const activeContent = content[type] || content.terms;
  const HeaderIcon = activeContent.headerIcon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activeContent.title}>
      {/* Custom Header Area inside Modal Body */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <HeaderIcon size={32} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-1">
              Legal Information
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {activeContent.intro}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full w-fit">
          <Calendar size={14} />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>

      {activeContent.body}

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          Close
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl shadow-lg shadow-gray-200 hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
        >
          I Understand
        </button>
      </div>
    </Modal>
  );
}
