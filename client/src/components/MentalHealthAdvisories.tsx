import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ExternalLink, Youtube, Twitter, Award, CheckCircle } from 'lucide-react';

interface SocialMediaContent {
  id: string;
  platform: 'youtube' | 'twitter';
  title: string;
  creator: string;
  creatorHandle: string;
  description: string;
  embedUrl: string;
  tags: string[];
  featuredContent?: boolean;
}

interface Professional {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  bio: string;
  tips: string[];
  credentials: string;
  imageUrl?: string;
}

const socialMediaContent: SocialMediaContent[] = [
  {
    id: 'yt-1',
    platform: 'youtube',
    title: 'Mental Health Tips for Students',
    creator: 'SoulCare',
    creatorHandle: '@SoulCare-j4q1s',
    description: 'Essential mental health and well-being strategies specifically designed for students during stressful periods.',
    embedUrl: 'https://www.youtube.com/embed/rkZl2gsLUp4?si=iqpw9Dhx9ro1Sm1J',
    tags: ['mental-health', 'students', 'wellness-tips'],
    featuredContent: true
  },
  {
    id: 'yt-2',
    platform: 'youtube',
    title: 'Meditation for Exam Anxiety',
    creator: 'SoulCare',
    creatorHandle: '@SoulCare-j4q1s',
    description: 'Guided meditation techniques to help manage anxiety and stress before and during exam periods.',
    embedUrl: 'https://www.youtube.com/embed/_2BFj-k__s0?si=TI07SBgqfBmOikgY',
    tags: ['meditation', 'exams', 'anxiety-relief']
  },
  {
    id: 'yt-3',
    platform: 'youtube',
    title: 'Stress Management Techniques',
    creator: 'SoulCare',
    creatorHandle: '@SoulCare-j4q1s',
    description: 'Effective techniques to manage and reduce stress in your daily academic and personal life.',
    embedUrl: 'https://www.youtube.com/embed/Bk2-dKH2Ta4?si=gVzghuLKXXMq9Mn2',
    tags: ['stress-management', 'mental-health', 'wellness'],
    featuredContent: true
  },
  {
    id: 'tw-1',
    platform: 'twitter',
    title: 'Mental Health Tips Thread',
    creator: 'SoulCare',
    creatorHandle: '@SoulCare1001',
    description: 'A comprehensive thread of daily mental health tips and exercises specifically designed for students.',
    embedUrl: 'https://platform.twitter.com/widgets/tweet_button.html#button_count',
    tags: ['mental-health', 'daily-tips', 'wellness'],
    featuredContent: false
  }
];

const professionals: Professional[] = [
  {
    id: 'prof-1',
    name: 'Dr. Meena Sharma',
    title: 'Clinical Psychologist',
    specialty: ['Student Mental Health', 'Anxiety Disorders', 'Academic Stress'],
    bio: 'Dr. Sharma specializes in helping students navigate academic pressure and anxiety. With over 15 years of experience in university counseling centers, she has developed effective protocols for student mental wellbeing.',
    tips: [
      'Schedule "worry time" - 15 minutes daily to acknowledge anxieties, then let them go',
      'Use the 5-4-3-2-1 grounding technique when feeling overwhelmed (notice 5 things you see, 4 things you feel, etc.)',
      'Break large assignments into smaller tasks with specific completion times'
    ],
    credentials: 'PhD in Clinical Psychology, certified in CBT and mindfulness-based interventions'
  },
  {
    id: 'prof-2',
    name: 'Dr. James Wilson',
    title: 'Psychiatrist & Researcher',
    specialty: ['Teen & Young Adult Mental Health', 'Social Anxiety', 'Depression'],
    bio: 'Dr. Wilson combines clinical practice with research on young adult stress resilience. His work has been featured in leading psychiatric journals with a focus on developing practical coping tools.',
    tips: [
      'Practice "opposite action" - doing the opposite of what your anxiety tells you to do',
      'Establish a sleep routine with a technology curfew 1 hour before bed',
      'Talk back to negative thoughts using evidence from your past successes'
    ],
    credentials: 'MD, Board Certified in Psychiatry, researcher at National Institute of Mental Health'
  },
  {
    id: 'prof-3',
    name: 'Prof. Sarah Lin',
    title: 'Educational Psychologist',
    specialty: ['Learning Anxiety', 'Test Preparation', 'Student Wellness'],
    bio: 'Prof. Lin focuses on the intersection of educational achievement and psychological wellbeing. Her innovative approaches help students optimize learning while maintaining balanced mental health.',
    tips: [
      'Use the Pomodoro technique (25 minutes focus, 5 minutes break) for studying',
      'Create study playlists without lyrics to boost focus during work sessions',
      'Practice "best possible self" visualization before exams to reduce test anxiety'
    ],
    credentials: 'PhD in Educational Psychology, certified in academic coaching and cognitive behavioral techniques'
  }
];

const MentalHealthAdvisories = () => {
  const [selectedTab, setSelectedTab] = useState('social-media');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  
  const featuredContent = socialMediaContent.filter(content => content.featuredContent);
  
  const renderSocialMediaEmbed = (content: SocialMediaContent) => {
    switch(content.platform) {
      case 'youtube':
        return (
          <div className="aspect-video rounded-md overflow-hidden">
            <iframe 
              src={content.embedUrl} 
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        );
      case 'twitter':
        return (
          <div className="bg-neutral-50 rounded-md p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Twitter className="text-[#1DA1F2] h-5 w-5" />
              <span className="font-medium">{content.creator}</span>
              <span className="text-neutral-500 text-sm">@{content.creatorHandle.replace('@', '')}</span>
            </div>
            <p className="text-sm mb-3">{content.description}</p>
            <a 
              href={`https://twitter.com/${content.creatorHandle.replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1DA1F2] text-sm flex items-center gap-1"
            >
              View on Twitter <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );

      default:
        return null;
    }
  };
  
  const renderProfessionalDetails = () => {
    if (!selectedProfessionalId) return null;
    
    const professional = professionals.find(p => p.id === selectedProfessionalId);
    if (!professional) return null;
    
    return (
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{professional.name}</CardTitle>
              <CardDescription>{professional.title}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-1">
              {professional.specialty.map((spec, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Background</h4>
            <p className="text-sm text-neutral-600">{professional.bio}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Expert Tips</h4>
            <ul className="space-y-2">
              {professional.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Credentials</h4>
            <p className="text-sm text-neutral-600">{professional.credentials}</p>
          </div>
          
          <Button variant="outline" onClick={() => setSelectedProfessionalId(null)}>
            Back to All Experts
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Mental Health Advisory</h2>
        <p className="text-muted-foreground">Expert advice and resources for your emotional wellbeing</p>
      </div>
      
      {/* Featured Content */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Featured Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredContent.map(content => (
            <Card key={content.id} className="overflow-hidden card-hover-effect">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  {content.platform === 'youtube' && <Youtube className="text-red-600 h-5 w-5" />}
                  {content.platform === 'twitter' && <Twitter className="text-[#1DA1F2] h-5 w-5" />}
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </div>
                <CardDescription>{content.creator}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderSocialMediaEmbed(content)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Tabs for Content Types */}
      <Tabs defaultValue="social-media" className="mb-8" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="social-media" className="flex items-center gap-1.5">
            <Youtube className="h-4 w-4" />
            <span>Social Media Resources</span>
          </TabsTrigger>
          <TabsTrigger value="professionals" className="flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            <span>Mental Health Experts</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="social-media" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialMediaContent.map(content => (
              <Card key={content.id} className="overflow-hidden card-hover-effect">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {content.platform === 'youtube' && <Youtube className="text-red-600 h-5 w-5" />}
                    {content.platform === 'twitter' && <Twitter className="text-[#1DA1F2] h-5 w-5" />}
                    <CardTitle className="text-base">{content.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{content.creator}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 mb-3">{content.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {content.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {content.platform === 'youtube' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-1.5"
                      asChild
                    >
                      <a 
                        href={content.embedUrl.replace('embed/', 'watch?v=')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Youtube className="h-4 w-4 text-red-600" />
                        Watch on YouTube
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="professionals" className="space-y-6">
          {selectedProfessionalId ? (
            renderProfessionalDetails()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {professionals.map(professional => (
                <Card 
                  key={professional.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedProfessionalId(professional.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{professional.name}</CardTitle>
                    <CardDescription>{professional.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {professional.specialty.slice(0, 2).map((spec, index) => (
                        <span 
                          key={index} 
                          className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary"
                        >
                          {spec}
                        </span>
                      ))}
                      {professional.specialty.length > 2 && (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100">
                          +{professional.specialty.length - 2} more
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-3 mb-3">{professional.bio}</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                    >
                      View Expert Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentalHealthAdvisories;
