import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  PhilippinePeso,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  Leaf,
  Users,
} from "lucide-react";

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 font-['Poppins',sans-serif] overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white border-b border-neutral-200 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-yellow-400/20 group-hover:border-yellow-400 transition-colors">
              <img
                src="/landing/Logo.png"
                alt="JunkHub Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-yellow-500">Junk</span>
              <span className="text-neutral-900">HUB</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium text-neutral-600">
              <Link
                to="/about"
                className="hover:text-yellow-600 transition-colors"
              >
                About
              </Link>

              <Link
                to="/signup"
                className="hover:text-yellow-600 transition-colors"
              >
                Join as Seller
              </Link>
            </div>
            <Link
              to="/login/user"
              className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all hover:scale-105 flex items-center gap-2"
            >
              Sign In <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-neutral-100 p-6 flex flex-col gap-4 md:hidden animate-slideUp">
            <Link to="/about" className="text-neutral-600 font-medium py-2">
              About
            </Link>
            <Link to="/signup" className="text-neutral-600 font-medium py-2">
              Join as Seller
            </Link>
            <Link
              to="/login/user"
              className="w-full text-center px-5 py-3 bg-yellow-400 text-neutral-900 font-semibold rounded-lg"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background Blobs - Fixed Absolute Positioning with large scale */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-yellow-300/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100/50 border border-yellow-200 text-yellow-700 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Revolutionizing Recycling
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 leading-[1.1] tracking-tight">
              One man's <span className="text-yellow-500">Trash</span> <br />
              is another man's{" "}
              <span className="underline decoration-yellow-400/30 decoration-4 underline-offset-4">
                Treasure
              </span>
            </h1>

            <p className="text-lg text-neutral-600 leading-relaxed max-w-lg">
              JunkHub connects sellers, buyers, and recyclers. Turn your clutter
              into cash and help build a sustainable future with our secure
              marketplace.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup/owner"
                className="px-8 py-4 bg-yellow-400 text-neutral-900 font-bold rounded-xl hover:bg-yellow-300 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Start Selling Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-neutral-900">5k+</p>
                <p className="text-sm text-neutral-500 font-medium">
                  Active Users
                </p>
              </div>
              <div className="w-px h-10 bg-neutral-200" />
              <div>
                <p className="text-3xl font-bold text-neutral-900">12k+</p>
                <p className="text-sm text-neutral-500 font-medium">
                  Items Recycled
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] w-full hidden lg:block animate-slideRight delay-200">
            {/* Composition of Images */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400 rounded-full opacity-10 animate-pulse" />

            {/* Floating Elements - Using absolute positioning within the relative container for the composition */}
            <div className="absolute top-0 right-10 w-64 h-64 rounded-2xl overflow-hidden rotate-6 hover:rotate-0 transition-all duration-500 border-4 border-white z-20">
              <img
                src="/landing/bottles.png"
                alt="Recycling Bottles"
                className="w-full h-full object-cover bg-neutral-100"
              />
            </div>

            <div className="absolute bottom-20 left-10 w-72 h-60 rounded-2xl overflow-hidden -rotate-6 hover:rotate-0 transition-all duration-500 border-4 border-white z-30">
              <img
                src="/landing/workingtv.png"
                alt="Electronics"
                className="w-full h-full object-cover bg-neutral-100"
              />
            </div>

            <div className="absolute top-40 left-20 w-48 h-48 rounded-2xl overflow-hidden rotate-12 z-10 blur-[2px] opacity-80">
              <img
                src="/landing/junks.jpg"
                alt="Scrap"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur py-3 px-6 rounded-2xl border border-white/50 animate-float">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Leaf size={24} />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">
                    100% Eco-Friendly
                  </p>
                  <p className="text-xs text-neutral-500">Verified Process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose JunkHub?
            </h2>
            <p className="text-neutral-600">
              We make trading recyclable materials safe, easy, and profitable
              for everyone involved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Recycle size={32} />}
              title="Sustainable Impact"
              desc="Contribute to a greener planet by ensuring your waste materials get a second life through proper recycling channels."
              color="bg-green-100 text-green-700"
            />
            <FeatureCard
              icon={<PhilippinePeso size={32} />}
              title="Best Prices"
              desc="Get competitive market rates for your scrap materials. Real-time pricing updates ensures you get the best deal."
              color="bg-yellow-100 text-yellow-700"
            />
            <FeatureCard
              icon={<ShieldCheck size={32} />}
              title="Secure Trading"
              desc="Our platform verifies all buyers and sellers. Secure payments and verified reviews keep the community safe."
              color="bg-blue-100 text-blue-700"
            />
          </div>
        </div>
      </section>

      {/* About / Mission Section */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Building a{" "}
                <span className="text-yellow-400">Greener Future</span> <br />
                Together
              </h2>
              <div className="w-20 h-1 bg-yellow-400 mb-8 rounded-full"></div>
              <div className="space-y-6 text-neutral-300 text-lg leading-relaxed">
                <p>
                  JunkHub is more than just a marketplace—it's a movement. We
                  are dedicated to transforming how society views waste. By
                  connecting local junk shops with households and businesses, we
                  streamline the recycling process.
                </p>
                <p>
                  With secure transactions, real-time pricing, and a
                  user-friendly platform, we make junk trading efficient,
                  profitable, and eco-friendly.
                </p>
              </div>
              <div className="mt-10">
                <Link
                  to="/about"
                  className="text-yellow-400 font-semibold hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  Read our full story <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden border-8 border-white/5 relative">
                <div className="absolute inset-0 bg-yellow-400/20 mix-blend-overlay"></div>
                <img
                  src="/landing/bottles.png"
                  alt="Ecosystem"
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                />

                {/* Floating Stat Card */}
                <div className="absolute bottom-6 right-6 bg-white text-neutral-900 p-6 rounded-2xl max-w-xs">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-neutral-100 rounded-full">
                      <Users size={24} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Community First</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        Join thousands of eco-warriors making a difference.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 bg-yellow-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 mix-blend-overlay opacity-20">
          <Recycle size={400} />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Ready to clear the clutter?
          </h2>
          <p className="text-xl text-neutral-800/80 mb-10 max-w-2xl mx-auto">
            Join JunkHub today. Start selling your recyclables or find treasures
            in your local area. It's free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup/owner"
              className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:scale-105 transition-transform text-lg"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login/user"
              className="px-8 py-4 bg-white/20 backdrop-blur border border-neutral-900/10 text-neutral-900 font-bold rounded-xl hover:bg-white/30 transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-900/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-neutral-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20">
                <img
                  src="/landing/Logo.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>© 2025 JunkHub Inc.</span>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-neutral-900">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-neutral-900">
                Terms
              </Link>
              <Link to="/social" className="hover:text-neutral-900">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global CSS for custom animations that Tailwind doesn't strictly cover by default utilities */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideRight {
           animation: slideRight 0.8s ease-out forwards;
        }
        @keyframes slideRight {
           from { opacity: 0; transform: translateX(20px); }
           to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 transition-all duration-300 group cursor-default">
      <div
        className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3">{title}</h3>
      <p className="text-neutral-500 leading-relaxed">{desc}</p>
    </div>
  );
}
