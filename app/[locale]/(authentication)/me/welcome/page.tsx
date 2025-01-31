import Welcome from "@/components/ui/Form/WelcomeForm";

async function WelcomePage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-custom-black">
      <section className="mx-auto max-w-xs self-center flex flex-col gap-8 text-center">
        <h1 className="text-white text-2xl text-center m-auto mt-10">
          Bienvenue sur Num4
        </h1>
      </section>

      <Welcome />
    </div>
  );
}

export default WelcomePage;
