import { Jumbotron } from '@/components/Jumbotron';
import { AboutUs } from '@/components/AboutUs';
import { Philosophy } from '@/components/Philosophy';
import { Focus } from '@/components/Focus';
import { Projects } from '@/components/Projects';
import { Founders } from '@/components/Founders';
import { Articles } from '@/components/Articles';
import { Contact } from '@/components/Contact';
import { Story } from '@/components/Story';
import { 
  getCopywritingData, 
  getFeaturedProjectsData, 
  getFeaturedArticlesData
} from '@/lib/api-client';

export default async function Home() {
  // Fetch all data from API for ISR
  const copywriting = await getCopywritingData();
  const featuredProjects = await getFeaturedProjectsData(6);
  const featuredArticles = await getFeaturedArticlesData(6);

  const { title: foundersTitle, subtitle: foundersSubtitle, items: foundersData } = copywriting.landingPage.founders;
  const { title: projectsTitle, subtitle: projectsSubtitle, viewAll: projectsViewAll } = copywriting.landingPage.projects;
  const { title: articlesTitle, subtitle: articlesSubtitle, viewAll: articlesViewAll } = copywriting.landingPage.articles;

  return (
    <>
      <Jumbotron hero={copywriting.landingPage.hero} />
      <Story story={copywriting.landingPage.story} />
      <AboutUs about={copywriting.landingPage.about} />
      <Philosophy philosophy={copywriting.landingPage.philosophy} />
      <Focus focus={copywriting.landingPage.focus} />
      <Projects 
        title={projectsTitle} 
        subtitle={projectsSubtitle} 
        viewAll={projectsViewAll}
        projects={featuredProjects}
      />
      <Founders 
        title={foundersTitle} 
        subtitle={foundersSubtitle} 
        founders={foundersData} 
      />
      <Articles 
        title={articlesTitle} 
        subtitle={articlesSubtitle} 
        viewAll={articlesViewAll}
        articles={featuredArticles}
      />
      <Contact contact={copywriting.landingPage.contact} />
    </>
  );
}
