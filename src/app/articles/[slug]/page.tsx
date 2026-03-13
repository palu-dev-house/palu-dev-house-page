import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: 'building-proper-apps' },
    { slug: 'umkm-digital-transformation' },
    { slug: 'from-sulawesi-to-global' },
    { slug: 'simplicity-in-tech' },
    { slug: 'blockchain-for-business' },
  ];
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const articles: Record<string, {
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    read_time: string;
    author: string;
  }> = {
    'building-proper-apps': {
      title: 'The Art of Building Proper Applications',
      excerpt: 'Why understanding the problem is more important than writing code, and how we approach software development at Palu Dev House.',
      content: `In the world of software development, it's easy to fall into the trap of building first and asking questions later. We've all seen it—apps that are technically impressive but solve no real problem, or solutions so complex that they create more issues than they resolve.

At Palu Dev House, we believe in a different approach. We call it "Building Proper."

## Understanding Before Building

Before writing a single line of code, we spend time understanding the problem. This means:

- Talking to real users and understanding their pain points
- Analyzing existing solutions and their shortcomings
- Defining clear success metrics
- Validating assumptions with data

This approach might seem slower initially, but it saves countless hours of rebuilding and refactoring later.

## The 80/20 Principle

We've observed that most applications suffer from feature bloat—20% of features that get 80% of usage, buried under 80% of features that hardly anyone uses.

Our philosophy is to identify that critical 20% and build it exceptionally well. This doesn't mean we ignore the other 80%, but we prioritize ruthlessly and add features only when there's clear evidence they're needed.

## Simplicity is Hard

Anyone can build complex software. Building simple software that solves real problems is much harder. It requires:

- Deep understanding of the domain
- Courage to say no to feature requests
- Continuous refinement and iteration
- Focus on user outcomes, not technical impressiveness

## Conclusion

Building proper means respecting your users' time and attention. It means creating software that feels inevitable—like it couldn't have been built any other way. This is our commitment at Palu Dev House, and it's a standard we hold ourselves to with every project we undertake.`,
      published_at: '2024-03-10',
      read_time: '5 min read',
      author: 'Palu Dev House Team',
    },
    'umkm-digital-transformation': {
      title: 'Digital Transformation for UMKM in Indonesia',
      excerpt: 'How small businesses can leverage simple technology tools to compete and grow in the digital economy.',
      content: `The digital economy is transforming how business is done worldwide, and Indonesia's UMKM (Usaha Mikro, Kecil, dan Menengah) sector is no exception. However, many small business owners feel overwhelmed by the perceived complexity of digital tools.

## The Digital Divide

While large corporations have resources to invest in sophisticated ERP systems and dedicated IT teams, UMKM businesses often struggle with:

- Limited technical expertise
- Budget constraints
- Time limitations
- Fear of technology complexity

This doesn't mean UMKM businesses should be left behind. In fact, with the right approach, digital transformation can be both accessible and highly impactful.

## Simple Tools, Big Impact

The key is focusing on tools that provide immediate value without requiring extensive training or investment:

### 1. Inventory Management
Simple digital inventory tracking can reduce stockouts by up to 80% and free up capital tied up in excess inventory.

### 2. Digital Payments
Accepting digital payments not only improves customer experience but also provides automatic record-keeping for accounting.

### 3. Social Media Presence
Basic social media management tools can help UMKM reach new customers and build brand awareness at minimal cost.

### 4. Customer Relationship Management
Even a simple customer database can significantly improve repeat business and customer satisfaction.

## Our Approach

At Palu Dev House, we're committed to building tools specifically designed for UMKM needs:

- **Affordable**: Pricing models that work for small business budgets
- **Simple**: No training required—if you can use WhatsApp, you can use our tools
- **Mobile-first**: Designed for business owners who primarily use smartphones
- **Integrated**: Connected solutions that work together seamlessly

## Getting Started

The journey of digital transformation doesn't have to be overwhelming. Start small:

1. Identify one pain point in your business
2. Find a simple tool that addresses it
3. Use it consistently for a month
4. Measure the impact
5. Move to the next challenge

Remember, digital transformation is not about using the most advanced technology—it's about using the right technology to solve real problems.

## Conclusion

The future of Indonesian business is digital, and UMKM businesses that embrace this transformation will thrive. With the right tools and approach, every UMKM can compete and succeed in the digital economy.`,
      published_at: '2024-03-05',
      read_time: '8 min read',
      author: 'Palu Dev House Team',
    },
    'from-sulawesi-to-global': {
      title: 'From Sulawesi to Global: Our Journey',
      excerpt: 'The story of how two friends from different parts of Indonesia came together to build a tech house.',
      content: `Every company has an origin story, and ours begins with a simple conversation between two friends who shared a dream of making technology accessible to everyone in Indonesia.

## The Beginning

Stiven, from Palu in Central Sulawesi, and Ferdy, from Medan in North Sumatra, met during their computer science studies. Despite coming from different corners of Indonesia, they discovered a shared passion: using technology to solve real problems.

## The Brainstorming Session

The name "Palu Dev House" emerged during one late-night brainstorming session. "Palu" represents our starting point—humble beginnings in a city not typically known as a tech hub. "Dev House" reflects our aspiration to be more than just a company; we want to be a home for developers and innovators.

## Our Diverse Backgrounds

What makes our partnership work is our complementary expertise:

**Stiven** brings business acumen, blockchain knowledge, and financial expertise. His experience building enterprise applications taught him the importance of understanding business needs before writing code.

**Ferdy** contributes deep technical expertise in frontend development, ERP systems, and an interesting twist—psychology. This unique combination allows him to build interfaces that not only work well but feel intuitive to users.

## The Mission

Our mission extends beyond building successful products. We want to:

1. **Spread Technology**: Make digital tools accessible to communities across Indonesia, starting from where we came from
2. **Support UMKM**: Help small businesses compete in the digital economy
3. **Learn and Give Back**: Continue our education abroad and bring knowledge back to benefit Indonesia

## Why Sulawesi?

Many ask why we chose to start from Sulawesi when Jakarta or Bali might offer more opportunities. The answer is simple: we believe great ideas and talent exist everywhere, not just in major cities. By building from Sulawesi, we hope to inspire others in secondary cities to pursue their tech dreams.

## Looking Forward

Today, Palu Dev House is still in its early days, but our vision is clear. We're building tools that matter, one small step at a time. Every product we create, every line of code we write, brings us closer to our goal of making technology work for everyone in Indonesia.

The journey from Sulawesi to global impact is long, but we're excited to take it—one proper, impactful, simple solution at a time.`,
      published_at: '2024-02-28',
      read_time: '6 min read',
      author: 'Palu Dev House Team',
    },
    'simplicity-in-tech': {
      title: 'The Power of Simplicity in Technology',
      excerpt: 'Why we believe simple solutions often outperform complex ones, and how to achieve meaningful impact with minimal complexity.',
      content: `In a world where technology increasingly drives every aspect of our lives, there's a dangerous trend toward complexity. Features are added, interfaces become cluttered, and users are left confused. At Palu Dev House, we take a stand against this trend.

## The Complexity Trap

It's easy to understand why complexity happens:

- Engineers love building cool features
- Product managers want to check every box
- Competitors have that feature, so we need it too
- We might need this someday, better build it now

The result? Software that does everything but satisfies no one.

## The Simplicity Advantage

Simple solutions have distinct advantages:

### 1. Faster to Build
Less code means less time to develop, test, and deploy.

### 2. Easier to Maintain
Fewer features mean fewer bugs and less technical debt.

### 3. Better User Experience
Users can quickly understand and adopt simple tools.

### 4. More Reliable
Simple systems have fewer points of failure.

### 5. Easier to Scale
Clean architectures scale more gracefully than complex ones.

## How We Keep It Simple

At Palu Dev House, simplicity isn't just a goal—it's a discipline:

**Ruthless Prioritization**: We say no to 90% of feature requests, focusing only on what truly matters.

**User-First Design**: Before adding any feature, we ask: "Will this make the user's life simpler or more complex?"

**Regular Pruning**: We review and remove features that aren't being used, no matter how much effort went into building them.

**Clear Documentation**: Even simple tools need clear explanation. We invest in making our tools self-explanatory.

## Conclusion

Simplicity is not about building less—it's about building right. It's the discipline to solve problems elegantly, to respect users' time and attention, and to create technology that feels like an extension of human capability rather than a barrier to it.

This is our commitment: little things, but impactful. Simple, but powerful.`,
      published_at: '2024-02-20',
      read_time: '4 min read',
      author: 'Palu Dev House Team',
    },
    'blockchain-for-business': {
      title: 'Blockchain Technology for Indonesian Businesses',
      excerpt: 'Exploring practical applications of blockchain technology that can benefit businesses in Indonesia.',
      content: `Blockchain technology has evolved far beyond its cryptocurrency origins. Today, businesses worldwide are discovering practical applications that solve real problems. For Indonesian businesses, understanding blockchain's potential is increasingly important.

## Beyond Cryptocurrency

While Bitcoin put blockchain on the map, the technology's true potential lies in its ability to create trust, transparency, and efficiency in business processes. Key features include:

- **Immutability**: Records cannot be altered once written
- **Transparency**: All participants can verify transactions
- **Decentralization**: No single point of control or failure
- **Smart Contracts**: Self-executing agreements without intermediaries

## Practical Applications for Indonesian Businesses

### Supply Chain Transparency
Indonesia's vast archipelago creates supply chain challenges. Blockchain can:
- Track products from source to consumer
- Verify authenticity of goods
- Reduce fraud and counterfeiting
- Improve food safety traceability

### Financial Services
For the unbanked and underbanked populations:
- Decentralized identity verification
- Peer-to-peer lending platforms
- Cross-border payments with lower fees
- Transparent microfinance tracking

### Land and Property Rights
Indonesia's land registry challenges can benefit from:
- Immutable property records
- Transparent ownership history
- Reduced land disputes
- Easier property transfers

### Digital Identity
A unified digital identity system could:
- Simplify government service access
- Reduce identity fraud
- Enable secure digital signatures
- Streamline business registration

## Getting Started

For businesses interested in exploring blockchain:

1. **Start with Education**: Understand the basics before considering implementation
2. **Identify Pain Points**: Look for trust, transparency, or efficiency issues in your processes
3. **Start Small**: Pilot projects are better than massive overhauls
4. **Partner Wisely**: Work with experienced blockchain developers

## Our Perspective

At Palu Dev House, we see blockchain as one tool among many. It's not a solution for every problem, but for the right problems, it's transformative. We're exploring applications that can genuinely benefit Indonesian businesses and communities.

## Conclusion

Blockchain technology is maturing beyond the hype. For Indonesian businesses willing to explore its potential thoughtfully, there are real opportunities to improve operations, build trust, and create new value. The key is understanding where it fits and where simpler solutions might suffice.`,
      published_at: '2024-02-15',
      read_time: '7 min read',
      author: 'Palu Dev House Team',
    },
  };

  const article = articles[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        <article className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
          <header className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.published_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.read_time}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            <p className="text-lg text-gray-600">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-500">
                By {article.author}
              </span>
              <button
                className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Share article"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </header>

          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-li:text-gray-600">
            {article.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="text-gray-600">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\./)) {
                return (
                  <ol key={index} className="list-decimal pl-6 mb-4 space-y-2">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="text-gray-600">
                        {item.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={index} className="font-semibold text-gray-900 mb-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              }
              return (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
