import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Video } from "lucide-react";
import { resourcesData, featuredResource } from "@/lib/resourcesData";
import GameBar from "./GameBar";

const ResourceIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'lungs':
      return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lungs"><path d="M6.081 20c1.574-.001 2.461-1.156 2.574-2.121.291-2.48-.465-5.47-2.691-9.279-1.689-2.894-2.561-5.12-1.674-7.024.488-1.048 1.51-1.576 3.06-1.576 3.217 0 5.442 3.915 6.65 7"/><path d="M17.92 20c-1.574-.001-2.461-1.156-2.574-2.121-.291-2.48.465-5.47 2.691-9.279 1.689-2.894 2.561-5.12 1.674-7.024C19.224.528 18.201 0 16.65 0c-3.217 0-5.442 3.915-6.65 7"/><path d="M15.066 15.369c0 .991-.837 2.174-1.825 2.174a2.111 2.111 0 0 1-1.852-2.174c0-1.204.76-2.17 1.852-2.174 1.083 0 1.825 1.191 1.825 2.174z"/></svg>;
    case 'clock':
      return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'brain':
      return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
    case 'activity':
      return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
  }
};

const Resources = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl mb-2">Stress Management Resources</h2>
        <p className="text-neutral-600">Discover tools and techniques to help manage your stress levels.</p>
      </div>

      {/* Interactive Games */}
      <GameBar />

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {resourcesData.map((resource, index) => (
          <Card key={index} className="bg-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start mb-3">
                <div className="rounded-full bg-primary/10 p-2 mr-3">
                  <ResourceIcon name={resource.icon} />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-lg">{resource.title}</h3>
                  <p className="text-neutral-600 text-sm">{resource.description}</p>
                </div>
              </div>
              <ul className="space-y-2 mb-3">
                {resource.techniques.map((technique, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="text-[#6ECB63] mr-2 h-4 w-4" />
                    <span>{technique}</span>
                  </li>
                ))}
              </ul>
              <a 
                href={resource.link} 
                className="text-primary text-sm font-medium flex items-center hover:underline"
              >
                <span>View {resource.title.toLowerCase()}</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Video */}
      <Card className="bg-white shadow-md mb-6">
        <CardContent className="p-5">
          <h3 className="font-heading font-medium text-lg mb-3">
            Featured Resource: {featuredResource.title}
          </h3>
          <div className="aspect-video bg-neutral-200 rounded-lg flex items-center justify-center mb-3">
            <Video className="h-8 w-8 text-neutral-400" />
            <span className="ml-2 text-neutral-500">Video Preview</span>
          </div>
          <p className="text-neutral-600 text-sm mb-3">{featuredResource.description}</p>
          <Button className="w-full py-2 bg-primary text-white rounded-lg font-medium">
            Watch Video
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
