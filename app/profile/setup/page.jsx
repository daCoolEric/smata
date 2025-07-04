"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Select from "@/app/components/ui/Select";

export default function ProfileSetup() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    region: "",
    school: "",
    level: "",
    programOfStudy: "",
    interests: [],
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;
    setFormData((prev) => {
      const interests = [...prev.interests];
      if (checked) {
        interests.push(value);
      } else {
        const index = interests.indexOf(value);
        if (index > -1) {
          interests.splice(index, 1);
        }
      }
      return { ...prev, interests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle profile photo upload if exists
      if (formData.profilePhoto) {
        const fileExt = formData.profilePhoto.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `profile_photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData.profilePhoto);

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(filePath);

          // Add publicUrl to your form data before saving
          const updatedData = { ...formData, profilePhotoUrl: publicUrl };
          // Save updatedData to your profiles table
        }
      }

      // Save the rest of profile data
      router.push("/home/dashboard");
    } catch (error) {
      console.error("Profile setup error:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Ghana-specific data options
  const regions = [
    "Ahafo",
    "Ashanti",
    "Bono",
    "Bono East",
    "Central",
    "Eastern",
    "Greater Accra",
    "North East",
    "Northern",
    "Oti",
    "Savannah",
    "Upper East",
    "Upper West",
    "Volta",
    "Western",
    "Western North",
  ];

  const educationLevels = [
    "Junior High School",
    "Senior High School",
    "Undergraduate",
    "Postgraduate",
    "Vocational/Training",
  ];

  const interestAreas = [
    "STEM",
    "Arts",
    "Business",
    "Medicine",
    "Law",
    "Agriculture",
    "Technology",
    "Engineering",
    "Education",
    "Social Sciences",
    "Sports",
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Help us personalize your Smata learning experience
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow"
      >
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={triggerFileInput}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-50 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            name="profilePhoto"
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            {previewImage ? "Change photo" : "Upload photo"}
          </button>
        </div>

        {/* Personal Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstname"
              type="text"
              value={formData.firstname || ""}
              onChange={handleChange}
              required
              placeholder="John"
            />

            <Input
              label="Last Name"
              name="lastname"
              type="text"
              value={formData.lastname || ""}
              onChange={handleChange}
              required
              placeholder="Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Other Names"
              name="otherNames"
              type="text"
              value={formData.otherNames || ""}
              onChange={handleChange}
              placeholder="Optional"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="e.g., 0244123456"
              pattern="[0-9]{10}"
              title="Please enter a valid Ghanaian phone number"
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Select gender" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
                { value: "prefer-not-to-say", label: "Prefer not to say" },
              ]}
            />

            <Select
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Select your region" },
                ...regions.map((region) => ({ value: region, label: region })),
              ]}
            />
          </div>
        </div>

        {/* Educational Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Educational Information
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="School/Institution"
              name="school"
              type="text"
              value={formData.school}
              onChange={handleChange}
              required
              placeholder="e.g., University of Ghana"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Current Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                options={[
                  { value: "", label: "Select your level" },
                  ...educationLevels.map((level) => ({
                    value: level,
                    label: level,
                  })),
                ]}
              />

              <Input
                label="Program of Study"
                name="programOfStudy"
                type="text"
                value={formData.programOfStudy}
                onChange={handleChange}
                required
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Areas of Interest
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Select subjects or fields you're interested in (select all that
            apply)
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestAreas.map((interest) => (
              <div key={interest} className="flex items-center">
                <input
                  id={`interest-${interest}`}
                  name="interests"
                  type="checkbox"
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`interest-${interest}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {interest}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-8 py-3">
            Complete Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
