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
  ChevronDown,
} from "lucide-react";

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

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

              {/* Login Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setLoginDropdownOpen(true)}
                onMouseLeave={() => setLoginDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-yellow-600 transition-colors focus:outline-none">
                  Login <ChevronDown size={14} />
                </button>

                {loginDropdownOpen && (
                  <div className="absolute top-full right-0 w-48 pt-2">
                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden p-1">
                      <Link
                        to="/login/user"
                        className="block px-4 py-2 rounded-lg hover:bg-neutral-50 text-left"
                      >
                        <span className="block text-neutral-900 font-semibold">
                          User Login
                        </span>
                        <span className="block text-xs text-neutral-500">
                          For sellers & buyers
                        </span>
                      </Link>
                      <Link
                        to="/login/owner"
                        className="block px-4 py-2 rounded-lg hover:bg-neutral-50 text-left"
                      >
                        <span className="block text-neutral-900 font-semibold">
                          Owner Login
                        </span>
                        <span className="block text-xs text-neutral-500">
                          For shop owners
                        </span>
                      </Link>
                      <hr className="my-1 border-neutral-100" />
                      <Link
                        to="/signup/user"
                        className="block px-4 py-2 rounded-lg hover:bg-neutral-50 text-left"
                      >
                        <span className="block text-neutral-900 font-semibold">
                          Create Account
                        </span>
                        <span className="block text-xs text-neutral-500">
                          New to JunkHub?
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Link
              to="/choose"
              className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all hover:scale-105 flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
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
          <div className="absolute top-full left-0 w-full bg-white border-b border-neutral-100 p-6 flex flex-col gap-4 md:hidden animate-slideUp shadow-xl">
            <Link
              to="/about"
              className="text-neutral-600 font-medium py-2 border-b border-neutral-100"
            >
              About
            </Link>

            <div className="flex flex-col gap-2 py-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Login
              </span>
              <Link
                to="/login/user"
                className="text-neutral-600 font-medium pl-4 py-1 hover:text-yellow-600"
              >
                User Login
              </Link>
              <Link
                to="/login/owner"
                className="text-neutral-600 font-medium pl-4 py-1 hover:text-yellow-600"
              >
                Owner Login
              </Link>
              <Link
                to="/choose"
                className="text-neutral-600 font-medium pl-4 py-1 hover:text-yellow-600"
              >
                Create Account
              </Link>
            </div>

            <Link
              to="/choose"
              className="w-full text-center px-5 py-3 bg-yellow-400 text-neutral-900 font-semibold rounded-lg mt-2"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background Blobs */}
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

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup/user"
                className="flex-1 px-8 py-4 bg-yellow-400 text-neutral-900 font-bold rounded-xl hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="text-left">
                  <div className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                    I have junk
                  </div>
                  <div className="text-lg">Sell My Items</div>
                </div>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/signup/owner"
                className="flex-1 px-8 py-4 bg-white border-2 border-neutral-100 text-neutral-900 font-bold rounded-xl hover:border-yellow-400 hover:bg-yellow-50/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="text-left">
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    I am a buyer
                  </div>
                  <div className="text-lg">Register Shop</div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-neutral-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                  +2k
                </div>
              </div>
              <div className="text-sm">
                <p className="font-bold text-neutral-900">Trusted Community</p>
                <p className="text-neutral-500">Join 2,000+ active recyclers</p>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] w-full hidden lg:block animate-slideRight delay-200">
            {/* Composition of Images */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-20 blur-3xl animate-pulse" />

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-64 h-64 rounded-3xl overflow-hidden rotate-6 hover:rotate-0 transition-all duration-500 border-8 border-white shadow-2xl z-20">
              <img
                src="/landing/bottles.png"
                alt="Recycling Bottles"
                className="w-full h-full object-cover bg-neutral-100"
              />
            </div>

            <div className="absolute bottom-20 left-10 w-72 h-60 rounded-3xl overflow-hidden -rotate-6 hover:rotate-0 transition-all duration-500 border-8 border-white shadow-2xl z-30">
              <img
                src="/landing/workingtv.png"
                alt="Electronics"
                className="w-full h-full object-cover bg-neutral-100"
              />
            </div>

            {/* Decorative Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-md py-4 px-8 rounded-2xl border border-white/50 shadow-xl animate-float">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl text-green-600">
                  <Leaf size={28} />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 text-lg">
                    Eco-Friendly
                  </p>
                  <p className="text-sm text-neutral-500">Verified Impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-neutral-600">
              Turning your junk into cash is as easy as 1-2-3.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent border-t-2 border-dashed border-yellow-200 -z-10" />

            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center text-center group transition-all duration-300">
              <div className="w-20 h-20 rounded-2xl bg-yellow-100/80 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-500 text-white font-bold flex items-center justify-center border-4 border-white shadow-sm">
                  1
                </div>
                <div className="text-yellow-600">
                  <Recycle size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Snap & Post
              </h3>
              <p className="text-neutral-500 leading-relaxed text-sm">
                Take a photo of your recyclable items and post them on our
                marketplace in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center text-center group transition-all duration-300">
              <div className="w-20 h-20 rounded-2xl bg-blue-100/80 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center border-4 border-white shadow-sm">
                  2
                </div>
                <div className="text-blue-600">
                  <ShieldCheck size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Get Offers
              </h3>
              <p className="text-neutral-500 leading-relaxed text-sm">
                Local junk shops will bid for your items. Choose the best offer
                that works for you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center text-center group transition-all duration-300">
              <div className="w-20 h-20 rounded-2xl bg-green-100/80 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center border-4 border-white shadow-sm">
                  3
                </div>
                <div className="text-green-600">
                  <PhilippinePeso size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Get Paid
              </h3>
              <p className="text-neutral-500 leading-relaxed text-sm">
                Schedule a pickup or drop-off, complete the trade, and receive
                instant payment.
              </p>
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
              to="/signup/user"
              className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:scale-105 transition-transform text-lg flex items-center gap-2"
            >
              Start Selling Trash
            </Link>
            <Link
              to="/signup/owner"
              className="px-8 py-4 bg-white/40 backdrop-blur border-2 border-neutral-900/10 text-neutral-900 font-bold rounded-xl hover:bg-white/60 transition-colors text-lg"
            >
              Register Your Shop
            </Link>
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
