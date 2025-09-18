import { industries } from "@/data/industries"
import OnboardingForm from "./_components/OnboardingForm"
import { getUserOnboardingStatus } from "@/actions/user"
import { redirect } from "next/navigation";


async function page() {

    const { isOnboarded }=await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return (
    <main>
      <OnboardingForm industries={industries}/>
    </main>
  )
}

export default page