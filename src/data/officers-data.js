const departments = [
  {
    name: "executive directors",
    logoUrl: "/assets/acm-logos/acm-logo.svg",
    people: [
      /*{
        name: "devrat patel",
        role: "president",
        imageUrl: "/images/devrat.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/devratpatel/",
          instagram: "https://www.instagram.com/devratpatel",
          github: "https://github.com/DevratPatel",
        },
      },
      {
        name: "yash rao",
        role: "vice president",
        imageUrl: "/images/yash.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/yash-rao-9082bb246",
          instagram: "https://www.instagram.com/yash.r.rao",
          github: "https://github.com/tecno5",
        },
      },
      {
        name: "muhammad khurram",
        role: "treasurer",
        imageUrl: "/images/mohammad.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/m-khurram",
          instagram: "https://www.instagram.com/ultimatem.90",
          github: "https://github.com/MuhammadHunainKhurram",
        },
      },
      {
        name: "jeremiah pitts",
        role: "events coordinator",
        imageUrl: "/images/jeremiah.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/jeremiahpitts",
          instagram: "https://www.instagram.com/jpfit321",
          github: "https://github.com/xchar08",
        },
      },
      {
        name: "Aastha Khatri",
        role: "events planner",
        imageUrl: "/images/aastha.png",
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "",
        },
      },
      {
        name: "bobby flennoy",
        role: "student advisor",
        imageUrl: "/images/bobby.png",
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "",
        },
      },*/
      {
        name: "Devrat Patel",
        role: "President",
        imageUrl: "/images/devrat.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/devratpatel/",
          instagram: "https://www.instagram.com/devratpatel",
          github: "https://github.com/DevratPatel",
          discord: "devratpatel"
        }
      },
      {
        name: "Yash Rao",
        role: "Vice President",
        imageUrl: "/images/yash.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/yash-rao-9082bb246/",
          instagram: "https://www.instagram.com/yash.r.rao",
          github: "https://github.com/tecno5",
          discord: "TheTecno"
        }
      },
      {
        name: "Muhammad Khurram",
        role: "Treasurer",
        imageUrl: "/images/mohammad.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/m-khurram/",
          instagram: "https://www.instagram.com/ultimatem.90",
          github: "https://github.com/MuhammadHunainKhurram",
          discord: "baljeet752"
        }
      },
      {
        name: "Aastha Khatri",
        role: "Events Planner",
        imageUrl: "/images/aastha.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/aastha-k-b69a5a248/",
          instagram: "https://www.instagram.com/aasthaa.xd",
          github: "https://github.com/aasthaaaaaaa",
          discord: "aasthaa.xd"
        }
      },
      {
        name: "Jeremiah Pitts",
        role: "Events Coordinator",
        imageUrl: "/images/jeremiah.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/jeremiahpitts",
          instagram: "https://www.instagram.com/jpfit321",
          github: "https://github.com/xchar08",
          discord: "elite.neet"
        }
      }
    ],
  },
  {
    name: "create",
    logoUrl: "/assets/acm-logos/acm-create-logo.svg",
    people: [ /*
      {
        name: "atiqur rahman",
        role: "director",
        imageUrl: "/images/atiq.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/atiqurx",
          instagram: "https://www.instagram.com/atiqur__",
          github: "https://github.com/atiqurx",
          website: "https://www.atiqurx.com",
        },
      },
      {
        name: "kevin farokhrouz",
        role: "director",
        imageUrl: "/images/kevin.png",
        socialLinks: {
          linkedin: "https://linkedin.com/in/kevinrouz",
          instagram: "https://www.instagram.com/kevinrouz",
          github: "https://github.com/kevinrouz",
        },
      },
      {
        name: "Paul Santana",
        role: "officer",
        imageUrl: "/images/paul.png",
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "",
          website: "",
        },
      },
      {
        name: "md rashidul alam sami",
        role: "officer",
        imageUrl: "/images/rashidul.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/rashidulas/",
          instagram: "https://www.instagram.com/rashidul___",
          github: "https://github.com/rashidulas",
        },
      },
      {
        name: "prajit viswanadha",
        role: "officer",
        imageUrl: "/images/prajit.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/prajit-viswanadha/",
          instagram: "",
          github: "https://github.com/V-prajit",
        },
      },
      {
        name: "shashank yaji",
        role: "officer",
        imageUrl: "/images/shashank.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/shashankyaji/",
          instagram: "https://www.instagram.com/yajishashank",
          github: "https://github.com/SSKYAJI",
        },
      },
      {
        name: "shloka bhatt",
        role: "officer",
        imageUrl: "/images/shloka.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/shloka-bhatt/",
          instagram: "https://www.instagram.com/shhhhhlokaa",
          github: "https://github.com/shloka2212",
        },
      },
      {
        name: "meghana chevva",
        role: "officer",
        imageUrl: "/images/meghana.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/meghana-chevva/",
          instagram: "https://www.instagram.com/Meghana_anahgem",
          github: "https://github.com/meggitt",
          website: "https://www.meghanachevva.com",
        },
      },*/
      {
        name: "Kevin Farokhrouz",
        role: "Create",
        imageUrl: "/images/kevin.png", // Placeholder
        socialLinks: {
          linkedin: "https://linkedin.com/in/kevinrouz",
          instagram: "https://www.instagram.com/kevinrouz",
          github: "https://github.com/kevinrouz"
        }
      },
      {
        name: "Atiqur Rahman",
        role: "Create",
        imageUrl: "/images/atiq.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/atiqurx/",
          instagram: "https://www.instagram.com/atiqur__",
          github: "https://github.com/atiqurx"
        }
      },
      {
        name: "Prajit Viswanadha",
        role: "Create",
        imageUrl: "/images/prajit.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/prajit-viswanadha/",
          instagram: "",
          github: "https://github.com/V-prajit"
        }
      },
      {
        name: "Md Rashidul Alam Sami",
        role: "Create",
        imageUrl: "/images/rashidul.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/rashidulas/",
          instagram: "https://www.instagram.com/rashidul___",
          github: "https://github.com/rashidulas"
        }
      },
      {
        name: "Oluwajomiloju Okuwobi",
        role: "Create",
        imageUrl: "/images/jomi.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/jomiloju-okuwobi/",
          instagram: "https://www.instagram.com/_jomi.o",
          github: "https://github.com/oJomiloju"
        }
      },
      {
        name: "Talha Tahmid",
        role: "Create",
        imageUrl: "/images/talha.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/talhathmd/",
          instagram: "https://www.instagram.com/talha.thmd",
          github: "https://github.com/talhathmd"
        }
      },
      {
        name: "Rabib Husain",
        role: "Create",
        imageUrl: "/images/noheadshot.webp", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/rabib-husain/",
          instagram: "https://www.instagram.com/rabib_husain",
          github: "https://github.com/Rabib001"
        }
      }

    ],
  },
  {
    name: "marketing",
    logoUrl: "/assets/acm-logos/acm-marketing-logo.png",
    people: [
      /*{
        name: "felix cherian",
        role: "director",
        imageUrl: "/images/felix.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/felix-cherian",
          instagram: "https://www.instagram.com/felix_cherian",
          github: "https://github.com/Flexinos717",
        },
      },
      {
        name: "jaideep singh",
        role: "officer",
        imageUrl: "/images/jaideep.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/jaideep-singh-4010342ab",
          instagram: "https://www.instagram.com/jaixsandhu",
          github: "https://github.com/jaidoescode",
        },
      },
      {
        name: "tista manandhar",
        role: "officer",
        imageUrl: "/images/tista.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/tistamanandhar19/",
          instagram: "https://www.instagram.com/_tistaa",
          github: "https://github.com/txm19",
        },
      },
      {
        name: "ishu pokhrel",
        role: "officer",
        imageUrl: "/images/ishu.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/ishu-pokhrel",
          instagram: "https://www.instagram.com/ishuthexplorer",
          github: "",
        },
      },
      {
        name: "dominic lamana",
        role: "officer",
        imageUrl: "/images/dominic.png",
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "",
        },
      },*/
      {
        name: "Felix Cherian",
        role: "Marketing",
        imageUrl: "/images/felix.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/felix-cherian",
          instagram: "https://www.instagram.com/felix_cherian",
          github: "https://github.com/Flexinos717"
        }
      },
      {
        name: "Dominic Lamana",
        role: "Marketing",
        imageUrl: "/images/dominic.png", // Placeholder
        socialLinks: {
          linkedin: "", // Not provided
          instagram: "https://www.instagram.com/flexinos", // Placeholder, not clear from screenshots
          github: "https://github.com/Flexinos717"
        }
      },
      {
        name: "Nnanna Ejim",
        role: "Marketing",
        imageUrl: "/images/nnanna.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/nnanna-ejim/",
          instagram: "https://www.instagram.com/n_ejvm",
          github: "https://github.com/NEjim2001"
        }
      },
      {
        name: "Sarah Naifa",
        role: "Marketing",
        imageUrl: "/images/sarah.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/sarah-naifa",
          instagram: "https://www.instagram.com/xonaifu",
          github: "https://github.com/sarahn13"
        }
      },
      {
        name: "Zeynep Uslu",
        role: "Marketing",
        imageUrl: "/images/zeynep.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/zeyneplu",
          instagram: "https://www.instagram.com/zeyeyuslu",
          github: "https://github.com/zeyneplu"
        }
      }
    ],
  },
  {
    name: "educate",
    logoUrl: "/assets/acm-logos/acm-educate-logo.svg",
    people: [
      /*{
        name: "trevor",
        role: "director",
        imageUrl: "/images/trevor.png",
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "",
        },
      },*/
      {
        name: "linh nguyen",
        role: "director",
        imageUrl: "/images/linh.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/lninnn",
          instagram: "https://www.instagram.com/_lninn_",
          github: "https://github.com/lninnn",
        },
      },
      /*{
        name: "shloka bhatt",
        role: "officer",
        imageUrl: "/images/shloka.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/shloka-bhatt/",
          instagram: "https://www.instagram.com/shhhhhlokaa",
          github: "https://github.com/shloka2212",
        },
      },*/
      /*{
        name: "sheena buwemi",
        role: "officer",
        imageUrl: "/images/noheadshot.webp",
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "",
        },
      },*/
      {
        name: "meghana chevva",
        role: "officer",
        imageUrl: "/images/meghana.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/meghana-chevva/",
          instagram: "https://www.instagram.com/Meghana_anahgem",
          github: "https://github.com/meggitt",
          website: "https://www.meghanachevva.com",
        },
      },
      {
        name: "aryan",
        role: "officer",
        imageUrl: "/images/aryan.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/aryanvyas05/",
          instagram: "https://www.instagram.com/aryanvyyass",
          github: "https://github.com/aryanvyas05",
        },
      },
    ],
  },
  {
    name: "outreach",
    logoUrl: "/assets/acm-logos/acm-outreach-logo.png",
    people: [
      /*{
        name: "paul santana",
        role: "director",
        imageUrl: "/images/paul.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/paul-hunter-santana/",
          instagram: "https://www.instagram.com/smhpaul_",
          github: "https://github.com/PostHScript",
        },
      },
      {
        name: "will maberry",
        role: "officer",
        imageUrl: "/images/will.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/will-maberry/",
          instagram: "https://www.instagram.com/maberrywill",
          github: "https://github.com/dinosaur-oatmeal",
        },
      },
      {
        name: "tista manandhar",
        role: "officer",
        imageUrl: "/images/tista.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/tistamanandhar19/",
          instagram: "https://www.instagram.com/_tistaa",
          github: "https://github.com/txm19",
        },
      },*/
      {
        name: "Paul Santana",
        role: "Outreach",
        imageUrl: "/images/paul.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/paul-hunter-santana/",
          instagram: "https://www.instagram.com/smhpaul_",
          github: "https://github.com/PostHScript"
        }
      },
      {
        name: "Will Maberry",
        role: "Outreach",
        imageUrl: "/images/will.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/will-maberry/",
          instagram: "https://www.instagram.com/maberrywill",
          github: "https://github.com/dinosaur-oatmeal"
        }
      },
      {
        name: "Tista Manandhar",
        role: "Outreach",
        imageUrl: "/images/tista.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/tistamanandhar19/",
          instagram: "https://www.instagram.com/_tistaa",
          github: "https://github.com/txm19"
        }
      },
      {
        name: "Jacob Mathew",
        role: "Outreach",
        imageUrl: "/images/jacob.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/jacob-mathew-794987306/",
          instagram: "https://www.instagram.com/jacobi.math",
          github: "https://github.com/Jallae16"
        }
      },
      {
        name: "Vincent Dang",
        role: "Outreach",
        imageUrl: "/images/vincent.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/vdanguta/",
          instagram: "https://www.instagram.com/vincentdangg",
          github: "https://github.com/vdang1120"
        }
      },
      {
        name: "Peter Tran",
        role: "Outreach",
        imageUrl: "/images/peter.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/peter-phi-tran/",
          instagram: "https://www.instagram.com/petertrxnn",
          github: "https://github.com/Peter-Phi-Tran"
        }
      }
    ],
  },
  {
    name: "research",
    logoUrl: "/assets/acm-logos/acm-research-logo.svg",
    people: [
      /*{
        name: "bobby flennoy",
        role: "director",
        imageUrl: "/images/bobby.png",
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "",
        },
      },*/
      {
        name: "Mariah Gardner",
        role: "Research",
        imageUrl: "/images/mariah.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/rohita-k/",
          instagram: "",
          github: "https://github.com/mxgardner"
        }
      },
      {
        name: "Rohita Konjeti",
        role: "Research",
        imageUrl: "/images/rohita.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/rohita-k/",
          instagram: "",
          github: "https://github.com/mapleS12"
        }
      },
      {
        name: "Manuel Arellano Jr",
        role: "Research",
        imageUrl: "/images/manuel.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/manuel-arellano-jr/",
          instagram: "https://www.instagram.com/cartierrmanny",
          github: "https://github.com/Manuel-Arellano-Jr"
        }
      },
      {
        name: "Aryan Vyas",
        role: "Research",
        imageUrl: "/images/aryan.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/aryanvyas05/",
          instagram: "https://www.instagram.com/aryanvyyass",
          github: "https://github.com/aryanvyas05"
        }
      },
      {
        name: "Ali Jifi-Bahlool",
        role: "Research",
        imageUrl: "/images/ali.png", // Placeholder
        socialLinks: {
          linkedin: "https://www.linkedin.com/in/ali-jifi-bahlool/", 
          instagram: "https://www.instagram.com/__bali__",
          github: "https://github.com/ali-jifi"
        }
      },
      {
        name: "Tsion Woldeselassie",
        role: "Research",
        imageUrl: "/images/tsion.png", // Placeholder
        socialLinks: {
          linkedin: "",
          instagram: "",
          github: "https://github.com/Tsion-Woldeselassie"
        }
      }
    ],
  },
];

export default departments;
