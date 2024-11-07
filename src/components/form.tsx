"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WorkExperience {
    companyName: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    roleDescription: string;
    keyAchievements: string;
}

interface Education {
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    honours: string;
    relevantModules: string;
}

interface Project {
    projectTitle: string;
    description: string;
    technologies: string;
}

interface Certification {
    certificationName: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate: string;
}

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    workExperience: WorkExperience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    skills: string;
    languages: string;
    volunteerWork: string;
}

interface FormProps {
    onSummaryGenerated: (summary: string) => void;
}

export default function Form({ onSummaryGenerated }: FormProps) {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        workExperience: [],
        education: [],
        projects: [],
        certifications: [],
        skills: '',
        languages: '',
        volunteerWork: '',
    });

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check required fields
        if (!formData.fullName || !formData.workExperience.length || !formData.skills) {
            alert("Please fill out all required fields.");
            return;
        }

        // Convert workExperience array to a formatted string for summary generation
        const formattedWorkExperience = formData.workExperience
            .map((experience) =>
                `${experience.jobTitle} at ${experience.companyName} (${experience.startDate} - ${experience.endDate}): ${experience.roleDescription} Achievements: ${experience.keyAchievements}`
            )
            .join("; ");

        // Prepare the payload
        const payload = {
            fullName: formData.fullName,
            jobTitle: formData.workExperience[0]?.jobTitle || '',
            workExperience: formattedWorkExperience,
            skills: formData.skills,
        };

        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!data.summary) {
            alert("Unable to generate CV summary.");
            return;
        }

        onSummaryGenerated(data.summary);
        router.push(`/cv?summary=${encodeURIComponent(data.summary)}`);
    };

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addWorkExperience = () => {
        setFormData((prev) => ({
            ...prev,
            workExperience: [
                ...prev.workExperience,
                { companyName: '', jobTitle: '', startDate: '', endDate: '', roleDescription: '', keyAchievements: '' },
            ],
        }));
    };

    const removeWorkExperience = (index: number) => {
        setFormData((prev) => {
            const updatedWorkExperience = [...prev.workExperience];
            updatedWorkExperience.splice(index, 1);
            return { ...prev, workExperience: updatedWorkExperience };
        });
    };

    const addEducation = () => {
        setFormData((prev) => ({
            ...prev,
            education: [
                ...prev.education,
                { institutionName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', honours: '', relevantModules: '' },
            ],
        }));
    };

    const removeEducation = (index: number) => {
        setFormData((prev) => {
            const updatedEducation = [...prev.education];
            updatedEducation.splice(index, 1);
            return { ...prev, education: updatedEducation };
        });
    };

    const addProject = () => {
        setFormData((prev) => ({
            ...prev,
            projects: [
                ...prev.projects,
                { projectTitle: '', description: '', technologies: '' },
            ],
        }));
    };

    const removeProject = (index: number) => {
        setFormData((prev) => {
            const updatedProjects = [...prev.projects];
            updatedProjects.splice(index, 1);
            return { ...prev, projects: updatedProjects };
        });
    };

    const addCertification = () => {
        setFormData((prev) => ({
            ...prev,
            certifications: [
                ...prev.certifications,
                { certificationName: '', issuingOrganization: '', issueDate: '', expirationDate: '' },
            ],
        }));
    };

    const removeCertification = (index: number) => {
        setFormData((prev) => {
            const updatedCertifications = [...prev.certifications];
            updatedCertifications.splice(index, 1);
            return { ...prev, certifications: updatedCertifications };
        });
    };

    return (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleGeneralChange} required className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleGeneralChange} className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleGeneralChange} className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="text" name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleGeneralChange} className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* Work Experience Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Work Experience</h2>
            <div className="space-y-6">
                {formData.workExperience.map((experience, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm space-y-4">
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            value={experience.companyName}
                            onChange={(e) => {
                                const updatedExperience = [...formData.workExperience];
                                updatedExperience[index].companyName = e.target.value;
                                setFormData({ ...formData, workExperience: updatedExperience });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="jobTitle"
                            placeholder="Job Title"
                            value={experience.jobTitle}
                            onChange={(e) => {
                                const updatedExperience = [...formData.workExperience];
                                updatedExperience[index].jobTitle = e.target.value;
                                setFormData({ ...formData, workExperience: updatedExperience });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="startDate"
                            placeholder="Start Date"
                            value={experience.startDate}
                            onChange={(e) => {
                                const updatedExperience = [...formData.workExperience];
                                updatedExperience[index].startDate = e.target.value;
                                setFormData({ ...formData, workExperience: updatedExperience });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="endDate"
                            placeholder="End Date"
                            value={experience.endDate}
                            onChange={(e) => {
                                const updatedExperience = [...formData.workExperience];
                                updatedExperience[index].endDate = e.target.value;
                                setFormData({ ...formData, workExperience: updatedExperience });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                            name="roleDescription"
                            placeholder="Role Description"
                            value={experience.roleDescription}
                            onChange={(e) => {
                                const updatedExperience = [...formData.workExperience];
                                updatedExperience[index].roleDescription = e.target.value;
                                setFormData({ ...formData, workExperience: updatedExperience });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                            name="keyAchievements"
                            placeholder="Key Achievements"
                            value={experience.keyAchievements}
                            onChange={(e) => {
                                const updatedExperience = [...formData.workExperience];
                                updatedExperience[index].keyAchievements = e.target.value;
                                setFormData({ ...formData, workExperience: updatedExperience });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={() => removeWorkExperience(index)} className="text-red-500">Remove Work Experience</button>
                    </div>
                ))}
                <button type="button" onClick={addWorkExperience} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Work Experience</button>
            </div>

            {/* Education Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Education</h2>
            <div className="space-y-6">
                {formData.education.map((edu, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm space-y-4">
                        <input
                            type="text"
                            name="institutionName"
                            placeholder="Institution Name"
                            value={edu.institutionName}
                            onChange={(e) => {
                                const updatedEducation = [...formData.education];
                                updatedEducation[index].institutionName = e.target.value;
                                setFormData({ ...formData, education: updatedEducation });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="degree"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => {
                                const updatedEducation = [...formData.education];
                                updatedEducation[index].degree = e.target.value;
                                setFormData({ ...formData, education: updatedEducation });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="fieldOfStudy"
                            placeholder="Field of Study"
                            value={edu.fieldOfStudy}
                            onChange={(e) => {
                                const updatedEducation = [...formData.education];
                                updatedEducation[index].fieldOfStudy = e.target.value;
                                setFormData({ ...formData, education: updatedEducation });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="startDate"
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => {
                                const updatedEducation = [...formData.education];
                                updatedEducation[index].startDate = e.target.value;
                                setFormData({ ...formData, education: updatedEducation });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="endDate"
                            placeholder="End Date"
                            value={edu.endDate}
                            onChange={(e) => {
                                const updatedEducation = [...formData.education];
                                updatedEducation[index].endDate = e.target.value;
                                setFormData({ ...formData, education: updatedEducation });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                            name="honours"
                            placeholder="Honours"
                            value={edu.honours}
                            onChange={(e) => {
                                const updatedEducation = [...formData.education];
                                updatedEducation[index].honours = e.target.value;
                                setFormData({ ...formData, education: updatedEducation });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                            name="relevantModules"
                            placeholder="Relevant Modules"
                            value={edu.relevantModules}
                            onChange={(e) => {
                                const updatedEducation = [...formData.education];
                                updatedEducation[index].relevantModules = e.target.value;
                                setFormData({ ...formData, education: updatedEducation });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={() => removeEducation(index)} className="text-red-500">Remove Education</button>
                    </div>
                ))}
                <button type="button" onClick={addEducation} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Education</button>
            </div>

            {/* Projects Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Projects</h2>
            <div className="space-y-6">
                {formData.projects.map((project, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm space-y-4">
                        <input
                            type="text"
                            name="projectTitle"
                            placeholder="Project Title"
                            value={project.projectTitle}
                            onChange={(e) => {
                                const updatedProjects = [...formData.projects];
                                updatedProjects[index].projectTitle = e.target.value;
                                setFormData({ ...formData, projects: updatedProjects });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                            name="description"
                            placeholder="Project Description"
                            value={project.description}
                            onChange={(e) => {
                                const updatedProjects = [...formData.projects];
                                updatedProjects[index].description = e.target.value;
                                setFormData({ ...formData, projects: updatedProjects });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="technologies"
                            placeholder="Technologies Used"
                            value={project.technologies}
                            onChange={(e) => {
                                const updatedProjects = [...formData.projects];
                                updatedProjects[index].technologies = e.target.value;
                                setFormData({ ...formData, projects: updatedProjects });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={() => removeProject(index)} className="text-red-500">Remove Project</button>
                    </div>
                ))}
                <button type="button" onClick={addProject} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Project</button>
            </div>

            {/* Certifications Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Certifications</h2>
            <div className="space-y-6">
                {formData.certifications.map((certification, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm space-y-4">
                        <input
                            type="text"
                            name="certificationName"
                            placeholder="Certification Name"
                            value={certification.certificationName}
                            onChange={(e) => {
                                const updatedCertifications = [...formData.certifications];
                                updatedCertifications[index].certificationName = e.target.value;
                                setFormData({ ...formData, certifications: updatedCertifications });
                            }}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="issuingOrganization"
                            placeholder="Issuing Organization"
                            value={certification.issuingOrganization}
                            onChange={(e) => {
                                const updatedCertifications = [...formData.certifications];
                                updatedCertifications[index].issuingOrganization = e.target.value;
                                setFormData({ ...formData, certifications: updatedCertifications });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="issueDate"
                            placeholder="Issue Date"
                            value={certification.issueDate}
                            onChange={(e) => {
                                const updatedCertifications = [...formData.certifications];
                                updatedCertifications[index].issueDate = e.target.value;
                                setFormData({ ...formData, certifications: updatedCertifications });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="expirationDate"
                            placeholder="Expiration Date"
                            value={certification.expirationDate}
                            onChange={(e) => {
                                const updatedCertifications = [...formData.certifications];
                                updatedCertifications[index].expirationDate = e.target.value;
                                setFormData({ ...formData, certifications: updatedCertifications });
                            }}
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={() => removeCertification(index)} className="text-red-500">Remove Certification</button>
                    </div>
                ))}
                <button type="button" onClick={addCertification} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Certification</button>
            </div>

            {/* Skills Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Skills</h2>
            <textarea
                name="skills"
                placeholder="List your skills"
                value={formData.skills}
                onChange={handleGeneralChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Languages Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Languages</h2>
            <textarea
                name="languages"
                placeholder="List the languages you know"
                value={formData.languages}
                onChange={handleGeneralChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Volunteer Work Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Volunteer Work</h2>
            <textarea
                name="volunteerWork"
                placeholder="Describe any volunteer work"
                value={formData.volunteerWork}
                onChange={handleGeneralChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button type="submit" className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Generate CV Summary</button>
        </form>
    );
}
