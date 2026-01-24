import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Charles",
  lastName: "Wittemann",
  name: `Charles Wittemann`,
  role: "Software and Finance Student",
  avatar: "/images/avatar_v2.jpg",
  email: "charliewittemann@icloud.com",
  location: "America/New_York", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Spanish"], // optional: Leave the array empty if you don't want to display languages
};
const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/charleswittemann23",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/charles-wittemann",
    essential: true,
  },
  
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Leveraging automation, data, and modeling to enhance business decisions</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">EZ Grader RAG </strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/Anthropic_hack_ez",
  },
  subline: (
    <>
    I'm Charlie, a student at <Text as="span" size="xl" weight="strong">UVA</Text>, where I'm exploring the intersection of <br />
    technology and finance. Take a look at what I'm working on! 
</>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Hi, I'm Charlie Wittemann, a UVA student working towards degrees in Computer Science and Finance.
        In Fall 2025, I worked for the Charlottesville startup Augvu as a Full Stack Developer. This past summer, I worked for Code Platoon, teaching veterans to become software developers. <br/><br/>My professional interests lie in machine learning, leveraging modeling and data analysis to solve complex financial problems.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Goldman Sachs",
        link: "https://www.goldmansachs.com/",
        timeframe: "Incoming Summer 2026",
        role: "Incoming Engineering Summer Analyst -  Quantitative Strategist, SLC, USA",
        achievements: [
          <>
             Excited to contribute to cutting-edge financial technologies and strategies this coming summer. 
          </>,
        ],
      },
      {
        company: "Augvu" ,
        link: "https://www.augvu.com/",
        timeframe: "August 2025 - Present",
        role: "Senior Full Stack Developer Intern",
        achievements: [
          <>
            Spearheaded 3-person engineering team of an early-stage startup, building an interactive social media storytelling platform. Delivered enhanced introductory content for Augvu users, cutting down user onboarding time by 90% and increasing user engagement 20%. First time using PHP, Dart, and was quite the challenge.
          </>,
          
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/augvu-cover.jpeg",
            alt: "Once UI Project",
            width: 16,
            height: 34,
          },
        ],
      },
      {
        company: "Code Platoon",
        timeframe: "Summer 2025",
        role: "Full Stack Teaching Assistant",
        achievements: [
          <>
            Supported instruction and curriculum delivery during a 15-week intensive 
            full-stack bootcamp training veterans and military spouses in software engineering, 
            and managed final projects. Really awesome work.
          </>,
         
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Virginia",
        description: <>BA in Computer Science. <br/>
        B.S in Finance with a concentration in Quantitative Finance from the McIntire School of Commerce. Teaching Assistant for CS 3240: Software Engineering
        <br/><br/><strong>Coursework</strong>: Computer Systems and Organizations, Data Structures and Algorithms, Linear Algebra, Software Engineering, Finance and Quantitative Analysis, Strategy and Systems, Discrete Mathemtatics, Cybersecurity
        </>,
        
      },
      
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: (
          <>Able to prototype in Figma with Once UI with unnatural speed.</>
        ),
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: (
          <>Building next gen apps with Next.js + Once UI + Supabase.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "Supabase",
            icon: "supabase",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  
  images: [
    {
      src: "/images/gallery/horizontal-5.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-6.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-7.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
