export type NavItem = {
  label: string;
  href: string;
  isModal?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Blogs", href: "#blogs" },
  { label: "Certifications", href: "#certificates" },
  { label: "Connect", href: "#contact", isModal: true },
];

// export const sectionIds = navItems
//   .filter((item) => !item.isModal)
//   .map((item) => item.href.replace("#", ""));

export function hrefToId(href: string) {
  return href.replace("/#", "");
}

export const sectionIds = navItems.filter((item) => !item.isModal).map((item) => hrefToId(item.href));
