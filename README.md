# Personal Website

A modern, performant personal website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Homepage**: Hero section, About, Skills, and Interests
- **Projects Portfolio**: Showcase your work with project cards
- **Blog**: MDX-powered blog with syntax highlighting
- **Video Section**: Embed and showcase video content
- **Contact Form**: Validated contact form with React Hook Form + Zod
- **Responsive Design**: Mobile-first, fully responsive
- **SEO Optimized**: Proper metadata and OpenGraph tags
- **Animations**: Smooth animations with Framer Motion
- **Dark Mode Support**: Built-in dark mode compatibility

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX for blog posts
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your website.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with nav/footer
│   ├── page.tsx           # Homepage
│   ├── projects/          # Projects page
│   ├── blog/              # Blog pages
│   ├── video/             # Video page
│   └── contact/           # Contact page
├── components/
│   ├── navigation/        # Navbar and Footer
│   ├── sections/          # Homepage sections
│   ├── projects/          # Project components
│   ├── blog/              # Blog components
│   └── forms/             # Contact form
├── content/
│   ├── blog/              # MDX blog posts
│   └── projects/          # Project data
├── lib/
│   ├── blog.ts            # Blog utilities
│   ├── constants.ts       # Site configuration
│   └── types.ts           # TypeScript types
└── public/                # Static assets

```

## Customization

### Update Site Information

Edit [`lib/constants.ts`](lib/constants.ts) to update:
- Site name and description
- Navigation links
- Social media links
- Skills and interests
- About text

### Add Projects

Edit [`content/projects/projects.ts`](content/projects/projects.ts) to add your projects.

### Write Blog Posts

Create new `.mdx` files in [`content/blog/`](content/blog/) with frontmatter:

```yaml
---
title: "Your Post Title"
date: "2024-01-01"
excerpt: "Brief description"
tags: ["tag1", "tag2"]
---

Your content here...
```

### Update Video

Edit [`app/video/page.tsx`](app/video/page.tsx) to update the video URL or use a local video file.

### Customize Styling

- Edit [`tailwind.config.ts`](tailwind.config.ts) for theme colors
- Edit [`app/globals.css`](app/globals.css) for global styles

## Contact Form Setup

The contact form currently simulates submissions. To make it functional:

### Option 1: Use a Form Service (Recommended)

1. Sign up for [Formspree](https://formspree.io/) or [Web3Forms](https://web3forms.com/)
2. Update [`components/forms/ContactForm.tsx`](components/forms/ContactForm.tsx) with your form endpoint

### Option 2: Create API Route

Create `app/api/contact/route.ts` and integrate with an email service like:
- [Resend](https://resend.com/)
- [SendGrid](https://sendgrid.com/)
- [Nodemailer](https://nodemailer.com/)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

Your site will be live with automatic HTTPS and global CDN.

### Other Platforms

This Next.js app can also be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render

## SEO

The site includes:
- Metadata API for each page
- OpenGraph tags for social sharing
- Twitter cards
- Semantic HTML

To further improve SEO:
- Add `app/sitemap.ts` for dynamic sitemap
- Add `app/robots.ts` for robots.txt
- Optimize images in `/public/images/`
- Add structured data (JSON-LD)

## Performance

Built with performance in mind:
- Static generation for all pages
- Automatic code splitting
- Image optimization with Next.js Image
- Minimal JavaScript for fast page loads

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have questions or need help, feel free to open an issue or reach out!
