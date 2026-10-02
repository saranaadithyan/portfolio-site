export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  url?: string;
  updatedAt?: string;
  tags: string[];
};

// export const blogPosts: BlogPost[] = [
//   {
//     slug: "understanding-cryptography",
//     title: "Cryptography",
//     summary:
//       "Learn how cryptography enables secure communication by converting plain text into unreadable cipher text.",
//     coverImage: "/placeholder-blog.png",
//     category: "Security",
//     publishedAt: "2024-01-01", // Update with actual publish date
//     readingTime: "8 min read",
//     url: "https://medium.com/@saranaadithyan.dev/understanding-cryptography-8f9d9d2263d3",
//   },
//   {
//     slug: "firebase-emulator-suite-export",
//     title: "Firebase Emulator Suite Export",
//     summary:
//       "A complete guide to automating Firebase Local Emulator Suite backups on Linux (Ubuntu), making local development safer and more efficient.",
//     coverImage: "/placeholder-blog.png",
//     category: "Firebase",
//     publishedAt: "2024-01-01", // Update with actual publish date
//     readingTime: "6 min read",
//     url: "https://medium.com/@saranaadithyan.dev/firebase-local-emulator-backup-automation-on-linux-ubuntu-machine-complete-guide-bd55c0415f0f",
//   },
// ];