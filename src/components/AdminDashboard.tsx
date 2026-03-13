"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Shield,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  Settings,
  BarChart3,
  Users,
  LogOut,
  Save,
  Eye,
} from "lucide-react";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Input";
import MultiImageSelector from "@/components/MultiImageSelector";

interface AdminSession {
  token: string;
  loginAt: number;
  expiresAt: number;
}

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

// Types for projects
interface Project {
  id: string;
  title: string;
  description: string;
  type: "SaaS" | "Tools" | "Enterprise" | "Custom";
  featured: boolean;
  technologies: string[];
  images: string[];
  founders: string[];
  status: "active" | "inactive" | "development";
  createdAt: string;
  updatedAt: string;
}

// Types for copywriting data
interface CopywritingForm {
  landingPage: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
      stats: Array<{ value: string; label: string }>;
    };
    story: {
      title: string;
      content: string[];
    };
    about: {
      title: string;
      subtitle: string;
      origin: { title: string; content: string };
      background: { title: string; content: string };
      mission: { title: string; content: string };
    };
    philosophy: {
      title: string;
      subtitle: string;
      items: Array<{ title: string; description: string }>;
    };
    focus: {
      title: string;
      subtitle: string;
      items: Array<{ title: string; description: string; examples: string[] }>;
    };
    founders: {
      title: string;
      subtitle: string;
      items: Array<{
        name: string;
        location: string;
        image: string;
        background: string[];
        experience: string;
        website: string;
        medium: string;
        social: {
          linkedin: string;
          github: string;
          twitter: string;
        };
      }>;
    };
    projects: {
      title: string;
      subtitle: string;
      viewAll: string;
    };
    articles: {
      title: string;
      subtitle: string;
      viewAll: string;
      medium: Array<{
        author: string;
        mediumProfile: string;
        articles: Array<{
          title: string;
          excerpt: string;
          url: string;
          publishedAt: string;
          readTime: string;
        }>;
      }>;
    };
    contact: {
      title: string;
      subtitle: string;
      email: string;
      phone: string;
      location: string;
    };
  };
}

const defaultCopywriting: CopywritingForm = {
  landingPage: {
    hero: {
      title: "Membangun Tools yang Tepat untuk Semua Orang di Indonesia",
      subtitle: "Tech House dari Indonesia",
      description:
        "Kami membangun tools yang tepat, berdampak, dan sederhana untuk semua orang di Indonesia.",
      ctaPrimary: "Lihat Proyek Kami",
      ctaSecondary: "Hubungi Kami",
      stats: [
        { value: "2", label: "Pendiri" },
        { value: "4+", label: "Tahun Pengalaman" },
        { value: "100%", label: "Tim Indonesia" },
        { value: "∞", label: "Semangat Teknologi" },
      ],
    },
    story: {
      title: "Cerita Kami",
      content: [
        "Kisah Palu Dev House dimulai dari percakapan larut malam antara dua teman yang memiliki mimpi bersama: menggunakan teknologi untuk membuat perbedaan nyata di Indonesia.",
        "Stiven, dari Palu di Sulawesi Tengah, dan Ferdy, dari Medan di Sumatera Utara, bertemu saat studi computer science mereka. Meskipun berasal dari berbagai penjuru kepulauan, mereka menemukan frustrasi yang sama: teknologi hebat sering kali terlalu kompleks, terlalu mahal, atau bahkan tidak tersedia bagi orang yang paling membutuhkannya.",
        "Mereka bertanya pada diri sendiri: Bagaimana jika kita membangun teknologi secara berbeda? Bagaimana jika kita fokus menyelesaikan masalah nyata dengan solusi yang sederhana dan dapat diakses?",
        "Dari pertanyaan itu, Palu Dev House lahir. Dinamai sesuai kota dimana perjalanan kami dimulai, kami berkomitmen untuk membangun teknologi yang tepat, berdampak, dan sederhana untuk semua orang di Indonesia—dimulai dari tempat asal kami.",
      ],
    },
    about: {
      title: "Tentang Kami",
      subtitle:
        "Dua lulusan Computer Science dengan visi bersama untuk masa depan teknologi Indonesia",
      origin: {
        title: "Asal Usul",
        content:
          "Palu Dev House lahir dari persahabatan dua mahasiswa Computer Science dari berbagai penjuru Indonesia. Berawal dari diskusi larut malam tentang bagaimana teknologi dapat menyelesaikan masalah nyata, kami memutuskan untuk membangun sesuatu yang berarti bagi bangsa.",
      },
      background: {
        title: "Latar Belakang",
        content:
          "Dengan pengalaman di berbagai industri teknologi, kami memahami kesenjangan antara solusi enterprise dan kebutuhan bisnis lokal. Kami membawa pengetahuan global untuk memecahkan masalah Indonesia.",
      },
      mission: {
        title: "Misi",
        content:
          "Membangun tools teknologi yang tepat, berdampak, dan sederhana untuk membantu bisnis dan individu di seluruh Indonesia berkembang di era digital.",
      },
    },
    philosophy: {
      title: "Filosofi Kami",
      subtitle: "Tiga prinsip yang memandu setiap baris kode yang kami tulis",
      items: [
        {
          title: "Tepat",
          description:
            "Memahami masalah sebelum menulis solusi. Setiap fitur harus memiliki tujuan yang jelas dan menyelesaikan kebutuhan nyata pengguna.",
        },
        {
          title: "Berdampak",
          description:
            "Teknologi harus menciptakan nilai nyata. Kami mengukur kesuksesan dari dampak positif yang dihasilkan, bukan dari kompleksitas teknis.",
        },
        {
          title: "Sederhana",
          description:
            "Solusi terbaik adalah yang paling sederhana. Kami percaya bahwa kemudahan penggunaan adalah kunci adopsi teknologi yang luas.",
        },
      ],
    },
    focus: {
      title: "Fokus Kami",
      subtitle:
        "Area spesialisasi yang kami geluti untuk memberikan solusi terbaik",
      items: [
        {
          title: "Enterprise Solutions",
          description:
            "Membangun sistem yang handal untuk kebutuhan bisnis yang lebih kompleks. ERP, CRM, dan sistem custom.",
          examples: ["ERP Systems", "Custom Apps", "Integrations"],
        },
        {
          title: "Digital Tools",
          description:
            "Menciptakan tools yang memudahkan produktivitas dan kolaborasi untuk bisnis kecil dan menengah.",
          examples: [
            "Productivity Apps",
            "Automation Tools",
            "Collaboration Platforms",
          ],
        },
      ],
    },
    founders: {
      title: "Kenali Para Pendiri",
      subtitle:
        "Dua lulusan Computer Science dengan visi bersama untuk masa depan teknologi Indonesia",
      items: [
        {
          name: "Stiven",
          location: "Palu, Sulawesi",
          image: "/images/stiven.webp",
          background: ["Business", "Blockchain", "Finance"],
          experience:
            "Membangun enterprise applications dengan keahlian dalam business strategy, blockchain technology, dan financial systems.",
          website: "",
          medium: "https://medium.com/@stivenhendra",
          social: {
            linkedin: "https://www.linkedin.com/in/stiven-suhendra/",
            github: "https://github.com/Stiv26",
            twitter: "",
          },
        },
        {
          name: "Ferdy",
          location: "Medan, Sumatera",
          image: "/images/ferdy.webp",
          background: ["Software Development", "ERP", "Psychology"],
          experience:
            "Senior Frontend Engineer dengan pengalaman 4+ tahun membangun enterprise apps, ERP systems, dan landing pages. Saat ini bekerja di perusahaan Malaysia.",
          website: "https://ferdylim.paludevhouse.site/",
          medium: "https://medium.com/@ferdylimm9",
          social: {
            linkedin: "https://www.linkedin.com/in/ferdylimm9/",
            github: "https://github.com/ferdylimmm9",
            twitter: "https://x.com/dundundance_",
          },
        },
      ],
    },
    projects: {
      title: "Proyek Kami",
      subtitle:
        "Solusi teknologi yang kami bangun untuk membantu bisnis dan komunitas",
      viewAll: "Lihat Semua Proyek",
    },
    articles: {
      title: "Artikel Terbaru",
      subtitle:
        "Berbagi pengetahuan dan pengalaman dalam pengembangan teknologi",
      viewAll: "Lihat Semua Artikel",
      medium: [
        {
          author: "Ferdy",
          mediumProfile: "https://medium.com/@ferdylimm9",
          articles: [
            {
              title: "Building Scalable Frontend Applications",
              excerpt:
                "Best practices for creating maintainable and scalable frontend applications using modern React patterns.",
              url: "https://medium.com/@ferdylimm9",
              publishedAt: "2024-03-10",
              readTime: "5 min",
            },
            {
              title: "ERP Systems: Lessons from 4+ Years of Development",
              excerpt:
                "Key insights and challenges faced while developing enterprise resource planning systems for various industries.",
              url: "https://medium.com/@ferdylimm9",
              publishedAt: "2024-03-05",
              readTime: "8 min",
            },
          ],
        },
      ],
    },
    contact: {
      title: "Hubungi Kami",
      subtitle:
        "Punya proyek atau ingin berkolaborasi? Kami ingin mendengar dari Anda.",
      email: "paludevhouse@gmail.com",
      phone: "+62 822-6874-7890",
      location: "Sulawesi, Indonesia",
    },
  },
};

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  // Copywriting management state
  const [showCopywritingEditor, setShowCopywritingEditor] = useState(false);
  const [copywritingStatus, setCopywritingStatus] = useState<string | null>(
    null,
  );
  const [copywritingForm, setCopywritingForm] =
    useState<CopywritingForm>(defaultCopywriting);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    hero: true,
    story: false,
    about: false,
    philosophy: false,
    focus: false,
    founders: false,
    contact: false,
  });
  const [isLoadingCopywriting, setIsLoadingCopywriting] = useState(false);

  // Project management state
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectEditor, setShowProjectEditor] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    type: "Tools" as "SaaS" | "Tools" | "Enterprise" | "Custom",
    featured: false,
    technologies: "",
    images: "",
    founders: "",
    status: "active" as "active" | "inactive" | "development",
  });
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);

  // Add debug info
  const addDebug = (message: string) => {
    console.log("🔐 Admin Dashboard Debug:", message);
    setDebugInfo((prev) => {
      const newDebug = [
        ...prev.slice(-4),
        `${new Date().toLocaleTimeString()}: ${message}`,
      ];
      return newDebug;
    });
  };

  // Helper function to get auth headers for API calls
  const getAuthHeaders = (): Record<string, string> => {
    const sessionData = localStorage.getItem("adminSession");
    if (sessionData) {
      const session: AdminSession = JSON.parse(sessionData);
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token}`,
      };
    }
    return { "Content-Type": "application/json" };
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        addDebug("Checking admin authentication...");

        // Get session from localStorage
        const sessionData = localStorage.getItem("adminSession");

        if (!sessionData) {
          addDebug("No session found, redirecting to login...");
          router.push("/admin/login");
          return;
        }

        const session: AdminSession = JSON.parse(sessionData);

        // Check if session is expired
        if (session.expiresAt < Date.now()) {
          addDebug("Session expired, clearing and redirecting...");
          localStorage.removeItem("adminSession");
          router.push("/admin/login");
          return;
        }

        // Validate token with server
        const response = await fetch("/api/admin/auth/login", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!response.ok) {
          addDebug("Token validation failed, clearing session...");
          localStorage.removeItem("adminSession");
          router.push("/admin/login");
          return;
        }

        const data = await response.json();
        addDebug("Token validated successfully");

        setUser(data.user);
        setLoading(false);
      } catch (error) {
        addDebug("Authentication check failed: " + error);
        console.error("Auth check error:", error);
        localStorage.removeItem("adminSession");
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  // Load all data in parallel with better error handling
  const loadAllData = async () => {
    try {
      // Load all data sources in parallel
      const [
        projectsResponse,
        copywritingResponse,
        assetsResponse
      ] = await Promise.all([
        fetch("/api/admin/projects", { headers: getAuthHeaders() }),
        fetch("/api/copywriting"),
        fetch("/api/assets")
      ]);

      // Process all responses in parallel
      await Promise.all([
        // Process projects data
        projectsResponse.ok 
          ? projectsResponse.json().then(data => setProjects(data.projects || []))
          : Promise.reject(new Error("Failed to load projects")),
        
        // Process copywriting data
        copywritingResponse.ok
          ? copywritingResponse.json().then(data => {
              const validatedData = validateCopywritingData(data);
              setCopywritingForm(validatedData);
            })
          : Promise.resolve(setCopywritingForm(defaultCopywriting)), // Fallback
        
        // Process assets data (for founder image options)
        assetsResponse.ok
          ? assetsResponse.json().then(data => {
              setAvailableAssets(data.assets || []);
              addDebug("Assets loaded for founder image selection");
            })
          : Promise.resolve(setAvailableAssets([])) // Empty fallback
      ]);
      
      addDebug("All data loaded successfully in parallel");
    } catch (error) {
      console.error("Failed to load data:", error);
      // Fallback to default copywriting on error
      setCopywritingForm(defaultCopywriting);
      addDebug("Data loading failed, using fallbacks");
    }
  };

  // Load copywriting data on mount
  useEffect(() => {
    if (activeTab === "copywriting") {
      loadCopywriting();
    }
    if (activeTab === "projects") {
      loadProjects();
    }
    // Load all data in parallel when component mounts
    loadAllData();
  }, [activeTab]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch("/api/admin/projects", { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const loadCopywriting = async () => {
    setIsLoadingCopywriting(true);
    try {
      const response = await fetch("/api/copywriting");
      if (response.ok) {
        const data = await response.json();

        // Validate required fields and merge with defaults if needed
        const validatedData = validateCopywritingData(data);
        setCopywritingForm(validatedData);
      } else {
        // Fallback to default copywriting if API fails
        setCopywritingForm(defaultCopywriting);
      }
    } catch (error) {
      console.error("Failed to load copywriting:", error);
      // Fallback to default copywriting on error
      setCopywritingForm(defaultCopywriting);
    } finally {
      setIsLoadingCopywriting(false);
    }
  };

  // Validate copywriting data to prevent empty required fields
  const validateCopywritingData = (data: any): CopywritingForm => {
    const validated = { ...defaultCopywriting };

    if (data?.landingPage) {
      const landingPage = data.landingPage;

      // Validate hero section
      if (landingPage.hero) {
        validated.landingPage.hero = {
          title:
            landingPage.hero.title || defaultCopywriting.landingPage.hero.title,
          subtitle:
            landingPage.hero.subtitle ||
            defaultCopywriting.landingPage.hero.subtitle,
          description:
            landingPage.hero.description ||
            defaultCopywriting.landingPage.hero.description,
          ctaPrimary:
            landingPage.hero.ctaPrimary ||
            defaultCopywriting.landingPage.hero.ctaPrimary,
          ctaSecondary:
            landingPage.hero.ctaSecondary ||
            defaultCopywriting.landingPage.hero.ctaSecondary,
          stats:
            Array.isArray(landingPage.hero.stats) &&
            landingPage.hero.stats.length > 0
              ? landingPage.hero.stats
              : defaultCopywriting.landingPage.hero.stats,
        };
      }

      // Validate story section
      if (landingPage.story) {
        validated.landingPage.story = {
          title:
            landingPage.story.title ||
            defaultCopywriting.landingPage.story.title,
          content:
            Array.isArray(landingPage.story.content) &&
            landingPage.story.content.length > 0
              ? landingPage.story.content
              : defaultCopywriting.landingPage.story.content,
        };
      }

      // Validate about section
      if (landingPage.about) {
        validated.landingPage.about = {
          title:
            landingPage.about.title ||
            defaultCopywriting.landingPage.about.title,
          subtitle:
            landingPage.about.subtitle ||
            defaultCopywriting.landingPage.about.subtitle,
          origin: {
            title:
              landingPage.about.origin?.title ||
              defaultCopywriting.landingPage.about.origin.title,
            content:
              landingPage.about.origin?.content ||
              defaultCopywriting.landingPage.about.origin.content,
          },
          background: {
            title:
              landingPage.about.background?.title ||
              defaultCopywriting.landingPage.about.background.title,
            content:
              landingPage.about.background?.content ||
              defaultCopywriting.landingPage.about.background.content,
          },
          mission: {
            title:
              landingPage.about.mission?.title ||
              defaultCopywriting.landingPage.about.mission.title,
            content:
              landingPage.about.mission?.content ||
              defaultCopywriting.landingPage.about.mission.content,
          },
        };
      }

      // Validate philosophy section
      if (landingPage.philosophy) {
        validated.landingPage.philosophy = {
          title:
            landingPage.philosophy.title ||
            defaultCopywriting.landingPage.philosophy.title,
          subtitle:
            landingPage.philosophy.subtitle ||
            defaultCopywriting.landingPage.philosophy.subtitle,
          items:
            Array.isArray(landingPage.philosophy.items) &&
            landingPage.philosophy.items.length > 0
              ? landingPage.philosophy.items
              : defaultCopywriting.landingPage.philosophy.items,
        };
      }

      // Validate focus section
      if (landingPage.focus) {
        validated.landingPage.focus = {
          title:
            landingPage.focus.title ||
            defaultCopywriting.landingPage.focus.title,
          subtitle:
            landingPage.focus.subtitle ||
            defaultCopywriting.landingPage.focus.subtitle,
          items:
            Array.isArray(landingPage.focus.items) &&
            landingPage.focus.items.length > 0
              ? landingPage.focus.items
              : defaultCopywriting.landingPage.focus.items,
        };
      }

      // Validate founders section
      if (landingPage.founders) {
        validated.landingPage.founders = {
          title:
            landingPage.founders.title ||
            defaultCopywriting.landingPage.founders.title,
          subtitle:
            landingPage.founders.subtitle ||
            defaultCopywriting.landingPage.founders.subtitle,
          items:
            Array.isArray(landingPage.founders.items) &&
            landingPage.founders.items.length > 0
              ? landingPage.founders.items
              : defaultCopywriting.landingPage.founders.items,
        };
      }

      // Validate contact section
      if (landingPage.contact) {
        validated.landingPage.contact = {
          title:
            landingPage.contact.title ||
            defaultCopywriting.landingPage.contact.title,
          subtitle:
            landingPage.contact.subtitle ||
            defaultCopywriting.landingPage.contact.subtitle,
          email:
            landingPage.contact.email ||
            defaultCopywriting.landingPage.contact.email,
          phone:
            landingPage.contact.phone ||
            defaultCopywriting.landingPage.contact.phone,
          location:
            landingPage.contact.location ||
            defaultCopywriting.landingPage.contact.location,
        };
      }
    }

    return validated;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      addDebug("Logging out...");

      const sessionData = localStorage.getItem("adminSession");
      if (sessionData) {
        const session: AdminSession = JSON.parse(sessionData);

        // Call logout API
        await fetch("/api/admin/auth/login", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
      }

      // Clear local storage
      localStorage.removeItem("adminSession");

      addDebug("Logged out successfully, redirecting...");
      router.push("/admin/login");
    } catch (error) {
      addDebug("Logout error: " + error);
      console.error("Logout error:", error);
      // Still redirect even if API call fails
      localStorage.removeItem("adminSession");
      router.push("/admin/login");
    }
  };

  // Handle copywriting update
  const handleCopywritingUpdate = async () => {
    // Validate required fields before saving
    const validationErrors = validateCopywritingBeforeSave(copywritingForm);

    if (validationErrors.length > 0) {
      alert(`Please fix the following issues:\n${validationErrors.join("\n")}`);
      return;
    }

    setIsLoadingCopywriting(true);
    try {
      const response = await fetch("/api/copywriting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copywritingForm),
      });

      if (response.ok) {
        // Run copywriting save and cache revalidation in parallel
        await Promise.all([
          // Cache revalidation for all pages
          fetch("/api/revalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret: process.env.REVALIDATE_SECRET || "palu-dev-house-secret",
              paths: ["/", "/about", "/founders", "/projects", "/contact"],
              invalidateAll: true,
            }),
          }),
          // Update UI state (synchronous, but wrapped for consistency)
          Promise.resolve().then(() => {
            setCopywritingStatus("success");
          })
        ]);
        addDebug("Copywriting updated and pages revalidated!");
      } else {
        setCopywritingStatus("error");
        addDebug("Copywriting update failed");
      }
    } catch (error) {
      setCopywritingStatus("error");
      addDebug("Copywriting update error: " + error);
    } finally {
      setIsLoadingCopywriting(false);
      setTimeout(() => setCopywritingStatus(null), 3000);
    }
  };

  // Validate copywriting before save to prevent empty required fields
  const validateCopywritingBeforeSave = (data: CopywritingForm): string[] => {
    const errors: string[] = [];
    const { landingPage } = data;

    // Validate hero section
    if (!landingPage.hero.title.trim()) errors.push("Hero title is required");
    if (!landingPage.hero.subtitle.trim())
      errors.push("Hero subtitle is required");
    if (!landingPage.hero.description.trim())
      errors.push("Hero description is required");
    if (!landingPage.hero.ctaPrimary.trim())
      errors.push("Hero primary CTA is required");
    if (!landingPage.hero.ctaSecondary.trim())
      errors.push("Hero secondary CTA is required");

    if (
      !Array.isArray(landingPage.hero.stats) ||
      landingPage.hero.stats.length === 0
    ) {
      errors.push("Hero stats are required");
    } else {
      landingPage.hero.stats.forEach((stat, index) => {
        if (!stat.value.trim())
          errors.push(`Hero stat ${index + 1} value is required`);
        if (!stat.label.trim())
          errors.push(`Hero stat ${index + 1} label is required`);
      });
    }

    // Validate story section
    if (!landingPage.story.title.trim()) errors.push("Story title is required");
    if (
      !Array.isArray(landingPage.story.content) ||
      landingPage.story.content.length === 0
    ) {
      errors.push("Story content is required");
    } else {
      landingPage.story.content.forEach((content, index) => {
        if (!content.trim())
          errors.push(`Story paragraph ${index + 1} is required`);
      });
    }

    // Validate about section
    if (!landingPage.about.title.trim()) errors.push("About title is required");
    if (!landingPage.about.subtitle.trim())
      errors.push("About subtitle is required");
    if (!landingPage.about.origin.title.trim())
      errors.push("About origin title is required");
    if (!landingPage.about.origin.content.trim())
      errors.push("About origin content is required");
    if (!landingPage.about.background.title.trim())
      errors.push("About background title is required");
    if (!landingPage.about.background.content.trim())
      errors.push("About background content is required");
    if (!landingPage.about.mission.title.trim())
      errors.push("About mission title is required");
    if (!landingPage.about.mission.content.trim())
      errors.push("About mission content is required");

    // Validate philosophy section
    if (!landingPage.philosophy.title.trim())
      errors.push("Philosophy title is required");
    if (!landingPage.philosophy.subtitle.trim())
      errors.push("Philosophy subtitle is required");
    if (
      !Array.isArray(landingPage.philosophy.items) ||
      landingPage.philosophy.items.length === 0
    ) {
      errors.push("Philosophy items are required");
    } else {
      landingPage.philosophy.items.forEach((item, index) => {
        if (!item.title.trim())
          errors.push(`Philosophy item ${index + 1} title is required`);
        if (!item.description.trim())
          errors.push(`Philosophy item ${index + 1} description is required`);
      });
    }

    // Validate focus section
    if (!landingPage.focus.title.trim()) errors.push("Focus title is required");
    if (!landingPage.focus.subtitle.trim())
      errors.push("Focus subtitle is required");
    if (
      !Array.isArray(landingPage.focus.items) ||
      landingPage.focus.items.length === 0
    ) {
      errors.push("Focus items are required");
    } else {
      landingPage.focus.items.forEach((item, index) => {
        if (!item.title.trim())
          errors.push(`Focus item ${index + 1} title is required`);
        if (!item.description.trim())
          errors.push(`Focus item ${index + 1} description is required`);
        if (!Array.isArray(item.examples) || item.examples.length === 0) {
          errors.push(`Focus item ${index + 1} examples are required`);
        } else {
          item.examples.forEach((example, exampleIndex) => {
            if (!example.trim())
              errors.push(
                `Focus item ${index + 1} example ${exampleIndex + 1} is required`,
              );
          });
        }
      });
    }

    // Validate founders section
    if (!landingPage.founders.title.trim())
      errors.push("Founders title is required");
    if (!landingPage.founders.subtitle.trim())
      errors.push("Founders subtitle is required");
    if (
      !Array.isArray(landingPage.founders.items) ||
      landingPage.founders.items.length === 0
    ) {
      errors.push("Founders items are required");
    } else {
      landingPage.founders.items.forEach((founder, index) => {
        if (!founder.name.trim())
          errors.push(`Founder ${index + 1} name is required`);
        if (!founder.location.trim())
          errors.push(`Founder ${index + 1} location is required`);
        if (!founder.image.trim())
          errors.push(`Founder ${index + 1} image is required`);
        if (!founder.experience.trim())
          errors.push(`Founder ${index + 1} experience is required`);
        if (
          !Array.isArray(founder.background) ||
          founder.background.length === 0
        ) {
          errors.push(`Founder ${index + 1} background is required`);
        }
      });
    }

    // Validate contact section
    if (!landingPage.contact.title.trim())
      errors.push("Contact title is required");
    if (!landingPage.contact.subtitle.trim())
      errors.push("Contact subtitle is required");
    if (!landingPage.contact.email.trim())
      errors.push("Contact email is required");
    if (!landingPage.contact.phone.trim())
      errors.push("Contact phone is required");
    if (!landingPage.contact.location.trim())
      errors.push("Contact location is required");

    return errors;
  };

  // Handle revalidate
  const handleRevalidate = async () => {
    try {
      addDebug("Triggering revalidation...");

      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.REVALIDATE_SECRET || "palu-dev-house-secret",
        }),
      });

      if (response.ok) {
        addDebug("Revalidation successful");
      } else {
        addDebug("Revalidation failed");
      }
    } catch (error) {
      addDebug("Revalidation error: " + error);
    }
  };

  // Project management functions
  const handleProjectSave = async () => {
    if (!projectForm.title || !projectForm.description) {
      alert("Title and description are required");
      return;
    }

    setIsLoadingProjects(true);
    try {
      const projectData = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        type: projectForm.type,
        featured: projectForm.featured,
        technologies: projectForm.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        images: projectForm.images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img),
        founders: projectForm.founders
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        status: projectForm.status,
        ...(editingProject && { id: editingProject.id }),
      };

      const response = await fetch("/api/admin/projects", {
        method: editingProject ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        // Run UI updates and data reload in parallel
        await Promise.all([
          loadProjects(),
          // UI state updates (synchronous, but wrapped for consistency)
          Promise.resolve().then(() => {
            setShowProjectEditor(false);
            setEditingProject(null);
            setProjectForm({
              title: "",
              description: "",
              type: "Tools",
              featured: false,
              technologies: "",
              images: "",
              founders: "",
              status: "active",
            });
          })
        ]);
      } else {
        alert("Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      type: project.type,
      featured: project.featured,
      technologies: project.technologies.join(", "),
      images: project.images.join(", "),
      founders: project.founders ? project.founders.join(", ") : "",
      status: project.status,
    });
    setShowProjectEditor(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Run delete confirmation and data reload in parallel
        await Promise.all([
          loadProjects(),
          // Show success feedback (synchronous, but wrapped for consistency)
          Promise.resolve().then(() => {
            addDebug("Project deleted successfully");
          })
        ]);
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push("/admin/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🔐 Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.name}</span>
                <span className="ml-2 text-gray-400">({user?.email})</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Debug Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-900">🔍 Debug Info:</h3>
            </div>
            <div className="space-y-1 text-sm">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-blue-700">
                  {info}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "copywriting", label: "Copywriting", icon: FileText },
                { id: "articles", label: "Articles", icon: FileText },
                { id: "projects", label: "Projects", icon: Folder },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-gray-600">
                  You have successfully authenticated and accessed the admin
                  dashboard.
                </p>
              </div>

              {/* Admin Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-gray-900">
                        Copywriting
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage website content and copywriting
                  </p>
                  <button
                    onClick={() => setActiveTab("copywriting")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage Copywriting →
                  </button>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-gray-900">
                        Articles
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage blog articles and content
                  </p>
                  <button
                    onClick={() => setActiveTab("articles")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage Articles →
                  </button>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Folder className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-gray-900">
                        Projects
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage portfolio projects
                  </p>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage Projects →
                  </button>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-gray-900">
                        Settings
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure system settings
                  </p>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage Settings →
                  </button>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-gray-900">
                        Revalidate
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Trigger ISR revalidation
                  </p>
                  <button
                    onClick={handleRevalidate}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Trigger Revalidate →
                  </button>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-gray-900">
                        User Management
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage admin users and permissions
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Manage Users →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Copywriting Tab */}
          {activeTab === "copywriting" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Copywriting Management
                    </h2>
                    <p className="text-sm text-gray-500">
                      Edit website content from one central place
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setShowCopywritingEditor(!showCopywritingEditor)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    {showCopywritingEditor
                      ? "Close Editor"
                      : "Edit Copywriting"}
                  </button>
                </div>

                {copywritingStatus && (
                  <div
                    className={`mb-4 flex items-center gap-2 ${copywritingStatus === "success" ? "text-green-600" : "text-red-600"}`}
                  >
                    {copywritingStatus === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span>
                      {copywritingStatus === "success"
                        ? "Copywriting updated and pages revalidated!"
                        : "Failed to update copywriting."}
                    </span>
                  </div>
                )}

                {showCopywritingEditor && (
                  <div className="space-y-6">
                    {isLoadingCopywriting && (
                      <div className="text-center py-4 text-gray-500">
                        Loading copywriting data...
                      </div>
                    )}

                    {/* Hero Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("hero")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          Hero Section
                        </span>
                        {expandedSections.hero ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections["hero"] && (
                        <div className="p-4 space-y-4">
                          <Input
                            label="Title"
                            value={copywritingForm.landingPage.hero.title}
                            onChange={(e) =>
                              setCopywritingForm((prev) => ({
                                ...prev,
                                landingPage: {
                                  ...prev.landingPage,
                                  hero: {
                                    ...prev.landingPage.hero,
                                    title: e.target.value,
                                  },
                                },
                              }))
                            }
                            placeholder="Enter hero title"
                          />
                          <Input
                            label="Subtitle"
                            value={copywritingForm.landingPage.hero.subtitle}
                            onChange={(e) =>
                              setCopywritingForm((prev) => ({
                                ...prev,
                                landingPage: {
                                  ...prev.landingPage,
                                  hero: {
                                    ...prev.landingPage.hero,
                                    subtitle: e.target.value,
                                  },
                                },
                              }))
                            }
                            placeholder="Enter hero subtitle"
                          />
                          <Textarea
                            label="Description"
                            value={copywritingForm.landingPage.hero.description}
                            onChange={(e) =>
                              setCopywritingForm((prev) => ({
                                ...prev,
                                landingPage: {
                                  ...prev.landingPage,
                                  hero: {
                                    ...prev.landingPage.hero,
                                    description: e.target.value,
                                  },
                                },
                              }))
                            }
                            rows={3}
                            placeholder="Enter hero description"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="CTA Primary"
                              value={
                                copywritingForm.landingPage.hero.ctaPrimary
                              }
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    hero: {
                                      ...prev.landingPage.hero,
                                      ctaPrimary: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Primary CTA text"
                            />
                            <Input
                              label="CTA Secondary"
                              value={
                                copywritingForm.landingPage.hero.ctaSecondary
                              }
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    hero: {
                                      ...prev.landingPage.hero,
                                      ctaSecondary: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Secondary CTA text"
                            />
                          </div>
                          
                          {/* Stats Section */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Statistics (Value, Label pairs)
                            </label>
                            <div className="space-y-2">
                              {copywritingForm.landingPage.hero.stats.map((stat, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    label=""
                                    value={stat.value}
                                    onChange={(e) => {
                                      const newStats = [...copywritingForm.landingPage.hero.stats];
                                      newStats[index].value = e.target.value;
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          hero: {
                                            ...prev.landingPage.hero,
                                            stats: newStats,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="Value (e.g., 2, 4+, 100%)"
                                    className="flex-1"
                                  />
                                  <Input
                                    label=""
                                    value={stat.label}
                                    onChange={(e) => {
                                      const newStats = [...copywritingForm.landingPage.hero.stats];
                                      newStats[index].label = e.target.value;
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          hero: {
                                            ...prev.landingPage.hero,
                                            stats: newStats,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="Label (e.g., Pendiri)"
                                    className="flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newStats = copywritingForm.landingPage.hero.stats.filter((_, i) => i !== index);
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          hero: {
                                            ...prev.landingPage.hero,
                                            stats: newStats,
                                          },
                                        },
                                      }));
                                    }}
                                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newStats = [...copywritingForm.landingPage.hero.stats, { value: "", label: "" }];
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      hero: {
                                        ...prev.landingPage.hero,
                                        stats: newStats,
                                      },
                                    },
                                  }));
                                }}
                                className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              >
                                Add Stat
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Story Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("story")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          Story Section
                        </span>
                        {expandedSections.story ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections["story"] && (
                        <div className="p-4 space-y-4">
                          <Input
                            label="Title"
                            value={copywritingForm.landingPage.story.title}
                            onChange={(e) =>
                              setCopywritingForm((prev) => ({
                                ...prev,
                                landingPage: {
                                  ...prev.landingPage,
                                  story: {
                                    ...prev.landingPage.story,
                                    title: e.target.value,
                                  },
                                },
                              }))
                            }
                            placeholder="Enter story title"
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Story Content (Paragraphs)
                            </label>
                            <div className="space-y-2">
                              {copywritingForm.landingPage.story.content.map((paragraph, index) => (
                                <div key={index} className="flex gap-2">
                                  <Textarea
                                    label=""
                                    value={paragraph}
                                    onChange={(e) => {
                                      const newContent = [...copywritingForm.landingPage.story.content];
                                      newContent[index] = e.target.value;
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          story: {
                                            ...prev.landingPage.story,
                                            content: newContent,
                                          },
                                        },
                                      }));
                                    }}
                                    rows={3}
                                    placeholder={`Paragraph ${index + 1}`}
                                    className="flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newContent = copywritingForm.landingPage.story.content.filter((_, i) => i !== index);
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          story: {
                                            ...prev.landingPage.story,
                                            content: newContent,
                                          },
                                        },
                                      }));
                                    }}
                                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newContent = [...copywritingForm.landingPage.story.content, ""];
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      story: {
                                        ...prev.landingPage.story,
                                        content: newContent,
                                      },
                                    },
                                  }));
                                }}
                                className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              >
                                Add Paragraph
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* About Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("about")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          About Section
                        </span>
                        {expandedSections.about ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections["about"] && (
                        <div className="p-4 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Title"
                              value={copywritingForm.landingPage.about.title}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    about: {
                                      ...prev.landingPage.about,
                                      title: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter about title"
                            />
                            <Input
                              label="Subtitle"
                              value={copywritingForm.landingPage.about.subtitle}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    about: {
                                      ...prev.landingPage.about,
                                      subtitle: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter about subtitle"
                            />
                          </div>
                          
                          {/* Origin Section */}
                          <div className="border border-gray-100 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Origin</h4>
                            <div className="space-y-3">
                              <Input
                                label="Origin Title"
                                value={copywritingForm.landingPage.about.origin.title}
                                onChange={(e) =>
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      about: {
                                        ...prev.landingPage.about,
                                        origin: {
                                          ...prev.landingPage.about.origin,
                                          title: e.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                placeholder="Enter origin title"
                              />
                              <Textarea
                                label="Origin Content"
                                value={copywritingForm.landingPage.about.origin.content}
                                onChange={(e) =>
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      about: {
                                        ...prev.landingPage.about,
                                        origin: {
                                          ...prev.landingPage.about.origin,
                                          content: e.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                rows={3}
                                placeholder="Enter origin content"
                              />
                            </div>
                          </div>
                          
                          {/* Background Section */}
                          <div className="border border-gray-100 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Background</h4>
                            <div className="space-y-3">
                              <Input
                                label="Background Title"
                                value={copywritingForm.landingPage.about.background.title}
                                onChange={(e) =>
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      about: {
                                        ...prev.landingPage.about,
                                        background: {
                                          ...prev.landingPage.about.background,
                                          title: e.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                placeholder="Enter background title"
                              />
                              <Textarea
                                label="Background Content"
                                value={copywritingForm.landingPage.about.background.content}
                                onChange={(e) =>
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      about: {
                                        ...prev.landingPage.about,
                                        background: {
                                          ...prev.landingPage.about.background,
                                          content: e.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                rows={3}
                                placeholder="Enter background content"
                              />
                            </div>
                          </div>
                          
                          {/* Mission Section */}
                          <div className="border border-gray-100 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Mission</h4>
                            <div className="space-y-3">
                              <Input
                                label="Mission Title"
                                value={copywritingForm.landingPage.about.mission.title}
                                onChange={(e) =>
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      about: {
                                        ...prev.landingPage.about,
                                        mission: {
                                          ...prev.landingPage.about.mission,
                                          title: e.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                placeholder="Enter mission title"
                              />
                              <Textarea
                                label="Mission Content"
                                value={copywritingForm.landingPage.about.mission.content}
                                onChange={(e) =>
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      about: {
                                        ...prev.landingPage.about,
                                        mission: {
                                          ...prev.landingPage.about.mission,
                                          content: e.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                rows={3}
                                placeholder="Enter mission content"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Philosophy Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("philosophy")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          Philosophy Section
                        </span>
                        {expandedSections.philosophy ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections["philosophy"] && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Title"
                              value={copywritingForm.landingPage.philosophy.title}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    philosophy: {
                                      ...prev.landingPage.philosophy,
                                      title: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter philosophy title"
                            />
                            <Input
                              label="Subtitle"
                              value={copywritingForm.landingPage.philosophy.subtitle}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    philosophy: {
                                      ...prev.landingPage.philosophy,
                                      subtitle: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter philosophy subtitle"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Philosophy Items
                            </label>
                            <div className="space-y-3">
                              {copywritingForm.landingPage.philosophy.items.map((item, index) => (
                                <div key={index} className="border border-gray-100 rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <Input
                                      label="Item Title"
                                      value={item.title}
                                      onChange={(e) => {
                                        const newItems = [...copywritingForm.landingPage.philosophy.items];
                                        newItems[index].title = e.target.value;
                                        setCopywritingForm((prev) => ({
                                          ...prev,
                                          landingPage: {
                                            ...prev.landingPage,
                                            philosophy: {
                                              ...prev.landingPage.philosophy,
                                              items: newItems,
                                            },
                                          },
                                        }));
                                      }}
                                      placeholder="Item title"
                                    />
                                    <div className="flex items-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newItems = copywritingForm.landingPage.philosophy.items.filter((_, i) => i !== index);
                                          setCopywritingForm((prev) => ({
                                            ...prev,
                                            landingPage: {
                                              ...prev.landingPage,
                                              philosophy: {
                                                ...prev.landingPage.philosophy,
                                                items: newItems,
                                              },
                                            },
                                          }));
                                        }}
                                        className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                      >
                                        Remove Item
                                      </button>
                                    </div>
                                  </div>
                                  <Textarea
                                    label="Item Description"
                                    value={item.description}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.philosophy.items];
                                      newItems[index].description = e.target.value;
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          philosophy: {
                                            ...prev.landingPage.philosophy,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    rows={3}
                                    placeholder="Item description"
                                  />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...copywritingForm.landingPage.philosophy.items, { title: "", description: "" }];
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      philosophy: {
                                        ...prev.landingPage.philosophy,
                                        items: newItems,
                                      },
                                    },
                                  }));
                                }}
                                className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              >
                                Add Philosophy Item
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Focus Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("focus")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          Focus Section
                        </span>
                        {expandedSections.focus ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections["focus"] && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Title"
                              value={copywritingForm.landingPage.focus.title}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    focus: {
                                      ...prev.landingPage.focus,
                                      title: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter focus title"
                            />
                            <Input
                              label="Subtitle"
                              value={copywritingForm.landingPage.focus.subtitle}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    focus: {
                                      ...prev.landingPage.focus,
                                      subtitle: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter focus subtitle"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Focus Items
                            </label>
                            <div className="space-y-3">
                              {copywritingForm.landingPage.focus.items.map((item, index) => (
                                <div key={index} className="border border-gray-100 rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                    <Input
                                      label="Item Title"
                                      value={item.title}
                                      onChange={(e) => {
                                        const newItems = [...copywritingForm.landingPage.focus.items];
                                        newItems[index].title = e.target.value;
                                        setCopywritingForm((prev) => ({
                                          ...prev,
                                          landingPage: {
                                            ...prev.landingPage,
                                            focus: {
                                              ...prev.landingPage.focus,
                                              items: newItems,
                                            },
                                          },
                                        }));
                                      }}
                                      placeholder="Item title"
                                    />
                                    <div className="flex items-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newItems = copywritingForm.landingPage.focus.items.filter((_, i) => i !== index);
                                          setCopywritingForm((prev) => ({
                                            ...prev,
                                            landingPage: {
                                              ...prev.landingPage,
                                              focus: {
                                                ...prev.landingPage.focus,
                                                items: newItems,
                                              },
                                            },
                                          }));
                                        }}
                                        className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                  <Textarea
                                    label="Item Description"
                                    value={item.description}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.focus.items];
                                      newItems[index].description = e.target.value;
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          focus: {
                                            ...prev.landingPage.focus,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    rows={2}
                                    placeholder="Item description"
                                  />
                                  <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Examples (comma-separated)
                                    </label>
                                    <Input
                                      label=""
                                      value={item.examples.join(", ")}
                                      onChange={(e) => {
                                        const newItems = [...copywritingForm.landingPage.focus.items];
                                        newItems[index].examples = e.target.value.split(",").map(ex => ex.trim()).filter(ex => ex);
                                        setCopywritingForm((prev) => ({
                                          ...prev,
                                          landingPage: {
                                            ...prev.landingPage,
                                            focus: {
                                              ...prev.landingPage.focus,
                                              items: newItems,
                                            },
                                          },
                                        }));
                                      }}
                                      placeholder="Example 1, Example 2, Example 3"
                                    />
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...copywritingForm.landingPage.focus.items, { title: "", description: "", examples: [] }];
                                  setCopywritingForm((prev) => ({
                                    ...prev,
                                    landingPage: {
                                      ...prev.landingPage,
                                      focus: {
                                        ...prev.landingPage.focus,
                                        items: newItems,
                                      },
                                    },
                                  }));
                                }}
                                className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              >
                                Add Focus Item
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Founders Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("founders")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          Founders Section
                        </span>
                        {expandedSections.founders ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections["founders"] && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Title"
                              value={copywritingForm.landingPage.founders.title}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    founders: {
                                      ...prev.landingPage.founders,
                                      title: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter founders title"
                            />
                            <Input
                              label="Subtitle"
                              value={copywritingForm.landingPage.founders.subtitle}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    founders: {
                                      ...prev.landingPage.founders,
                                      subtitle: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter founders subtitle"
                            />
                          </div>
                          
                          {/* Founders Items */}
                          <div className="space-y-6">
                            {copywritingForm.landingPage.founders.items.map((founder, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-medium text-gray-900">Founder {index + 1}</h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newItems = copywritingForm.landingPage.founders.items.filter((_, i) => i !== index);
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    Remove
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <Input
                                    label="Name"
                                    value={founder.name}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { ...newItems[index], name: e.target.value };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="Founder name"
                                  />
                                  <Input
                                    label="Location"
                                    value={founder.location}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { ...newItems[index], location: e.target.value };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="City, Country"
                                  />
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <div className="space-y-2">
                                      <select
                                        value={founder.image}
                                        onChange={(e) => {
                                          const newItems = [...copywritingForm.landingPage.founders.items];
                                          newItems[index] = { ...newItems[index], image: e.target.value };
                                          setCopywritingForm((prev) => ({
                                            ...prev,
                                            landingPage: {
                                              ...prev.landingPage,
                                              founders: {
                                                ...prev.landingPage.founders,
                                                items: newItems,
                                              },
                                            },
                                          }));
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400 transition-colors duration-200"
                                      >
                                        <option value="">Select an image...</option>
                                        {availableAssets.length > 0 ? (
                                          availableAssets.map((asset) => (
                                            <option key={asset.value} value={asset.value}>
                                              {asset.label} ({asset.value})
                                            </option>
                                          ))
                                        ) : (
                                          <>
                                            <option value="/images/stiven.webp">Stiven (/images/stiven.webp)</option>
                                            <option value="/images/ferdy.webp">Ferdy (/images/ferdy.webp)</option>
                                            <option value="/images/logo.svg">Logo (/images/logo.svg)</option>
                                            <option value="/images/hero-bg-1.webp">Hero Background (/images/hero-bg-1.webp)</option>
                                            <option value="/images/erp-system.webp">ERP System (/images/erp-system.webp)</option>
                                          </>
                                        )}
                                      </select>
                                      
                                      {/* Image Preview */}
                                      {founder.image && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                          <div className="flex items-center justify-center">
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-300">
                                              <img
                                                src={founder.image}
                                                alt="Founder preview"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                  const target = e.target as HTMLImageElement;
                                                  target.style.display = 'none';
                                                  const parent = target.parentElement;
                                                  if (parent) {
                                                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center">Image not found</div>';
                                                  }
                                                }}
                                              />
                                            </div>
                                            <div className="ml-3 flex-1">
                                              <p className="text-xs text-gray-600 font-medium">Preview:</p>
                                              <p className="text-xs text-gray-500 truncate">{founder.image}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  <Textarea
                                    label="Background (comma separated)"
                                    value={founder.background.join(", ")}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { 
                                        ...newItems[index], 
                                        background: e.target.value.split(",").map(b => b.trim()).filter(b => b)
                                      };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="Business, Technology, Finance"
                                    rows={2}
                                  />
                                  <Textarea
                                    label="Experience"
                                    value={founder.experience}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { ...newItems[index], experience: e.target.value };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="Brief description of experience"
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                  <Input
                                    label="Website"
                                    value={founder.website}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { ...newItems[index], website: e.target.value };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="https://example.com"
                                  />
                                  <Input
                                    label="Medium"
                                    value={founder.medium}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { ...newItems[index], medium: e.target.value };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="https://medium.com/@username"
                                  />
                                  <Input
                                    label="LinkedIn"
                                    value={founder.social.linkedin}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { 
                                        ...newItems[index], 
                                        social: { ...newItems[index].social, linkedin: e.target.value }
                                      };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="https://linkedin.com/in/username"
                                  />
                                  <Input
                                    label="GitHub"
                                    value={founder.social.github}
                                    onChange={(e) => {
                                      const newItems = [...copywritingForm.landingPage.founders.items];
                                      newItems[index] = { 
                                        ...newItems[index], 
                                        social: { ...newItems[index].social, github: e.target.value }
                                      };
                                      setCopywritingForm((prev) => ({
                                        ...prev,
                                        landingPage: {
                                          ...prev.landingPage,
                                          founders: {
                                            ...prev.landingPage.founders,
                                            items: newItems,
                                          },
                                        },
                                      }));
                                    }}
                                    placeholder="https://github.com/username"
                                  />
                                </div>
                                
                                <Input
                                  label="Twitter"
                                  value={founder.social.twitter}
                                  onChange={(e) => {
                                    const newItems = [...copywritingForm.landingPage.founders.items];
                                    newItems[index] = { 
                                      ...newItems[index], 
                                      social: { ...newItems[index].social, twitter: e.target.value }
                                    };
                                    setCopywritingForm((prev) => ({
                                      ...prev,
                                      landingPage: {
                                        ...prev.landingPage,
                                        founders: {
                                          ...prev.landingPage.founders,
                                            items: newItems,
                                        },
                                      },
                                    }));
                                  }}
                                  placeholder="https://twitter.com/username"
                                  className="mt-4"
                                />
                              </div>
                            ))}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...copywritingForm.landingPage.founders.items, {
                                name: "",
                                location: "",
                                image: "",
                                background: [],
                                experience: "",
                                website: "",
                                medium: "",
                                social: {
                                  linkedin: "",
                                  github: "",
                                  twitter: "",
                                },
                              }];
                              setCopywritingForm((prev) => ({
                                ...prev,
                                landingPage: {
                                  ...prev.landingPage,
                                  founders: {
                                    ...prev.landingPage.founders,
                                    items: newItems,
                                  },
                                },
                              }));
                            }}
                            className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          >
                            Add Founder
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Contact Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("contact")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          Contact Section
                        </span>
                        {expandedSections.contact ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections["contact"] && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Title"
                              value={copywritingForm.landingPage.contact.title}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    contact: {
                                      ...prev.landingPage.contact,
                                      title: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter contact title"
                            />
                            <Input
                              label="Subtitle"
                              value={copywritingForm.landingPage.contact.subtitle}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    contact: {
                                      ...prev.landingPage.contact,
                                      subtitle: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter contact subtitle"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              label="Email"
                              value={copywritingForm.landingPage.contact.email}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    contact: {
                                      ...prev.landingPage.contact,
                                      email: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter contact email"
                            />
                            <Input
                              label="Phone"
                              value={copywritingForm.landingPage.contact.phone}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    contact: {
                                      ...prev.landingPage.contact,
                                      phone: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter contact phone"
                            />
                            <Input
                              label="Location"
                              value={copywritingForm.landingPage.contact.location}
                              onChange={(e) =>
                                setCopywritingForm((prev) => ({
                                  ...prev,
                                  landingPage: {
                                    ...prev.landingPage,
                                    contact: {
                                      ...prev.landingPage.contact,
                                      location: e.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="Enter contact location"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Add more sections as needed... */}
                  </div>
                )}

                {showCopywritingEditor && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleCopywritingUpdate}
                      disabled={isLoadingCopywriting}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isLoadingCopywriting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Articles Management
                  </h2>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Article
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Building Proper Apps
                      </h3>
                      <p className="text-sm text-gray-500">
                        Published on March 10, 2024
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        UMKM Digital Transformation
                      </h3>
                      <p className="text-sm text-gray-500">
                        Published on March 5, 2024
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Projects Management
                  </h2>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        title: "",
                        description: "",
                        type: "Tools",
                        featured: false,
                        technologies: "",
                        images: "",
                        founders: "",
                        status: "active",
                      });
                      setShowProjectEditor(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                {showProjectEditor && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Title"
                          value={projectForm.title}
                          onChange={(e) =>
                            setProjectForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Project title"
                          required
                        />
                        <Select
                          label="Type"
                          value={projectForm.type}
                          onChange={(e) =>
                            setProjectForm((prev) => ({
                              ...prev,
                              type: e.target.value as any,
                            }))
                          }
                          options={[
                            { value: "SaaS", label: "SaaS" },
                            { value: "Tools", label: "Tools" },
                            { value: "Enterprise", label: "Enterprise" },
                            { value: "Custom", label: "Custom" },
                          ]}
                        />
                      </div>
                      <Textarea
                        label="Description"
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Project description"
                        required
                      />
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Input
                          label="Technologies (comma separated)"
                          value={projectForm.technologies}
                          onChange={(e) =>
                            setProjectForm((prev) => ({
                              ...prev,
                              technologies: e.target.value,
                            }))
                          }
                          placeholder="React, Node.js, MongoDB"
                        />
                        <MultiImageSelector
                          label="Project Images"
                          value={projectForm.images}
                          onChange={(value) =>
                            setProjectForm((prev) => ({
                              ...prev,
                              images: value,
                            }))
                          }
                          placeholder="Select project images"
                        />
                        <Input
                          label="Founders (comma separated)"
                          value={projectForm.founders}
                          onChange={(e) =>
                            setProjectForm((prev) => ({
                              ...prev,
                              founders: e.target.value,
                            }))
                          }
                          placeholder="John Doe, Jane Smith"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Status"
                          value={projectForm.status}
                          onChange={(e) =>
                            setProjectForm((prev) => ({
                              ...prev,
                              status: e.target.value as any,
                            }))
                          }
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                            { value: "development", label: "Development" },
                          ]}
                        />
                        <div className="flex items-center justify-end">
                          <Checkbox
                            id="featured"
                            label="Featured Project"
                            checked={projectForm.featured}
                            onChange={(e) =>
                              setProjectForm((prev) => ({
                                ...prev,
                                featured: e.target.checked,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          onClick={() => setShowProjectEditor(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProjectSave}
                          disabled={isLoadingProjects}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {isLoadingProjects
                            ? "Saving..."
                            : editingProject
                              ? "Update Project"
                              : "Add Project"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {isLoadingProjects ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading projects...
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
No projects found. Click &quot;Add Project&quot; to create your
                      first project.
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-gray-900">
                              {project.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                project.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "inactive"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {project.status}
                            </span>
                            {project.featured && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {project.type} •{" "}
                            {project.technologies.slice(0, 3).join(", ")}
                            {project.technologies.length > 3 ? "..." : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              window.open(`/projects/${project.id}`, "_blank")
                            }
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="View project"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  System Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">
                      Site Configuration
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Maintenance Mode
                          </p>
                          <p className="text-sm text-gray-500">
                            Temporarily disable the site
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">
                          Disabled
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Analytics Tracking
                          </p>
                          <p className="text-sm text-gray-500">
                            Enable visitor analytics
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                          Enabled
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <button
                      onClick={handleRevalidate}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Revalidate Site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
