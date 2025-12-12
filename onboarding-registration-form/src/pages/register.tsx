import React from "react";
import Head from "next/head";
import OnboardingForm from "../components/OnboardingForm";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>VEND88 Onboarding Registration Form</title>
        <meta name="description" content="VEND88 Onboarding Registration Form" />
      </Head>
      <main>
        <OnboardingForm />
      </main>
    </>
  );
}
