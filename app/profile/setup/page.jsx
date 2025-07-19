"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Select from "@/app/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/app/config/supabaseClient";

export default function ProfileSetup() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isExistingProfile, setIsExistingProfile] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    otherNames: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    school: "",
    level: "",
    region: "",
    programOfStudy: "",
    profilePhoto: null,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Check for existing profile when user changes
  useEffect(() => {
    if (user) {
      checkProfileExists();
    }
  }, [user]);

  // Set basic user info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        firstname: user.user_metadata?.firstname || "",
        lastname: user.user_metadata?.lastname || "",
      }));
    }
  }, [user]);

  const checkProfileExists = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (profile) {
        setIsExistingProfile(true);
        setFormData({
          firstname: profile.first_name || "",
          lastname: profile.last_name || "",
          otherNames: profile.other_names || "",
          email: profile.email || user.email || "",
          phoneNumber: profile.phone_number || "",
          dateOfBirth: profile.date_of_birth
            ? new Date(profile.date_of_birth).toISOString().split("T")[0]
            : "",
          gender: profile.gender || "",
          maritalStatus: profile.marital_status || "",
          school: profile.school || "",
          level: profile.education_level || "",
          region: profile.region || "",
          programOfStudy: profile.program_of_study || "",
          profilePhoto: null,
        });

        if (profile.profile_photo_url) {
          setPreviewImage(profile.profile_photo_url);
        }
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Loading state
  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const validateForm = () => {
    const requiredFields = [
      "firstname",
      "lastname",
      "email",
      "phoneNumber",
      "dateOfBirth",
      "gender",
      "school",
      "level",
      "programOfStudy",
    ];
    return requiredFields.every((field) => formData[field]);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!validateForm()) {
        throw new Error("Please fill in all required fields");
      }

      // Verify session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error("Not authenticated");

      let profilePhotoUrl = previewImage || null;

      // Handle new profile photo upload
      if (formData.profilePhoto) {
        const fileExt = formData.profilePhoto.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `profile_photos/${fileName}`;

        // Delete old photo if exists
        if (previewImage && previewImage.includes("profile_photos/")) {
          try {
            const oldFileName = previewImage
              .split("profile_photos/")[1]
              .split("?")[0];
            await supabase.storage
              .from("avatars")
              .remove([`profile_photos/${oldFileName}`]);
          } catch (deleteError) {
            console.warn("Could not delete old photo:", deleteError);
          }
        }

        // Upload new photo
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData.profilePhoto, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          if (uploadError.message.includes("bucket not found")) {
            throw new Error("Storage bucket not configured properly");
          }
          throw uploadError;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        profilePhotoUrl = publicUrl;
      }

      // Prepare profile data
      const profileData = {
        id: user.id,
        first_name: formData.firstname,
        last_name: formData.lastname,
        other_names: formData.otherNames,
        email: formData.email,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        school: formData.school,
        education_level: formData.level,
        region: formData.region,
        program_of_study: formData.programOfStudy,
        profile_photo_url: profilePhotoUrl,
        updated_at: new Date().toISOString(),
      };

      // Upsert profile data
      const { error } = await supabase
        .from("profiles")
        .upsert(profileData)
        .eq("id", user.id);

      if (error) throw error;

      router.push("/home/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Profile setup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Data options
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

  const maritalStatus = [
    "single",
    "married",
    "separated",
    "divorced",
    "widowed",
  ];

  const educationLevels = [
    "Junior High School",
    "Senior High School",
    "Undergraduate",
    "Postgraduate",
    "Vocational/Training",
  ];

  return (
    <div className="min-h-screen mx-auto py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto py-5 px-1">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isExistingProfile
              ? "Update Your Profile"
              : "Complete Your Profile"}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {isExistingProfile
              ? "Keep your information up to date"
              : "Help us personalize your Smata learning experience"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg shadow"
        >
          {error && <div className="text-red-500 mb-4">Error: {error}</div>}

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
                value={formData.firstname}
                onChange={handleChange}
                required
                placeholder="John"
                disabled={isExistingProfile}
              />

              <Input
                label="Last Name"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                required
                placeholder="Doe"
                disabled={isExistingProfile}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Other Names"
                name="otherNames"
                type="text"
                value={formData.otherNames}
                onChange={handleChange}
                placeholder="Optional"
                disabled={isExistingProfile && formData.otherNames}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                disabled={isExistingProfile}
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
                disabled={isExistingProfile && formData.dateOfBirth}
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
                disabled={isExistingProfile}
              />

              <Select
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                required
                options={[
                  { value: "", label: "Select your status" },
                  ...maritalStatus.map((status) => ({
                    value: status,
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                  })),
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
              <Input
                label="Program of Study"
                name="programOfStudy"
                type="text"
                value={formData.programOfStudy}
                onChange={handleChange}
                required
                placeholder="e.g., Computer Science"
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
                <Select
                  label="Region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "", label: "Select your region" },
                    ...regions.map((region) => ({
                      value: region,
                      label: region,
                    })),
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            {isExistingProfile && (
              <Button
                type="button"
                onClick={() => router.push("/home/dashboard")}
                variant="outline"
                className="px-6 py-3"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className={`px-8 py-3 ${!isExistingProfile ? "w-full" : ""}`}
              disabled={isSubmitting || !validateForm()}
            >
              {isSubmitting
                ? "Saving..."
                : isExistingProfile
                ? "Update Profile"
                : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
