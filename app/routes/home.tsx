import { useEffect } from "react";
import { useNavigate } from "react-router";
import ResumeCard from "~/components/ResumeCard";
import { resumes } from "~/constants";
import { usePuterStore } from "~/lib/puter";
import Navbar from "../components/navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { isLoading, auth } = usePuterStore();
  const navigate = useNavigate();

  // Redirect to Auth page if user is not authenticated
  // Adding the next param to redirect back to home after authenticating
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className='main-section'>
        <Navbar />
        <div className='page-heading py-16'>
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback</h2>
        </div>

        {resumes.length > 0 && (
          <div className='resumes-section'>
            {resumes.map((resume) => {
              return <ResumeCard key={resume.id} resume={resume} />;
            })}
          </div>
        )}
      </section>
    </main>
  );
}
