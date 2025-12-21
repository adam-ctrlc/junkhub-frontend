import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  ArrowLeft,
  Quote,
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Chidrick Galario",
      role: "Project Manager",
      email: "galariochidrick@gmail.com",
      phone: "+63 9705867487",
      location: "Pag-asa, Bolonsiri, Camaman-an",
      image: "/team/Chidrick.jpg",
    },
    {
      name: "Reggie Abrera",
      role: "Frontend Specialist",
      email: "abrera.reggie2004@gmail.com",
      phone: "+63 9069150347",
      location: "Zone 6, San Lazaro, Agora Lapasan",
      image: "/team/Reggie.jpg",
    },
    {
      name: "Joebert Zarate",
      role: "Backend Engineer",
      email: "zarate.joebert06@gmail.com",
      phone: "+63 9617761182",
      location: "Sta. Cruz, Tagoloan, Misamis Oriental",
      image: "/team/Joebert.jpg",
    },
    {
      name: "Godwin Acido",
      role: "UX/UI Designer",
      email: "acidogodwin17@gmail.com",
      phone: "+63 9944826977",
      location: "143 Tiano Del Pilar St. CDO",
      image: "/team/Godwin.jpeg",
    },
    {
      name: "Jeffrey Pangan Jr",
      role: "Full Stack Developer",
      email: "jeffreypangan23@gmail.com",
      phone: "+63 9943742131",
      location: "Bauk Bauk Balingoan Misamis Oriental",
      image: "/team/Jeffrey.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FCD34D]/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all hover:-translate-x-1 mb-12 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="text-center mb-20 relative z-10">
          <span className="text-[#F59E0B] font-bold tracking-wider uppercase text-sm mb-2 block">
            The Minds Behind The Magic
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Meet Our{" "}
            <span className="relative inline-block">
              Team
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#FCD34D] -z-10 opacity-60 skew-x-[-10deg]"></span>
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We are a group of passionate individuals dedicated to
            revolutionizing waste management through innovative technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FCD34D] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-3xl"></div>

              <div className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative z-10 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="px-2 pb-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#F59E0B] transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-400 font-medium mb-4 uppercase text-sm tracking-wider">
                  {member.role}
                </p>

                {/* Social Icons */}
                <div className="flex justify-start gap-4 mb-6">
                  {[Linkedin, Github, Twitter].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="p-2 bg-gray-50 text-gray-400 hover:bg-[#FCD34D] hover:text-white rounded-xl transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-600 group/item hover:text-gray-900 transition-colors">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover/item:text-[#F59E0B] group-hover/item:bg-[#FEF3C7] transition-all">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm pt-1.5 break-all">
                      {member.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 group/item hover:text-gray-900 transition-colors">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover/item:text-[#F59E0B] group-hover/item:bg-[#FEF3C7] transition-all">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm">{member.phone}</span>
                  </div>

                  <div className="flex items-start gap-3 text-gray-600 group/item hover:text-gray-900 transition-colors">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover/item:text-[#F59E0B] group-hover/item:bg-[#FEF3C7] transition-all">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm pt-1.5 leading-snug">
                      {member.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCD34D]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <Quote className="text-[#FCD34D] w-12 h-12 mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 max-w-3xl mx-auto">
            "Innovation distinguishes between a leader and a follower."
          </h2>
          <p className="text-gray-500 font-medium">- Steve Jobs</p>
        </div>

        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} JunkHub. Built with precision and
            passion.
          </p>
        </footer>
      </div>
    </div>
  );
}
