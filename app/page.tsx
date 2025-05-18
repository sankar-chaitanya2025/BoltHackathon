import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { ArrowRight, Video, MessageSquare, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <MainLayout>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-background z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 md:py-28">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
                <span className="block">Connect Anywhere,</span>
                <span className="block text-foreground">Collaborate Everywhere</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-muted-foreground sm:max-w-3xl">
                Meet, chat, and collaborate seamlessly with our modern virtual meeting platform.
              </p>
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full group">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Why Choose MeetSpace?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              Designed for seamless collaboration and productivity.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transition-all duration-200 hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">HD Video Meetings</h3>
                <p className="mt-2 text-muted-foreground">
                  Crystal clear video conferencing with up to 9 participants in a single view.
                </p>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transition-all duration-200 hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">Integrated Chat</h3>
                <p className="mt-2 text-muted-foreground">
                  Send messages, share links, and maintain conversation history during meetings.
                </p>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transition-all duration-200 hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">Easy Collaboration</h3>
                <p className="mt-2 text-muted-foreground">
                  Share your screen, control your audio/video, and connect with teammates effortlessly.
                </p>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transition-all duration-200 hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">Secure Meetings</h3>
                <p className="mt-2 text-muted-foreground">
                  End-to-end security with user authentication and private meeting rooms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Virtual meeting in progress"
                  width={800}
                  height={450}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden shadow-xl hidden md:block">
                <Image
                  src="https://images.pexels.com/photos/5915196/pexels-photo-5915196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Team collaboration"
                  width={400}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                Meetings Reimagined
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                MeetSpace combines simplicity with powerful features to make your virtual meetings more productive and engaging.
              </p>
              <div className="mt-8">
                <ul className="space-y-5">
                  {[
                    'HD video and audio quality',
                    'Real-time chat and messaging',
                    'Simple controls for audio/video',
                    'Screen sharing capabilities',
                    'Join via browser - no downloads required',
                    'Dark and light mode support',
                  ].map((feature, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary">
                          ✓
                        </div>
                      </div>
                      <p className="ml-3 text-base text-muted-foreground">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10">
                <Link href="/auth/signup">
                  <Button size="lg">
                    Start Meeting Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Ready to Transform Your Virtual Meetings?
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Join thousands of teams already using MeetSpace to collaborate effectively.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}