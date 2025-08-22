import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/navbar";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const FormEnum = {
  COMPANY_NAME: "company-name",
  JOB_TITLE: "job-title",
  JOB_DESCRIPTION: "job-description",
};

type FormDataType = {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
};

export function meta() {
  return [
    { title: "Upload Resume" },
    { name: "description", content: "Upload your resume for analysis" },
  ];
}

export default function Upload() {
  const { COMPANY_NAME, JOB_TITLE, JOB_DESCRIPTION } = FormEnum;

  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState(
    "Drop your resume for an ATS score and improvement tips."
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleError = (status: string, error?: unknown) => {
    setStatusText(status);
    setIsProcessing(false);
    console.error("Error:", error || "Unknown error");
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: FormDataType) => {
    setIsProcessing(true);

    setStatusText("Analyzing your resume...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile)
      return handleError("Failed to upload the file. Please try again.");

    setStatusText("Generating image from resume...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return handleError("Failed to convert PDF to image.", imageFile.error);

    setStatusText("Uploading image...");
    const uploadedImg = await fs.upload([imageFile.file]);
    if (!uploadedImg)
      return handleError("Failed to upload the image. Please try again.");

    setStatusText("Preparing data...");

    const uuid = generateUUID();
    const data: Resume = {
      id: uuid,
      userId: auth.user?.uuid,
      companyName,
      jobTitle,
      jobDescription,
      resumePath: uploadedFile.path,
      imagePath: uploadedImg.path,
      createdAt: new Date().toISOString(),
      feedback: {} as Feedback,
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing resume with AI...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return handleError("Failed to analyze the resume.");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analysis complete! Redirecting to your resume...");

    console.log("data: ", data);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form || !file) return;

    const formData = new FormData(form);
    const companyName = formData.get(COMPANY_NAME);
    const jobTitle = formData.get(JOB_TITLE);
    const jobDescription = formData.get(JOB_DESCRIPTION);

    handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file,
    } as FormDataType);
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className='main-section'>
        <Navbar />
        <div className='page-heading py-16'>
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>{" "}
              <img
                src='/images/resume-scan.gif'
                alt='scanning resume'
                className='w-full'
              />
            </>
          ) : (
            <h2>{statusText}</h2>
          )}
          {!isProcessing && (
            <form
              id='upload-form'
              onSubmit={handleSubmit}
              className='flex flex-col gap-4 mt-8'>
              <div className='form-div'>
                <label htmlFor={COMPANY_NAME}>Company Name</label>
                <input
                  type='text'
                  name={COMPANY_NAME}
                  id={COMPANY_NAME}
                  placeholder='Company Name'
                />
              </div>
              <div className='form-div'>
                <label htmlFor={JOB_TITLE}>Job Title</label>
                <input
                  type='text'
                  name={JOB_TITLE}
                  id={JOB_TITLE}
                  placeholder='Job Title'
                />
              </div>
              <div className='form-div'>
                <label htmlFor={JOB_DESCRIPTION}>Job Description</label>
                <textarea
                  rows={5}
                  name={JOB_DESCRIPTION}
                  id={JOB_DESCRIPTION}
                  placeholder='Job Description'
                />
              </div>
              <div className='form-div'>
                <label htmlFor='uploader'>Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className='primary-button' type='submit'>
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
